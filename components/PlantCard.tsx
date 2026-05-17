import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';

interface PlantCardProps {
  id: number;
  name: string;
  commonName?: string;
  category?: string;
  healthStatus?: 'healthy' | 'warning' | 'critical';
  nextCare?: string;
  image?: string;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

export const PlantCard: React.FC<PlantCardProps> = ({
  id,
  name,
  commonName,
  category,
  healthStatus = 'healthy',
  nextCare,
  image,
  onPress,
  variant = 'vertical',
}) => {
  const colors = useColors();

  const getHealthStatusColor = () => {
    switch (healthStatus) {
      case 'healthy':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'critical':
        return colors.error;
      default:
        return colors.success;
    }
  };

  const getHealthStatusText = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'Saludable';
      case 'warning':
        return 'Requiere atención';
      case 'critical':
        return 'Problema urgente';
      default:
        return 'Saludable';
    }
  };

  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View className="flex-row bg-surface rounded-xl p-3 mb-3 border border-border">
          {image && (
            <Image
              source={{ uri: image }}
              className="w-16 h-16 rounded-lg bg-muted"
            />
          )}
          <View className="flex-1 ml-3 justify-between">
            <View>
              <Text className="text-base font-semibold text-foreground">
                {name}
              </Text>
              {commonName && (
                <Text className="text-xs text-muted mt-1">{commonName}</Text>
              )}
            </View>
            {nextCare && (
              <Text className="text-xs text-muted mt-1">
                Próximo riego: {nextCare}
              </Text>
            )}
          </View>
          <View
            className="w-3 h-3 rounded-full self-center"
            style={{ backgroundColor: getHealthStatusColor() }}
          />
        </View>
      </Pressable>
    );
  }

  if (variant === 'compact') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View className="bg-surface rounded-lg p-2 border border-border">
          {image && (
            <Image
              source={{ uri: image }}
              className="w-full h-20 rounded-lg bg-muted mb-2"
            />
          )}
          <Text className="text-sm font-semibold text-foreground">
            {name}
          </Text>
          {category && (
            <Text className="text-xs text-muted mt-1">{category}</Text>
          )}
          <View
            className="w-2 h-2 rounded-full mt-2"
            style={{ backgroundColor: getHealthStatusColor() }}
          />
        </View>
      </Pressable>
    );
  }

  // Default vertical variant
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-xl overflow-hidden border border-border">
        {image && (
          <Image
            source={{ uri: image }}
            className="w-full h-40 bg-muted"
          />
        )}
        <View className="p-3">
          <Text className="text-base font-semibold text-foreground">
            {name}
          </Text>
          {commonName && (
            <Text className="text-xs text-muted mt-1">{commonName}</Text>
          )}
          {category && (
            <Text className="text-xs text-muted mt-1">{category}</Text>
          )}
          <View className="flex-row items-center mt-3 justify-between">
            <View
              className="flex-row items-center gap-2"
            >
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getHealthStatusColor() }}
              />
              <Text className="text-xs text-muted">
                {getHealthStatusText()}
              </Text>
            </View>
            {nextCare && (
              <Text className="text-xs text-muted">{nextCare}</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
