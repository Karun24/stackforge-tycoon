import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { GamePhase, Packet, PlayerMode, ProductTemplate } from '../types/game';

interface Props {
  phase: GamePhase;
  mode: PlayerMode;
  product: ProductTemplate;
  buildProgress: number;
  canPublish: boolean;
  installedBuildIds: string[];
  terminalLogs: string[];
  infraLevels: Record<string, number>;
  temperature: number;
  isThermalThrottling: boolean;
  powerKw: number;
  incomingReqPerSec: number;
  totalCapacity: number;
  droppedReqPerSec: number;
  loadPercent: number;
  activeBottleneck: string;
  packets: Packet[];
  onPublish: () => void;
}

const PACKET_COLORS: Record<Packet['type'], string> = {
  static: '#38BDF8', // Neon Cyan: Static/CDN
  read: '#34D399',   // Emerald Green: Cache/Reads
  write: '#FBBF24',  // Amber Yellow: Queue/Writes
  dropped: '#F43F5E', // Rose Red: Dropped Packet
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const ArchitectureCanvas: React.FC<Props> = ({
  phase,
  mode,
  product,
  buildProgress,
  canPublish,
  installedBuildIds,
  terminalLogs,
  infraLevels,
  temperature,
  isThermalThrottling,
  powerKw,
  incomingReqPerSec,
  totalCapacity,
  droppedReqPerSec,
  loadPercent,
  activeBottleneck,
  packets,
  onPublish,
}) => {
  // Fan rotation animation
  const fanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(fanAnim, {
        toValue: 1,
        duration: isThermalThrottling ? 500 : 1200,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isThermalThrottling]);

  const fanSpin = fanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // --- PHASE 1: FULL SCREEN LOCAL DEV WORKSPACE ---
  if (phase === 'build') {
    const hasDocker = installedBuildIds.includes('docker');
    const hasDb = installedBuildIds.includes('primary_db');
    const hasTests = installedBuildIds.includes('test_suite');

    return (
      <View style={styles.buildContainer}>
        {/* IDE Top Bar */}
        <View style={styles.ideHeader}>
          <View style={styles.ideHeaderLeft}>
            <View style={[styles.windowDot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.windowDot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.windowDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.ideTitle}>VS CODE // {product.name.toUpperCase()}</Text>
          </View>
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{buildProgress}% COMPILED</Text>
          </View>
        </View>

        {/* IDE Editor Tabs */}
        <View style={styles.editorTabs}>
          <View style={[styles.editorTab, styles.editorTabActive]}>
            <Text style={styles.editorTabTextActive}>App.tsx</Text>
          </View>
          <View style={styles.editorTab}>
            <Text style={styles.editorTabText}>schema.prisma</Text>
          </View>
          <View style={styles.editorTab}>
            <Text style={styles.editorTabText}>Dockerfile</Text>
          </View>
          <View style={styles.editorTab}>
            <Text style={styles.editorTabText}>deploy.yml</Text>
          </View>
        </View>

        {/* Code Visualizer */}
        <View style={styles.codeWindow}>
          <View style={styles.lineNumbers}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <Text key={n} style={styles.lineNumberText}>
                {n}
              </Text>
            ))}
          </View>
          <View style={styles.codeLines}>
            <Text style={styles.codeLine}>
              <Text style={{ color: '#C084FC' }}>import</Text> {'{'} ProductEngine {'}'}{' '}
              <Text style={{ color: '#C084FC' }}>from</Text>{' '}
              <Text style={{ color: '#FDE047' }}>'@core/engine'</Text>;
            </Text>
            <Text style={styles.codeLine}>
              <Text style={{ color: '#38BDF8' }}>const</Text> app ={' '}
              <Text style={{ color: '#34D399' }}>new</Text> ProductEngine({'{'}
            </Text>
            <Text style={styles.codeLine}>
              {'  '}name: <Text style={{ color: '#FDE047' }}>'{product.name}'</Text>,
            </Text>
            <Text style={styles.codeLine}>
              {'  '}database:{' '}
              <Text style={{ color: hasDb ? '#34D399' : '#64748B' }}>
                {hasDb ? "'postgres://cluster:5432'" : 'null /* PENDING */'}
              </Text>
              ,
            </Text>
            <Text style={styles.codeLine}>
              {'  '}container:{' '}
              <Text style={{ color: hasDocker ? '#22D3EE' : '#64748B' }}>
                {hasDocker ? "'docker.io/dist:latest'" : 'null /* UNPACKAGED */'}
              </Text>
              ,
            </Text>
            <Text style={styles.codeLine}>
              {'  '}tests:{' '}
              <Text style={{ color: hasTests ? '#10B981' : '#64748B' }}>
                {hasTests ? "'PASS (214/214)'" : "'RUNNING...'"}
              </Text>
            </Text>
            <Text style={styles.codeLine}>{'}'});</Text>
            <Text style={styles.codeLine}>
              <Text style={{ color: '#38BDF8' }}>export default</Text> app.listen(
              <Text style={{ color: '#F97316' }}>8080</Text>);
            </Text>
          </View>

          {/* Docker Overlay Box */}
          {hasDocker && (
            <View style={styles.dockerOverlayBadge}>
              <Text style={styles.dockerOverlayText}>🐳 DOCKER SEALED</Text>
            </View>
          )}
        </View>

        {/* Live Terminal Output */}
        <View style={styles.terminalContainer}>
          <View style={styles.terminalHeader}>
            <Text style={styles.terminalHeaderText}>TERMINAL // BASH</Text>
            <Text style={styles.terminalStatus}>
              {canPublish ? '● BUILD SUCCEEDED' : '● COMPILING...'}
            </Text>
          </View>
          <View style={styles.terminalContent}>
            {terminalLogs.slice(-4).map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </View>
        </View>

        {/* Publish Button */}
        {canPublish && (
          <TouchableOpacity style={styles.launchBtn} onPress={onPublish}>
            <Text style={styles.launchBtnText}>🚀 PUBLISH TO PUBLIC CLOUD →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // --- PHASE 2: LIVE SYSTEM DESIGN & HARDWARE RACK CANVAS ---
  const podCount = infraLevels['k8s_pods'] || 1;
  const hasGpu = (infraLevels['gpu_rack'] || 0) > 0;
  const hasLb = (infraLevels['nginx_lb'] || 0) > 0;
  const hasCdn = (infraLevels['cdn_edge'] || 0) > 0;
  const hasRedis = (infraLevels['redis_cluster'] || 0) > 0;
  const hasKafka = (infraLevels['kafka_queue'] || 0) > 0;
  const fanCount = infraLevels['case_fans'] || 1;
  const isOverloaded = droppedReqPerSec > 0;

  return (
    <View style={styles.canvasContainer}>
      {/* Top Telemetry Bar */}
      <View style={styles.telemetryBar}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>POWER (PDU)</Text>
          <Text style={styles.telemetryValue}>{powerKw} kW</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>CHIP TEMP</Text>
          <Text
            style={[
              styles.telemetryValue,
              { color: isThermalThrottling ? '#F43F5E' : temperature > 65 ? '#F59E0B' : '#10B981' },
            ]}
          >
            {temperature}°C
          </Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>CAPACITY</Text>
          <Text style={styles.telemetryValue}>{totalCapacity} REQ/S</Text>
        </View>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>BOTTLENECK</Text>
          <Text
            style={[
              styles.telemetryValue,
              { color: activeBottleneck !== 'NOMINAL' ? '#F59E0B' : '#34D399' },
            ]}
          >
            {activeBottleneck}
          </Text>
        </View>
      </View>

      {/* SVG Canvas for High-Density Server Rack */}
      <Svg height="260" width="100%" viewBox="0 0 380 260">
        <Defs>
          <LinearGradient id="busGrad" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#0B1221" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#22D3EE" stopOpacity="0.3" />
          </LinearGradient>
          <LinearGradient id="rackGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#0B132B" />
            <Stop offset="1" stopColor="#070B14" />
          </LinearGradient>
        </Defs>

        {/* Outer 42U Server Rack Chassis */}
        <Rect
          x="12"
          y="10"
          width="356"
          height="182"
          rx="12"
          fill="url(#rackGrad)"
          stroke={isOverloaded ? '#F43F5E' : '#1E293B'}
          strokeWidth="1.5"
        />

        {/* Bus Trace Lines connecting Ingress to Sleds */}
        <Path
          d="M 190 230 L 190 170 M 190 170 L 80 150 M 190 170 L 190 125 M 190 170 L 300 150 M 190 125 L 105 85 M 190 125 L 275 85 M 105 85 L 105 38 M 275 85 L 275 38"
          stroke="#1E293B"
          strokeWidth="2"
          fill="none"
        />

        {/* Animated Data Packets */}
        {packets.map((p) => {
          const startY = 225;
          const endY = 38;
          const y = startY - p.progress * (startY - endY);

          let targetX = 190;
          if (p.lane === 0) targetX = 80;
          else if (p.lane === 1) targetX = 145;
          else if (p.lane === 2) targetX = 235;
          else targetX = 300;

          const x =
            p.progress < 0.35
              ? 190
              : 190 + ((p.progress - 0.35) / 0.65) * (targetX - 190);

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

        {/* TOP ROW: DATA & STORAGE TIER */}
        {/* Redis Cache Sled */}
        <Rect
          x="26"
          y="20"
          width="100"
          height="34"
          rx="6"
          fill="#0F172A"
          stroke={hasRedis ? '#34D399' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="76" y="35" fill={hasRedis ? '#34D399' : '#475569'} fontSize="9" fontWeight="900" textAnchor="middle">
          REDIS CACHE
        </SvgText>
        <SvgText x="76" y="47" fill="#94A3B8" fontSize="8" textAnchor="middle">
          {hasRedis ? `LV ${infraLevels['redis_cluster']} • <1ms` : 'OFFLINE'}
        </SvgText>

        {/* Primary SQL Database */}
        <Rect
          x="140"
          y="20"
          width="100"
          height="34"
          rx="6"
          fill="#0F172A"
          stroke={isOverloaded ? '#F43F5E' : '#38BDF8'}
          strokeWidth="1.5"
        />
        <SvgText x="190" y="35" fill="#F8FAFC" fontSize="9" fontWeight="900" textAnchor="middle">
          SQL DATABASE
        </SvgText>
        <SvgText x="190" y="47" fill="#38BDF8" fontSize="8" textAnchor="middle">
          PRIMARY CLUSTER
        </SvgText>

        {/* Kafka Event Queue */}
        <Rect
          x="254"
          y="20"
          width="100"
          height="34"
          rx="6"
          fill="#0F172A"
          stroke={hasKafka ? '#FBBF24' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="304" y="35" fill={hasKafka ? '#FBBF24' : '#475569'} fontSize="9" fontWeight="900" textAnchor="middle">
          KAFKA QUEUE
        </SvgText>
        <SvgText x="304" y="47" fill="#94A3B8" fontSize="8" textAnchor="middle">
          {hasKafka ? `LV ${infraLevels['kafka_queue']} • STREAM` : 'OFFLINE'}
        </SvgText>

        {/* MIDDLE ROW: COMPUTE PODS & GPU RACKS */}
        {/* Kubernetes Cluster Pod Sled */}
        <Rect
          x="26"
          y="70"
          width="155"
          height="40"
          rx="8"
          fill="#0F172A"
          stroke={isThermalThrottling ? '#F43F5E' : '#22D3EE'}
          strokeWidth="1.5"
        />
        <SvgText x="103" y="87" fill="#F8FAFC" fontSize="9" fontWeight="900" textAnchor="middle">
          K8S PODS ({podCount} REPLICAS)
        </SvgText>
        <SvgText x="103" y="101" fill={isThermalThrottling ? '#F43F5E' : '#22D3EE'} fontSize="8" textAnchor="middle">
          {isThermalThrottling ? '⚠ THROTTLED (-35%)' : 'ACTIVE • HEALTHY'}
        </SvgText>

        {/* GPU Compute Rack */}
        <Rect
          x="199"
          y="70"
          width="155"
          height="40"
          rx="8"
          fill="#0F172A"
          stroke={hasGpu ? '#10B981' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="276" y="87" fill={hasGpu ? '#10B981' : '#475569'} fontSize="9" fontWeight="900" textAnchor="middle">
          GPU TENSOR RACK
        </SvgText>
        <SvgText x="276" y="101" fill="#94A3B8" fontSize="8" textAnchor="middle">
          {hasGpu ? `LV ${infraLevels['gpu_rack']} • NVLINK 100%` : 'UNPROVISIONED'}
        </SvgText>

        {/* EDGE TIER: NGINX LB & CDN */}
        <Rect
          x="26"
          y="126"
          width="155"
          height="34"
          rx="6"
          fill="#0B1221"
          stroke={hasLb ? '#22D3EE' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="103" y="141" fill={hasLb ? '#22D3EE' : '#64748B'} fontSize="9" fontWeight="900" textAnchor="middle">
          NGINX LOAD BALANCER
        </SvgText>
        <SvgText x="103" y="152" fill="#94A3B8" fontSize="8" textAnchor="middle">
          {hasLb ? `LV ${infraLevels['nginx_lb']} • L7 REVERSE PROXY` : 'LOCKED'}
        </SvgText>

        <Rect
          x="199"
          y="126"
          width="155"
          height="34"
          rx="6"
          fill="#0B1221"
          stroke={hasCdn ? '#38BDF8' : '#1E293B'}
          strokeWidth="1.5"
        />
        <SvgText x="276" y="141" fill={hasCdn ? '#38BDF8' : '#64748B'} fontSize="9" fontWeight="900" textAnchor="middle">
          GLOBAL CDN EDGE
        </SvgText>
        <SvgText x="276" y="152" fill="#94A3B8" fontSize="8" textAnchor="middle">
          {hasCdn ? `LV ${infraLevels['cdn_edge']} • 300+ POPS` : 'LOCKED'}
        </SvgText>

        {/* BOTTOM INGRESS GATEWAY FUNNEL */}
        <Path
          d="M 130 250 L 170 205 L 210 205 L 250 250 Z"
          fill="#0B132B"
          stroke="#22D3EE"
          strokeWidth="1.5"
        />
        <SvgText x="190" y="222" fill="#22D3EE" fontSize="10" fontWeight="900" textAnchor="middle">
          INGRESS GATEWAY
        </SvgText>
        <SvgText x="190" y="240" fill="#F8FAFC" fontSize="11" fontWeight="900" textAnchor="middle">
          USERS: {incomingReqPerSec} REQ/S
        </SvgText>
      </Svg>

      {/* Rack Sub-Footer: Thermal Fans & Status Indicator */}
      <View style={styles.rackFooter}>
        <View style={styles.fanRow}>
          <Animated.View style={{ transform: [{ rotate: fanSpin }] }}>
            <Text style={styles.fanIcon}>⚙️</Text>
          </Animated.View>
          <Text style={styles.fanText}>
            COOLING FANS: {fanCount} UNITS ({isThermalThrottling ? 'HIGH RPM' : 'NOMINAL'})
          </Text>
        </View>
        <View style={styles.loadIndicator}>
          <View
            style={[
              styles.loadDot,
              { backgroundColor: isOverloaded ? '#F43F5E' : '#10B981' },
            ]}
          />
          <Text
            style={[
              styles.loadText,
              { color: isOverloaded ? '#F43F5E' : '#10B981' },
            ]}
          >
            {isOverloaded ? `DROPPING ${droppedReqPerSec}/S` : `LOAD ${loadPercent}%`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Phase 1: Build Styles ---
  buildContainer: {
    flex: 1,
    backgroundColor: '#070B14',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  ideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  ideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  windowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ideTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 6,
  },
  progressPill: {
    backgroundColor: '#083344',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#22D3EE',
  },
  progressText: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '900',
  },
  editorTabs: {
    flexDirection: 'row',
    backgroundColor: '#0B1221',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1E293B',
  },
  editorTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderColor: '#1E293B',
  },
  editorTabActive: {
    backgroundColor: '#070B14',
    borderTopWidth: 2,
    borderTopColor: '#22D3EE',
  },
  editorTabText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  editorTabTextActive: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  codeWindow: {
    backgroundColor: '#070B14',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
    flexDirection: 'row',
    padding: 12,
    minHeight: 180,
    position: 'relative',
  },
  lineNumbers: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'flex-end',
  },
  lineNumberText: {
    color: '#475569',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  codeLines: {
    paddingLeft: 12,
    flex: 1,
  },
  codeLine: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  dockerOverlayBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: '#083344',
    borderWidth: 1.5,
    borderColor: '#22D3EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dockerOverlayText: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '900',
  },
  terminalContainer: {
    backgroundColor: '#040711',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 10,
    overflow: 'hidden',
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0B1221',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  terminalHeaderText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  terminalStatus: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  terminalContent: {
    padding: 10,
    gap: 4,
  },
  logText: {
    color: '#34D399',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  launchBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  launchBtnText: {
    color: '#042F2E',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // --- Phase 2: Live Canvas Styles ---
  canvasContainer: {
    backgroundColor: '#070B14',
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  telemetryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  telemetryItem: {
    alignItems: 'center',
  },
  telemetryLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  telemetryValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  rackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  fanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fanIcon: {
    fontSize: 14,
  },
  fanText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  loadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
