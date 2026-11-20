import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { GamePhase, Packet, ProductTemplate } from '../types/game';

interface Props {
  phase: GamePhase;
  product: ProductTemplate;
  buildProgress: number;
  canPublish: boolean;
  installedBuildIds: string[];
  infraLevels: Record<string, number>;
  incomingReqPerSec: number;
  totalCapacity: number;
  droppedReqPerSec: number;
  loadPercent: number;
  packets: Packet[];
  onPublish: () => void;
}

const PACKET_COLORS: Record<Packet['type'], string> = {
  static: '#38BDF8', // Blue: Static/CDN
  read: '#34D399',   // Green: Reads/Cache
  write: '#FBBF24',  // Amber: Writes/Queue
  dropped: '#F43F5E', // Red: Dropped!
};

export const ArchitectureCanvas: React.FC<Props> = ({
  phase,
  product,
  buildProgress,
  canPublish,
  installedBuildIds,
  infraLevels,
  incomingReqPerSec,
  totalCapacity,
  droppedReqPerSec,
  loadPercent,
  packets,
  onPublish,
}) => {
  if (phase === 'build') {
    const hasDocker = installedBuildIds.includes('docker');
    return (
      <View style={styles.canvasCard}>
        <View style={styles.canvasHeader}>
          <Text style={styles.canvasTitle}>PHASE 1: LOCAL DEV WORKSPACE</Text>
          <Text style={styles.progressBadge}>{buildProgress}% READY</Text>
        </View>

        <Svg height="210" width="100%" viewBox="0 0 340 210">
          {/* Laptop / IDE Frame */}
          <Rect
            x="20"
            y="16"
            width="300"
            height="155"
            rx="12"
            fill="#0B1221"
            stroke={hasDocker ? '#22D3EE' : '#334155'}
            strokeWidth={hasDocker ? '2.5' : '1.5'}
          />
          <SvgText x="36" y="38" fill="#64748B" fontSize="10" fontWeight="bold">
            VS CODE // {product.name.toUpperCase()}
          </SvgText>

          {/* Animated Code Blocks */}
          {[0, 1, 2, 3, 4].map((idx) => {
            const active = installedBuildIds.length > idx;
            return (
              <Rect
                key={idx}
                x="36"
                y={52 + idx * 20}
                width={active ? 140 + (idx % 2) * 50 : 90}
                height="10"
                rx="4"
                fill={active ? product.color : '#1E293B'}
                opacity={active ? 0.9 : 0.5}
              />
            );
          })}

          {/* Docker Container Badge */}
          <Rect
            x="215"
            y="55"
            width="88"
            height="72"
            rx="10"
            fill={hasDocker ? '#083344' : '#0F172A'}
            stroke={hasDocker ? '#22D3EE' : '#1E293B'}
            strokeDasharray={hasDocker ? '' : '4 4'}
          />
          <SvgText
            x="259"
            y="88"
            fill={hasDocker ? '#22D3EE' : '#475569'}
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            {hasDocker ? '🐳 DOCKER' : 'NO DOCKER'}
          </SvgText>
          <SvgText
            x="259"
            y="106"
            fill="#94A3B8"
            fontSize="9"
            textAnchor="middle"
          >
            {hasDocker ? 'PACKAGED' : 'PENDING'}
          </SvgText>

          {/* Progress Bar */}
          <Rect x="20" y="185" width="300" height="10" rx="5" fill="#1E293B" />
          <Rect
            x="20"
            y="185"
            width={Math.max(10, (buildProgress / 100) * 300)}
            height="10"
            rx="5"
            fill="#10B981"
          />
        </Svg>

        {canPublish && (
          <TouchableOpacity style={styles.publishBtn} onPress={onPublish}>
            <Text style={styles.publishBtnText}>🚀 PUBLISH TO PUBLIC CLOUD</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // LIVE SYSTEM DESIGN ARCHITECTURE VIEW
  const hasLB = (infraLevels['nginx_lb'] || 0) > 0;
  const hasRedis = (infraLevels['redis_cache'] || 0) > 0;
  const hasKafka = (infraLevels['kafka_queue'] || 0) > 0;
  const podCount = infraLevels['k8s_pods'] || 1;
  const isOverloaded = droppedReqPerSec > 0;

  return (
    <View style={[styles.canvasCard, isOverloaded && styles.canvasOverload]}>
      <View style={styles.canvasHeader}>
        <Text style={styles.canvasTitle}>
          LIVE ARCHITECTURE // {product.name.toUpperCase()}
        </Text>
        <Text
          style={[
            styles.loadBadge,
            { color: isOverloaded ? '#F43F5E' : '#10B981' },
          ]}
        >
          {isOverloaded ? `⚠ DROPPING ${droppedReqPerSec}/S` : `LOAD ${loadPercent}%`}
        </Text>
      </View>

      <Svg height="215" width="100%" viewBox="0 0 340 215">
        {/* Connection Lines */}
        <Line x1="170" y1="185" x2="170" y2="140" stroke="#1E293B" strokeWidth="3" />
        <Line x1="170" y1="110" x2="85" y2="75" stroke="#1E293B" strokeWidth="2.5" />
        <Line x1="170" y1="110" x2="170" y2="75" stroke="#1E293B" strokeWidth="2.5" />
        <Line x1="170" y1="110" x2="255" y2="75" stroke="#1E293B" strokeWidth="2.5" />

        {/* Animated Traffic Packets */}
        {packets.map((p) => {
          const startY = 185;
          const endY = 48;
          const y = startY - p.progress * (startY - endY);
          const targetX = p.lane === 0 ? 85 : p.lane === 1 ? 170 : 255;
          const x = p.progress < 0.4 ? 170 : 170 + ((p.progress - 0.4) / 0.6) * (targetX - 170);
          return (
            <Circle
              key={p.id}
              cx={x}
              cy={y}
              r={p.type === 'dropped' ? 4.5 : 3.5}
              fill={PACKET_COLORS[p.type]}
            />
          );
        })}

        {/* Top Row: Data Layer (Redis / Primary DB / Kafka) */}
        <Rect
          x="35"
          y="20"
          width="95"
          height="46"
          rx="8"
          fill="#0B1221"
          stroke={hasRedis ? '#34D399' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="82" y="40" fill={hasRedis ? '#34D399' : '#475569'} fontSize="9" fontWeight="bold" textAnchor="middle">
          REDIS CACHE
        </SvgText>
        <SvgText x="82" y="54" fill="#94A3B8" fontSize="9" textAnchor="middle">
          {hasRedis ? `LV ${infraLevels['redis_cache']}` : 'LOCKED'}
        </SvgText>

        <Rect
          x="138"
          y="20"
          width="64"
          height="46"
          rx="8"
          fill="#0B1221"
          stroke={isOverloaded ? '#F43F5E' : '#38BDF8'}
          strokeWidth="1.5"
        />
        <SvgText x="170" y="40" fill="#F8FAFC" fontSize="9" fontWeight="bold" textAnchor="middle">
          SQL DB
        </SvgText>
        <SvgText x="170" y="54" fill="#38BDF8" fontSize="9" textAnchor="middle">
          PRIMARY
        </SvgText>

        <Rect
          x="210"
          y="20"
          width="95"
          height="46"
          rx="8"
          fill="#0B1221"
          stroke={hasKafka ? '#FBBF24' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="257" y="40" fill={hasKafka ? '#FBBF24' : '#475569'} fontSize="9" fontWeight="bold" textAnchor="middle">
          KAFKA QUEUE
        </SvgText>
        <SvgText x="257" y="54" fill="#94A3B8" fontSize="9" textAnchor="middle">
          {hasKafka ? `LV ${infraLevels['kafka_queue']}` : 'LOCKED'}
        </SvgText>

        {/* Middle Row: Compute / K8s Pods + Load Balancer */}
        <Rect
          x="70"
          y="96"
          width="200"
          height="46"
          rx="10"
          fill="#0F172A"
          stroke={isOverloaded ? '#F43F5E' : '#22D3EE'}
          strokeWidth="2"
        />
        <SvgText x="170" y="116" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">
          {hasLB ? 'NGINX LB → ' : ''}K8S CLUSTER ({podCount} PODS)
        </SvgText>
        <SvgText x="170" y="132" fill="#94A3B8" fontSize="9" textAnchor="middle">
          CAPACITY: {totalCapacity} REQ/S
        </SvgText>

        {/* Bottom Row: Incoming Users */}
        <Rect
          x="95"
          y="168"
          width="150"
          height="34"
          rx="8"
          fill="#0B1221"
          stroke="#334155"
        />
        <SvgText x="170" y="189" fill="#22D3EE" fontSize="11" fontWeight="bold" textAnchor="middle">
          USERS: {incomingReqPerSec} REQ/S
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  canvasCard: {
    backgroundColor: '#0B1221',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 12,
    marginHorizontal: 14,
    marginBottom: 10,
  },
  canvasOverload: {
    borderColor: '#F43F5E',
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  canvasTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressBadge: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '800',
  },
  loadBadge: {
    fontSize: 11,
    fontWeight: '900',
  },
  publishBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  publishBtnText: {
    color: '#042F2E',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
