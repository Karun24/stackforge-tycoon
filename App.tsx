import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArchitectureCanvas } from './src/components/ArchitectureCanvas';
import { BottomDeck } from './src/components/BottomDeck';
import { OnboardingModal } from './src/components/OnboardingModal';
import { useGameEngine } from './src/engine/useGameEngine';
import { DeckTab } from './src/types/game';

export default function App() {
  const game = useGameEngine();
  const [activeTab, setActiveTab] = useState<DeckTab>('build');

  useEffect(() => {
    if (game.phase === 'live') {
      setActiveTab('infra');
    }
  }, [game.phase]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        {game.phase === 'onboarding' ? (
          <OnboardingModal onStart={game.startGame} />
        ) : (
          <View style={styles.container}>
            {/* Top HUD */}
            <View style={styles.hud}>
              <View>
                <Text style={styles.hudLabel}>
                  {game.mode.toUpperCase()} MODE • ★ {game.rating.toFixed(1)}
                </Text>
                <Text style={styles.cashText}>${game.cash.toLocaleString()}</Text>
              </View>
              <View style={styles.hudRight}>
                <Text style={styles.netText}>
                  {game.netIncomePerSec >= 0 ? '+' : ''}${game.netIncomePerSec}/s
                </Text>
                <Text style={styles.burnText}>
                  CLOUD BURN: -${game.burnPerSec}/s
                </Text>
              </View>
            </View>

            {/* Chaos Alert Banner */}
            {game.activeChaos && (
              <View style={styles.chaosBanner}>
                <Text style={styles.chaosTitle}>
                  ⚡ {game.activeChaos.title} ({game.chaosTimer}s)
                </Text>
                <Text style={styles.chaosDesc}>{game.activeChaos.description}</Text>
              </View>
            )}

            {/* Animated Visual Canvas */}
            <ArchitectureCanvas
              phase={game.phase}
              product={game.product}
              buildProgress={game.buildProgress}
              canPublish={game.canPublish}
              installedBuildIds={game.installedBuildIds}
              infraLevels={game.infraLevels}
              incomingReqPerSec={game.incomingReqPerSec}
              totalCapacity={game.totalCapacity}
              droppedReqPerSec={game.droppedReqPerSec}
              loadPercent={game.loadPercent}
              packets={game.packets}
              onPublish={game.publishProduct}
            />

            {/* Bottom Control Deck */}
            <BottomDeck
              phase={game.phase}
              mode={game.mode}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              cash={game.cash}
              installedBuildIds={game.installedBuildIds}
              infraLevels={game.infraLevels}
              marketingLevels={game.marketingLevels}
              hiredCrewIds={game.hiredCrewIds}
              droppedReqPerSec={game.droppedReqPerSec}
              onInstallBuild={game.installBuildModule}
              getInfraCost={game.getInfraCost}
              onUpgradeInfra={game.upgradeInfra}
              getMarketingCost={game.getMarketingCost}
              onUpgradeMarketing={game.upgradeMarketing}
              onHireCrew={game.hireCrew}
            />
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
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  hudLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cashText: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: '900',
  },
  hudRight: {
    alignItems: 'flex-end',
  },
  netText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  burnText: {
    color: '#F43F5E',
    fontSize: 11,
    fontWeight: '700',
  },
  chaosBanner: {
    backgroundColor: '#450A0A',
    borderWidth: 1,
    borderColor: '#F43F5E',
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
  },
  chaosTitle: {
    color: '#FDA4AF',
    fontSize: 12,
    fontWeight: '900',
  },
  chaosDesc: {
    color: '#FECDD3',
    fontSize: 11,
    marginTop: 2,
  },
});
