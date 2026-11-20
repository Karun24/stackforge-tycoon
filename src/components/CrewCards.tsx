import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CREW_MEMBERS } from '../data/gameData';
import { CrewMember } from '../types/game';

interface Props {
  hiredCrewIds: string[];
  cash: number;
  gems: number;
  bronzeKeys: number;
  purpleKeys: number;
  goldKeys: number;
  dailyGiftClaimed: boolean;
  onClaimDailyGift: () => void;
  onOpenChest: (type: 'basic' | 'premium') => void;
}

export const CrewCards: React.FC<Props> = ({
  hiredCrewIds,
  cash,
  gems,
  bronzeKeys,
  purpleKeys,
  goldKeys,
  dailyGiftClaimed,
  onClaimDailyGift,
  onOpenChest,
}) => {
  const [subTab, setSubTab] = useState<'chests' | 'cards'>('chests');

  return (
    <View style={styles.container}>
      {/* Subtab Switcher (Screenshot 6: CHESTS | CARDS) */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          onPress={() => setSubTab('chests')}
          style={[styles.subTabBtn, subTab === 'chests' && styles.subTabBtnActive]}
        >
          <Text
            style={[
              styles.subTabText,
              subTab === 'chests' && styles.subTabTextActive,
            ]}
          >
            🎁 CRATES & KEYS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubTab('cards')}
          style={[styles.subTabBtn, subTab === 'cards' && styles.subTabBtnActive]}
        >
          <Text
            style={[
              styles.subTabText,
              subTab === 'cards' && styles.subTabTextActive,
            ]}
          >
            🎴 CREW CARDS ({hiredCrewIds.length}/{CREW_MEMBERS.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Keys Counter Ribbon (Screenshot 6) */}
      <View style={styles.keysRibbon}>
        <View style={styles.keyItem}>
          <Text style={styles.keyIcon}>🗝️</Text>
          <Text style={styles.keyText}>BRONZE: {bronzeKeys}</Text>
        </View>
        <View style={styles.keyItem}>
          <Text style={styles.keyIcon}>🟣</Text>
          <Text style={styles.keyText}>PURPLE: {purpleKeys}</Text>
        </View>
        <View style={styles.keyItem}>
          <Text style={styles.keyIcon}>👑</Text>
          <Text style={styles.keyText}>GOLD: {goldKeys}</Text>
        </View>
      </View>

      {subTab === 'chests' ? (
        <ScrollView
          contentContainerStyle={styles.chestsContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Rewards Row (Daily Gift & Free Chest) */}
          <View style={styles.quickRewardsRow}>
            {/* Daily Gift */}
            <View style={styles.giftCard}>
              <Text style={styles.giftIcon}>🎁</Text>
              <Text style={styles.giftTitle}>DAILY GIFT</Text>
              <Text style={styles.giftReward}>+15 💎  +2 🗝️</Text>
              <TouchableOpacity
                disabled={dailyGiftClaimed}
                onPress={onClaimDailyGift}
                style={[
                  styles.claimBtn,
                  dailyGiftClaimed && styles.claimBtnDisabled,
                ]}
              >
                <Text style={styles.claimBtnText}>
                  {dailyGiftClaimed ? 'CLAIMED' : 'CLAIM'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Free Crate */}
            <View style={styles.giftCard}>
              <Text style={styles.giftIcon}>📦</Text>
              <Text style={styles.giftTitle}>FREE CRATE</Text>
              <Text style={styles.giftReward}>BASIC CREW</Text>
              <TouchableOpacity
                onPress={() => onOpenChest('basic')}
                style={styles.claimBtn}
              >
                <Text style={styles.claimBtnText}>OPEN 🗝️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tiered Crates (Screenshot 6) */}
          {/* 1. BASIC CHEST */}
          <View style={styles.chestTierCard}>
            <View style={styles.chestTierHeader}>
              <View>
                <Text style={styles.chestTierTitle}>BASIC RECRUIT CRATE</Text>
                <Text style={styles.chestTierSub}>
                  Guaranteed RARE specialist in 10 openings
                </Text>
              </View>
              <Text style={styles.chestTierIcon}>🧰</Text>
            </View>
            <View style={styles.tierPips}>
              <Text style={styles.pipText}>
                COST: 1 BRONZE KEY OR $2,500 CASH
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onOpenChest('basic')}
              style={styles.openCrateBtn}
            >
              <Text style={styles.openCrateBtnText}>
                OPEN BASIC CRATE (🗝️ x1 or $2.5K)
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. PREMIUM CHEST */}
          <View style={[styles.chestTierCard, styles.chestTierPremium]}>
            <View style={styles.chestTierHeader}>
              <View>
                <Text style={styles.premiumTitle}>PREMIUM EXECUTIVE VAULT</Text>
                <Text style={styles.chestTierSub}>
                  Guaranteed EPIC in 10 • LEGENDARY in 40
                </Text>
              </View>
              <Text style={styles.chestTierIcon}>🗄️</Text>
            </View>
            <View style={styles.tierPips}>
              <Text style={styles.pipText}>
                COST: 1 PURPLE KEY OR 20 GEMS
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onOpenChest('premium')}
              style={[styles.openCrateBtn, styles.openPremiumBtn]}
            >
              <Text style={styles.openCrateBtnText}>
                OPEN PREMIUM VAULT (🟣 x1 or 20 💎)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* CREW CARDS LIST (Screenshot 1 & Specialist Cards) */
        <ScrollView
          contentContainerStyle={styles.crewList}
          showsVerticalScrollIndicator={false}
        >
          {CREW_MEMBERS.map((member) => {
            const isHired = hiredCrewIds.includes(member.id);

            return (
              <View
                key={member.id}
                style={[
                  styles.crewCard,
                  isHired && styles.crewCardHired,
                ]}
              >
                <View
                  style={[
                    styles.avatarBox,
                    { backgroundColor: member.avatarColor },
                  ]}
                >
                  <Text style={styles.avatarIcon}>{member.avatarIcon}</Text>
                </View>

                <View style={styles.crewInfo}>
                  <View style={styles.crewHeaderRow}>
                    <Text style={styles.crewName}>{member.name}</Text>
                    <Text style={styles.starsText}>
                      {'★'.repeat(member.stars)}
                    </Text>
                  </View>
                  <Text style={styles.crewRole}>{member.role}</Text>
                  <Text style={styles.crewBonus}>{member.bonusText}</Text>
                </View>

                <View style={styles.crewAction}>
                  {isHired ? (
                    <View style={styles.hiredBadge}>
                      <Text style={styles.hiredBadgeText}>ASSIGNED</Text>
                    </View>
                  ) : (
                    <View style={styles.lockedCrewBadge}>
                      <Text style={styles.lockedCrewText}>IN CHESTS</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
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
  subTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  subTabBtn: {
    flex: 1,
    backgroundColor: '#0B1221',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingVertical: 8,
    alignItems: 'center',
  },
  subTabBtnActive: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
  },
  subTabText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
  },
  subTabTextActive: {
    color: '#38BDF8',
  },
  keysRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0B1221',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  keyIcon: {
    fontSize: 13,
  },
  keyText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  chestsContainer: {
    paddingBottom: 40,
    gap: 10,
  },
  quickRewardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  giftCard: {
    flex: 1,
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    alignItems: 'center',
  },
  giftIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  giftTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  giftReward: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
    marginVertical: 4,
  },
  claimBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  claimBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  claimBtnText: {
    color: '#070B14',
    fontSize: 11,
    fontWeight: '900',
  },
  chestTierCard: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    padding: 12,
  },
  chestTierPremium: {
    borderColor: '#A855F7',
    backgroundColor: '#130E26',
  },
  chestTierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chestTierTitle: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '900',
  },
  premiumTitle: {
    color: '#C084FC',
    fontSize: 13,
    fontWeight: '900',
  },
  chestTierSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  chestTierIcon: {
    fontSize: 28,
  },
  tierPips: {
    marginVertical: 8,
  },
  pipText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
  },
  openCrateBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  openPremiumBtn: {
    backgroundColor: '#9333EA',
  },
  openCrateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  crewList: {
    paddingBottom: 40,
    gap: 8,
  },
  crewCard: {
    flexDirection: 'row',
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    alignItems: 'center',
  },
  crewCardHired: {
    borderColor: '#0284C7',
    backgroundColor: '#091A30',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarIcon: {
    fontSize: 20,
  },
  crewInfo: {
    flex: 1,
  },
  crewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crewName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  starsText: {
    color: '#F59E0B',
    fontSize: 10,
  },
  crewRole: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  crewBonus: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  crewAction: {
    marginLeft: 8,
  },
  hiredBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hiredBadgeText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  lockedCrewBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lockedCrewText: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '800',
  },
});
