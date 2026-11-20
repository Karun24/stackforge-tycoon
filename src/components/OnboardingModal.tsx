import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PRODUCTS,
  TECH_STACKS_BY_PRODUCT,
} from '../data/gameData';
import { PlayerMode, ProductId } from '../types/game';

interface Props {
  onStart: (
    mode: PlayerMode,
    productId: ProductId,
    stackId: string
  ) => void;
}

export const OnboardingModal: React.FC<Props> = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = useState<PlayerMode>('explorer');
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('ecommerce');
  const [selectedStackId, setSelectedStackId] = useState<string>('go_postgres');

  const availableStacks = TECH_STACKS_BY_PRODUCT[selectedProduct] || [];

  const handleSelectProduct = (prodId: ProductId) => {
    setSelectedProduct(prodId);
    const newStacks = TECH_STACKS_BY_PRODUCT[prodId] || [];
    if (newStacks.length > 0) {
      setSelectedStackId(newStacks[0].id);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.badge}>STACKFORGE // PRODUCT & HARDWARE TYCOON</Text>
      <Text style={styles.title}>System Design & Architecture Tycoon</Text>
      <Text style={styles.subtitle}>
        Build your dream app or 3D game, compile milestones in the terminal, pass app store reviews, launch viral marketing campaigns, and scale global server racks!
      </Text>

      {/* 1. Mode Selection */}
      <Text style={styles.sectionLabel}>1. SELECT YOUR PLAYSTYLE</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.modeCard,
            selectedMode === 'explorer' && styles.cardActive,
          ]}
          onPress={() => setSelectedMode('explorer')}
        >
          <Text style={styles.modeIcon}>🧭</Text>
          <Text style={styles.cardTitle}>Explorer</Text>
          <Text style={styles.cardRole}>NORMAL PERSON</Text>
          <Text style={styles.cardDesc}>
            Plain-English guides explaining what Docker, Redis, and GPU clusters actually do.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeCard,
            selectedMode === 'developer' && styles.cardActive,
          ]}
          onPress={() => setSelectedMode('developer')}
        >
          <Text style={styles.modeIcon}>💻</Text>
          <Text style={styles.cardTitle}>Architect</Text>
          <Text style={styles.cardRole}>SOFTWARE ENGINEER</Text>
          <Text style={styles.cardDesc}>
            Deep technical specs: OpenAPI schemas, eBPF sockets, FP8 quantization, and PDU kW load.
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Product Archetype Selection */}
      <Text style={styles.sectionLabel}>2. CHOOSE YOUR APPLICATION OR GAME</Text>
      <View style={styles.productGrid}>
        {PRODUCTS.map((prod) => {
          const isSelected = selectedProduct === prod.id;
          return (
            <TouchableOpacity
              key={prod.id}
              style={[
                styles.productCard,
                isSelected && { borderColor: prod.color, backgroundColor: '#0F1A30' },
              ]}
              onPress={() => handleSelectProduct(prod.id)}
            >
              <View style={styles.productHeader}>
                <Text style={styles.productIcon}>{prod.icon}</Text>
                <View style={styles.productRevenueBadge}>
                  <Text style={styles.productRevenueText}>
                    ${prod.revenuePerReq}/req
                  </Text>
                </View>
              </View>
              <Text style={styles.productName}>{prod.name}</Text>
              <Text style={styles.productTagline}>{prod.tagline}</Text>
              <Text style={styles.productStackNote}>
                Stack: {prod.recommendedStack}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Tech Stack Tailored to Chosen Product */}
      <Text style={styles.sectionLabel}>
        3. SELECT ARCHITECTURE STACK FOR{' '}
        {PRODUCTS.find((p) => p.id === selectedProduct)?.name.toUpperCase()}
      </Text>
      <View style={styles.stackColumn}>
        {availableStacks.map((stack) => {
          const isSelected = selectedStackId === stack.id;
          return (
            <TouchableOpacity
              key={stack.id}
              style={[
                styles.stackCard,
                isSelected && styles.stackCardActive,
              ]}
              onPress={() => setSelectedStackId(stack.id)}
            >
              <View style={styles.stackHeader}>
                <Text style={styles.stackName}>{stack.name}</Text>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{stack.tag}</Text>
                </View>
              </View>
              <Text style={styles.stackDesc}>{stack.desc}</Text>
              <View style={styles.bonusRow}>
                <Text style={styles.bonusText}>
                  +{stack.capacityBonus} RPS BASE CAPACITY
                </Text>
                <Text style={styles.bonusText}>
                  +{(stack.efficiencyBonus * 100).toFixed(0)}% REVENUE BONUS
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Launch Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => onStart(selectedMode, selectedProduct, selectedStackId)}
      >
        <Text style={styles.startButtonText}>
          INITIALIZE WORKSPACE & START CODING 🚀
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#070B14',
    paddingBottom: 40,
  },
  badge: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 12,
  },
  cardActive: {
    borderColor: '#38BDF8',
    backgroundColor: '#0D1E3A',
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  cardRole: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  productGrid: {
    gap: 10,
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productIcon: {
    fontSize: 22,
  },
  productRevenueBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  productRevenueText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  productName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  productTagline: {
    color: '#94A3B8',
    fontSize: 11,
    marginVertical: 2,
  },
  productStackNote: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  stackColumn: {
    gap: 10,
    marginBottom: 20,
  },
  stackCard: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 12,
  },
  stackCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#09211C',
  },
  stackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stackName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  tagPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
  stackDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  bonusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bonusText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  startButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#070B14',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
