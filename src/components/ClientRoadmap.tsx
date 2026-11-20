import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { ClientJob } from '../types/game';

interface Props {
  jobs: ClientJob[];
  currentJob: ClientJob;
  currentProgress: number;
  gems: number;
  incomingReqPerSec: number;
  onSelectJob: (id: string) => void;
  onSpeedUp: () => void;
}

export const ClientRoadmap: React.FC<Props> = ({
  jobs,
  currentJob,
  currentProgress,
  gems,
  incomingReqPerSec,
  onSelectJob,
  onSpeedUp,
}) => {
  const progressPercent = Math.min(
    100,
    Math.round((currentProgress / currentJob.targetRequests) * 100)
  );

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CLIENT CONTRACTS // ROADMAP</Text>
        <Text style={styles.headerSub}>
          BOARD-01 • {jobs.filter((j) => j.completed).length} / {jobs.length} COMPLETED
        </Text>
      </View>

      {/* Circuit Roadmap Diagram (Matching Screenshot 2) */}
      <View style={styles.roadmapCard}>
        <Svg height="140" width="100%" viewBox="0 0 340 140">
          {/* Circuit Trace Path */}
          <Path
            d="M 40 110 L 110 110 L 170 80 L 230 80 L 290 30"
            stroke="#1E293B"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 40 110 L 110 110"
            stroke="#22D3EE"
            strokeWidth="3"
            fill="none"
          />

          {/* Node 1: YOU */}
          <Rect x="20" y="94" width="32" height="32" rx="8" fill="#083344" stroke="#22D3EE" strokeWidth="1.5" />
          <SvgText x="36" y="113" fill="#22D3EE" fontSize="12" fontWeight="bold" textAnchor="middle">
            🔲
          </SvgText>

          {/* Node 2: Rovewise */}
          <Circle cx="110" cy="110" r="14" fill="#061A1E" stroke="#10B981" strokeWidth="2" />
          <SvgText x="110" y="114" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
            ✓
          </SvgText>
          <SvgText x="110" y="132" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">
            ROVEWISE
          </SvgText>

          {/* Node 3: Chirpwell (Active) */}
          <Circle cx="170" cy="80" r="16" fill="#0B132B" stroke="#22D3EE" strokeWidth="2.5" />
          <Circle cx="170" cy="80" r="6" fill="#22D3EE" />
          <SvgText x="170" y="60" fill="#22D3EE" fontSize="9" fontWeight="bold" textAnchor="middle">
            CHIRPWELL
          </SvgText>

          {/* Node 4: Archiva */}
          <Circle cx="230" cy="80" r="12" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <SvgText x="230" y="84" fill="#64748B" fontSize="9" textAnchor="middle">
            🔒
          </SvgText>
          <SvgText x="230" y="102" fill="#64748B" fontSize="8" textAnchor="middle">
            ARCHIVA
          </SvgText>

          {/* Node 5: CivicGrid */}
          <Circle cx="290" cy="30" r="14" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <SvgText x="290" y="34" fill="#64748B" fontSize="9" textAnchor="middle">
            🔒
          </SvgText>
          <SvgText x="290" y="52" fill="#64748B" fontSize="8" textAnchor="middle">
            CIVICGRID
          </SvgText>
        </Svg>
      </View>

      {/* Active Contract Detail Card (Matching Screenshot 2) */}
      <View style={styles.activeJobCard}>
        <View style={styles.jobTopRow}>
          <View>
            <Text style={styles.jobName}>{currentJob.name}</Text>
            <Text style={styles.jobMeta}>
              CONTRACT {currentJob.stepNumber} / {currentJob.totalSteps} • {currentJob.category}
            </Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{currentJob.completed ? 'COMPLETED' : 'SERVING NOW'}</Text>
          </View>
        </View>

        <Text style={styles.jobDesc}>{currentJob.description}</Text>

        {/* Contract Metrics */}
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>TARGET SIZE</Text>
            <Text style={styles.metricValue}>
              {currentJob.targetRequests >= 1000
                ? `${(currentJob.targetRequests / 1000).toFixed(1)}K REQ`
                : `${currentJob.targetRequests} REQ`}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>CONTRACT REWARD</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>
              ${currentJob.rewardCash >= 1000 ? `${(currentJob.rewardCash / 1000).toFixed(1)}K` : currentJob.rewardCash}{' '}
              <Text style={{ color: '#22D3EE' }}>💎 {currentJob.rewardGems}</Text>
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>THROUGHPUT</Text>
            <Text style={styles.metricValue}>{incomingReqPerSec}/S</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressStats}>
              {currentProgress >= 1000 ? `${(currentProgress / 1000).toFixed(1)}K` : currentProgress} /{' '}
              {currentJob.targetRequests >= 1000
                ? `${(currentJob.targetRequests / 1000).toFixed(1)}K REQ`
                : currentJob.targetRequests}{' '}
              • {incomingReqPerSec}/S
            </Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Speed-Up Action */}
        <TouchableOpacity
          disabled={gems < 1}
          style={[styles.speedUpBtn, gems < 1 && styles.btnDisabled]}
          onPress={onSpeedUp}
        >
          <Text style={styles.speedUpBtnText}>⚡ SPEED UP (+35% REQ) • 1 GEM (HAVE {gems})</Text>
        </TouchableOpacity>
      </View>

      {/* Available Contracts Roster */}
      <Text style={styles.rosterTitle}>ALL CONTRACTS</Text>
      <View style={styles.contractList}>
        {jobs.map((job) => {
          const isSelected = job.id === currentJob.id;
          return (
            <TouchableOpacity
              key={job.id}
              disabled={job.locked}
              style={[
                styles.contractItem,
                isSelected && styles.contractItemActive,
                job.locked && styles.contractItemLocked,
              ]}
              onPress={() => onSelectJob(job.id)}
            >
              <View style={styles.contractLeft}>
                <Text style={styles.contractIcon}>
                  {job.completed ? '✓' : job.locked ? '🔒' : '📶'}
                </Text>
                <View>
                  <Text style={styles.contractName}>{job.name}</Text>
                  <Text style={styles.contractCategory}>{job.category}</Text>
                </View>
              </View>

              <Text style={styles.contractReward}>
                +${job.rewardCash >= 1000 ? `${(job.rewardCash / 1000).toFixed(1)}K` : job.rewardCash}
              </Text>
            </TouchableOpacity>
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
    marginBottom: 8,
  },
  headerTitle: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerSub: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  roadmapCard: {
    backgroundColor: '#0B1221',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 8,
    marginBottom: 12,
  },
  activeJobCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#22D3EE',
    padding: 14,
    marginBottom: 16,
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  jobName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  jobMeta: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#083344',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#22D3EE',
  },
  badgePillText: {
    color: '#22D3EE',
    fontSize: 10,
    fontWeight: '900',
  },
  jobDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#070B14',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressStats: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  progressPercent: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '900',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  speedUpBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  speedUpBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  rosterTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  contractList: {
    gap: 8,
  },
  contractItem: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractItemActive: {
    borderColor: '#22D3EE',
    backgroundColor: '#0B192C',
  },
  contractItemLocked: {
    opacity: 0.5,
  },
  contractLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contractIcon: {
    fontSize: 16,
    color: '#22D3EE',
  },
  contractName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  contractCategory: {
    color: '#94A3B8',
    fontSize: 10,
  },
  contractReward: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
  },
});
