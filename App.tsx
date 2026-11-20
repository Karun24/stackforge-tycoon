import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArchitectureCanvas } from './src/components/ArchitectureCanvas';
import { BenchmarkRaceScreen } from './src/components/BenchmarkRaceScreen';
import { BottomDeck } from './src/components/BottomDeck';
import { ClientRoadmap } from './src/components/ClientRoadmap';
import { CrewCards } from './src/components/CrewCards';
import { DeployPhaseModal } from './src/components/DeployPhaseModal';
import { DynoTuneScreen } from './src/components/DynoTuneScreen';
import { GlobalRegionMap } from './src/components/GlobalRegionMap';
import { LabScreen } from './src/components/LabScreen';
import { MarketingScreen } from './src/components/MarketingScreen';
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

  // Bottom Navigation tabs (Matching Screenshots 1, 6, 7, 10, 11)
  const navTabs: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'rig', label: 'RIG', icon: '🔲' },
    { id: 'regions', label: 'REGIONS', icon: '🌐' },
    { id: 'dyno', label: 'DYNO', icon: '🎛️' },
    { id: 'race', label: 'RACE', icon: '🏁' },
    { id: 'lab', label: 'LAB', icon: '🧪' },
    { id: 'cards', label: 'CRATES', icon: '🎁' },
    { id: 'marketing', label: 'GROWTH', icon: '📢' },
    { id: 'clients', label: 'CLIENTS', icon: '📶' },
    { id: 'shop', label: 'SHOP', icon: '🛍️' },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        {/* Phase 0: Onboarding */}
        {game.phase === 'onboarding' && (
          <OnboardingModal onStart={game.startGame} />
        )}

        {/* Phase 2: Production Deploy Pipeline */}
        {game.phase === 'deploy' && (
          <DeployPhaseModal
            product={game.product}
            deploySteps={game.deploySteps}
            currentStepIndex={game.deployStepIndex}
            onAdvanceStep={game.advanceDeployStep}
          />
        )}

        {/* Phase 3: Launch Marketing Blitz */}
        {game.phase === 'launch_marketing' && (
          <MarketingScreen
            product={game.product}
            campaigns={game.activeCampaigns}
            cash={game.cash}
            onLaunchCampaign={game.launchCampaign}
            onFinishLaunchMarketing={game.finishLaunchMarketing}
            isInitialLaunchMode={true}
          />
        )}

        {/* Phase 1: Build OR Phase 4: Live Operations */}
        {(game.phase === 'build' || game.phase === 'live') && (
          <View style={styles.container}>
            {/* TOP STATUS BAR (Matching Screenshots 1-13) */}
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
                <Text style={styles.centerTitle} numberOfLines={1}>
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
                  BILLING: <Text style={styles.billingHighlight}>${game.revenuePerReq}/REQ</Text>
                </Text>
                <Text style={styles.billingItem}>
                  BURN: <Text style={styles.burnHighlight}>-${game.burnPerSec}/S</Text>
                </Text>
                <Text style={styles.billingItem}>
                  USERS: <Text style={styles.usersHighlight}>{game.incomingReqPerSec} REQ/S</Text>
                </Text>
                <Text style={styles.billingItem}>
                  KEYS: <Text style={styles.keysHighlight}>🗝️{game.bronzeKeys} 🟣{game.purpleKeys}</Text>
                </Text>
              </View>
            )}

            {/* CHAOS ALERT BANNER */}
            {game.activeChaos && (
              <View style={styles.chaosBanner}>
                <Text style={styles.chaosTitle}>{game.activeChaos.title}</Text>
                <Text style={styles.chaosDesc}>
                  {game.activeChaos.description} ({game.chaosTimer}s left)
                </Text>
              </View>
            )}

            {/* MAIN CONTENT AREA */}
            <View style={styles.contentArea}>
              {game.phase === 'build' ? (
                <>
                  <ArchitectureCanvas
                    phase={game.phase}
                    mode={game.mode}
                    product={game.product}
                    buildProgress={Math.round(
                      (game.installedBuildIds.length / game.buildModules.length) * 100
                    )}
                    installedBuildIds={game.installedBuildIds}
                    terminalLogs={game.terminalLogs}
                    infraLevels={game.infraLevels}
                    temperature={game.currentTempC}
                    isThermalThrottling={game.isThrottling}
                    powerKw={4.8}
                    incomingReqPerSec={0}
                    totalCapacity={game.baseCapacity}
                    activeBottleneck="OPTIMAL"
                    packets={[]}
                    activeSubTab={game.rigSubTab}
                    onSelectSubTab={game.setRigSubTab}
                    onRev={() => {}}
                    floatingCashList={[]}
                    dynoScore={game.dynoScore}
                  />
                  <BottomDeck
                    phase={game.phase}
                    mode={game.mode}
                    rigSubTab={game.rigSubTab}
                    setRigSubTab={game.setRigSubTab}
                    cash={game.cash}
                    buildModules={game.buildModules}
                    installedBuildIds={game.installedBuildIds}
                    infraLevels={game.infraLevels}
                    activeBottleneck={game.currentBottleneck}
                    onInstallBuild={game.installBuildModule}
                    onUpgradeInfra={game.upgradeInfra}
                  />
                </>
              ) : (
                <>
                  {game.activeTab === 'rig' && (
                    <>
                      <ArchitectureCanvas
                        phase={game.phase}
                        mode={game.mode}
                        product={game.product}
                        buildProgress={100}
                        installedBuildIds={game.installedBuildIds}
                        terminalLogs={game.terminalLogs}
                        infraLevels={game.infraLevels}
                        temperature={game.currentTempC}
                        isThermalThrottling={game.isThrottling}
                        powerKw={4.8}
                        incomingReqPerSec={game.incomingReqPerSec}
                        totalCapacity={game.baseCapacity}
                        activeBottleneck={game.currentBottleneck}
                        packets={game.packets}
                        activeSubTab={game.rigSubTab}
                        onSelectSubTab={game.setRigSubTab}
                        onRev={game.revEngine}
                        floatingCashList={game.floatingCashList}
                        dynoScore={game.dynoScore}
                      />
                      <BottomDeck
                        phase={game.phase}
                        mode={game.mode}
                        rigSubTab={game.rigSubTab}
                        setRigSubTab={game.setRigSubTab}
                        cash={game.cash}
                        buildModules={game.buildModules}
                        installedBuildIds={game.installedBuildIds}
                        infraLevels={game.infraLevels}
                        activeBottleneck={game.currentBottleneck}
                        onInstallBuild={game.installBuildModule}
                        onUpgradeInfra={game.upgradeInfra}
                      />
                    </>
                  )}

                  {game.activeTab === 'regions' && (
                    <GlobalRegionMap
                      regions={game.regions}
                      cash={game.cash}
                      onUnlockRegion={game.unlockRegion}
                    />
                  )}

                  {game.activeTab === 'dyno' && (
                    <DynoTuneScreen
                      tuningRatio={game.tuningRatio}
                      onSetTuningRatio={game.setTuningRatio}
                      tuningAccuracy={game.tuningAccuracy}
                      autoTuneActive={game.autoTuneActive}
                      onTriggerAutoTune={game.triggerAutoTune}
                      dynoScore={game.dynoScore}
                      totalCapacity={game.baseCapacity}
                      unlockedLabIds={game.unlockedLabIds}
                    />
                  )}

                  {game.activeTab === 'race' && (
                    <BenchmarkRaceScreen
                      rivals={game.rivals}
                      currentRivalIndex={game.currentRivalIndex}
                      dynoScore={game.dynoScore}
                      raceTries={game.raceTries}
                      isRacing={game.isRacing}
                      raceProgress={game.raceProgress}
                      onRunBenchmark={game.runBenchmark}
                      productName={game.product.name}
                    />
                  )}

                  {game.activeTab === 'lab' && (
                    <LabScreen
                      labBenches={game.labBenches}
                      unlockedLabIds={game.unlockedLabIds}
                      cash={game.cash}
                      gems={game.gems}
                      onStartResearch={game.startResearch}
                      onUnlockBench={game.unlockLabBench}
                    />
                  )}

                  {game.activeTab === 'cards' && (
                    <CrewCards
                      hiredCrewIds={game.hiredCrewIds}
                      cash={game.cash}
                      gems={game.gems}
                      bronzeKeys={game.bronzeKeys}
                      purpleKeys={game.purpleKeys}
                      goldKeys={game.goldKeys}
                      dailyGiftClaimed={game.dailyGiftClaimed}
                      onClaimDailyGift={game.claimDailyGift}
                      onOpenChest={game.openChest}
                    />
                  )}

                  {game.activeTab === 'marketing' && (
                    <MarketingScreen
                      product={game.product}
                      campaigns={game.activeCampaigns}
                      cash={game.cash}
                      onLaunchCampaign={game.launchCampaign}
                    />
                  )}

                  {game.activeTab === 'clients' && (
                    <ClientRoadmap
                      jobs={game.clientJobs}
                      currentJob={
                        game.clientJobs.find((j) => j.id === game.currentJobId) ||
                        game.clientJobs[0]
                      }
                      currentProgress={game.currentJobProgress}
                      gems={game.gems}
                      incomingReqPerSec={game.effectiveReqPerSec}
                      onSelectJob={() => {}}
                      onSpeedUp={() => {}}
                    />
                  )}

                  {game.activeTab === 'shop' && (
                    <ShopScreen
                      cash={game.cash}
                      gems={game.gems}
                      onClaimGrant={(amount: number) => {}}
                      onTradeGems={(gemsAmount: number, cashReward: number) => {}}
                    />
                  )}
                </>
              )}
            </View>

            {/* BOTTOM NAVIGATION TAB BAR (Screenshot 1-13) */}
            {game.phase === 'live' && (
              <View style={styles.bottomNavWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.bottomNavScroll}
                >
                  {navTabs.map((tab) => {
                    const isSelected = game.activeTab === tab.id;
                    return (
                      <TouchableOpacity
                        key={tab.id}
                        onPress={() => game.setActiveTab(tab.id)}
                        style={[
                          styles.navTabButton,
                          isSelected && styles.navTabButtonActive,
                        ]}
                      >
                        <Text style={styles.navTabIcon}>{tab.icon}</Text>
                        <Text
                          style={[
                            styles.navTabLabel,
                            isSelected && styles.navTabLabelActive,
                          ]}
                        >
                          {tab.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#070B14',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  topBarLeft: {
    flexDirection: 'row',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  modeBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
  },
  topBarCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  centerTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centerNetIncome: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 6,
  },
  cashPill: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cashPillText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  gemPill: {
    backgroundColor: '#4C1D95',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gemPillText: {
    color: '#C084FC',
    fontSize: 11,
    fontWeight: '900',
  },
  billingRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0B1221',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  billingItem: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  billingHighlight: {
    color: '#38BDF8',
    fontFamily: 'monospace',
  },
  burnHighlight: {
    color: '#F87171',
    fontFamily: 'monospace',
  },
  usersHighlight: {
    color: '#34D399',
    fontFamily: 'monospace',
  },
  keysHighlight: {
    color: '#FBBF24',
    fontFamily: 'monospace',
  },
  chaosBanner: {
    backgroundColor: '#7F1D1D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EF4444',
  },
  chaosTitle: {
    color: '#FECACA',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  chaosDesc: {
    color: '#FCA5A5',
    fontSize: 9,
  },
  contentArea: {
    flex: 1,
  },
  bottomNavWrapper: {
    backgroundColor: '#070B14',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 4,
  },
  bottomNavScroll: {
    paddingHorizontal: 6,
    gap: 6,
    flexDirection: 'row',
  },
  navTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 62,
  },
  navTabButtonActive: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  navTabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  navTabLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  navTabLabelActive: {
    color: '#38BDF8',
  },
});
