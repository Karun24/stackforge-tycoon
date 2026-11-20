import { useEffect, useMemo, useState } from 'react';
import {
  BUILD_MODULES,
  CHAOS_EVENTS,
  CREW_MEMBERS,
  INFRA_NODES,
  MARKETING_CHANNELS,
  PRODUCTS,
} from '../data/gameData';
import {
  ChaosEvent,
  GamePhase,
  Packet,
  PlayerMode,
  ProductId,
} from '../types/game';

export function useGameEngine() {
  const [phase, setPhase] = useState<GamePhase>('onboarding');
  const [mode, setMode] = useState<PlayerMode>('explorer');
  const [productId, setProductId] = useState<ProductId>('ecommerce');

  const [cash, setCash] = useState<number>(1500);
  const [rating, setRating] = useState<number>(4.8);
  const [installedBuildIds, setInstalledBuildIds] = useState<string[]>([]);
  const [infraLevels, setInfraLevels] = useState<Record<string, number>>({
    k8s_pods: 1,
  });
  const [marketingLevels, setMarketingLevels] = useState<Record<string, number>>({});
  const [hiredCrewIds, setHiredCrewIds] = useState<string[]>([]);
  const [activeChaos, setActiveChaos] = useState<ChaosEvent | null>(null);
  const [chaosTimer, setChaosTimer] = useState<number>(0);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [totalRequestsServed, setTotalRequestsServed] = useState<number>(0);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0],
    [productId]
  );

  // Build progress (0 to 100)
  const buildProgress = useMemo(() => {
    return installedBuildIds.reduce((sum, id) => {
      const mod = BUILD_MODULES.find((m) => m.id === id);
      return sum + (mod ? mod.progressBoost : 0);
    }, 0);
  }, [installedBuildIds]);

  const canPublish = buildProgress >= 100;

  // Crew multipliers
  const capacityMult =
    1 +
    hiredCrewIds.reduce((sum, id) => {
      const c = CREW_MEMBERS.find((m) => m.id === id);
      return c?.effectType === 'capacity' ? sum + c.effectValue : sum;
    }, 0);

  const revenueMult =
    1 +
    hiredCrewIds.reduce((sum, id) => {
      const c = CREW_MEMBERS.find((m) => m.id === id);
      return c?.effectType === 'revenue' ? sum + c.effectValue : sum;
    }, 0);

  const burnDiscount = hiredCrewIds.reduce((sum, id) => {
    const c = CREW_MEMBERS.find((m) => m.id === id);
    return c?.effectType === 'burn_reduction' ? sum + c.effectValue : sum;
  }, 0);

  // Incoming traffic (REQ/s)
  const baseIncomingReq = useMemo(() => {
    if (phase !== 'live') return 0;
    const marketingBoost = MARKETING_CHANNELS.reduce((sum, ch) => {
      const lvl = marketingLevels[ch.id] || 0;
      return sum + lvl * ch.reqPerSecBoost;
    }, 0);
    return product.baseTraffic + marketingBoost;
  }, [phase, product, marketingLevels]);

  const incomingReqPerSec = Math.round(
    baseIncomingReq * (activeChaos ? activeChaos.trafficMultiplier : 1)
  );

  // Total server capacity (REQ/s)
  const totalCapacity = useMemo(() => {
    const raw = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return sum + lvl * node.capacityPerLevel;
    }, 0);
    return Math.round(raw * capacityMult);
  }, [infraLevels, capacityMult]);

  // Cloud burn rate ($/s)
  const burnPerSec = useMemo(() => {
    if (phase !== 'live') return 0;
    const rawBurn = INFRA_NODES.reduce((sum, node) => {
      const lvl = infraLevels[node.id] || 0;
      return sum + lvl * node.burnPerSec;
    }, 0);
    return +(rawBurn * (1 - Math.min(0.6, burnDiscount))).toFixed(2);
  }, [phase, infraLevels, burnDiscount]);

  const servedReqPerSec = Math.min(incomingReqPerSec, totalCapacity);
  const droppedReqPerSec = Math.max(0, incomingReqPerSec - totalCapacity);
  const loadPercent =
    totalCapacity > 0
      ? Math.min(100, Math.round((incomingReqPerSec / totalCapacity) * 100))
      : 100;

  const grossIncomePerSec = +(
    servedReqPerSec *
    product.revenuePerReq *
    revenueMult
  ).toFixed(2);
  const netIncomePerSec = +(grossIncomePerSec - burnPerSec).toFixed(2);

  // Simulation tick (every 100ms for smooth animations & numbers)
  useEffect(() => {
    if (phase !== 'live') return;

    let packetIdCounter = 1;
    const interval = setInterval(() => {
      // Update cash & requests
      setCash((prev) => Math.max(0, +(prev + netIncomePerSec * 0.1).toFixed(2)));
      setTotalRequestsServed((prev) => prev + Math.round(servedReqPerSec * 0.1));

      // Update star rating based on dropped requests
      setRating((prev) => {
        if (droppedReqPerSec > 0) {
          const penalty = hiredCrewIds.includes('sre_lead') ? 0.008 : 0.02;
          return Math.max(1.0, +(prev - penalty).toFixed(2));
        }
        return Math.min(5.0, +(prev + 0.004).toFixed(2));
      });

      // Animate packets
      setPackets((prev) => {
        const moved = prev
          .map((p) => ({ ...p, progress: p.progress + 0.055 }))
          .filter((p) => p.progress <= 1);

        // Spawn new packets proportional to traffic
        const spawnCount = Math.min(3, Math.max(1, Math.ceil(incomingReqPerSec / 35)));
        for (let i = 0; i < spawnCount; i++) {
          if (moved.length < 24) {
            const isDropped =
              droppedReqPerSec > 0 &&
              Math.random() < droppedReqPerSec / Math.max(1, incomingReqPerSec);
            const types: Packet['type'][] = ['static', 'read', 'write'];
            moved.push({
              id: packetIdCounter++,
              progress: 0,
              lane: Math.floor(Math.random() * 3),
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
  }, [phase, netIncomePerSec, servedReqPerSec, droppedReqPerSec, incomingReqPerSec, hiredCrewIds]);

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
      } else if (incomingReqPerSec > 25 && Math.random() < 0.03) {
        const ev = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
        setActiveChaos(ev);
        setChaosTimer(ev.durationSec);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, activeChaos, incomingReqPerSec]);

  // Actions
  const startGame = (selectedMode: PlayerMode, selectedProduct: ProductId) => {
    setMode(selectedMode);
    setProductId(selectedProduct);
    setPhase('build');
  };

  const installBuildModule = (moduleId: string) => {
    if (installedBuildIds.includes(moduleId)) return;
    const mod = BUILD_MODULES.find((m) => m.id === moduleId);
    if (!mod || cash < mod.cost) return;
    setCash((c) => +(c - mod.cost).toFixed(2));
    setInstalledBuildIds((prev) => [...prev, moduleId]);
  };

  const publishProduct = () => {
    if (!canPublish) return;
    setPhase('live');
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

  const getMarketingCost = (channelId: string) => {
    const ch = MARKETING_CHANNELS.find((m) => m.id === channelId);
    if (!ch) return 0;
    const lvl = marketingLevels[channelId] || 0;
    return Math.round(ch.baseCost * Math.pow(ch.costMultiplier, lvl));
  };

  const upgradeMarketing = (channelId: string) => {
    const cost = getMarketingCost(channelId);
    if (cash < cost) return;
    setCash((c) => +(c - cost).toFixed(2));
    setMarketingLevels((prev) => ({
      ...prev,
      [channelId]: (prev[channelId] || 0) + 1,
    }));
  };

  const hireCrew = (crewId: string) => {
    if (hiredCrewIds.includes(crewId)) return;
    const member = CREW_MEMBERS.find((c) => c.id === crewId);
    if (!member || cash < member.cost) return;
    setCash((c) => +(c - member.cost).toFixed(2));
    setHiredCrewIds((prev) => [...prev, crewId]);
  };

  return {
    phase,
    mode,
    product,
    cash,
    rating,
    buildProgress,
    canPublish,
    installedBuildIds,
    infraLevels,
    marketingLevels,
    hiredCrewIds,
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
    totalRequestsServed,
    startGame,
    installBuildModule,
    publishProduct,
    getInfraCost,
    upgradeInfra,
    getMarketingCost,
    upgradeMarketing,
    hireCrew,
  };
}
