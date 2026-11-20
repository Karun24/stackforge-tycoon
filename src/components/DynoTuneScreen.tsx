import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

interface Props {
  tuningRatio: number;
  onSetTuningRatio: (val: number) => void;
  tuningAccuracy: number;
  autoTuneActive: boolean;
  onTriggerAutoTune: () => void;
  dynoScore: number;
  totalCapacity: number;
  unlockedLabIds: string[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const DynoTuneScreen: React.FC<Props> = ({
  tuningRatio,
  onSetTuningRatio,
  tuningAccuracy,
  autoTuneActive,
  onTriggerAutoTune,
  dynoScore,
  totalCapacity,
  unlockedLabIds,
}) => {
  const isOptimal = Math.abs(tuningRatio - 0.70) <= 0.05 || autoTuneActive;

  const handleStep = (delta: number) => {
    const next = Math.min(1.0, Math.max(0.2, tuningRatio + delta));
    onSetTuningRatio(Math.round(next * 100) / 100);
  };

  // SVG Curve calculations
  const sliderX = 40 + ((tuningRatio - 0.2) / (1.0 - 0.2)) * 260;

  return (
    <View style={styles.container}>
      {/* Target Metrics at Redline (Screenshot 10) */}
      <View style={styles.targetCard}>
        <View style={styles.targetHeader}>
          <Text style={styles.targetTitle}>DYNO TARGETS • AT REDLINE</Text>
          <View style={styles.knockBadge}>
            <Text
              style={[
                styles.knockText,
                { color: isOptimal ? '#10B981' : '#EF4444' },
              ]}
            >
              ● {isOptimal ? 'OPTIMAL' : 'MISALIGNED'}
            </Text>
          </View>
        </View>

        <View style={styles.targetRow}>
          <View style={styles.targetCol}>
            <Text style={styles.metricLabel}>THROUGHPUT</Text>
            <Text style={styles.metricValue}>
              {dynoScore} / {Math.round(totalCapacity * 1.5)} RPS
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, (dynoScore / (totalCapacity * 1.5)) * 100)}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.targetCol}>
            <Text style={styles.metricLabel}>EFFICIENCY</Text>
            <Text style={styles.metricValue}>
              {(tuningAccuracy * 100).toFixed(1)}% / 100%
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: '#10B981',
                    width: `${Math.min(100, tuningAccuracy * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Action Prompt & Auto-Tune button */}
        <View style={styles.promptRow}>
          <Text style={styles.promptText}>
            Slide dial into the green band.
          </Text>
          <TouchableOpacity
            onPress={onTriggerAutoTune}
            style={[styles.autoTuneBtn, autoTuneActive && styles.autoTuneActive]}
          >
            <Text style={styles.autoTuneText}>
              {autoTuneActive ? '⚡ AUTO-TUNED (ACTIVE)' : '🔧 AUTO-TUNE BOOST'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Dyno Curve Graph (Screenshot 10) */}
      <View style={styles.graphContainer}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>THREAD POOL / MEMORY BALANCE</Text>
          <Text style={styles.ratioValue}>
            {(tuningRatio * 20).toFixed(1)} : 1
          </Text>
        </View>

        <View style={styles.svgWrapper}>
          <Svg width={340} height={140} viewBox="0 0 340 140">
            <Defs>
              <LinearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#38BDF8" stopOpacity={0.6} />
                <Stop offset="100%" stopColor="#38BDF8" stopOpacity={0.0} />
              </LinearGradient>
            </Defs>

            {/* Background Grid */}
            <Rect x="0" y="0" width="340" height="140" fill="#070B14" rx="8" />
            <Line x1="20" y1="35" x2="320" y2="35" stroke="#1E293B" strokeDasharray="3,3" />
            <Line x1="20" y1="70" x2="320" y2="70" stroke="#1E293B" strokeDasharray="3,3" />
            <Line x1="20" y1="105" x2="320" y2="105" stroke="#1E293B" strokeDasharray="3,3" />

            {/* Optimal Green Band Zone */}
            <Rect x="180" y="10" width="65" height="120" fill="rgba(16, 185, 129, 0.15)" />
            <Line x1="180" y1="10" x2="180" y2="130" stroke="#10B981" strokeDasharray="2,2" />
            <Line x1="245" y1="10" x2="245" y2="130" stroke="#10B981" strokeDasharray="2,2" />

            {/* Performance Power Curve (Cyan) */}
            <Path
              d="M 30 110 Q 100 90 150 45 T 215 35 Q 260 40 310 115"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
            />
            {/* Efficiency Curve (Green) */}
            <Path
              d="M 30 120 Q 90 110 170 60 T 215 50 Q 250 55 310 120"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
            />

            {/* Draggable Current Marker Vertical Line */}
            <Line
              x1={sliderX}
              y1="10"
              x2={sliderX}
              y2="130"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Draggable Handle Circle */}
            <Circle
              cx={sliderX}
              cy="48"
              r="8"
              fill="#FFFFFF"
              stroke={isOptimal ? '#10B981' : '#F59E0B'}
              strokeWidth="3"
            />
          </Svg>
        </View>

        {/* Manual Stepper Controls */}
        <View style={styles.stepperRow}>
          <TouchableOpacity
            onPress={() => handleStep(-0.05)}
            style={styles.stepBtn}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </TouchableOpacity>

          <View style={styles.sliderStatus}>
            <Text style={[styles.statusMsg, isOptimal && styles.statusMsgGreen]}>
              {isOptimal
                ? '★ OPTIMAL POWER BAND (+25% BONUS RPS)'
                : 'Slide dial into the green box'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleStep(+0.05)}
            style={styles.stepBtn}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Advanced Tuners Locked by Lab Research (Screenshot 10) */}
      <View style={styles.lockedTunersList}>
        <View style={styles.lockedCard}>
          <View>
            <Text style={styles.lockedTitle}>KERNEL eBPF PACKET BYPASS</Text>
            <Text style={styles.lockedSubtitle}>
              Unlocks zero-copy network socket tuning dial
            </Text>
          </View>
          <View style={styles.labTag}>
            <Text style={styles.labTagText}>
              {unlockedLabIds.includes('lab_ebpf') ? 'UNLOCKED' : 'RESEARCH IN LAB 🧪'}
            </Text>
          </View>
        </View>

        <View style={styles.lockedCard}>
          <View>
            <Text style={styles.lockedTitle}>HTTP/3 QUIC CONGESTION BBRv2</Text>
            <Text style={styles.lockedSubtitle}>
              Unlocks real-time packet pacing control
            </Text>
          </View>
          <View style={styles.labTag}>
            <Text style={styles.labTagText}>
              {unlockedLabIds.includes('lab_quic') ? 'UNLOCKED' : 'RESEARCH IN LAB 🧪'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  targetCard: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 10,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  targetTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  knockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#070B14',
  },
  knockText: {
    fontSize: 10,
    fontWeight: '900',
  },
  targetRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  targetCol: {
    flex: 1,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  promptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  promptText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  autoTuneBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  autoTuneActive: {
    backgroundColor: '#0284C7',
  },
  autoTuneText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  graphContainer: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    marginBottom: 10,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  graphTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  ratioValue: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  svgWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  sliderStatus: {
    flex: 1,
    alignItems: 'center',
  },
  statusMsg: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  statusMsgGreen: {
    color: '#10B981',
  },
  lockedTunersList: {
    gap: 8,
  },
  lockedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
  },
  lockedTitle: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
  },
  lockedSubtitle: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 2,
  },
  labTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  labTagText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
});
