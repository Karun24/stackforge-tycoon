import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  cash: number;
  gems: number;
  onClaimGrant: (amount: number) => void;
  onTradeGems: (gemsAmount: number, cashReward: number) => void;
}

export const ShopScreen: React.FC<Props> = ({
  cash,
  gems,
  onClaimGrant,
  onTradeGems,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CLOUD SHOP // FINANCING & BOOSTERS</Text>
        <Text style={styles.headerSub}>SECURE VENTURE CAPITAL & ACCELERATE INFRASTRUCTURE</Text>
      </View>

      {/* Free Cloud Credits Grant */}
      <View style={styles.grantCard}>
        <View style={styles.grantLeft}>
          <Text style={styles.grantIcon}>🎁</Text>
          <View>
            <Text style={styles.grantTitle}>SEED ACCELERATOR GRANT</Text>
            <Text style={styles.grantDesc}>Claim +$5,000 in fake in-game cloud credits</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.grantBtn} onPress={() => onClaimGrant(5000)}>
          <Text style={styles.grantBtnText}>CLAIM $5K</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>GEM LIQUIDITY EXCHANGE</Text>

      {/* Gem Trading Cards */}
      <View style={styles.tradeCard}>
        <View style={styles.tradeInfo}>
          <Text style={styles.tradeTitle}>CONVERT 5 GEMS → $12,500 CASH</Text>
          <Text style={styles.tradeDesc}>Liquidate contract gems into immediate server funding.</Text>
        </View>
        <TouchableOpacity
          disabled={gems < 5}
          style={[styles.tradeBtn, gems < 5 && styles.btnDisabled]}
          onPress={() => onTradeGems(5, 12500)}
        >
          <Text style={styles.tradeBtnText}>TRADE 5 💎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tradeCard}>
        <View style={styles.tradeInfo}>
          <Text style={styles.tradeTitle}>CONVERT 15 GEMS → $45,000 CASH</Text>
          <Text style={styles.tradeDesc}>Large-scale institutional credit liquidation.</Text>
        </View>
        <TouchableOpacity
          disabled={gems < 15}
          style={[styles.tradeBtn, gems < 15 && styles.btnDisabled]}
          onPress={() => onTradeGems(15, 45000)}
        >
          <Text style={styles.tradeBtnText}>TRADE 15 💎</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#070B14',
    paddingBottom: 30,
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
  grantCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  grantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  grantIcon: {
    fontSize: 26,
  },
  grantTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },
  grantDesc: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  grantBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  grantBtnText: {
    color: '#042F2E',
    fontSize: 12,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tradeCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  tradeInfo: {
    flex: 1,
  },
  tradeTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  tradeDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  tradeBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tradeBtnText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '900',
  },
  btnDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.5,
  },
});
