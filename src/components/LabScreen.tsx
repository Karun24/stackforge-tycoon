import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LAB_UPGRADES } from '../data/gameData';
import { LabBench } from '../types/game';

interface Props {
  labBenches: LabBench[];
  unlockedLabIds: string[];
  cash: number;
  gems: number;
  onStartResearch: (benchId: number, upgradeId: string) => void;
  onUnlockBench: (benchId: number) => void;
}

export const LabScreen: React.FC<Props> = ({
  labBenches,
  unlockedLabIds,
  cash,
  gems,
  onStartResearch,
  onUnlockBench,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'NETWORK', 'DATABASE', 'COMPUTE', 'AI'];

  const filteredUpgrades =
    selectedCategory === 'ALL'
      ? LAB_UPGRADES
      : LAB_UPGRADES.filter((u) => u.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header Stat & Perks (Screenshot 7) */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.labSubtitle}>R&D ENGINEERING</Text>
          <Text style={styles.labTitle}>
            RESEARCH LAB ({unlockedLabIds.length}/{LAB_UPGRADES.length})
          </Text>
        </View>
        <View style={styles.perkBadges}>
          <Text style={styles.perkBadge}>-15% LATENCY</Text>
          <Text style={styles.perkBadge}>+30% IOPS</Text>
        </View>
      </View>

      {/* 3 Research Benches (Screenshot 7) */}
      <View style={styles.benchesRow}>
        {labBenches.map((bench) => {
          if (!bench.unlocked) {
            return (
              <TouchableOpacity
                key={bench.id}
                onPress={() => onUnlockBench(bench.id)}
                style={[styles.benchCard, styles.benchLocked]}
              >
                <Text style={styles.benchLockIcon}>🔒</Text>
                <Text style={styles.benchName}>{bench.name}</Text>
                <Text style={styles.benchUnlockPrice}>
                  💎 {bench.unlockCostGems}
                </Text>
                <Text style={styles.benchUnlockSub}>UNLOCK</Text>
              </TouchableOpacity>
            );
          }

          if (bench.activeUpgradeId) {
            const activeUp = LAB_UPGRADES.find(
              (u) => u.id === bench.activeUpgradeId
            );
            const progress =
              bench.totalSeconds > 0
                ? 1 - bench.remainingSeconds / bench.totalSeconds
                : 0;

            return (
              <View key={bench.id} style={[styles.benchCard, styles.benchBusy]}>
                <Text style={styles.benchName}>{bench.name}</Text>
                <Text style={styles.benchActiveProject} numberOfLines={1}>
                  {activeUp?.title || 'RESEARCHING'}
                </Text>
                <Text style={styles.benchTimer}>
                  ⏱️ {Math.ceil(bench.remainingSeconds)}s
                </Text>
                {/* Progress bar */}
                <View style={styles.benchProgressBg}>
                  <View
                    style={[
                      styles.benchProgressFill,
                      { width: `${Math.round(progress * 100)}%` },
                    ]}
                  />
                </View>
              </View>
            );
          }

          return (
            <View key={bench.id} style={[styles.benchCard, styles.benchReady]}>
              <Text style={styles.benchName}>{bench.name}</Text>
              <Text style={styles.benchStatusReady}>+ READY</Text>
              <Text style={styles.benchPickSub}>pick project</Text>
            </View>
          );
        })}
      </View>

      {/* Category Filter Pills (Screenshot 7) */}
      <View style={styles.categoryPills}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.catPill, isSelected && styles.catPillActive]}
            >
              <Text
                style={[
                  styles.catPillText,
                  isSelected && styles.catPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Research Upgrades List */}
      <ScrollView
        contentContainerStyle={styles.upgradesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredUpgrades.map((upgrade) => {
          const isUnlocked = unlockedLabIds.includes(upgrade.id);
          const hasPrereq =
            !upgrade.prerequisiteId ||
            unlockedLabIds.includes(upgrade.prerequisiteId);
          const canAfford = cash >= upgrade.cost;
          const freeBench = labBenches.find(
            (b) => b.unlocked && !b.activeUpgradeId
          );

          return (
            <View
              key={upgrade.id}
              style={[
                styles.upgradeCard,
                isUnlocked && styles.cardUnlocked,
                !hasPrereq && styles.cardDisabled,
              ]}
            >
              <View style={styles.upgradeHeader}>
                <View style={styles.titleCol}>
                  <View style={styles.catRow}>
                    <Text style={styles.catBadge}>{upgrade.category}</Text>
                    {isUnlocked && (
                      <Text style={styles.unlockedBadge}>✓ RESEARCHED</Text>
                    )}
                  </View>
                  <Text style={styles.upgradeTitle}>{upgrade.title}</Text>
                </View>

                {/* Start Research Button */}
                {isUnlocked ? (
                  <View style={styles.donePill}>
                    <Text style={styles.donePillText}>ACTIVE</Text>
                  </View>
                ) : !hasPrereq ? (
                  <View style={styles.lockedPill}>
                    <Text style={styles.lockedPillText}>PREREQUISITE</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    disabled={!canAfford || !freeBench}
                    onPress={() => freeBench && onStartResearch(freeBench.id, upgrade.id)}
                    style={[
                      styles.startBtn,
                      (!canAfford || !freeBench) && styles.startBtnDisabled,
                    ]}
                  >
                    <Text style={styles.startBtnText}>
                      ${upgrade.cost.toLocaleString()}
                    </Text>
                    <Text style={styles.startBtnSub}>
                      START ({upgrade.durationSeconds}s)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.bonusText}>{upgrade.bonusText}</Text>
              <Text style={styles.descText}>{upgrade.explorerDesc}</Text>
            </View>
          );
        })}
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labSubtitle: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  labTitle: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '900',
  },
  perkBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  perkBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  benchesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  benchCard: {
    flex: 1,
    backgroundColor: '#0B1221',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 8,
    alignItems: 'center',
  },
  benchLocked: {
    opacity: 0.6,
  },
  benchLockIcon: {
    fontSize: 14,
  },
  benchUnlockPrice: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '900',
    marginVertical: 2,
  },
  benchUnlockSub: {
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
  },
  benchBusy: {
    borderColor: '#38BDF8',
    backgroundColor: '#0F1E3A',
  },
  benchName: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
  },
  benchActiveProject: {
    color: '#F8FAFC',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  benchTimer: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  benchProgressBg: {
    width: '100%',
    height: 3,
    backgroundColor: '#1E293B',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  benchProgressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  benchReady: {
    borderColor: '#10B981',
  },
  benchStatusReady: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },
  benchPickSub: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '700',
  },
  categoryPills: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  catPill: {
    backgroundColor: '#0B1221',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  catPillActive: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
  },
  catPillText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
  },
  catPillTextActive: {
    color: '#38BDF8',
  },
  upgradesList: {
    paddingBottom: 40,
    gap: 8,
  },
  upgradeCard: {
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
  },
  cardUnlocked: {
    borderColor: '#065F46',
    backgroundColor: '#071F18',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  upgradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  catBadge: {
    backgroundColor: '#1E293B',
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  unlockedBadge: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  upgradeTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  donePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  donePillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  lockedPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lockedPillText: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '800',
  },
  startBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  startBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  startBtnText: {
    color: '#070B14',
    fontSize: 11,
    fontWeight: '900',
  },
  startBtnSub: {
    color: '#064E3B',
    fontSize: 8,
    fontWeight: '800',
  },
  bonusText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    marginVertical: 2,
  },
  descText: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 14,
  },
});
