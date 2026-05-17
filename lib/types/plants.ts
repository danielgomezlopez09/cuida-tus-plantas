// Types for plant care application

export interface PlantCare {
  light: string;
  water: string;
  temperature: string;
  humidity: string;
  soil: string;
  frequency: string;
}

export interface PestControl {
  natural: string[];
  chemical: string[];
}

export interface Fertilizer {
  type: string;
  frequency: string;
  natural: string[];
}

export interface Plant {
  id: number;
  name: string;
  commonNames: string[];
  type: 'planta_interior' | 'arbol_frutal' | 'arbusto_floral' | 'hierba_aromatica' | 'hortaliza' | 'suculenta';
  category: string;
  description: string;
  care: PlantCare;
  propagation: string;
  pests: string[];
  diseases: string[];
  pestControl: PestControl;
  fertilizer: Fertilizer;
  pruning: string;
  season: string;
  toxicity: string;
}

export interface UserPlant {
  id: string;
  userId: string;
  plantId: number;
  plantName: string;
  location: string;
  purchaseDate: string;
  notes: string;
  image?: string;
  lastWatered?: string;
  lastFertilized?: string;
  lastPruned?: string;
}

export interface CareHistory {
  id: string;
  userPlantId: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'pest_treatment' | 'disease_treatment' | 'other';
  date: string;
  notes: string;
  image?: string;
}

export interface PlantDiagnosis {
  id: string;
  userPlantId: string;
  symptoms: string[];
  possibleCauses: string[];
  solutions: string[];
  date: string;
  image?: string;
  resolved: boolean;
}

export interface Reminder {
  id: string;
  userPlantId: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'inspection';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextDue: string;
  enabled: boolean;
}

export interface FertilizerRecipe {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  preparationTime: string;
  applicableTo: string[];
  benefits: string[];
}
