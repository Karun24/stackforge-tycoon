import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LAB_UPGRADES } from '../data/gameData';
import { PlayerMode } from '../types/game';

interface Props {
  mode: PlayerMode;
  unlockedLabIds: string[];
  cash: number;
  onUnlockLab: (id: string) => void;
}

export const LabScreen: React.FC<Props> = ({
  mode,
  unlockedLabIds,
  cash,
  onUnlockLab,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>R&D LAB // SYSTEM OPTIMIZATION</Text>
        <Text style={styles.headerSub}>RESEARCH PROTOCOLS & ALGORITHMIC EFFICIENCIES</Text>
      </View>

      <View style={styles.list}>
        {LAB_UPGRADES.map((upgrade) => {
          const isUnlocked = unlockedLabIds.includes(upgrade.id);
          const canAfford = cash >= upgrade.cost;

          return (
            <View
              key={upgrade.id}
              style={[styles.card, isUnlocked && styles.cardUnlocked]}
            >
              <View style={styles.cardInfo}>
                <View style={styles.badgeRow}>
                  <Text style={styles.categoryBadge}>{upgrade.category}</Text>
                  {isUnlocked && <Text style={styles.unlockedBadge}>ACTIVE IN PROD</Text>}
                </View>
                <Text style={styles.title}>{upgrade.title}</Text>
                <Text style={styles.bonusText}>⚡ {upgrade.bonusText}</Text>
                <Text style={styles.desc}>
                  {mode === 'explorer' ? upgrade.explorerDesc : upgrade.devDesc}
                </Text>
              </View>

              <TouchableOpacity
                disabled={isUnlocked || !canAfford}
                style={[
                  styles.buyBtn,
                  isUnlocked
                    ? styles.btnUnlocked
                    : !canAfford
                    ? styles.btnDisabled
                    : styles.btnAfford,
                ]}
                onPress={() => onUnlockLab(upgrade.id)}
              >
                <Text style={styles.buyBtnText}>
                  {isUnlocked
                    ? 'RESEARCHED'
                    : `$${upgrade.cost >= 1000 ? `${(upgrade.cost / 1000).toFixed(1)}K` : upgrade.cost}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 30,
    backgroundColor: '#070B14',
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerSub: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardUnlocked: {
    borderColor: '#10B981',
    backgroundColor: '#061D1A',
  },
  cardInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    color: '#22D3EE',
    fontSize: 9,
    fontWeight: '900',
  },
  unlockedBadge: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '900',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  bonusText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  desc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  buyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  btnAfford: {
    backgroundColor: '#10B981',
  },
  btnDisabled: {
    backgroundColor: '#1E293B',
  },
  btnUnlocked: {
    backgroundColor: '#083344',
  },
  buyBtnText: {
    color: '#042F2E',
    fontSize: 12,
    fontWeight: '900',
  },
});
