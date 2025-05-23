import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { OrderStatus } from '../types/orders.types';
import { colors } from '@/src/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { typography } from '@/src/constants/Typography';

type StatusStep = {
  key: OrderStatus;
  label: string;
  icon: string;
};

const STATUS_STEPS: StatusStep[] = [
  { key: 'pending', label: 'Pendiente', icon: 'clock' },
  { key: 'processing', label: 'Procesando', icon: 'refresh-cw' },
  { key: 'completed', label: 'Entregado', icon: 'check-circle' },
];

type PurchaseStatusTrackerProps = {
  currentStatus: OrderStatus;
};

export function PurchaseStatusTracker({ currentStatus }: PurchaseStatusTrackerProps) {
  const getStatusIndex = (status: OrderStatus): number => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex((step) => step.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <View style={styles.container}>
      {currentStatus === 'cancelled' ? (
        <View style={styles.cancelledContainer}>
          <View style={styles.cancelledIconContainer}>
            <Feather name="x-circle" size={28} color={colors.statusCancelled} />
          </View>
          <ThemedText style={styles.cancelledText}>Pedido Cancelado</ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, index) => {
              const isActive = index <= currentIndex;
              const isLastItem = index === STATUS_STEPS.length - 1;

              return (
                <React.Fragment key={step.key}>
                  <View style={styles.stepContainer}>
                    <View style={[styles.stepIconContainer, isActive ? styles.activeStep : styles.inactiveStep]}>
                      <Feather name={step.icon as any} size={16} color={isActive ? colors.textLight : colors.textTertiary} />
                    </View>
                    <ThemedText style={[styles.stepLabel, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                      {step.label}
                    </ThemedText>
                  </View>

                  {!isLastItem && (
                    <View style={[styles.connector, index < currentIndex ? styles.activeConnector : styles.inactiveConnector]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  inactiveStep: {
    backgroundColor: colors.divider,
  },
  stepLabel: {
    fontSize: typography.sizes.small,
    textAlign: 'center',
    width: 80,
  },
  activeLabel: {
    color: colors.text,
    fontFamily: typography.fontFamily.sansBold,
  },
  inactiveLabel: {
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.sans,
  },
  connector: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  activeConnector: {
    backgroundColor: colors.primary,
  },
  inactiveConnector: {
    backgroundColor: colors.divider,
  },
  cancelledContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  cancelledIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.statusCancelled}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelledText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.sansBold,
    color: colors.statusCancelled,
  },
});
