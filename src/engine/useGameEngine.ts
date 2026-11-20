import { useEffect, useMemo, useState } from 'react';
import {
  BENCHMARK_RIVALS,
  BUILD_MODULES_BY_PRODUCT,
  CHAOS_EVENTS,
  CLIENT_JOBS,
  CREW_MEMBERS,
  DEPLOY_STEPS_BY_PRODUCT,
  GLOBAL_REGIONS,
  INFRA_NODES,
  LAB_UPGRADES,
  MARKETING_CAMPAIGNS,
  PRODUCTS,
  TECH_STACKS_BY_PRODUCT,
} from '../data/gameData';
import {
  BenchmarkRival,
  BuildModule,
  ChaosEvent,
  ClientJob,
  CrewMember,
  DeployStep,
  GamePhase,
  GlobalRegion,
  LabBench,
  LabUpgrade,
  MarketingCampaign,
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
  const [selectedStackId, setSelectedStackId] = useState<string>('go_postgres');

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<NavigationTab>('rig');
  const [rigSubTab, setRigSubTab] = useState<RigSubTab>('compute');

  // Economy & Progression
  const [cash, setCash] = useState<number>(15000);
  const [gems, setGems] = useState<number>(25);
  const [bronzeKeys, setBronzeKeys] = useState<number>(3);
  const [purpleKeys, setPurpleKeys] = useState<number>(2);
  const [goldKeys, setGoldKeys] = useState<number>(1);
  const [dailyGiftClaimed, setDailyGiftClaimed] = useState<boolean>(false);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [rating, setRating] = useState<number>(4.9);
  const [totalRequestsServed, setTotalRequestsServed] = useState<number>(0);

  // Phase 1: Build & Architecture
  const [installedBuildIds, setInstalledBuildIds] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System ready. Select architecture modules to initialize your repository.',
  ]);

  // Phase 2: Deploy Pipeline
  const [deployStepIndex, setDeployStepIndex] = useState<number>(0);

  // Phase 3: Launch Marketing
  const [activeCampaigns, setActiveCampaigns] = useState<MarketingCampaign[]>(MARKETING_CAMPAIGNS);

  // Phase 4: Live System Hardware Deck (Levels for nodes)
  const [infraLevels, setInfraLevels] = useState<Record<string, number>>({
    app_server: 1,
    cooling_fan: 1,
    edge_dns: 1,
  });

  // Global Regions Map
  const [regions, setRegions] = useState<GlobalRegion[]>(GLOBAL_REGIONS);

  // Dyno / Tuning State
  const [tuningRatio, setTuningRatio] = useState<number>(0.70); // 0.65-0.75 is optimal green band!
  const [autoTuneActive, setAutoTuneActive] = useState<boolean>(false);

  // Benchmark / Race Rivals
  const [rivals, setRivals] = useState<BenchmarkRival[]>(BENCHMARK_RIVALS);
  const [currentRivalIndex, setCurrentRivalIndex] = useState<number>(0);
  const [raceTries, setRaceTries] = useState<number>(5);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [raceProgress, setRaceProgress] = useState<number>(0); // 0 to 1

  // Client Jobs Roadmap
  const [clientJobs, setClientJobs] = useState<ClientJob[]>(CLIENT_JOBS);
  const [currentJobId, setCurrentJobId] = useState<string>('job_rovewise');
  const [currentJobProgress, setCurrentJobProgress] = useState<number>(0);

  // 3-Bench Research Lab
  const [labBenches, setLabBenches] = useState<LabBench[]>([
    { id: 1, name: 'BENCH 1', unlocked: true, unlockCostGems: 0, activeUpgradeId: null, remainingSeconds: 0, totalSeconds: 0 },
    { id: 2, name: 'BENCH 2', unlocked: false, unlockCostGems: 15, activeUpgradeId: null, remainingSeconds: 0, totalSeconds: 0 },
    { id: 3, name: 'BENCH 3', unlocked: false, unlockCostGems: 30, activeUpgradeId: null, remainingSeconds: 0, totalSeconds: 0 },
  ]);
  const [unlockedLabIds, setUnlockedLabIds] = useState<string[]>([]);

  // Crew Cards
  const [hiredCrewIds, setHiredCrewIds] = useState<string[]>(['crew_5']);

  // Tap-to-Rev Interactive Engine
  const [revBonusRps, setRevBonusRps] = useState<number>(0);
  const [floatingCashList, setFloatingCashList] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Chaos & Traffic
  const [activeChaos, setActiveChaos] = useState<ChaosEvent | null>(null);
  const [chaosTimer, setChaosTimer] = useState<number>(0);
  const [packets, setPackets] = useState<Packet[]>([]);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0],
    [productId]
  );

  const availableStacks = useMemo(
    () => TECH_STACKS_BY_PRODUCT[productId] || TECH_STACKS_BY_PRODUCT.ecommerce,
    [productId]
  );

  const selectedStack = useMemo(
    () => availableStacks.find((s) => s.id === selectedStackId) || availableStacks[0],
    [availableStacks, selectedStackId]
  );

  const buildModules = useMemo(
    () => BUILD_MODULES_BY_PRODUCT[productId] || BUILD_MODULES_BY_PRODUCT.ecommerce,
    [productId]
  );

  const deploySteps = useMemo(
    () => DEPLOY_STEPS_BY_PRODUCT[productId] || DEPLOY_STEPS_BY_PRODUCT.ecommerce,
    [productId]
  );

  // Active crew members
  const hiredCrew = useMemo(
    () => CREW_MEMBERS.filter((c) => hiredCrewIds.includes(c.id)),
    [hiredCrewIds]
  );

  // Tuning accuracy: 1.0 if perfectly in 0.65-0.75, scales down otherwise
  const tuningAccuracy = useMemo(() => {
    if (autoTuneActive) return 1.25; // 25% boost!
    const diff = Math.abs(tuningRatio - 0.70);
    if (diff <= 0.05) return 1.15; // In green band!
    return Math.max(0.75, 1.0 - diff);
  }, [tuningRatio, autoTuneActive]);

  // Compute total capacity from hardware
  const baseCapacity = useMemo(() => {
    let cap = 50;
    // Add hardware nodes
    INFRA_NODES.forEach((node) => {
      const lvl = infraLevels[node.id] || 0;
      cap += lvl * node.capacityPerLevel;
    });

    // Add stack bonus
    cap += selectedStack.capacityBonus;

    // Add lab bonus
    if (unlockedLabIds.includes('lab_ebpf')) cap *= 1.4;

    // Add crew bonus
    hiredCrew.forEach((c) => {
      if (c.effectType === 'capacity') cap *= 1 + c.effectValue;
    });

    return Math.round(cap * tuningAccuracy);
  }, [infraLevels, selectedStack, unlockedLabIds, hiredCrew, tuningAccuracy]);

  // Compute thermal metrics
  const { currentTempC, isThrottling, netHeatGen } = useMemo(() => {
    let totalHeatGen = 10;
    let totalCooling = 0;

    INFRA_NODES.forEach((node) => {
      const lvl = infraLevels[node.id] || 0;
      if (node.heatPerLevel > 0) {
        totalHeatGen += lvl * node.heatPerLevel;
      } else {
        totalCooling += lvl * Math.abs(node.heatPerLevel);
      }
    });

    // Crew cooling effect
    hiredCrew.forEach((c) => {
      if (c.effectType === 'cooling') totalCooling *= 1 + c.effectValue;
    });

    const netHeat = Math.max(-50, totalHeatGen - totalCooling);
    // Baseline ambient is 28°C
    const temp = Math.min(100, Math.max(28, 28 + netHeat * 1.8));
    const throttling = temp >= 80;

    return {
      currentTempC: Math.round(temp * 10) / 10,
      isThrottling: throttling,
      netHeatGen: netHeat,
    };
  }, [infraLevels, hiredCrew]);

  // Active Region Multipliers
  const unlockedRegions = useMemo(() => regions.filter((r) => r.unlocked), [regions]);
  const regionRpsBoost = useMemo(
    () => unlockedRegions.reduce((sum, r) => sum + r.rpsCapacity, 0),
    [unlockedRegions]
  );
  const regionIncomeMultiplier = useMemo(
    () => unlockedRegions.reduce((acc, r) => acc + r.incomeBonus, 1.0),
    [unlockedRegions]
  );

  // Marketing campaign traffic multiplier
  const marketingMultiplier = useMemo(() => {
    return activeCampaigns
      .filter((c) => c.active)
      .reduce((mult, c) => mult * c.trafficMultiplier, 1.0);
  }, [activeCampaigns]);

  // Dynamic Incoming Traffic
  const incomingReqPerSec = useMemo(() => {
    if (phase !== 'live') return 0;
    let base = product.baseTraffic + (playerLevel - 1) * 8 + revBonusRps;

    // Region additions
    base += Math.round(regionRpsBoost * 0.08);

    // Chaos boost
    if (activeChaos) base *= activeChaos.trafficMultiplier;

    // Marketing boost
    base *= marketingMultiplier;

    // Client job multiplier
    const activeJob = clientJobs.find((j) => j.id === currentJobId);
    if (activeJob && !activeJob.completed) {
      base *= activeJob.reqPerSecMultiplier;
    }

    return Math.round(base);
  }, [phase, product, playerLevel, revBonusRps, regionRpsBoost, activeChaos, marketingMultiplier, clientJobs, currentJobId]);

  // Bottleneck calculation (Which component is choking throughput)
  const currentBottleneck = useMemo((): string => {
    if (isThrottling) return 'THERMAL';
    const ingressLvl = (infraLevels.edge_dns || 0) + (infraLevels.load_balancer || 0);
    const computeLvl = (infraLevels.app_server || 0) + (infraLevels.gpu_tensor || 0);
    const dbLvl = (infraLevels.db_primary || 0) + (infraLevels.redis_sled || 0);

    if (ingressLvl < computeLvl && ingressLvl * 100 < incomingReqPerSec) return 'INGRESS';
    if (dbLvl < computeLvl && dbLvl * 150 < incomingReqPerSec) return 'DB READS';
    if (baseCapacity < incomingReqPerSec) return 'COMPUTE';
    return 'OPTIMAL';
  }, [isThrottling, infraLevels, incomingReqPerSec, baseCapacity]);

  // Effective Processed Throughput
  const effectiveReqPerSec = useMemo(() => {
    let effective = Math.min(incomingReqPerSec, baseCapacity);
    if (isThrottling) effective *= 0.6; // 40% thermal throttle penalty!
    return Math.round(effective);
  }, [incomingReqPerSec, baseCapacity, isThrottling]);

  // Financial calculations
  const revenuePerReq = useMemo(() => {
    let rev = product.revenuePerReq;
    rev *= regionIncomeMultiplier;
    hiredCrew.forEach((c) => {
      if (c.effectType === 'revenue') rev *= 1 + c.effectValue;
    });
    return Math.round(rev * 100) / 100;
  }, [product, regionIncomeMultiplier, hiredCrew]);

  const burnPerSec = useMemo(() => {
    let burn = 5;
    INFRA_NODES.forEach((node) => {
      const lvl = infraLevels[node.id] || 0;
      burn += lvl * node.burnPerSec;
    });
    hiredCrew.forEach((c) => {
      if (c.effectType === 'burn_reduction') burn *= 1 - c.effectValue;
    });
    return Math.round(burn);
  }, [infraLevels, hiredCrew]);

  const netIncomePerSec = useMemo(() => {
    const gross = effectiveReqPerSec * revenuePerReq;
    return Math.round(gross - burnPerSec);
  }, [effectiveReqPerSec, revenuePerReq, burnPerSec]);

  // Dyno Score for benchmark racing
  const dynoScore = useMemo(() => {
    let score = baseCapacity * 0.8 + (100 - Math.min(95, currentTempC)) * 2;
    score *= tuningAccuracy;
    return Math.round(score);
  }, [baseCapacity, currentTempC, tuningAccuracy]);

  // Interactive Tap-To-Rev / Boost Function
  const revEngine = () => {
    setRevBonusRps((prev) => Math.min(250, prev + 25));
    const bonusEarned = Math.round(15 * (1 + playerLevel * 0.4) * revenuePerReq);
    setCash((prev) => prev + bonusEarned);

    // Spawn floating particle
    const newId = Date.now() + Math.random();
    const randomX = Math.floor(Math.random() * 120) - 60;
    const randomY = Math.floor(Math.random() * 40) - 20;
    setFloatingCashList((prev) => [
      ...prev.slice(-6),
      { id: newId, text: `+$${bonusEarned}`, x: randomX, y: randomY },
    ]);

    setTimeout(() => {
      setFloatingCashList((prev) => prev.filter((item) => item.id !== newId));
    }, 1200);
  };

  // Main 100ms simulation loop
  useEffect(() => {
    if (phase !== 'live') return;

    const interval = setInterval(() => {
      // Decay rev bonus smoothly
      setRevBonusRps((prev) => Math.max(0, prev - 2));

      // Financial balance increment
      setCash((prevCash) => Math.max(0, prevCash + netIncomePerSec * 0.1));
      setTotalRequestsServed((prev) => prev + Math.round(effectiveReqPerSec * 0.1));

      // Update active client job
      const activeJob = clientJobs.find((j) => j.id === currentJobId);
      if (activeJob && !activeJob.completed) {
        setCurrentJobProgress((prevProgress) => {
          const newProgress = prevProgress + Math.round(effectiveReqPerSec * 0.1);
          if (newProgress >= activeJob.targetRequests) {
            setCash((c) => c + activeJob.rewardCash);
            setGems((g) => g + activeJob.rewardGems);
            setBronzeKeys((k) => k + 1);

            // Mark job completed & unlock next
            setClientJobs((jobs) =>
              jobs.map((job) => {
                if (job.id === activeJob.id) return { ...job, completed: true };
                if (job.stepNumber === activeJob.stepNumber + 1) return { ...job, locked: false };
                return job;
              })
            );
            return activeJob.targetRequests;
          }
          return newProgress;
        });
      }

      // Decrement lab benches timers
      setLabBenches((benches) =>
        benches.map((bench) => {
          if (!bench.activeUpgradeId || bench.remainingSeconds <= 0) return bench;
          const newSec = bench.remainingSeconds - 0.1;
          if (newSec <= 0) {
            // Upgrade finished!
            if (!unlockedLabIds.includes(bench.activeUpgradeId)) {
              setUnlockedLabIds((ids) => [...ids, bench.activeUpgradeId!]);
            }
            return { ...bench, activeUpgradeId: null, remainingSeconds: 0 };
          }
          return { ...bench, remainingSeconds: newSec };
        })
      );

      // Decrement marketing campaign timers
      setActiveCampaigns((campaigns) =>
        campaigns.map((camp) => {
          if (!camp.active || camp.durationSec <= 0) return camp;
          const newDur = camp.durationSec - 0.1;
          if (newDur <= 0) {
            return { ...camp, active: false, durationSec: 0 };
          }
          return { ...camp, durationSec: newDur };
        })
      );

      // Animate packet visualizer
      setPackets((prev) => {
        const advanced = prev
          .map((p) => ({ ...p, progress: p.progress + 0.08 }))
          .filter((p) => p.progress <= 1);

        if (advanced.length < 8 && Math.random() > 0.3) {
          const lane = Math.floor(Math.random() * 4);
          const type = Math.random() > 0.85 && isThrottling ? 'dropped' : 'read';
          advanced.push({ id: Math.random(), progress: 0, lane, type });
        }
        return advanced;
      });

      // Handle chaos event countdown
      if (activeChaos) {
        setChaosTimer((prev) => {
          if (prev <= 1) {
            setActiveChaos(null);
            return 0;
          }
          return prev - 1;
        });
      } else if (Math.random() < 0.005) {
        // Random chaos event trigger
        const randomChaos = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
        setActiveChaos(randomChaos);
        setChaosTimer(randomChaos.durationSec);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    phase,
    netIncomePerSec,
    effectiveReqPerSec,
    clientJobs,
    currentJobId,
    activeChaos,
    isThrottling,
    unlockedLabIds,
  ]);

  // Phase Handlers
  const startGame = (chosenMode: PlayerMode, chosenProduct: ProductId, chosenStack: string) => {
    setMode(chosenMode);
    setProductId(chosenProduct);
    setSelectedStackId(chosenStack);
    setPhase('build');
    setInstalledBuildIds([BUILD_MODULES_BY_PRODUCT[chosenProduct][0].id]);
    setTerminalLogs([
      `[INIT] Scaffolded project for ${chosenProduct.toUpperCase()} with ${chosenStack}.`,
    ]);
  };

  const installBuildModule = (moduleId: string) => {
    const mod = buildModules.find((m) => m.id === moduleId);
    if (!mod || installedBuildIds.includes(moduleId) || cash < mod.cost) return;

    setCash((prev) => prev - mod.cost);
    setInstalledBuildIds((prev) => [...prev, moduleId]);
    setTerminalLogs((prev) => [...prev.slice(-6), mod.terminalLog]);

    // Check if ready for deploy
    const allRequiredInstalled = buildModules
      .filter((m) => m.requiredForLaunch)
      .every((m) => [...installedBuildIds, moduleId].includes(m.id));

    if (allRequiredInstalled) {
      setPhase('deploy');
      setDeployStepIndex(0);
    }
  };

  const advanceDeployStep = () => {
    if (deployStepIndex < deploySteps.length - 1) {
      setDeployStepIndex((i) => i + 1);
    } else {
      // Completed deploy! Move to launch marketing
      setPhase('launch_marketing');
    }
  };

  const finishLaunchMarketing = () => {
    setPhase('live');
    setActiveTab('rig');
  };

  // Hardware upgrade handler
  const upgradeInfra = (nodeId: string) => {
    const node = INFRA_NODES.find((n) => n.id === nodeId);
    if (!node) return;
    const currentLvl = infraLevels[nodeId] || 0;
    const cost = Math.round(node.baseCost * Math.pow(node.costMultiplier, currentLvl));

    if (cash >= cost) {
      setCash((prev) => prev - cost);
      setInfraLevels((prev) => ({ ...prev, [nodeId]: currentLvl + 1 }));

      // Level progression
      const totalHardwareLevels = Object.values({ ...infraLevels, [nodeId]: currentLvl + 1 }).reduce(
        (a, b) => a + b,
        0
      );
      setPlayerLevel(Math.min(50, Math.floor(1 + totalHardwareLevels / 3)));
    }
  };

  // Global Region provision
  const unlockRegion = (regionId: string) => {
    const reg = regions.find((r) => r.id === regionId);
    if (!reg || reg.unlocked || cash < reg.unlockCost) return;

    setCash((prev) => prev - reg.unlockCost);
    setRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, unlocked: true } : r))
    );
    setGems((g) => g + 10);
  };

  // Dyno tuning auto-tune
  const triggerAutoTune = () => {
    setAutoTuneActive(true);
    setTuningRatio(0.70); // Jump directly into optimal green band!
    setTimeout(() => {
      setAutoTuneActive(false);
    }, 45000);
  };

  // Benchmark race trigger
  const runBenchmark = () => {
    if (raceTries <= 0 || isRacing) return;
    setRaceTries((t) => t - 1);
    setIsRacing(true);
    setRaceProgress(0);

    const rival = rivals[currentRivalIndex];
    const isWin = dynoScore >= rival.score;

    const interval = setInterval(() => {
      setRaceProgress((p) => {
        if (p >= 1) {
          clearInterval(interval);
          setIsRacing(false);
          if (isWin) {
            setCash((c) => c + rival.rewardCash);
            setGems((g) => g + rival.rewardGems);
            if (rival.rewardKey === 'bronze') setBronzeKeys((k) => k + 1);
            if (rival.rewardKey === 'purple') setPurpleKeys((k) => k + 1);
            if (rival.rewardKey === 'gold') setGoldKeys((k) => k + 1);

            setRivals((list) =>
              list.map((r, idx) => (idx === currentRivalIndex ? { ...r, defeated: true } : r))
            );
            if (currentRivalIndex < rivals.length - 1) {
              setCurrentRivalIndex((i) => i + 1);
            }
          }
          return 1;
        }
        return p + 0.15;
      });
    }, 200);
  };

  // Research Lab Bench management
  const startResearch = (benchId: number, upgradeId: string) => {
    const upgrade = LAB_UPGRADES.find((u) => u.id === upgradeId);
    const bench = labBenches.find((b) => b.id === benchId);
    if (!upgrade || !bench || !bench.unlocked || bench.activeUpgradeId || cash < upgrade.cost) return;

    setCash((c) => c - upgrade.cost);
    setLabBenches((benches) =>
      benches.map((b) =>
        b.id === benchId
          ? {
              ...b,
              activeUpgradeId: upgradeId,
              remainingSeconds: upgrade.durationSeconds,
              totalSeconds: upgrade.durationSeconds,
            }
          : b
      )
    );
  };

  const unlockLabBench = (benchId: number) => {
    const bench = labBenches.find((b) => b.id === benchId);
    if (!bench || bench.unlocked || gems < bench.unlockCostGems) return;

    setGems((g) => g - bench.unlockCostGems);
    setLabBenches((benches) =>
      benches.map((b) => (b.id === benchId ? { ...b, unlocked: true } : b))
    );
  };

  // Chests & Loot
  const claimDailyGift = () => {
    if (dailyGiftClaimed) return;
    setDailyGiftClaimed(true);
    setCash((c) => c + 2500);
    setGems((g) => g + 15);
    setBronzeKeys((k) => k + 2);
    setPurpleKeys((k) => k + 1);
  };

  const openChest = (type: 'basic' | 'premium') => {
    if (type === 'basic') {
      if (bronzeKeys <= 0 && cash < 2500) return;
      if (bronzeKeys > 0) setBronzeKeys((k) => k - 1);
      else setCash((c) => c - 2500);

      // Drops: cash + gems + chance of crew
      setCash((c) => c + 1500);
      setGems((g) => g + 3);
      const unhired = CREW_MEMBERS.filter((c) => !hiredCrewIds.includes(c.id));
      if (unhired.length > 0 && Math.random() > 0.4) {
        setHiredCrewIds((ids) => [...ids, unhired[0].id]);
      }
    } else {
      if (purpleKeys <= 0 && gems < 20) return;
      if (purpleKeys > 0) setPurpleKeys((k) => k - 1);
      else setGems((g) => g - 20);

      // Premium crate: epic/legendary crew
      setCash((c) => c + 10000);
      setGems((g) => g + 10);
      const unhired = CREW_MEMBERS.filter((c) => !hiredCrewIds.includes(c.id));
      if (unhired.length > 0) {
        setHiredCrewIds((ids) => [...ids, unhired[0].id]);
      }
    }
  };

  // Launch marketing campaign
  const launchCampaign = (campaignId: string) => {
    const camp = activeCampaigns.find((c) => c.id === campaignId);
    if (!camp || camp.active || cash < camp.cost) return;

    setCash((c) => c - camp.cost);
    setActiveCampaigns((campaigns) =>
      campaigns.map((c) => (c.id === campaignId ? { ...c, active: true } : c))
    );
  };

  return {
    // Phase & Identity
    phase,
    mode,
    product,
    selectedStack,
    availableStacks,
    activeTab,
    rigSubTab,
    setActiveTab,
    setRigSubTab,
    startGame,

    // Progression & Wallet
    cash,
    gems,
    bronzeKeys,
    purpleKeys,
    goldKeys,
    dailyGiftClaimed,
    claimDailyGift,
    openChest,
    playerLevel,
    rating,
    totalRequestsServed,

    // Live Metrics & Telemetry
    incomingReqPerSec,
    effectiveReqPerSec,
    baseCapacity,
    currentTempC,
    isThrottling,
    currentBottleneck,
    revenuePerReq,
    burnPerSec,
    netIncomePerSec,
    packets,
    activeChaos,
    chaosTimer,

    // Phase 1: Build
    buildModules,
    installedBuildIds,
    terminalLogs,
    installBuildModule,

    // Phase 2: Deploy
    deploySteps,
    deployStepIndex,
    advanceDeployStep,

    // Phase 3: Launch Marketing
    finishLaunchMarketing,

    // Phase 4: Hardware Deck
    infraLevels,
    upgradeInfra,

    // Tap-To-Rev Interactive Booster
    revBonusRps,
    floatingCashList,
    revEngine,

    // Global Regions Map
    regions,
    unlockRegion,

    // Dyno Tuning
    tuningRatio,
    setTuningRatio,
    tuningAccuracy,
    dynoScore,
    autoTuneActive,
    triggerAutoTune,

    // Benchmark / Race
    rivals,
    currentRivalIndex,
    raceTries,
    isRacing,
    raceProgress,
    runBenchmark,

    // Clients Roadmap
    clientJobs,
    currentJobId,
    currentJobProgress,

    // Research Lab
    labBenches,
    unlockedLabIds,
    startResearch,
    unlockLabBench,

    // Crew
    hiredCrew,
    hiredCrewIds,

    // Marketing Campaigns
    activeCampaigns,
    launchCampaign,
  };
}
