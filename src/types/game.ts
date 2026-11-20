export type PlayerMode = 'explorer' | 'developer';

export type GamePhase = 'onboarding' | 'build' | 'live';

export type ProductId = 'ecommerce' | 'social' | 'ai_saas' | 'mobile_game';

export type DeckTab = 'build' | 'infra' | 'marketing' | 'crew' | 'learn';

export interface ProductTemplate {
  id: ProductId;
  name: string;
  tagline: string;
  icon: string;
  revenuePerReq: number;
  baseTraffic: number;
  color: string;
}

export interface BuildModule {
  id: string;
  name: string;
  category: 'IDE' | 'Core' | 'Container' | 'Deploy';
  cost: number;
  progressBoost: number;
  explorerDesc: string;
  devDesc: string;
  requiredForLaunch: boolean;
}

export interface InfraNode {
  id: string;
  name: string;
  shortName: string;
  layer: 'edge' | 'compute' | 'data' | 'security';
  baseCost: number;
  costMultiplier: number;
  burnPerSec: number;
  capacityPerLevel: number;
  explorerDesc: string;
  devDesc: string;
  solvesBottleneck: string;
}

export interface MarketingChannel {
  id: string;
  name: string;
  baseCost: number;
  costMultiplier: number;
  reqPerSecBoost: number;
  explorerDesc: string;
  devDesc: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  cost: number;
  bonusText: string;
  effectType: 'revenue' | 'capacity' | 'burn_reduction' | 'rating';
  effectValue: number;
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
  lane: number; // 0, 1, 2
  type: 'static' | 'read' | 'write' | 'dropped';
}
