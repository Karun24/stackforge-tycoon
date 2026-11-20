import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MarketingCampaign, ProductTemplate } from '../types/game';

interface Props {
  product: ProductTemplate;
  campaigns: MarketingCampaign[];
  cash: number;
  onLaunchCampaign: (campaignId: string) => void;
  onFinishLaunchMarketing?: () => void;
  isInitialLaunchMode?: boolean;
}

export const MarketingScreen: React.FC<Props> = ({
  product,
  campaigns,
  cash,
  onLaunchCampaign,
  onFinishLaunchMarketing,
  isInitialLaunchMode = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>USER ACQUISITION & GROWTH</Text>
        <Text style={styles.title}>MARKETING CAMPAIGNS</Text>
        <Text style={styles.productFocus}>
          FOCUS: {product.marketingFocus.toUpperCase()}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.campaignList}
        showsVerticalScrollIndicator={false}
      >
        {campaigns.map((camp) => {
          const canAfford = cash >= camp.cost;

          return (
            <View
              key={camp.id}
              style={[
                styles.campaignCard,
                camp.active && styles.campaignActive,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Text style={styles.icon}>{camp.icon}</Text>
                </View>

                <View style={styles.headerText}>
                  <Text style={styles.channelBadge}>{camp.channel}</Text>
                  <Text style={styles.campaignName}>{camp.name}</Text>
                </View>

                {camp.active ? (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>
                      ⏱️ {Math.ceil(camp.durationSec)}s
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    disabled={!canAfford}
                    onPress={() => onLaunchCampaign(camp.id)}
                    style={[
                      styles.launchBtn,
                      !canAfford && styles.launchBtnDisabled,
                    ]}
                  >
                    <Text style={styles.launchBtnText}>
                      ${camp.cost.toLocaleString()}
                    </Text>
                    <Text style={styles.launchBtnSub}>START</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.descText}>{camp.desc}</Text>

              {/* Multiplier Badges */}
              <View style={styles.multipliersRow}>
                <View style={styles.multPill}>
                  <Text style={styles.multText}>
                    ⚡ {camp.trafficMultiplier}x INCOMING TRAFFIC
                  </Text>
                </View>
                <View style={styles.multPillViral}>
                  <Text style={styles.viralText}>
                    +{camp.viralBonus}% VIRAL RETENTION
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* If during initial launch phase, button to enter live game */}
      {isInitialLaunchMode && onFinishLaunchMarketing && (
        <View style={styles.finishBar}>
          <TouchableOpacity
            onPress={onFinishLaunchMarketing}
            style={styles.enterLiveBtn}
          >
            <Text style={styles.enterLiveBtnText}>
              ENTER LIVE RIG-01 & OPEN DATA CENTERS 🚀
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '900',
  },
  productFocus: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  campaignList: {
    paddingBottom: 50,
    gap: 10,
  },
  campaignCard: {
    backgroundColor: '#0B1221',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
  },
  campaignActive: {
    borderColor: '#10B981',
    backgroundColor: '#091C1B',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  channelBadge: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  campaignName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  activePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  activePillText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  launchBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  launchBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  launchBtnText: {
    color: '#070B14',
    fontSize: 11,
    fontWeight: '900',
  },
  launchBtnSub: {
    color: '#064E3B',
    fontSize: 8,
    fontWeight: '800',
  },
  descText: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  multipliersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  multPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  multText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },
  multPillViral: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  viralText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
  },
  finishBar: {
    paddingVertical: 10,
  },
  enterLiveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  enterLiveBtnText: {
    color: '#070B14',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
