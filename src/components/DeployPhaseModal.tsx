import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DeployStep, ProductTemplate } from '../types/game';

interface Props {
  product: ProductTemplate;
  deploySteps: DeployStep[];
  currentStepIndex: number;
  onAdvanceStep: () => void;
}

export const DeployPhaseModal: React.FC<Props> = ({
  product,
  deploySteps,
  currentStepIndex,
  onAdvanceStep,
}) => {
  const currentStep = deploySteps[currentStepIndex] || deploySteps[0];
  const isFinalStep = currentStepIndex >= deploySteps.length - 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.tagline}>PRODUCTION RELEASE PIPELINE</Text>
        <Text style={styles.title}>DEPLOYING {product.name.toUpperCase()}</Text>
      </View>

      {/* Steps Checklist */}
      <View style={styles.stepsCard}>
        {deploySteps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <View
              key={step.id}
              style={[
                styles.stepRow,
                isActive && styles.stepRowActive,
                isDone && styles.stepRowDone,
              ]}
            >
              <View
                style={[
                  styles.statusCircle,
                  isDone && styles.circleDone,
                  isActive && styles.circleActive,
                ]}
              >
                <Text style={styles.statusText}>
                  {isDone ? '✓' : idx + 1}
                </Text>
              </View>

              <View style={styles.stepInfo}>
                <Text
                  style={[
                    styles.stepTitle,
                    isActive && styles.stepTitleActive,
                    isDone && styles.stepTitleDone,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.stepSub}>{step.subtitle}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Live Terminal Output Box */}
      <View style={styles.terminalBox}>
        <Text style={styles.terminalHeader}>CI/CD RUNNER // STDOUT</Text>
        <Text style={styles.terminalCmd}>{currentStep.terminalCommand}</Text>
        <Text style={styles.terminalLog}>
          [INFO] Verification integrity check passed (Exit Code 0).
        </Text>
      </View>

      {/* Advance Action Button */}
      <TouchableOpacity onPress={onAdvanceStep} style={styles.advanceBtn}>
        <Text style={styles.advanceBtnText}>
          {isFinalStep
            ? '🚀 FLIP SWITCH & GO TO MARKETING LAUNCH'
            : `EXECUTE STEP ${currentStepIndex + 1} / ${deploySteps.length} ▶`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tagline: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  stepsCard: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  stepRowActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  stepRowDone: {
    opacity: 0.7,
  },
  statusCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  circleActive: {
    backgroundColor: '#0284C7',
  },
  circleDone: {
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  stepTitleActive: {
    color: '#38BDF8',
    fontWeight: '900',
  },
  stepTitleDone: {
    color: '#10B981',
  },
  stepSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  terminalBox: {
    backgroundColor: '#030712',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  terminalHeader: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  terminalCmd: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  terminalLog: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  advanceBtn: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  advanceBtnText: {
    color: '#070B14',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
