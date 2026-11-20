import React, { useEffect, useRef, useState } from 'react';
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
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { GlobalRegion } from '../types/game';

interface Props {
  regions: GlobalRegion[];
  cash: number;
  onUnlockRegion: (regionId: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const GlobalRegionMap: React.FC<Props> = ({
  regions,
  cash,
  onUnlockRegion,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('me_central');
  const packetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(packetAnim, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const selectedRegion =
    regions.find((r) => r.id === selectedRegionId) || regions[3];
  const unlockedCount = regions.filter((r) => r.unlocked).length;

  return (
    <View style={styles.container}>
      {/* Top Banner (Screenshot 1: "OPEN NEW REGIONS ALONG YOUR BACKBONE") */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>OPEN NEW CLOUD REGIONS</Text>
        <Text style={styles.headerTitle}>ALONG YOUR BACKBONE</Text>
        <View style={styles.subStatsRow}>
          <Text style={styles.statsCount}>
            ROUTES: {unlockedCount} OF {regions.length} REGIONS ONLINE
          </Text>
          <Text style={styles.statsRps}>+$33.9K/SEC</Text>
        </View>
      </View>

      {/* World Map SVG Canvas */}
      <View style={styles.mapContainer}>
        <Svg width={SCREEN_WIDTH - 24} height={260} viewBox="0 0 360 260">
          <Defs>
            <LinearGradient id="mapGlow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#0B132B" />
              <Stop offset="100%" stopColor="#070B14" />
            </LinearGradient>
            <LinearGradient id="cableGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="50%" stopColor="#10B981" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>
          </Defs>

          {/* Ocean Grid Background */}
          <Rect x="0" y="0" width="360" height="260" fill="url(#mapGlow)" rx="12" />

          {/* Grid lines */}
          <Path
            d="M 0 65 L 360 65 M 0 130 L 360 130 M 0 195 L 360 195 M 90 0 L 90 260 M 180 0 L 180 260 M 270 0 L 270 260"
            stroke="#1E293B"
            strokeWidth="0.8"
            strokeDasharray="4,4"
          />

          {/* Abstract Continents Outlines */}
          {/* North America */}
          <Path
            d="M 40 40 Q 80 30 110 50 Q 90 90 60 100 Q 30 70 40 40 Z"
            fill="#111C35"
            stroke="#1E3A8A"
            strokeWidth="1"
          />
          {/* Europe */}
          <Path
            d="M 155 35 Q 200 30 210 65 Q 180 85 160 70 Z"
            fill="#111C35"
            stroke="#1E3A8A"
            strokeWidth="1"
          />
          {/* Asia */}
          <Path
            d="M 215 45 Q 310 40 330 90 Q 280 130 220 100 Z"
            fill="#111C35"
            stroke="#1E3A8A"
            strokeWidth="1"
          />
          {/* Africa */}
          <Path
            d="M 165 95 Q 210 100 205 170 Q 185 190 170 140 Z"
            fill="#111C35"
            stroke="#1E3A8A"
            strokeWidth="1"
          />
          {/* South America */}
          <Path
            d="M 90 120 Q 130 130 120 190 Q 95 210 85 150 Z"
            fill="#111C35"
            stroke="#1E3A8A"
            strokeWidth="1"
          />

          {/* Subsea Optical Fiber Cable Routes (Curved dashed lines) */}
          {/* US-East to EU-West */}
          <Path
            d="M 86 93 Q 130 40 172 78"
            fill="none"
            stroke="url(#cableGrad)"
            strokeWidth="2"
            strokeDasharray="4,3"
          />
          {/* EU-West to ME-Central */}
          <Path
            d="M 172 78 Q 200 90 223 114"
            fill="none"
            stroke="url(#cableGrad)"
            strokeWidth="2"
            strokeDasharray="4,3"
          />
          {/* ME-Central to AP-Southeast */}
          <Path
            d="M 223 114 Q 255 125 280 135"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          {/* US-East to SA-East */}
          <Path
            d="M 86 93 Q 95 135 118 187"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />

          {/* Region Node Markers */}
          {regions.map((reg) => {
            const posX = (reg.x / 100) * 360;
            const posY = (reg.y / 100) * 260;
            const isSelected = reg.id === selectedRegion.id;

            return (
              <G key={reg.id}>
                {/* Outer Pulse Ring */}
                <Circle
                  cx={posX}
                  cy={posY}
                  r={isSelected ? 14 : 9}
                  fill="none"
                  stroke={reg.unlocked ? '#10B981' : '#F59E0B'}
                  strokeWidth="1.5"
                  strokeDasharray={reg.unlocked ? 'none' : '2,2'}
                  opacity={0.8}
                />
                {/* Center Core */}
                <Circle
                  cx={posX}
                  cy={posY}
                  r={isSelected ? 6 : 4}
                  fill={reg.unlocked ? '#10B981' : '#D97706'}
                />
                {/* Node Code Label */}
                <SvgText
                  x={posX}
                  y={posY - 12}
                  fill={reg.unlocked ? '#38BDF8' : '#94A3B8'}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {reg.code}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Region Selector Pills */}
      <View style={styles.pillsRow}>
        {regions.map((r) => {
          const isSelected = r.id === selectedRegion.id;
          return (
            <TouchableOpacity
              key={r.id}
              onPress={() => setSelectedRegionId(r.id)}
              style={[styles.pill, isSelected && styles.pillActive]}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                {r.code} {r.unlocked ? '✓' : '🔒'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Region Detail Card (Screenshot 1: DXB DUBAI INTERNATIONAL CARD) */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardCode}>{selectedRegion.code}</Text>
            <Text style={styles.cardTitle}>{selectedRegion.name}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              selectedRegion.unlocked
                ? styles.statusUnlocked
                : styles.statusLocked,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {selectedRegion.unlocked ? 'ONLINE' : 'PROVISION NEEDED'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardDesc}>{selectedRegion.description}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statVal}>{selectedRegion.latencyMs}ms</Text>
            <Text style={styles.statSub}>PING LATENCY</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statVal}>+{selectedRegion.rpsCapacity}</Text>
            <Text style={styles.statSub}>RPS BACKBONE</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statVal}>
              +{(selectedRegion.incomeBonus * 100).toFixed(0)}%
            </Text>
            <Text style={styles.statSub}>GLOBAL INCOME</Text>
          </View>
        </View>

        {/* Provision / Unlocked Button */}
        {selectedRegion.unlocked ? (
          <View style={styles.unlockedBox}>
            <Text style={styles.unlockedBoxText}>
              ✅ REGION ACTIVE • FIBER LINK ROUTED
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            disabled={cash < selectedRegion.unlockCost}
            onPress={() => onUnlockRegion(selectedRegion.id)}
            style={[
              styles.provisionBtn,
              cash < selectedRegion.unlockCost && styles.provisionBtnDisabled,
            ]}
          >
            <Text style={styles.provisionBtnText}>
              OPEN {selectedRegion.name.toUpperCase()} • $
              {selectedRegion.unlockCost.toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerTitle: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  statsCount: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRps: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  mapContainer: {
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pill: {
    backgroundColor: '#0B1221',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  pillActive: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
  },
  pillText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
  },
  pillTextActive: {
    color: '#38BDF8',
  },
  cardContainer: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardCode: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '900',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusUnlocked: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusLocked: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusBadgeText: {
    color: '#F8FAFC',
    fontSize: 9,
    fontWeight: '800',
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#070B14',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  statCell: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  statSub: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },
  unlockedBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  unlockedBoxText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '900',
  },
  provisionBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  provisionBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  provisionBtnText: {
    color: '#070B14',
    fontSize: 12,
    fontWeight: '900',
  },
});
