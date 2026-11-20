export type PlayerMode = 'explorer' | 'developer';

export type GamePhase = 'onboarding' | 'build' | 'live';

export type ProductId = 'ecommerce' | 'social' | 'ai_saas' | 'mobile_game';

export type NavigationTab = 'rig' | 'clients' | 'cards' | 'lab' | 'shop';

export type RigSubTab = 'compute' | 'thermal' | 'ingress' | 'interconnect';

export interface ProductTemplate {
  id: ProductId;
  name: string;
  tagline: string;
  icon: string;
  revenuePerReq: number;
  baseTraffic: number;
  color: string;
  recommendedStack: string;
}

export interface TechStackOption {
  id: string;
  category: 'backend' | 'database';
  name: string;
  tag: string;
  desc: string;
  capacityBonus: number;
  efficiencyBonus: number;
}

export interface BuildModule {
  id: string;
  name: string;
  shortName: string;
  category: 'ARCH' | 'CORE' | 'DATA' | 'CONTAINER' | 'DEVOPS';
  cost: number;
  progressBoost: number;
  explorerDesc: string;
  devDesc: string;
  terminalLog: string;
  requiredForLaunch: boolean;
}

export interface InfraNode {
  id: string;
  name: string;
  shortName: string;
  subTab: RigSubTab;
  baseCost: number;
  costMultiplier: number;
  burnPerSec: number;
  capacityPerLevel: number;
  heatPerLevel: number;
  powerKwPerLevel: number;
  unit: string;
  explorerDesc: string;
  devDesc: string;
  solvesBottleneck: string;
}

export interface ClientJob {
  id: string;
  name: string;
  stepNumber: number;
  totalSteps: number;
  category: string;
  description: string;
  reqPerSecMultiplier: number;
  targetRequests: number;
  rewardCash: number;
  rewardGems: number;
  estimatedSeconds: number;
  locked: boolean;
  completed: boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  category: 'COMPUTE' | 'COOLING' | 'INGRESS' | 'FINOPS';
  cost: number;
  level: number;
  bonusText: string;
  effectType: 'capacity' | 'revenue' | 'burn_reduction' | 'cooling' | 'intake';
  effectValue: number;
  avatarColor: string;
  avatarIcon: string;
}

export interface LabUpgrade {
  id: string;
  title: string;
  category: 'EFFICIENCY' | 'NETWORK' | 'DATABASE' | 'KERNEL';
  cost: number;
  bonusText: string;
  explorerDesc: string;
  devDesc: string;
  unlocked: boolean;
}

export interface ChaosEvent {
  id: string;
  title: string;
  description: string;
  trafficMultiplier: number;
  durationSec: number;
  requiredInfraId?: string;
}

export interface Packet {
  id: number;
  progress: number; // 0 to 1
  lane: number; // 0, 1, 2, 3
  type: 'static' | 'read' | 'write' | 'dropped';
}
