import { useEffect, useMemo, useState } from 'react';
import {
  BACKEND_STACKS,
  BUILD_MODULES,
  CHAOS_EVENTS,
  CLIENT_JOBS,
  CREW_MEMBERS,
  DATABASE_STACKS,
  INFRA_NODES,
  LAB_UPGRADES,
  PRODUCTS,
} from '../data/gameData';
import {
  ChaosEvent,
  ClientJob,
  GamePhase,
  NavigationTab,
  Packet,
  PlayerMode,
  ProductId,
  RigSubTab,
} from '../types/game';

export function useGameEngine() {
  const [phase, setPhase] = useState<GamePhase>('onboarding');
  const [mode, setMode] = useState<PlayerMode>('explorer');
  const [productId, setProductId] = useState<ProductId>('ecommerce');
  const [backendStackId, setBackendStackId] = useState<string>('golang');
  const [dbStackId, setDbStackId] = useState<string>('postgres');

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<NavigationTab>('rig');
  const [rigSubTab, setRigSubTab] = useState<RigSubTab>('compute');

  // Economy & Progression
  const [cash, setCash] = useState<number>(2400);
  const [gems, setGems] = useState<number>(5);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [rating, setRating] = useState<number>(4.9);
  const [totalRequestsServed, setTotalRequestsServed] = useState<number>(0);

  // Phase 1: Build & Ship
  const [installedBuildIds, setInstalledBuildIds] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System ready. Initialize workspace to begin building your product.',
  ]);

  // Phase 2: Live System Architecture
  const [infraLevels, setInfraLevels] = useState<Record<string, number>>({
    k8s_pods: 1,
    case_fans: 1,
  });

  // Client Jobs Roadmap
  const [clientJobs, setClientJobs] = useState<ClientJob[]>(CLIENT_JOBS);
  const [currentJobId, setCurrentJobId] = useState<string>('job_rovewise');
  const [currentJobProgress, setCurrentJobProgress] = useState<number>(0);

  // Crew & Lab
  const [hiredCrewIds, setHiredCrewIds] = useState<string[]>([]);
  const [unlockedLabIds, setUnlockedLabIds] = useState<string[]>([]);

  // Chaos & Traffic
  const [activeChaos, setActiveChaos] = useState<ChaosEvent | null>(null);
  const [chaosTimer, setChaosTimer] = useState<number>(0);
  const [packets, setPackets] = useState<Packet[]>([]);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0],
    [productId]
  );

  const backendStack = useMemo(
    () => BACKEND_STACKS.find((b) => b.id === backendStackId) || BACKEND_STACKS[0],
    [backendStackId]
  );

  const dbStack = useMemo(
    () => DATABASE_STACKS.find((d) => d.id === dbStackId) || DATABASE_STACKS[0],
    [dbStackId]
  );

  const currentJob = useMemo(
    () => clientJobs.find((j) => j.id === currentJobId) || clientJobs[0],
    [clientJobs, currentJobId]
  );

  // Build progress (0 to 100%)
  const buildProgress = useMemo(() => {
    return installedBuildIds.reduce((sum, id) => {
      const mod = BUILD_MODULES.find((m) => m.id === id);
      return sum + (mod ? mod.progressBoost : 0);
    }, 0);
  }, [installedBuildIds]);

  const canPublish = buildProgress >= 100;

  // Crew & Lab multipliers
  const crewCapacityMult =
    1 +
    hiredCrewIds.reduce((sum, id) => {
      const c = CREW_MEMBERS.find((m) => m.id === id);
      return c?.effectType === 'capacity' ? sum + c.effectValue : sum;
    }, 0);

  const crewCoolingMult =
    1 +
    hiredCrewIds.reduce((sum, id) => {
      const c = CREW_MEMBERS.find((m) => m.id === id);
      return c?.effectType === 'cooling' ? sum + c.effectValue : sum;
    }, 0);

  const crewBurnDiscount = hiredCrewIds.reduce((sum, id) => {
    const c = CREW_MEMBERS.find((m) => m.id === id);
    return c?.effectType === 'burn_reduction' ? sum + c.effectValue : sum;
  }, 0);

  const hasLabCompression = unlockedLabIds.includes('token_compression');
  const hasLabHttp3 = unlockedLabIds.includes('http3_quic');
  const hasLabDbReplicas = unlockedLabIds.includes('db_read_replicas');
  const hasLabZeroDowntime = unlockedLabIds.includes('zero_downtime');

  // Thermal physics calculation
  const temperature = useMemo(() => {
    if (phase !== 'live') return 25;
    const baseTemp = 28;
    const heatGenerated = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return node.heatPerLevel > 0 ? sum + lvl * node.heatPerLevel : sum;
    }, 0);

    const coolingPower = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return node.heatPerLevel < 0 ? sum + lvl * Math.abs(node.heatPerLevel) : sum;
    }, 0) * crewCoolingMult;

    const netHeat = Math.max(0, heatGenerated - coolingPower);
    return Math.min(95, Math.round(baseTemp + netHeat * 0.8));
  }, [phase, infraLevels, crewCoolingMult]);

  const isThermalThrottling = temperature >= 80;

  // Power Consumption (kW)
  const powerKw = useMemo(() => {
    if (phase !== 'live') return 0;
    const rawPower = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return sum + lvl * node.powerKwPerLevel;
    }, 0);
    return +(rawPower * (1 - Math.min(0.5, crewBurnDiscount * 0.5))).toFixed(1);
  }, [phase, infraLevels, crewBurnDiscount]);

  // Incoming traffic (REQ/S)
  const incomingReqPerSec = useMemo(() => {
    if (phase !== 'live') return 0;
    const jobMult = currentJob.reqPerSecMultiplier;
    const chaosMult = activeChaos ? activeChaos.trafficMultiplier : 1;
    const base = product.baseTraffic * jobMult;
    const stackBonus = backendStack.capacityBonus * 0.4;
    return Math.round((base + stackBonus) * chaosMult);
  }, [phase, product, currentJob, activeChaos, backendStack]);

  // Total server capacity (REQ/S)
  const totalCapacity = useMemo(() => {
    const rawCapacity = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return sum + lvl * node.capacityPerLevel;
    }, 0);

    const stackBonus = backendStack.capacityBonus + dbStack.capacityBonus;
    const replicaBonus = hasLabDbReplicas ? 60 : 0;
    let cap = (rawCapacity + stackBonus + replicaBonus) * crewCapacityMult;

    // Thermal throttling penalty
    if (isThermalThrottling) {
      cap *= 0.65; // 35% performance loss when overheating!
    }

    return Math.max(30, Math.round(cap));
  }, [
    infraLevels,
    backendStack,
    dbStack,
    hasLabDbReplicas,
    crewCapacityMult,
    isThermalThrottling,
  ]);

  // Cloud burn rate ($/s)
  const burnPerSec = useMemo(() => {
    if (phase !== 'live') return 0;
    const rawBurn = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return sum + lvl * node.burnPerSec;
    }, 0);
    const discounted = rawBurn * (1 - Math.min(0.65, crewBurnDiscount));
    return +(discounted).toFixed(2);
  }, [phase, infraLevels, crewBurnDiscount]);

  const servedReqPerSec = Math.min(incomingReqPerSec, totalCapacity);
  const droppedReqPerSec = Math.max(0, incomingReqPerSec - totalCapacity);
  const loadPercent =
    totalCapacity > 0
      ? Math.min(100, Math.round((incomingReqPerSec / totalCapacity) * 100))
      : 100;

  // Active Bottleneck Detection
  const activeBottleneck = useMemo(() => {
    if (temperature >= 80) return 'THERMAL OVERHEAT';
    if (droppedReqPerSec > 0) {
      if ((infraLevels['nginx_lb'] || 0) === 0) return 'INGRESS BOTTLENECK';
      if ((infraLevels['redis_cluster'] || 0) === 0) return 'DB READ LOCK';
      return 'COMPUTE CAPACITY';
    }
    return 'NOMINAL';
  }, [temperature, droppedReqPerSec, infraLevels]);

  const revenueMultiplier =
    (1 + backendStack.efficiencyBonus + dbStack.efficiencyBonus) *
    (hasLabCompression ? 1.15 : 1.0);

  const grossIncomePerSec = +(
    servedReqPerSec *
    product.revenuePerReq *
    revenueMultiplier
  ).toFixed(2);

  const netIncomePerSec = +(grossIncomePerSec - burnPerSec).toFixed(2);

  // Simulation tick (every 100ms)
  useEffect(() => {
    if (phase !== 'live') return;

    let packetId = 1;
    const interval = setInterval(() => {
      // Cash & Requests served
      setCash((prev) => Math.max(0, +(prev + netIncomePerSec * 0.1).toFixed(2)));
      const incrementServed = Math.round(servedReqPerSec * 0.1);
      setTotalRequestsServed((prev) => {
        const next = prev + incrementServed;
        // Level up every 25,000 requests
        const calculatedLvl = Math.floor(next / 25000) + 1;
        if (calculatedLvl > playerLevel) {
          setPlayerLevel(calculatedLvl);
        }
        return next;
      });

      // Update current Client Job progress
      setCurrentJobProgress((prev) => {
        const updated = prev + incrementServed;
        if (updated >= currentJob.targetRequests && !currentJob.completed) {
          // Reward player!
          setCash((c) => c + currentJob.rewardCash);
          setGems((g) => g + currentJob.rewardGems);

          // Mark job completed and unlock next
          setClientJobs((jobs) =>
            jobs.map((j, idx) => {
              if (j.id === currentJob.id) {
                return { ...j, completed: true };
              }
              if (idx === currentJob.stepNumber) {
                return { ...j, locked: false };
              }
              return j;
            })
          );
        }
        return updated;
      });

      // Star rating churn
      setRating((prev) => {
        if (droppedReqPerSec > 0 || isThermalThrottling) {
          const basePenalty = hasLabHttp3 ? 0.008 : 0.015;
          return Math.max(1.0, +(prev - basePenalty).toFixed(2));
        }
        const recoverySpeed = hasLabZeroDowntime ? 0.008 : 0.004;
        return Math.min(5.0, +(prev + recoverySpeed).toFixed(2));
      });

      // Animated traffic packets (Blue, Green, Amber, Red)
      setPackets((prev) => {
        const moved = prev
          .map((p) => ({ ...p, progress: p.progress + 0.065 }))
          .filter((p) => p.progress <= 1);

        const spawnRate = Math.min(4, Math.max(1, Math.ceil(incomingReqPerSec / 30)));
        for (let i = 0; i < spawnRate; i++) {
          if (moved.length < 28) {
            const isDropped =
              droppedReqPerSec > 0 &&
              Math.random() < droppedReqPerSec / Math.max(1, incomingReqPerSec);
            const types: Packet['type'][] = ['static', 'read', 'write'];
            moved.push({
              id: packetId++,
              progress: 0,
              lane: Math.floor(Math.random() * 4),
              type: isDropped
                ? 'dropped'
                : types[Math.floor(Math.random() * types.length)],
            });
          }
        }
        return moved;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    phase,
    netIncomePerSec,
    servedReqPerSec,
    droppedReqPerSec,
    incomingReqPerSec,
    currentJob,
    isThermalThrottling,
    hasLabHttp3,
    hasLabZeroDowntime,
    playerLevel,
  ]);

  // Chaos event scheduler (every 1s)
  useEffect(() => {
    if (phase !== 'live') return;
    const timer = setInterval(() => {
      if (activeChaos) {
        setChaosTimer((t) => {
          if (t <= 1) {
            setActiveChaos(null);
            return 0;
          }
          return t - 1;
        });
      } else if (incomingReqPerSec > 25 && Math.random() < 0.025) {
        const ev = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
        setActiveChaos(ev);
        setChaosTimer(ev.durationSec);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, activeChaos, incomingReqPerSec]);

  // --- ACTIONS ---

  const startGame = (
    selectedMode: PlayerMode,
    selectedProduct: ProductId,
    backendId: string,
    databaseId: string
  ) => {
    setMode(selectedMode);
    setProductId(selectedProduct);
    setBackendStackId(backendId);
    setDbStackId(databaseId);
    setPhase('build');
    setTerminalLogs([
      `$ stackforge init --product=${selectedProduct} --backend=${backendId} --db=${databaseId}`,
      '✓ Initialized Git repo, ESLint, and TypeScript environment.',
    ]);
  };

  const installBuildModule = (moduleId: string) => {
    if (installedBuildIds.includes(moduleId)) return;
    const mod = BUILD_MODULES.find((m) => m.id === moduleId);
    if (!mod || cash < mod.cost) return;

    setCash((c) => +(c - mod.cost).toFixed(2));
    setInstalledBuildIds((prev) => [...prev, moduleId]);
    setTerminalLogs((prev) => [...prev.slice(-6), mod.terminalLog]);
  };

  const publishProduct = () => {
    if (!canPublish) return;
    setPhase('live');
    setActiveTab('rig');
  };

  const getInfraCost = (nodeId: string) => {
    const node = INFRA_NODES.find((n) => n.id === nodeId);
    if (!node) return 0;
    const lvl = infraLevels[nodeId] || 0;
    return Math.round(node.baseCost * Math.pow(node.costMultiplier, lvl));
  };

  const upgradeInfra = (nodeId: string) => {
    const cost = getInfraCost(nodeId);
    if (cash < cost) return;
    setCash((c) => +(c - cost).toFixed(2));
    setInfraLevels((prev) => ({ ...prev, [nodeId]: (prev[nodeId] || 0) + 1 }));
  };

  const selectClientJob = (jobId: string) => {
    const target = clientJobs.find((j) => j.id === jobId);
    if (!target || target.locked) return;
    setCurrentJobId(jobId);
    setCurrentJobProgress(0);
  };

  const speedUpJob = () => {
    if (gems < 1) return;
    setGems((g) => g - 1);
    setCurrentJobProgress((prev) => prev + Math.round(currentJob.targetRequests * 0.35));
  };

  const hireCrew = (crewId: string) => {
    if (hiredCrewIds.includes(crewId)) return;
    const member = CREW_MEMBERS.find((c) => c.id === crewId);
    if (!member || cash < member.cost) return;
    setCash((c) => +(c - member.cost).toFixed(2));
    setHiredCrewIds((prev) => [...prev, crewId]);
  };

  const unlockLab = (labId: string) => {
    if (unlockedLabIds.includes(labId)) return;
    const upgrade = LAB_UPGRADES.find((u) => u.id === labId);
    if (!upgrade || cash < upgrade.cost) return;
    setCash((c) => +(c - upgrade.cost).toFixed(2));
    setUnlockedLabIds((prev) => [...prev, labId]);
  };

  return {
    phase,
    mode,
    product,
    backendStack,
    dbStack,
    activeTab,
    setActiveTab,
    rigSubTab,
    setRigSubTab,
    cash,
    gems,
    playerLevel,
    rating,
    totalRequestsServed,
    installedBuildIds,
    terminalLogs,
    buildProgress,
    canPublish,
    infraLevels,
    temperature,
    isThermalThrottling,
    powerKw,
    clientJobs,
    currentJob,
    currentJobProgress,
    hiredCrewIds,
    unlockedLabIds,
    activeBottleneck,
    incomingReqPerSec,
    totalCapacity,
    servedReqPerSec,
    droppedReqPerSec,
    loadPercent,
    grossIncomePerSec,
    burnPerSec,
    netIncomePerSec,
    packets,
    activeChaos,
    chaosTimer,
    startGame,
    installBuildModule,
    publishProduct,
    getInfraCost,
    upgradeInfra,
    selectClientJob,
    speedUpJob,
    hireCrew,
    unlockLab,
  };
}
