/**
 * Servicio de generación de reportes PDF
 * Permite exportar diagnósticos y historial a PDF
 */

import { DiagnosisRecord } from './plantnet-service';
import * as FileSystem from 'expo-file-system/legacy';

// Importar Sharing de forma segura
let Sharing: any = null;
try {
  Sharing = require('expo-sharing');
} catch (e) {
  console.warn('expo-sharing no disponible');
}

export interface PDFReportOptions {
  title?: string;
  includeImages?: boolean;
  includeRecommendations?: boolean;
  format?: 'full' | 'summary';
}

/**
 * Generar reporte PDF de un diagnóstico
 */
export async function generateDiagnosisReport(
  diagnosis: DiagnosisRecord,
  options: PDFReportOptions = {}
): Promise<string> {
  const {
    title = 'Reporte de Diagnóstico',
    includeImages = true,
    includeRecommendations = true,
    format = 'full',
  } = options;

  try {
    // Crear contenido HTML del reporte
    const htmlContent = generateDiagnosisHTML(diagnosis, {
      title,
      includeImages,
      includeRecommendations,
      format,
    });

    // Guardar como archivo temporal
    const fileName = `diagnosis_${diagnosis.id}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Aquí normalmente usarías una librería como react-native-pdf-lib
    // Por ahora, guardamos el HTML como texto
    await FileSystem.writeAsStringAsync(filePath, htmlContent);

    return filePath;
  } catch (error) {
    console.error('Error generando reporte PDF:', error);
    throw error;
  }
}

/**
 * Generar reporte PDF de múltiples diagnósticos
 */
export async function generateHistoryReport(
  diagnoses: DiagnosisRecord[],
  options: PDFReportOptions = {}
): Promise<string> {
  const {
    title = 'Historial de Diagnósticos',
    includeImages = false,
    includeRecommendations = true,
    format = 'summary',
  } = options;

  try {
    const htmlContent = generateHistoryHTML(diagnoses, {
      title,
      includeImages,
      includeRecommendations,
      format,
    });

    const fileName = `history_${Date.now()}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, htmlContent);

    return filePath;
  } catch (error) {
    console.error('Error generando reporte de historial:', error);
    throw error;
  }
}

/**
 * Compartir reporte PDF
 */
export async function shareReport(filePath: string, fileName: string): Promise<void> {
  try {
    if (!Sharing) {
      console.warn('Compartir no está disponible');
      return;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Compartir no está disponible en este dispositivo');
    }

    await Sharing.shareAsync(filePath, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir Reporte',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error compartiendo reporte:', error);
    throw error;
  }
}

/**
 * Generar HTML para reporte de diagnóstico
 */
function generateDiagnosisHTML(
  diagnosis: DiagnosisRecord,
  options: {
    title: string;
    includeImages: boolean;
    includeRecommendations: boolean;
    format: 'full' | 'summary';
  }
): string {
  const { title, includeImages, includeRecommendations, format } = options;
  const date = new Date(diagnosis.timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2d5016;
          padding-bottom: 15px;
        }
        .header h1 {
          color: #2d5016;
          margin: 0;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section h2 {
          color: #2d5016;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .plant-info {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        .plant-info p {
          margin: 5px 0;
        }
        .pest-item, .disease-item {
          background-color: #fff;
          border-left: 4px solid #2d5016;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 3px;
        }
        .pest-item {
          border-left-color: #d4a574;
        }
        .disease-item {
          border-left-color: #c41e3a;
        }
        .severity {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: bold;
          margin-left: 10px;
        }
        .severity.leve {
          background-color: #d4edda;
          color: #155724;
        }
        .severity.moderada {
          background-color: #fff3cd;
          color: #856404;
        }
        .severity.grave {
          background-color: #f8d7da;
          color: #721c24;
        }
        .treatments {
          margin-top: 10px;
        }
        .treatment-type {
          font-weight: bold;
          margin-top: 8px;
          margin-bottom: 5px;
        }
        .treatment-list {
          margin-left: 20px;
        }
        .treatment-list li {
          margin-bottom: 5px;
        }
        .notes {
          background-color: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 12px;
          margin-top: 15px;
          border-radius: 3px;
        }
        .action-taken {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          padding: 12px;
          margin-top: 15px;
          border-radius: 3px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌿 ${title}</h1>
        <p><strong>Planta:</strong> ${diagnosis.plantName}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Confianza:</strong> ${Math.round(diagnosis.results.confidence * 100)}%</p>
      </div>
  `;

  // Sección de plantas identificadas
  if (diagnosis.results.plants && diagnosis.results.plants.length > 0) {
    html += `
      <div class="section">
        <h2>🌱 Plantas Identificadas</h2>
    `;

    diagnosis.results.plants.forEach((plant) => {
      html += `
        <div class="plant-info">
          <p><strong>${plant.commonNames[0] || plant.scientificName}</strong></p>
          <p><em>${plant.scientificName}</em></p>
          <p>Familia: ${plant.family}</p>
          <p>Confianza: ${Math.round(plant.score * 100)}%</p>
        </div>
      `;
    });

    html += '</div>';
  }

  // Sección de plagas
  if (diagnosis.results.pests && diagnosis.results.pests.length > 0) {
    html += `
      <div class="section">
        <h2>🐛 Plagas Detectadas</h2>
    `;

    diagnosis.results.pests.forEach((pest) => {
      html += `
        <div class="pest-item">
          <p>
            <strong>${pest.pestName}</strong>
            <span class="severity ${pest.severity}">${pest.severity.toUpperCase()}</span>
          </p>
          <p>${pest.description}</p>
          <p><strong>Síntomas:</strong> ${pest.symptoms.join(', ')}</p>
          <p><strong>Áreas afectadas:</strong> ${pest.affectedAreas}</p>
      `;

      if (includeRecommendations) {
        html += `
          <div class="treatments">
            <div class="treatment-type">Tratamientos Naturales:</div>
            <ul class="treatment-list">
              ${pest.treatments.natural.map((t) => `<li>${t}</li>`).join('')}
            </ul>
            <div class="treatment-type">Tratamientos Químicos:</div>
            <ul class="treatment-list">
              ${pest.treatments.chemical.map((t) => `<li>${t}</li>`).join('')}
            </ul>
            <p><strong>Acción recomendada:</strong> ${pest.recommendedAction}</p>
          </div>
        `;
      }

      html += '</div>';
    });

    html += '</div>';
  }

  // Sección de enfermedades
  if (diagnosis.results.diseases && diagnosis.results.diseases.length > 0) {
    html += `
      <div class="section">
        <h2>🦠 Enfermedades Detectadas</h2>
    `;

    diagnosis.results.diseases.forEach((disease) => {
      html += `
        <div class="disease-item">
          <p>
            <strong>${disease.diseaseName}</strong>
            <span class="severity ${disease.severity}">${disease.severity.toUpperCase()}</span>
          </p>
          <p>${disease.description}</p>
          <p><strong>Síntomas:</strong> ${disease.symptoms.join(', ')}</p>
          <p><strong>Causa:</strong> ${disease.cause}</p>
      `;

      if (includeRecommendations) {
        html += `
          <div class="treatments">
            <div class="treatment-type">Tratamientos Naturales:</div>
            <ul class="treatment-list">
              ${disease.treatments.natural.map((t) => `<li>${t}</li>`).join('')}
            </ul>
            <div class="treatment-type">Tratamientos Químicos:</div>
            <ul class="treatment-list">
              ${disease.treatments.chemical.map((t) => `<li>${t}</li>`).join('')}
            </ul>
            <div class="treatment-type">Prevención:</div>
            <ul class="treatment-list">
              ${disease.preventionTips.map((t) => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      html += '</div>';
    });

    html += '</div>';
  }

  // Sección de notas
  if (diagnosis.notes) {
    html += `
      <div class="notes">
        <strong>📝 Notas:</strong><br>
        ${diagnosis.notes}
      </div>
    `;
  }

  // Sección de acción tomada
  if (diagnosis.actionTaken) {
    html += `
      <div class="action-taken">
        <strong>✓ Acción Tomada:</strong><br>
        ${diagnosis.actionTaken}
      </div>
    `;
  }

  // Footer
  html += `
    <div class="footer">
      <p>Generado por Cuida tus Plantas - ${new Date().toLocaleDateString('es-ES')}</p>
      <p>Este reporte contiene información diagnóstica basada en análisis de imagen</p>
    </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generar HTML para reporte de historial
 */
function generateHistoryHTML(
  diagnoses: DiagnosisRecord[],
  options: {
    title: string;
    includeImages: boolean;
    includeRecommendations: boolean;
    format: 'full' | 'summary';
  }
): string {
  const { title, includeRecommendations, format } = options;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2d5016;
          padding-bottom: 15px;
        }
        .header h1 {
          color: #2d5016;
          margin: 0;
        }
        .summary {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .summary p {
          margin: 5px 0;
        }
        .diagnosis-summary {
          background-color: #fff;
          border-left: 4px solid #2d5016;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 3px;
        }
        .diagnosis-summary h3 {
          margin: 0 0 10px 0;
          color: #2d5016;
        }
        .diagnosis-summary p {
          margin: 3px 0;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 ${title}</h1>
        <p>Generado el ${new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <div class="summary">
        <p><strong>Total de diagnósticos:</strong> ${diagnoses.length}</p>
        <p><strong>Período:</strong> ${diagnoses.length > 0 ? `${new Date(diagnoses[diagnoses.length - 1].timestamp).toLocaleDateString('es-ES')} - ${new Date(diagnoses[0].timestamp).toLocaleDateString('es-ES')}` : 'N/A'}</p>
      </div>
  `;

  // Resumen de diagnósticos
  diagnoses.forEach((diagnosis) => {
    const date = new Date(diagnosis.timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    html += `
      <div class="diagnosis-summary">
        <h3>${diagnosis.plantName} - ${date}</h3>
        <p><strong>Confianza:</strong> ${Math.round(diagnosis.results.confidence * 100)}%</p>
    `;

    if (diagnosis.results.pests && diagnosis.results.pests.length > 0) {
      html += `<p><strong>Plagas:</strong> ${diagnosis.results.pests.map((p) => p.pestName).join(', ')}</p>`;
    }

    if (diagnosis.results.diseases && diagnosis.results.diseases.length > 0) {
      html += `<p><strong>Enfermedades:</strong> ${diagnosis.results.diseases.map((d) => d.diseaseName).join(', ')}</p>`;
    }

    if (diagnosis.actionTaken) {
      html += `<p><strong>Acción:</strong> ${diagnosis.actionTaken}</p>`;
    }

    html += '</div>';
  });

  // Footer
  html += `
    <div class="footer">
      <p>Generado por Cuida tus Plantas</p>
      <p>Este reporte contiene un resumen del historial de diagnósticos</p>
    </div>
    </body>
    </html>
  `;

  return html;
}
