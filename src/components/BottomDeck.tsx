import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BUILD_MODULES, INFRA_NODES } from '../data/gameData';
import { GamePhase, PlayerMode, RigSubTab } from '../types/game';

interface Props {
  phase: GamePhase;
  mode: PlayerMode;
  rigSubTab: RigSubTab;
  setRigSubTab: (tab: RigSubTab) => void;
  cash: number;
  installedBuildIds: string[];
  infraLevels: Record<string, number>;
  activeBottleneck: string;
  onInstallBuild: (id: string) => void;
  getInfraCost: (id: string) => number;
  onUpgradeInfra: (id: string) => void;
}

export const BottomDeck: React.FC<Props> = ({
  phase,
  mode,
  rigSubTab,
  setRigSubTab,
  cash,
  installedBuildIds,
  infraLevels,
  activeBottleneck,
  onInstallBuild,
  getInfraCost,
  onUpgradeInfra,
}) => {
  // Phase 1: Build Modules Deck
  if (phase === 'build') {
    return (
      <View style={styles.deckContainer}>
        <View style={styles.deckHeader}>
          <Text style={styles.deckSectionTitle}>
            PRODUCT ENGINEERING ROADMAP ({installedBuildIds.length}/{BUILD_MODULES.length} MILESTONES)
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.buildList} showsVerticalScrollIndicator={false}>
          {BUILD_MODULES.map((mod) => {
            const installed = installedBuildIds.includes(mod.id);
            const canAfford = cash >= mod.cost;
            return (
              <View key={mod.id} style={[styles.buildCard, installed && styles.cardDone]}>
                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.categoryBadge}>{mod.category}</Text>
                    {installed && <Text style={styles.doneBadge}>✓ COMPILED</Text>}
                  </View>
                  <Text style={styles.buildTitle}>{mod.name}</Text>
                  <Text style={styles.buildDesc}>
                    {mode === 'explorer' ? mod.explorerDesc : mod.devDesc}
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={installed || !canAfford}
                  style={[
                    styles.buildActionBtn,
                    installed
                      ? styles.btnInstalled
                      : !canAfford
                      ? styles.btnDisabled
                      : styles.btnAfford,
                  ]}
                  onPress={() => onInstallBuild(mod.id)}
                >
                  <Text style={styles.buildActionBtnText}>
                    {installed ? 'DONE' : mod.cost === 0 ? 'FREE' : `$${mod.cost}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Phase 2: Live Hardware Tycoon Subtabs & Upgrade Deck
  const subTabs: { id: RigSubTab; label: string; icon: string }[] = [
    { id: 'compute', label: 'COMPUTE', icon: '⚡' },
    { id: 'thermal', label: 'THERMAL', icon: '❄️' },
    { id: 'ingress', label: 'INGRESS', icon: '🌐' },
    { id: 'interconnect', label: 'FABRIC', icon: '🔗' },
  ];

  const currentNodes = INFRA_NODES.filter((n) => n.subTab === rigSubTab);

  return (
    <View style={styles.deckContainer}>
      {/* Hardware Tycoon Subtabs */}
      <View style={styles.subTabRow}>
        {subTabs.map((st) => {
          const active = rigSubTab === st.id;
          return (
            <TouchableOpacity
              key={st.id}
              style={[styles.subTabBtn, active && styles.subTabBtnActive]}
              onPress={() => setRigSubTab(st.id)}
            >
              <Text style={[styles.subTabText, active && styles.subTabTextActive]}>
                {st.icon} {st.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2-Column Compact Upgrade Cards (Matching Reference Screenshots 3, 4, 5) */}
      <ScrollView contentContainerStyle={styles.infraGrid} showsVerticalScrollIndicator={false}>
        {currentNodes.map((node) => {
          const lvl = infraLevels[node.id] || 0;
          const cost = getInfraCost(node.id);
          const canAfford = cash >= cost;
          const isBottleneck = activeBottleneck === node.solvesBottleneck;

          return (
            <View
              key={node.id}
              style={[
                styles.infraCard,
                isBottleneck && styles.infraCardBottleneck,
              ]}
            >
              {isBottleneck && (
                <View style={styles.bottleneckTag}>
                  <Text style={styles.bottleneckTagText}>● BOTTLENECK</Text>
                </View>
              )}

              <View style={styles.infraCardHeader}>
                <Text style={styles.infraName}>{node.shortName}</Text>
                <Text style={styles.infraLevelBadge}>LV {lvl}</Text>
              </View>

              <Text style={styles.infraStats}>
                {node.capacityPerLevel > 0 && `+${node.capacityPerLevel} REQ/S `}
                {node.heatPerLevel < 0 && `${node.heatPerLevel}°C COOLING `}
                {node.heatPerLevel > 0 && `+${node.heatPerLevel}°C HEAT `}
                {`• -$${node.burnPerSec}/S`}
              </Text>

              <Text style={styles.infraDesc} numberOfLines={2}>
                {mode === 'explorer' ? node.explorerDesc : node.devDesc}
              </Text>

              <TouchableOpacity
                disabled={!canAfford}
                style={[
                  styles.infraBuyBtn,
                  !canAfford ? styles.btnDisabled : styles.btnAfford,
                ]}
                onPress={() => onUpgradeInfra(node.id)}
              >
                <Text style={styles.infraBuyBtnText}>
                  ${cost >= 1000 ? `${(cost / 1000).toFixed(1)}K` : cost}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  deckHeader: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  deckSectionTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  buildList: {
    paddingBottom: 24,
    gap: 8,
  },
  buildCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardDone: {
    borderColor: '#10B981',
    backgroundColor: '#061A1E',
  },
  cardInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryBadge: {
    color: '#22D3EE',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  doneBadge: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '900',
  },
  buildTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  buildDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  buildActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  buildActionBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '900',
  },

  // Subtabs
  subTabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  subTabBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  subTabBtnActive: {
    backgroundColor: '#22D3EE',
    borderColor: '#22D3EE',
  },
  subTabText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
  },
  subTabTextActive: {
    color: '#042F2E',
  },

  // Infra Grid
  infraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 24,
  },
  infraCard: {
    width: '48.5%',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    justifyContent: 'space-between',
    minHeight: 120,
    position: 'relative',
  },
  infraCardBottleneck: {
    borderColor: '#F59E0B',
    backgroundColor: '#1E1B13',
  },
  bottleneckTag: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bottleneckTagText: {
    color: '#451A03',
    fontSize: 8,
    fontWeight: '900',
  },
  infraCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  infraName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '900',
    flex: 1,
  },
  infraLevelBadge: {
    color: '#22D3EE',
    fontSize: 10,
    fontWeight: '900',
  },
  infraStats: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  infraDesc: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 14,
    marginVertical: 4,
  },
  infraBuyBtn: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  infraBuyBtnText: {
    color: '#042F2E',
    fontSize: 12,
    fontWeight: '900',
  },
  btnAfford: {
    backgroundColor: '#10B981',
  },
  btnDisabled: {
    backgroundColor: '#1E293B',
  },
  btnInstalled: {
    backgroundColor: '#083344',
  },
});
