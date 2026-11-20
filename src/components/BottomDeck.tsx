import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { INFRA_NODES } from '../data/gameData';
import { BuildModule, GamePhase, PlayerMode, RigSubTab } from '../types/game';

interface Props {
  phase: GamePhase;
  mode: PlayerMode;
  rigSubTab: RigSubTab;
  setRigSubTab: (tab: RigSubTab) => void;
  cash: number;
  buildModules: BuildModule[];
  installedBuildIds: string[];
  infraLevels: Record<string, number>;
  activeBottleneck: string;
  onInstallBuild: (id: string) => void;
  onUpgradeInfra: (id: string) => void;
}

export const BottomDeck: React.FC<Props> = ({
  phase,
  mode,
  rigSubTab,
  setRigSubTab,
  cash,
  buildModules,
  installedBuildIds,
  infraLevels,
  activeBottleneck,
  onInstallBuild,
  onUpgradeInfra,
}) => {
  // Phase 1: Build Modules Deck
  if (phase === 'build') {
    return (
      <View style={styles.deckContainer}>
        <View style={styles.deckHeader}>
          <Text style={styles.deckSectionTitle}>
            ARCHITECTURE ROADMAP ({installedBuildIds.length}/{buildModules.length} MILESTONES)
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.buildList}
          showsVerticalScrollIndicator={false}
        >
          {buildModules.map((mod) => {
            const installed = installedBuildIds.includes(mod.id);
            const canAfford = cash >= mod.cost;
            return (
              <View
                key={mod.id}
                style={[styles.buildCard, installed && styles.cardDone]}
              >
                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.categoryBadge}>{mod.category}</Text>
                    {installed && <Text style={styles.doneBadge}>✓ COMPILED</Text>}
                  </View>
                  <Text style={styles.buildTitle}>{mod.name}</Text>
                  <Text style={styles.buildDesc}>
                    {mode === 'developer' ? mod.devDesc : mod.explorerDesc}
                  </Text>
                </View>

                <View style={styles.cardAction}>
                  {installed ? (
                    <View style={styles.installedPill}>
                      <Text style={styles.installedPillText}>READY</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      disabled={!canAfford}
                      onPress={() => onInstallBuild(mod.id)}
                      style={[
                        styles.buyButton,
                        !canAfford && styles.buyButtonDisabled,
                      ]}
                    >
                      <Text style={styles.buyButtonText}>
                        ${mod.cost.toLocaleString()}
                      </Text>
                      <Text style={styles.buyButtonSubtext}>INSTALL</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Phase 4: Live Hardware Deck (Screenshots 2, 3, 4, 12: THE BOTTLENECK TAG NAMES THE NEXT BUY)
  const currentSubTabNodes = INFRA_NODES.filter((n) => n.subTab === rigSubTab);

  return (
    <View style={styles.deckContainer}>
      <ScrollView
        contentContainerStyle={styles.hardwareGrid}
        showsVerticalScrollIndicator={false}
      >
        {currentSubTabNodes.map((node) => {
          const currentLvl = infraLevels[node.id] || 0;
          const cost = Math.round(node.baseCost * Math.pow(node.costMultiplier, currentLvl));
          const canAfford = cash >= cost;
          const isBottleneck = activeBottleneck === node.solvesBottleneck;

          return (
            <View
              key={node.id}
              style={[
                styles.hardwareCard,
                isBottleneck && styles.cardBottleneck,
              ]}
            >
              {/* THE FAMOUS BOTTLENECK / BEST TAG (Screenshot 12) */}
              {isBottleneck ? (
                <View style={styles.bottleneckBadge}>
                  <Text style={styles.bottleneckBadgeText}>⚠️ BOTTLENECK</Text>
                </View>
              ) : currentLvl === 0 ? (
                <View style={styles.bestBadge}>
                  <Text style={styles.bestBadgeText}>★ NEW</Text>
                </View>
              ) : null}

              {/* Header Info */}
              <View style={styles.hardwareHeader}>
                <Text style={styles.hardwareName} numberOfLines={1}>
                  {node.shortName}
                </Text>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>LV {currentLvl}</Text>
                </View>
              </View>

              {/* Stat Benefit */}
              <View style={styles.statBox}>
                <Text style={styles.statBenefit}>
                  {node.heatPerLevel < 0
                    ? `${node.heatPerLevel}°C COOLING`
                    : `+${node.capacityPerLevel} ${node.unit}/S`}
                </Text>
                <Text style={styles.statSpec}>
                  PDU +{node.powerKwPerLevel}kW • BURN -${node.burnPerSec}/S
                </Text>
              </View>

              {/* Explanatory Description */}
              <Text style={styles.hardwareDesc} numberOfLines={2}>
                {mode === 'developer' ? node.devDesc : node.explorerDesc}
              </Text>

              {/* Purchase Button */}
              <TouchableOpacity
                disabled={!canAfford}
                onPress={() => onUpgradeInfra(node.id)}
                style={[
                  styles.upgradeBtn,
                  !canAfford && styles.upgradeBtnDisabled,
                  isBottleneck && styles.upgradeBtnBottleneck,
                ]}
              >
                <Text style={styles.upgradeBtnText}>
                  💵 ${cost >= 1000 ? `${(cost / 1000).toFixed(1)}k` : cost}
                </Text>
                <Text style={styles.upgradeBtnSubtext}>
                  {currentLvl === 0 ? 'INSTALL' : 'UPGRADE'}
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
    backgroundColor: '#070B14',
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  deckHeader: {
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 8,
  },
  deckSectionTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  buildList: {
    paddingBottom: 40,
    gap: 8,
  },
  buildCard: {
    flexDirection: 'row',
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDone: {
    borderColor: '#065F46',
    backgroundColor: '#06281E',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#1E293B',
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  doneBadge: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  buildTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  buildDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  cardAction: {
    alignItems: 'center',
  },
  installedPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  installedPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  buyButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 75,
  },
  buyButtonDisabled: {
    backgroundColor: '#1E293B',
  },
  buyButtonText: {
    color: '#070B14',
    fontSize: 12,
    fontWeight: '900',
  },
  buyButtonSubtext: {
    color: '#064E3B',
    fontSize: 8,
    fontWeight: '800',
  },
  hardwareGrid: {
    paddingBottom: 40,
    gap: 10,
  },
  hardwareCard: {
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    position: 'relative',
  },
  cardBottleneck: {
    borderColor: '#F59E0B',
    backgroundColor: '#15131C',
  },
  bottleneckBadge: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  bottleneckBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bestBadge: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  bestBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  hardwareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 2,
  },
  hardwareName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  levelPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelPillText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statBox: {
    marginVertical: 4,
  },
  statBenefit: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statSpec: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  hardwareDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  upgradeBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  upgradeBtnBottleneck: {
    backgroundColor: '#F59E0B',
  },
  upgradeBtnText: {
    color: '#070B14',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  upgradeBtnSubtext: {
    color: '#070B14',
    fontSize: 10,
    fontWeight: '800',
  },
});
