import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRODUCTS } from '../data/gameData';
import { PlayerMode, ProductId } from '../types/game';

interface Props {
  onStart: (mode: PlayerMode, productId: ProductId) => void;
}

export const OnboardingModal: React.FC<Props> = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = useState<PlayerMode>('explorer');
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('ecommerce');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.badge}>STACKFORGE // SYSTEM DESIGN TYCOON</Text>
      <Text style={styles.title}>Build, Ship & Scale Your Tech Empire</Text>
      <Text style={styles.subtitle}>
        Write code, pack it in Docker, launch to the public, and keep your servers alive as millions of users flood in.
      </Text>

      <Text style={styles.sectionLabel}>1. CHOOSE YOUR EXPERIENCE MODE</Text>
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[
            styles.modeCard,
            selectedMode === 'explorer' && styles.modeCardActive,
          ]}
          onPress={() => setSelectedMode('explorer')}
        >
          <Text style={styles.modeIcon}>🧭</Text>
          <Text style={styles.modeTitle}>Explorer</Text>
          <Text style={styles.modeDesc}>
            Plain-English guides & tooltips. Learn how apps are built and scaled.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeCard,
            selectedMode === 'developer' && styles.modeCardActive,
          ]}
          onPress={() => setSelectedMode('developer')}
        >
          <Text style={styles.modeIcon}>💻</Text>
          <Text style={styles.modeTitle}>Developer</Text>
          <Text style={styles.modeDesc}>
            Real engineering specs, architecture terms, and zero hand-holding.
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>2. PICK THE PRODUCT YOU WANT TO BUILD</Text>
      <View style={styles.productGrid}>
        {PRODUCTS.map((p) => {
          const active = selectedProduct === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.productCard,
                active && { borderColor: p.color, backgroundColor: '#111C30' },
              ]}
              onPress={() => setSelectedProduct(p.id)}
            >
              <Text style={styles.productIcon}>{p.icon}</Text>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productTag}>{p.tagline}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => onStart(selectedMode, selectedProduct)}
      >
        <Text style={styles.startBtnText}>INITIALIZE WORKSPACE →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#070B14',
  },
  badge: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
  },
  modeCardActive: {
    borderColor: '#22D3EE',
    backgroundColor: '#0D2137',
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  modeTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  modeDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
  },
  productIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  productName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  productTag: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  startBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#042F2E',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
