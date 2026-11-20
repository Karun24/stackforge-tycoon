import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BUILD_MODULES,
  CREW_MEMBERS,
  INFRA_NODES,
  MARKETING_CHANNELS,
} from '../data/gameData';
import { DeckTab, GamePhase, PlayerMode } from '../types/game';

interface Props {
  phase: GamePhase;
  mode: PlayerMode;
  activeTab: DeckTab;
  setActiveTab: (t: DeckTab) => void;
  cash: number;
  installedBuildIds: string[];
  infraLevels: Record<string, number>;
  marketingLevels: Record<string, number>;
  hiredCrewIds: string[];
  droppedReqPerSec: number;
  onInstallBuild: (id: string) => void;
  getInfraCost: (id: string) => number;
  onUpgradeInfra: (id: string) => void;
  getMarketingCost: (id: string) => number;
  onUpgradeMarketing: (id: string) => void;
  onHireCrew: (id: string) => void;
}

export const BottomDeck: React.FC<Props> = ({
  phase,
  mode,
  activeTab,
  setActiveTab,
  cash,
  installedBuildIds,
  infraLevels,
  marketingLevels,
  hiredCrewIds,
  droppedReqPerSec,
  onInstallBuild,
  getInfraCost,
  onUpgradeInfra,
  getMarketingCost,
  onUpgradeMarketing,
  onHireCrew,
}) => {
  const tabs: { id: DeckTab; label: string }[] =
    phase === 'build'
      ? [
          { id: 'build', label: 'BUILD' },
          { id: 'learn', label: 'GUIDE' },
        ]
      : [
          { id: 'infra', label: 'INFRA' },
          { id: 'marketing', label: 'GROWTH' },
          { id: 'crew', label: 'CREW' },
          { id: 'learn', label: 'GUIDE' },
        ];

  return (
    <View style={styles.container}>
      {/* Tab Strip */}
      <View style={styles.tabRow}>
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setActiveTab(t.id)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Deck Content */}
      <ScrollView contentContainerStyle={styles.list}>
        {activeTab === 'build' &&
          BUILD_MODULES.map((mod) => {
            const installed = installedBuildIds.includes(mod.id);
            const canAfford = cash >= mod.cost;
            return (
              <View key={mod.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory}>{mod.category}</Text>
                  <Text style={styles.cardTitle}>{mod.name}</Text>
                  <Text style={styles.cardDesc}>
                    {mode === 'explorer' ? mod.explorerDesc : mod.devDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={installed || !canAfford}
                  style={[
                    styles.actionBtn,
                    installed
                      ? styles.btnDone
                      : !canAfford && styles.btnDisabled,
                  ]}
                  onPress={() => onInstallBuild(mod.id)}
                >
                  <Text style={styles.actionBtnText}>
                    {installed ? 'DONE' : mod.cost === 0 ? 'FREE' : `$${mod.cost}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

        {activeTab === 'infra' &&
          INFRA_NODES.map((node) => {
            const lvl = infraLevels[node.id] || 0;
            const cost = getInfraCost(node.id);
            const canAfford = cash >= cost;
            return (
              <View
                key={node.id}
                style={[
                  styles.card,
                  droppedReqPerSec > 0 && lvl === 0 && styles.cardHighlight,
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory}>
                    LV {lvl} • +{node.capacityPerLevel} REQ/S • -${node.burnPerSec}/S
                  </Text>
                  <Text style={styles.cardTitle}>{node.name}</Text>
                  <Text style={styles.cardDesc}>
                    {mode === 'explorer' ? node.explorerDesc : node.devDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={!canAfford}
                  style={[styles.actionBtn, !canAfford && styles.btnDisabled]}
                  onPress={() => onUpgradeInfra(node.id)}
                >
                  <Text style={styles.actionBtnText}>${cost}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

        {activeTab === 'marketing' &&
          MARKETING_CHANNELS.map((ch) => {
            const lvl = marketingLevels[ch.id] || 0;
            const cost = getMarketingCost(ch.id);
            const canAfford = cash >= cost;
            return (
              <View key={ch.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory}>
                    LV {lvl} • +{ch.reqPerSecBoost} USERS/S
                  </Text>
                  <Text style={styles.cardTitle}>{ch.name}</Text>
                  <Text style={styles.cardDesc}>
                    {mode === 'explorer' ? ch.explorerDesc : ch.devDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={!canAfford}
                  style={[styles.actionBtn, !canAfford && styles.btnDisabled]}
                  onPress={() => onUpgradeMarketing(ch.id)}
                >
                  <Text style={styles.actionBtnText}>${cost}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

        {activeTab === 'crew' &&
          CREW_MEMBERS.map((member) => {
            const hired = hiredCrewIds.includes(member.id);
            const canAfford = cash >= member.cost;
            return (
              <View key={member.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory}>{member.role.toUpperCase()}</Text>
                  <Text style={styles.cardTitle}>{member.name}</Text>
                  <Text style={styles.cardDesc}>{member.bonusText}</Text>
                </View>
                <TouchableOpacity
                  disabled={hired || !canAfford}
                  style={[
                    styles.actionBtn,
                    hired ? styles.btnDone : !canAfford && styles.btnDisabled,
                  ]}
                  onPress={() => onHireCrew(member.id)}
                >
                  <Text style={styles.actionBtnText}>
                    {hired ? 'HIRED' : `$${member.cost}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

        {activeTab === 'learn' && (
          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>How Real Products Scale</Text>
            <Text style={styles.learnText}>
              • <Text style={styles.bold}>Blue Packets</Text>: Images & videos. Add a Global CDN to serve them instantly.
            </Text>
            <Text style={styles.learnText}>
              • <Text style={styles.bold}>Green Packets</Text>: Read requests. Add Redis Cache so your database stays fast.
            </Text>
            <Text style={styles.learnText}>
              • <Text style={styles.bold}>Amber Packets</Text>: Heavy writes & orders. Add Kafka Queue to prevent crashes.
            </Text>
            <Text style={styles.learnText}>
              • <Text style={styles.bold}>Red Packets</Text>: Dropped users! Upgrade Kubernetes Pods or Load Balancers immediately.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tabBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tabBtnActive: {
    backgroundColor: '#22D3EE',
    borderColor: '#22D3EE',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#042F2E',
  },
  list: {
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardHighlight: {
    borderColor: '#F59E0B',
  },
  cardInfo: {
    flex: 1,
  },
  cardCategory: {
    color: '#22D3EE',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 74,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#1E293B',
  },
  btnDone: {
    backgroundColor: '#083344',
  },
  actionBtnText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },
  learnCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  learnTitle: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '900',
  },
  learnText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
  },
  bold: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
});
