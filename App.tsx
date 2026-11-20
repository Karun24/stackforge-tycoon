import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArchitectureCanvas } from './src/components/ArchitectureCanvas';
import { BottomDeck } from './src/components/BottomDeck';
import { ClientRoadmap } from './src/components/ClientRoadmap';
import { CrewCards } from './src/components/CrewCards';
import { LabScreen } from './src/components/LabScreen';
import { OnboardingModal } from './src/components/OnboardingModal';
import { ShopScreen } from './src/components/ShopScreen';
import { useGameEngine } from './src/engine/useGameEngine';
import { NavigationTab } from './src/types/game';

export default function App() {
  const game = useGameEngine();

  const formattedCash =
    game.cash >= 1000000
      ? `${(game.cash / 1000000).toFixed(2)}M`
      : game.cash >= 1000
      ? `${(game.cash / 1000).toFixed(1)}K`
      : game.cash.toFixed(0);

  // Bottom Navigation tabs (Matching Screenshots 1, 2, 3, 4, 5)
  const navTabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'shop', label: 'SHOP', icon: '🛍️' },
    { id: 'clients', label: 'CLIENTS', icon: '📶' },
    { id: 'rig', label: 'RIG', icon: '🔲' },
    { id: 'lab', label: 'LAB', icon: '🧪' },
    { id: 'cards', label: 'CARDS', icon: '🎴' },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        {game.phase === 'onboarding' ? (
          <OnboardingModal onStart={game.startGame} />
        ) : (
          <View style={styles.container}>
            {/* TOP STATUS BAR (Matching Screenshots 1-5) */}
            <View style={styles.topBar}>
              <View style={styles.topBarLeft}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>👤 LV {game.playerLevel}</Text>
                </View>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeText}>
                    ★ {game.rating.toFixed(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.topBarCenter}>
                <Text style={styles.centerTitle}>
                  {game.phase === 'build'
                    ? 'DEV WORKSPACE'
                    : `RIG-01 // ${game.product.name.toUpperCase()}`}
                </Text>
                <Text style={styles.centerNetIncome}>
                  {game.netIncomePerSec >= 0 ? '+' : ''}${game.netIncomePerSec}/S
                </Text>
              </View>

              <View style={styles.topBarRight}>
                <View style={styles.cashPill}>
                  <Text style={styles.cashPillText}>💵 ${formattedCash}</Text>
                </View>
                <View style={styles.gemPill}>
                  <Text style={styles.gemPillText}>💎 {game.gems}</Text>
                </View>
              </View>
            </View>

            {/* BILLING & RATE RIBBON (Matching Screenshots 3, 4, 5) */}
            {game.phase === 'live' && (
              <View style={styles.billingRibbon}>
                <Text style={styles.billingItem}>
                  BILLING: <Text style={styles.billingHighlight}>${game.product.revenuePerReq}/REQ</Text>
                </Text>
                <Text style={styles.billingItem}>
                  BURN: <Text style={styles.burnHighlight}>-${game.burnPerSec}/S</Text>
                </Text>
                <Text style={styles.billingItem}>
                  USERS: <Text style={styles.usersHighlight}>{game.incomingReqPerSec} REQ/S</Text>
                </Text>
              </View>
            )}

            {/* CHAOS ALERT BANNER */}
            {game.activeChaos && (
              <View style={styles.chaosBanner}>
                <Text style={styles.chaosTitle}>
                  ⚡ {game.activeChaos.title} ({game.chaosTimer}s)
                </Text>
                <Text style={styles.chaosDesc}>{game.activeChaos.description}</Text>
              </View>
            )}

            {/* MAIN CONTENT AREA */}
            <View style={styles.mainContent}>
              {game.phase === 'build' ? (
                <View style={styles.buildLayout}>
                  <ArchitectureCanvas
                    phase={game.phase}
                    mode={game.mode}
                    product={game.product}
                    buildProgress={game.buildProgress}
                    canPublish={game.canPublish}
                    installedBuildIds={game.installedBuildIds}
                    terminalLogs={game.terminalLogs}
                    infraLevels={game.infraLevels}
                    temperature={game.temperature}
                    isThermalThrottling={game.isThermalThrottling}
                    powerKw={game.powerKw}
                    incomingReqPerSec={game.incomingReqPerSec}
                    totalCapacity={game.totalCapacity}
                    droppedReqPerSec={game.droppedReqPerSec}
                    loadPercent={game.loadPercent}
                    activeBottleneck={game.activeBottleneck}
                    packets={game.packets}
                    onPublish={game.publishProduct}
                  />

                  <BottomDeck
                    phase={game.phase}
                    mode={game.mode}
                    rigSubTab={game.rigSubTab}
                    setRigSubTab={game.setRigSubTab}
                    cash={game.cash}
                    installedBuildIds={game.installedBuildIds}
                    infraLevels={game.infraLevels}
                    activeBottleneck={game.activeBottleneck}
                    onInstallBuild={game.installBuildModule}
                    getInfraCost={game.getInfraCost}
                    onUpgradeInfra={game.upgradeInfra}
                  />
                </View>
              ) : (
                <>
                  {/* PHASE 2 SCREEN ROUTING */}
                  {game.activeTab === 'rig' && (
                    <View style={styles.rigLayout}>
                      <ArchitectureCanvas
                        phase={game.phase}
                        mode={game.mode}
                        product={game.product}
                        buildProgress={game.buildProgress}
                        canPublish={game.canPublish}
                        installedBuildIds={game.installedBuildIds}
                        terminalLogs={game.terminalLogs}
                        infraLevels={game.infraLevels}
                        temperature={game.temperature}
                        isThermalThrottling={game.isThermalThrottling}
                        powerKw={game.powerKw}
                        incomingReqPerSec={game.incomingReqPerSec}
                        totalCapacity={game.totalCapacity}
                        droppedReqPerSec={game.droppedReqPerSec}
                        loadPercent={game.loadPercent}
                        activeBottleneck={game.activeBottleneck}
                        packets={game.packets}
                        onPublish={game.publishProduct}
                      />

                      <BottomDeck
                        phase={game.phase}
                        mode={game.mode}
                        rigSubTab={game.rigSubTab}
                        setRigSubTab={game.setRigSubTab}
                        cash={game.cash}
                        installedBuildIds={game.installedBuildIds}
                        infraLevels={game.infraLevels}
                        activeBottleneck={game.activeBottleneck}
                        onInstallBuild={game.installBuildModule}
                        getInfraCost={game.getInfraCost}
                        onUpgradeInfra={game.upgradeInfra}
                      />
                    </View>
                  )}

                  {game.activeTab === 'clients' && (
                    <ClientRoadmap
                      jobs={game.clientJobs}
                      currentJob={game.currentJob}
                      currentProgress={game.currentJobProgress}
                      gems={game.gems}
                      incomingReqPerSec={game.incomingReqPerSec}
                      onSelectJob={game.selectClientJob}
                      onSpeedUp={game.speedUpJob}
                    />
                  )}

                  {game.activeTab === 'cards' && (
                    <CrewCards
                      hiredCrewIds={game.hiredCrewIds}
                      cash={game.cash}
                      onHireCrew={game.hireCrew}
                    />
                  )}

                  {game.activeTab === 'lab' && (
                    <LabScreen
                      mode={game.mode}
                      unlockedLabIds={game.unlockedLabIds}
                      cash={game.cash}
                      onUnlockLab={game.unlockLab}
                    />
                  )}

                  {game.activeTab === 'shop' && (
                    <ShopScreen
                      cash={game.cash}
                      gems={game.gems}
                      onClaimGrant={(amt) => game.startGame(game.mode, game.product.id, 'golang', 'postgres')} // re-grant
                      onTradeGems={(gAmt, cReward) => {}}
                    />
                  )}
                </>
              )}
            </View>

            {/* BOTTOM 5-TAB BAR (Matching Screenshots 1-5) */}
            {game.phase === 'live' && (
              <View style={styles.bottomNav}>
                {navTabs.map((t) => {
                  const active = game.activeTab === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.navBtn, active && styles.navBtnActive]}
                      onPress={() => game.setActiveTab(t.id)}
                    >
                      <Text style={styles.navIcon}>{t.icon}</Text>
                      <Text style={[styles.navText, active && styles.navTextActive]}>
                        {t.label}
                      </Text>
                      {active && <View style={styles.navActiveIndicator} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  container: {
    flex: 1,
    backgroundColor: '#070B14',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#070B14',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '900',
  },
  modeBadge: {
    backgroundColor: '#083344',
    borderWidth: 1,
    borderColor: '#22D3EE',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modeText: {
    color: '#22D3EE',
    fontSize: 10,
    fontWeight: '900',
  },
  topBarCenter: {
    alignItems: 'center',
  },
  centerTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  centerNetIncome: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cashPill: {
    backgroundColor: '#062822',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cashPillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '900',
  },
  gemPill: {
    backgroundColor: '#082F49',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gemPillText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
  },
  billingRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0B132B',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  billingItem: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
  },
  billingHighlight: {
    color: '#F8FAFC',
  },
  burnHighlight: {
    color: '#F43F5E',
  },
  usersHighlight: {
    color: '#22D3EE',
  },
  chaosBanner: {
    backgroundColor: '#450A0A',
    borderWidth: 1,
    borderColor: '#F43F5E',
    marginHorizontal: 12,
    marginTop: 6,
    padding: 8,
    borderRadius: 8,
  },
  chaosTitle: {
    color: '#FDA4AF',
    fontSize: 11,
    fontWeight: '900',
  },
  chaosDesc: {
    color: '#FECDD3',
    fontSize: 10,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
  },
  buildLayout: {
    flex: 1,
  },
  rigLayout: {
    flex: 1,
  },

  // Bottom 5-Tab Bar
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#070B14',
    borderTopWidth: 1.5,
    borderTopColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  navBtnActive: {
    opacity: 1,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navTextActive: {
    color: '#22D3EE',
    fontWeight: '900',
  },
  navActiveIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 3,
    backgroundColor: '#22D3EE',
    borderRadius: 1.5,
  },
});
