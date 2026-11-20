export type PlayerMode = 'explorer' | 'developer';

export type GamePhase = 'onboarding' | 'build' | 'deploy' | 'launch_marketing' | 'live';

export type ProductId = 'ecommerce' | 'mobile_game' | 'social' | 'ai_saas';

export type NavigationTab = 
  | 'rig' 
  | 'regions' 
  | 'dyno' 
  | 'race' 
  | 'clients' 
  | 'lab' 
  | 'cards' 
  | 'marketing' 
  | 'shop';

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
  marketingFocus: string;
}

export interface TechStackOption {
  id: string;
  category: 'backend' | 'database' | 'engine' | 'queue';
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

export interface DeployStep {
  id: string;
  title: string;
  subtitle: string;
  terminalCommand: string;
  done: boolean;
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

export interface GlobalRegion {
  id: string;
  name: string;
  code: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  unlocked: boolean;
  unlockCost: number;
  latencyMs: number;
  rpsCapacity: number;
  incomeBonus: number;
  contractsRequired: number;
  description: string;
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

export interface BenchmarkRival {
  id: string;
  league: string;
  stage: number;
  name: string;
  appType: string;
  score: number;
  quote: string;
  avatarIcon: string;
  rewardCash: number;
  rewardGems: number;
  rewardKey: 'bronze' | 'purple' | 'gold';
  defeated: boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  stars: number;
  category: 'COMPUTE' | 'COOLING' | 'INGRESS' | 'FINOPS';
  cost: number;
  level: number;
  bonusText: string;
  effectType: 'capacity' | 'revenue' | 'burn_reduction' | 'cooling' | 'intake';
  effectValue: number;
  avatarColor: string;
  avatarIcon: string;
}

export interface LabBench {
  id: number;
  name: string;
  unlocked: boolean;
  unlockCostGems: number;
  activeUpgradeId: string | null;
  remainingSeconds: number;
  totalSeconds: number;
}

export interface LabUpgrade {
  id: string;
  title: string;
  category: 'NETWORK' | 'DATABASE' | 'COMPUTE' | 'SECURITY' | 'AI';
  cost: number;
  durationSeconds: number;
  bonusText: string;
  explorerDesc: string;
  devDesc: string;
  unlocked: boolean;
  prerequisiteId?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  cost: number;
  durationSec: number;
  active: boolean;
  trafficMultiplier: number;
  viralBonus: number;
  icon: string;
  desc: string;
}

export interface ChestBox {
  id: 'daily' | 'basic' | 'premium';
  name: string;
  keyType: 'free' | 'bronze' | 'purple';
  guaranteedRarity: string;
  openCount: number;
  color: string;
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
