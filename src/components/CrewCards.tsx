import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CREW_MEMBERS } from '../data/gameData';

interface Props {
  hiredCrewIds: string[];
  cash: number;
  onHireCrew: (id: string) => void;
}

export const CrewCards: React.FC<Props> = ({
  hiredCrewIds,
  cash,
  onHireCrew,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CARDS // ENGINEERING CREW</Text>
        <Text style={styles.headerSub}>CREW BOOST YOUR CLUSTER PERFORMANCE & COOLING</Text>
      </View>

      {/* Free pack banner */}
      <View style={styles.packBanner}>
        <View style={styles.packBannerLeft}>
          <Text style={styles.packBannerIcon}>🎴</Text>
          <View>
            <Text style={styles.packBannerTitle}>SPECIALIST RECRUITMENT</Text>
            <Text style={styles.packBannerSub}>HIRE INDUSTRY EXPERTS TO OPTIMIZE YOUR RIG</Text>
          </View>
        </View>
      </View>

      {/* Grid of Crew Cards (Matching Screenshot 1) */}
      <Text style={styles.sectionTitle}>SPECIALISTS ON THE RIG ({hiredCrewIds.length}/{CREW_MEMBERS.length})</Text>

      <View style={styles.grid}>
        {CREW_MEMBERS.map((member) => {
          const isHired = hiredCrewIds.includes(member.id);
          const canAfford = cash >= member.cost;

          return (
            <View
              key={member.id}
              style={[
                styles.card,
                isHired && styles.cardHired,
              ]}
            >
              {/* Specialist Avatar / Icon */}
              <View style={[styles.avatarCircle, { borderColor: member.avatarColor }]}>
                <Text style={styles.avatarIcon}>{member.avatarIcon}</Text>
              </View>

              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role.toUpperCase()}</Text>

              {/* Bonus tag */}
              <View style={styles.bonusTag}>
                <Text style={styles.bonusText}>{member.bonusText}</Text>
              </View>

              {/* Hire Button */}
              <TouchableOpacity
                disabled={isHired || !canAfford}
                style={[
                  styles.hireBtn,
                  isHired
                    ? styles.btnHired
                    : !canAfford
                    ? styles.btnDisabled
                    : styles.btnAfford,
                ]}
                onPress={() => onHireCrew(member.id)}
              >
                <Text style={styles.hireBtnText}>
                  {isHired ? 'ACTIVE ON RIG' : `$${member.cost}`}
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
    marginBottom: 10,
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
  packBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 16,
  },
  packBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packBannerIcon: {
    fontSize: 24,
  },
  packBannerTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },
  packBannerSub: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 14,
    alignItems: 'center',
  },
  cardHired: {
    borderColor: '#22D3EE',
    backgroundColor: '#081726',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    backgroundColor: '#070B14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarIcon: {
    fontSize: 22,
  },
  memberName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
  },
  memberRole: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: 6,
  },
  bonusTag: {
    backgroundColor: '#070B14',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  bonusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '900',
  },
  hireBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAfford: {
    backgroundColor: '#10B981',
  },
  btnDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  btnHired: {
    backgroundColor: '#083344',
  },
  hireBtnText: {
    color: '#042F2E',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
