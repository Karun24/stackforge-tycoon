import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Line,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { GamePhase, Packet, PlayerMode, ProductTemplate, RigSubTab } from '../types/game';

interface Props {
  phase: GamePhase;
  mode: PlayerMode;
  product: ProductTemplate;
  buildProgress: number;
  installedBuildIds: string[];
  terminalLogs: string[];
  infraLevels: Record<string, number>;
  temperature: number;
  isThermalThrottling: boolean;
  powerKw: number;
  incomingReqPerSec: number;
  totalCapacity: number;
  activeBottleneck: string;
  packets: Packet[];
  activeSubTab: RigSubTab;
  onSelectSubTab: (tab: RigSubTab) => void;
  onRev: () => void;
  floatingCashList: { id: number; text: string; x: number; y: number }[];
  dynoScore: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const ArchitectureCanvas: React.FC<Props> = ({
  phase,
  mode,
  product,
  buildProgress,
  installedBuildIds,
  terminalLogs,
  infraLevels,
  temperature,
  isThermalThrottling,
  powerKw,
  incomingReqPerSec,
  totalCapacity,
  activeBottleneck,
  packets,
  activeSubTab,
  onSelectSubTab,
  onRev,
  floatingCashList,
  dynoScore,
}) => {
  // Continuous fan rotation animation
  const fanRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const revScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 3000 RPM fan spin
    const fanLoop = Animated.loop(
      Animated.timing(fanRotation, {
        toValue: 1,
        duration: isThermalThrottling ? 250 : 600,
        useNativeDriver: true,
      })
    );
    fanLoop.start();

    // Subtle server pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      fanLoop.stop();
      pulseLoop.stop();
    };
  }, [isThermalThrottling]);

  const spin = fanRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePressRev = () => {
    Animated.sequence([
      Animated.timing(revScaleAnim, {
        toValue: 0.96,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(revScaleAnim, {
        toValue: 1.04,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(revScaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onRev();
  };

  // Build Phase Visual
  if (phase === 'build') {
    return (
      <View style={styles.buildContainer}>
        {/* IDE & TERMINAL SCREEN */}
        <View style={styles.ideHeader}>
          <View style={styles.ideDots}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.ideTitle}>
            📁 {product.name.toLowerCase()} — main.ts (TypeScript 5.8)
          </Text>
        </View>

        <View style={styles.terminalBody}>
          <Text style={styles.terminalHeader}>
            BUILD PROGRESS: {buildProgress}% [
            {'■'.repeat(Math.floor(buildProgress / 10))}
            {' '.repeat(10 - Math.floor(buildProgress / 10))}]
          </Text>
          {terminalLogs.slice(-5).map((log, index) => (
            <Text key={index} style={styles.terminalLine} numberOfLines={1}>
              {log}
            </Text>
          ))}
          <Text style={styles.terminalCursor}>&gt; ready for next module_</Text>
        </View>

        {/* DOCKER & CONTAINER PROGRESS SEAL */}
        <View style={styles.buildFooter}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>
              📦 MODULES: {installedBuildIds.length} / 8 INSTALLED
            </Text>
            <Text style={styles.badgeStatus}>
              {buildProgress >= 100 ? '✅ READY TO DEPLOY' : '⚡ COMPILING'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Phase 4 Live: Hardware Tycoon Canvas (Matching Screenshots 9 & 13)
  const loadPercentage = Math.min(100, Math.round((incomingReqPerSec / Math.max(1, totalCapacity)) * 100));
  // Needle angles for dials (-120deg to +120deg)
  const rpsNeedleAngle = -120 + (loadPercentage / 100) * 240;
  const tempRatio = Math.min(1, Math.max(0, (temperature - 28) / (95 - 28)));
  const tempNeedleAngle = -120 + tempRatio * 240;

  return (
    <View style={styles.liveContainer}>
      {/* 1. ANALOG INSTRUMENT CLUSTER GAUGES (Screenshots 9 & 13) */}
      <View style={styles.gaugeCluster}>
        {/* TACH / RPS DIAL */}
        <View style={styles.gaugeBox}>
          <Text style={styles.gaugeLabel}>TACH RPS</Text>
          <Svg width={72} height={60} viewBox="0 0 100 80">
            <Defs>
              <LinearGradient id="tachGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#22D3EE" />
                <Stop offset="70%" stopColor="#10B981" />
                <Stop offset="100%" stopColor="#EF4444" />
              </LinearGradient>
            </Defs>
            {/* Background Arc */}
            <Path
              d="M 20 70 A 40 40 0 1 1 80 70"
              fill="none"
              stroke="#1E293B"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Active Gauge Arc */}
            <Path
              d="M 20 70 A 40 40 0 1 1 80 70"
              fill="none"
              stroke="url(#tachGrad)"
              strokeWidth="8"
              strokeDasharray="180"
              strokeDashoffset={180 - (loadPercentage / 100) * 180}
              strokeLinecap="round"
            />
            {/* Center Pivot */}
            <Circle cx="50" cy="50" r="5" fill="#38BDF8" />
            {/* Needle */}
            <Line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${rpsNeedleAngle}, 50, 50)`}
            />
          </Svg>
          <Text style={styles.gaugeValue}>{incomingReqPerSec}</Text>
        </View>

        {/* THROUGHPUT / CAPACITY */}
        <View style={styles.gaugeBox}>
          <Text style={styles.gaugeLabel}>THROUGHPUT</Text>
          <Text style={styles.centerScoreText}>
            {totalCapacity >= 1000 ? `${(totalCapacity / 1000).toFixed(1)}k` : totalCapacity}
          </Text>
          <Text style={styles.gaugeSubtext}>MAX RPS</Text>
        </View>

        {/* CHIP TEMPERATURE GAUGE */}
        <View style={styles.gaugeBox}>
          <Text style={styles.gaugeLabel}>CHIP TEMP</Text>
          <Svg width={72} height={60} viewBox="0 0 100 80">
            <Defs>
              <LinearGradient id="tempGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#38BDF8" />
                <Stop offset="60%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#EF4444" />
              </LinearGradient>
            </Defs>
            <Path
              d="M 20 70 A 40 40 0 1 1 80 70"
              fill="none"
              stroke="#1E293B"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <Path
              d="M 20 70 A 40 40 0 1 1 80 70"
              fill="none"
              stroke="url(#tempGrad)"
              strokeWidth="8"
              strokeDasharray="180"
              strokeDashoffset={180 - tempRatio * 180}
              strokeLinecap="round"
            />
            <Circle cx="50" cy="50" r="5" fill="#F59E0B" />
            <Line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${tempNeedleAngle}, 50, 50)`}
            />
          </Svg>
          <Text
            style={[
              styles.gaugeValue,
              { color: isThermalThrottling ? '#EF4444' : '#10B981' },
            ]}
          >
            {temperature.toFixed(1)}°C
          </Text>
        </View>

        {/* DYNO SCORE */}
        <View style={styles.gaugeBox}>
          <Text style={styles.gaugeLabel}>DYNO SCORE</Text>
          <Text style={styles.dynoScoreText}>⚡ {dynoScore}</Text>
          <Text style={styles.gaugeSubtext}>EFF 98.4%</Text>
        </View>
      </View>

      {/* 2. LIVE INTERACTIVE SERVER RACK (TAP OR HOLD TO REV IT!) */}
      <Animated.View style={{ transform: [{ scale: revScaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handlePressRev}
          style={[
            styles.rackChassis,
            isThermalThrottling && styles.rackThrottlingGlow,
          ]}
        >
          {/* Chassis Top Rail */}
          <View style={styles.chassisRail}>
            <View style={styles.ledCluster}>
              <View style={[styles.led, { backgroundColor: '#10B981' }]} />
              <View style={[styles.led, { backgroundColor: '#38BDF8' }]} />
              <View
                style={[
                  styles.led,
                  { backgroundColor: isThermalThrottling ? '#EF4444' : '#64748B' },
                ]}
              />
            </View>
            <Text style={styles.chassisLabel}>
              42U RACK // {product.recommendedStack.toUpperCase()}
            </Text>
            <Text style={styles.pduLabel}>⚡ {powerKw.toFixed(1)} kW</Text>
          </View>

          {/* Sleds Inside Rack */}
          <View style={styles.sledRow}>
            {/* Redis Cache Sled */}
            <View style={styles.sledBox}>
              <Text style={styles.sledIcon}>⚡</Text>
              <Text style={styles.sledName}>REDIS RAM</Text>
              <Text style={styles.sledLvl}>LV {infraLevels.redis_sled || 0}</Text>
            </View>
            {/* SQL Sled */}
            <View style={styles.sledBox}>
              <Text style={styles.sledIcon}>💾</Text>
              <Text style={styles.sledName}>SQL ACID</Text>
              <Text style={styles.sledLvl}>LV {infraLevels.db_primary || 0}</Text>
            </View>
            {/* Blade Compute Sled */}
            <View style={styles.sledBox}>
              <Text style={styles.sledIcon}>🔲</Text>
              <Text style={styles.sledName}>BLADE EPYC</Text>
              <Text style={styles.sledLvl}>LV {infraLevels.app_server || 1}</Text>
            </View>
            {/* GPU Sled */}
            <View style={styles.sledBox}>
              <Text style={styles.sledIcon}>🧠</Text>
              <Text style={styles.sledName}>H100 TENSOR</Text>
              <Text style={styles.sledLvl}>LV {infraLevels.gpu_tensor || 0}</Text>
            </View>
          </View>

          {/* Animated Spinning Fans Tray */}
          <View style={styles.fanTray}>
            <View style={styles.fanHousing}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Svg width={36} height={36} viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="16" fill="#0F172A" />
                  <Path d="M 50 50 Q 75 25 80 50 Q 65 60 50 50 Z" fill="#38BDF8" />
                  <Path d="M 50 50 Q 75 75 50 80 Q 40 65 50 50 Z" fill="#38BDF8" />
                  <Path d="M 50 50 Q 25 75 20 50 Q 35 40 50 50 Z" fill="#38BDF8" />
                  <Path d="M 50 50 Q 25 25 50 20 Q 60 35 50 50 Z" fill="#38BDF8" />
                </Svg>
              </Animated.View>
              <Text style={styles.fanSpeed}>
                {isThermalThrottling ? '3600 RPM' : '2800 RPM'}
              </Text>
            </View>

            <View style={styles.tapPromptBox}>
              <Text style={styles.tapPromptText}>
                👆 Tap or hold rack to rev traffic & earn cash!
              </Text>
            </View>

            <View style={styles.fanHousing}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Svg width={36} height={36} viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="16" fill="#0F172A" />
                  <Path d="M 50 50 Q 75 25 80 50 Q 65 60 50 50 Z" fill="#38BDF8" />
                  <Path d="M 50 50 Q 75 75 50 80 Q 40 65 50 50 Z" fill="#38BDF8" />
                  <Path d="M 50 50 Q 25 75 20 50 Q 35 40 50 50 Z" fill="#38BDF8" />
                  <Path d="M 50 50 Q 25 25 50 20 Q 60 35 50 50 Z" fill="#38BDF8" />
                </Svg>
              </Animated.View>
              <Text style={styles.fanSpeed}>
                {isThermalThrottling ? '3600 RPM' : '2800 RPM'}
              </Text>
            </View>
          </View>

          {/* Floating cash notifications when tapped */}
          {floatingCashList.map((item) => (
            <Text
              key={item.id}
              style={[
                styles.floatingCash,
                { transform: [{ translateX: item.x }, { translateY: item.y }] },
              ]}
            >
              {item.text}
            </Text>
          ))}
        </TouchableOpacity>
      </Animated.View>

      {/* 3. BOTTLENECK WARNING BANNER (Screenshots 5 & 12) */}
      <View
        style={[
          styles.bottleneckAlertBanner,
          activeBottleneck === 'THERMAL' && styles.bottleneckThermal,
          activeBottleneck === 'INGRESS' && styles.bottleneckIngress,
        ]}
      >
        <Text style={styles.bottleneckAlertText}>
          {activeBottleneck === 'THERMAL'
            ? '🔥 Throttling 40%: Upgrade CHASSIS FAN or LIQUID COOLING'
            : activeBottleneck === 'INGRESS'
            ? '⚠️ Ingress Choked: Upgrade ANYCAST GATEWAY or LOAD BALANCER'
            : activeBottleneck === 'DB READS'
            ? '💾 DB Saturated: Upgrade REDIS CACHE or READ REPLICAS'
            : activeBottleneck === 'COMPUTE'
            ? '⚡ Compute Bound: Upgrade BLADE SERVERS or H100 TENSOR'
            : '✅ System Design Operating at Maximum Peak Efficiency'}
        </Text>
      </View>

      {/* 4. RIG SUB-TABS (Screenshots 2, 3, 4, 9, 13) */}
      <View style={styles.subTabRow}>
        {(
          [
            { id: 'compute', label: 'COMPUTE', icon: '🔲', count: 4 },
            { id: 'thermal', label: 'COOLING', icon: '❄️', count: 2 },
            { id: 'ingress', label: 'INGRESS', icon: '📶', count: 2 },
            { id: 'interconnect', label: 'FIBER', icon: '⚡', count: 1 },
          ] as const
        ).map((tab) => {
          const isSelected = activeSubTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectSubTab(tab.id)}
              style={[styles.subTabButton, isSelected && styles.subTabActive]}
            >
              <Text
                style={[styles.subTabText, isSelected && styles.subTabTextActive]}
              >
                {tab.icon} {tab.label}
              </Text>
              <View
                style={[styles.subTabBadge, isSelected && styles.subTabBadgeActive]}
              >
                <Text style={styles.subTabBadgeText}>{tab.count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buildContainer: {
    backgroundColor: '#070B14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  ideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 8,
  },
  ideDots: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  ideTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  terminalBody: {
    backgroundColor: '#030712',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  terminalHeader: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    marginBottom: 6,
  },
  terminalLine: {
    color: '#A7F3D0',
    fontSize: 11,
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  terminalCursor: {
    color: '#38BDF8',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  buildFooter: {
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeStatus: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  liveContainer: {
    backgroundColor: '#070B14',
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  gaugeCluster: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0B1221',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
  },
  gaugeBox: {
    alignItems: 'center',
    flex: 1,
  },
  gaugeLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  gaugeValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginTop: -4,
  },
  gaugeSubtext: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  centerScoreText: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 6,
  },
  dynoScoreText: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 6,
  },
  rackChassis: {
    backgroundColor: '#0B132B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 10,
    position: 'relative',
  },
  rackThrottlingGlow: {
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  chassisRail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  ledCluster: {
    flexDirection: 'row',
    gap: 4,
  },
  led: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  chassisLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  pduLabel: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  sledRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 8,
  },
  sledBox: {
    flex: 1,
    backgroundColor: '#111C35',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  sledIcon: {
    fontSize: 14,
  },
  sledName: {
    color: '#E2E8F0',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  sledLvl: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  fanTray: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#070D1F',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  fanHousing: {
    alignItems: 'center',
  },
  fanSpeed: {
    color: '#64748B',
    fontSize: 7,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  tapPromptBox: {
    flex: 1,
    alignItems: 'center',
  },
  tapPromptText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  floatingCash: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    color: '#10B981',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottleneckAlertBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 6,
    alignItems: 'center',
  },
  bottleneckThermal: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  bottleneckIngress: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
  },
  bottleneckAlertText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subTabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  subTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1221',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 4,
  },
  subTabActive: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
  },
  subTabText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
  },
  subTabTextActive: {
    color: '#38BDF8',
  },
  subTabBadge: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  subTabBadgeActive: {
    backgroundColor: '#0284C7',
  },
  subTabBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
});
