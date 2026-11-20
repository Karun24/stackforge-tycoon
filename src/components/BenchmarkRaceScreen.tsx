import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BenchmarkRival } from '../types/game';

interface Props {
  rivals: BenchmarkRival[];
  currentRivalIndex: number;
  dynoScore: number;
  raceTries: number;
  isRacing: boolean;
  raceProgress: number;
  onRunBenchmark: () => void;
  productName: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const BenchmarkRaceScreen: React.FC<Props> = ({
  rivals,
  currentRivalIndex,
  dynoScore,
  raceTries,
  isRacing,
  raceProgress,
  onRunBenchmark,
  productName,
}) => {
  const currentRival = rivals[currentRivalIndex] || rivals[0];
  const isWin = dynoScore >= currentRival.score;
  const winChance = isWin
    ? 'SURE WIN (100%)'
    : dynoScore >= currentRival.score * 0.7
    ? 'POSSIBLE (65%)'
    : 'VERY RISKY (20%)';

  return (
    <View style={styles.container}>
      {/* League Header (Screenshot 11) */}
      <View style={styles.leagueCard}>
        <View style={styles.leagueLeft}>
          <View style={styles.stageBadge}>
            <Text style={styles.stageNum}>{currentRival.stage}</Text>
          </View>
          <View>
            <Text style={styles.leagueTitle}>{currentRival.league}</Text>
            <Text style={styles.stageSubtitle}>STAGE {currentRival.stage}</Text>
          </View>
        </View>

        {/* Boss indicator dots */}
        <View style={styles.bossTrack}>
          {rivals.map((r, i) => (
            <View
              key={r.id}
              style={[
                styles.bossDot,
                i < currentRivalIndex && styles.bossDotDone,
                i === currentRivalIndex && styles.bossDotActive,
              ]}
            />
          ))}
          <Text style={styles.bossTag}>
            BOSS IN {Math.max(0, rivals.length - 1 - currentRivalIndex)}
          </Text>
        </View>
      </View>

      {/* Head-to-Head Cards */}
      <View style={styles.matchupRow}>
        {/* YOU */}
        <View style={styles.competitorCard}>
          <Text style={styles.youBadge}>YOU</Text>
          <Text style={styles.scoreText}>⚡ {dynoScore}</Text>
          <Text style={styles.scoreLabel}>THROUGHPUT</Text>
          <Text style={styles.compName} numberOfLines={1}>
            {productName}
          </Text>
        </View>

        {/* VS Center */}
        <View style={styles.vsBox}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        {/* RIVAL */}
        <View style={[styles.competitorCard, styles.rivalCard]}>
          <Text style={styles.rivalBadge}>RIVAL</Text>
          <Text style={styles.rivalScoreText}>⚡ {currentRival.score}</Text>
          <Text style={styles.scoreLabel}>THROUGHPUT</Text>
          <Text style={styles.compName} numberOfLines={1}>
            {currentRival.name}
          </Text>
        </View>
      </View>

      {/* Rival Dialogue Speech Bubble (Screenshot 11) */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechIcon}>{currentRival.avatarIcon}</Text>
        <Text style={styles.speechQuote}>{currentRival.quote}</Text>
      </View>

      {/* Race Progress Simulation Bar */}
      <View style={styles.raceTrackBox}>
        <View style={styles.trackLabels}>
          <Text style={styles.trackYouText}>YOU ({dynoScore} RPS)</Text>
          <Text style={styles.trackRivalText}>
            RIVAL ({currentRival.score} RPS)
          </Text>
        </View>

        <View style={styles.trackLane}>
          {/* Your Car / Server */}
          <View
            style={[
              styles.runnerPill,
              { left: `${Math.min(92, raceProgress * 100 * (isWin ? 1 : 0.65))}%` },
            ]}
          >
            <Text style={styles.runnerIcon}>🚀</Text>
          </View>
          {/* Rival Car / Server */}
          <View
            style={[
              styles.runnerPillRival,
              {
                left: `${Math.min(92, raceProgress * 100 * (isWin ? 0.65 : 1))}%`,
              },
            ]}
          >
            <Text style={styles.runnerIcon}>🐌</Text>
          </View>
        </View>

        {/* Win Chance Bar */}
        <View style={styles.winChanceRow}>
          <Text style={styles.winChanceLabel}>WIN CHANCE:</Text>
          <Text
            style={[
              styles.winChanceValue,
              { color: isWin ? '#10B981' : '#F59E0B' },
            ]}
          >
            {winChance}
          </Text>
        </View>
      </View>

      {/* Rewards Row */}
      <View style={styles.rewardsRow}>
        <Text style={styles.rewardsLabel}>STAGE REWARD:</Text>
        <Text style={styles.rewardItem}>
          💵 ${currentRival.rewardCash.toLocaleString()}
        </Text>
        <Text style={styles.rewardItem}>💎 {currentRival.rewardGems}</Text>
        <Text style={styles.rewardItem}>
          🔑 {currentRival.rewardKey.toUpperCase()} KEY
        </Text>
      </View>

      {/* Challenge Action Buttons (Screenshot 11) */}
      <View style={styles.actionRow}>
        <View style={styles.triesBox}>
          <Text style={styles.triesText}>🎟️ TRIES: {raceTries}/5</Text>
        </View>

        <TouchableOpacity
          disabled={raceTries <= 0 || isRacing}
          onPress={onRunBenchmark}
          style={[
            styles.challengeBtn,
            (raceTries <= 0 || isRacing) && styles.challengeBtnDisabled,
          ]}
        >
          <Text style={styles.challengeBtnText}>
            {isRacing ? 'RUNNING STRESS TEST...' : 'CHALLENGE RIVAL ▶'}
          </Text>
          <Text style={styles.challengeBtnSub}>
            {isWin ? 'SURE WIN' : 'COMPUTE TEST'}
          </Text>
        </TouchableOpacity>
      </View>
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
  leagueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    marginBottom: 10,
  },
  leagueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageBadge: {
    backgroundColor: '#1E293B',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNum: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '900',
  },
  leagueTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  stageSubtitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  bossTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bossDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  bossDotDone: {
    backgroundColor: '#10B981',
  },
  bossDotActive: {
    backgroundColor: '#38BDF8',
  },
  bossTag: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
  },
  matchupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  competitorCard: {
    flex: 1,
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    padding: 10,
    alignItems: 'center',
  },
  rivalCard: {
    borderColor: '#DC2626',
  },
  youBadge: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '900',
  },
  rivalBadge: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '900',
  },
  scoreText: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  rivalScoreText: {
    color: '#EF4444',
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  scoreLabel: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '800',
  },
  compName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  vsBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vsText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '900',
  },
  speechBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    gap: 8,
    marginBottom: 10,
  },
  speechIcon: {
    fontSize: 20,
  },
  speechQuote: {
    color: '#F3F4F6',
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  raceTrackBox: {
    backgroundColor: '#0B1221',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 10,
    marginBottom: 10,
  },
  trackLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  trackYouText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  trackRivalText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  trackLane: {
    height: 36,
    backgroundColor: '#070B14',
    borderRadius: 6,
    position: 'relative',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  runnerPill: {
    position: 'absolute',
    top: 3,
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  runnerPillRival: {
    position: 'absolute',
    bottom: 3,
    backgroundColor: '#991B1B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  runnerIcon: {
    fontSize: 12,
  },
  winChanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  winChanceLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
  },
  winChanceValue: {
    fontSize: 11,
    fontWeight: '900',
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1221',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
  rewardsLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
  },
  rewardItem: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '900',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  triesBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  triesText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  challengeBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  challengeBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  challengeBtnText: {
    color: '#070B14',
    fontSize: 13,
    fontWeight: '900',
  },
  challengeBtnSub: {
    color: '#064E3B',
    fontSize: 9,
    fontWeight: '800',
  },
});
