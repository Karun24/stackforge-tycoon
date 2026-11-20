import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BACKEND_STACKS,
  DATABASE_STACKS,
  PRODUCTS,
} from '../data/gameData';
import { PlayerMode, ProductId } from '../types/game';

interface Props {
  onStart: (
    mode: PlayerMode,
    productId: ProductId,
    backendId: string,
    databaseId: string
  ) => void;
}

export const OnboardingModal: React.FC<Props> = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = useState<PlayerMode>('explorer');
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('ecommerce');
  const [selectedBackend, setSelectedBackend] = useState<string>('golang');
  const [selectedDb, setSelectedDb] = useState<string>('postgres');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.badge}>STACKFORGE // ARCHITECT & BUILD</Text>
      <Text style={styles.title}>Product & System Design Tycoon</Text>
      <Text style={styles.subtitle}>
        Write code, containerize with Docker, deploy to public cloud, and scale your servers to millions of requests without melting your hardware.
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
          <Text style={styles.cardTitle}>Explorer Mode</Text>
          <Text style={styles.cardDesc}>
            Plain-English guides explaining why you need Docker, Redis, or Load Balancers.
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
          <Text style={styles.cardTitle}>Developer Mode</Text>
          <Text style={styles.cardDesc}>
            Real engineering specs: HPA, P99 latency, L7 reverse proxies, and zero hand-holding.
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Product Selection */}
      <Text style={styles.sectionLabel}>2. CHOOSE YOUR TECH PRODUCT</Text>
      <View style={styles.productGrid}>
        {PRODUCTS.map((p) => {
          const active = selectedProduct === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.productCard,
                active && { borderColor: p.color, backgroundColor: '#0B172B' },
              ]}
              onPress={() => setSelectedProduct(p.id)}
            >
              <Text style={styles.productIcon}>{p.icon}</Text>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productTag}>{p.tagline}</Text>
              <Text style={[styles.recStack, { color: p.color }]}>
                REC: {p.recommendedStack}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Tech Stack Architecture */}
      <Text style={styles.sectionLabel}>3. CORE BACKEND ARCHITECTURE</Text>
      <View style={styles.stackColumn}>
        {BACKEND_STACKS.map((b) => {
          const active = selectedBackend === b.id;
          return (
            <TouchableOpacity
              key={b.id}
              style={[styles.stackCard, active && styles.stackCardActive]}
              onPress={() => setSelectedBackend(b.id)}
            >
              <View style={styles.stackTop}>
                <Text style={styles.stackName}>{b.name}</Text>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{b.tag}</Text>
                </View>
              </View>
              <Text style={styles.stackDesc}>{b.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>4. PRIMARY PERSISTENCE DATABASE</Text>
      <View style={styles.stackColumn}>
        {DATABASE_STACKS.map((d) => {
          const active = selectedDb === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              style={[styles.stackCard, active && styles.stackCardActive]}
              onPress={() => setSelectedDb(d.id)}
            >
              <View style={styles.stackTop}>
                <Text style={styles.stackName}>{d.name}</Text>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{d.tag}</Text>
                </View>
              </View>
              <Text style={styles.stackDesc}>{d.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Initialize Button */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() =>
          onStart(selectedMode, selectedProduct, selectedBackend, selectedDb)
        }
      >
        <Text style={styles.startBtnText}>INITIALIZE DEV WORKSPACE →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#070B14',
  },
  badge: {
    color: '#22D3EE',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },
  cardActive: {
    borderColor: '#22D3EE',
    backgroundColor: '#0A1C2E',
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  productCard: {
    width: '48.5%',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },
  productIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  productName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
  },
  productTag: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  recStack: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 6,
  },
  stackColumn: {
    gap: 8,
    marginBottom: 16,
  },
  stackCard: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: 12,
  },
  stackCardActive: {
    borderColor: '#22D3EE',
    backgroundColor: '#0B1D2F',
  },
  stackTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stackName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '900',
  },
  tagPill: {
    backgroundColor: '#083344',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: '#22D3EE',
    fontSize: 8,
    fontWeight: '900',
  },
  stackDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  startBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  startBtnText: {
    color: '#042F2E',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
