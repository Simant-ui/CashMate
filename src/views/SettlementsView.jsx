import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { ArrowRight, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react-native';

export const SettlementsView = () => {
  const {
    balances,
    currentUser,
    members,
    optimizedSettlements,
    settlements,
    setSelectedSettleTarget,
    setIsSettleModalOpen,
    deleteSettlement,
    language,
    t,
    colors
  } = useApp();

  const [historyFilter, setHistoryFilter] = useState('all');

  const userNet = balances[currentUser.id]?.netBalance || 0;

  let totalRoomOwe = 0;
  let totalRoomGet = 0;
  Object.values(balances).forEach(b => {
    if (b.netBalance < 0) totalRoomOwe += Math.abs(b.netBalance);
    if (b.netBalance > 0) totalRoomGet += b.netBalance;
  });

  const filteredHistory = settlements.filter(stl => {
    if (historyFilter === 'settled') return stl.status === 'Settled';
    if (historyFilter === 'pending') return stl.status === 'Pending';
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Title and + Record Payment Button */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={[styles.title, { color: colors.textMain }]}>{t('settlementHubTitle')}</Text>
          <Text style={[styles.subTitle, { color: colors.textMuted }]}>
            {t('settlementHubSub')}
          </Text>
        </View>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} color="#ffffff" />}
          onPress={() => {
            setSelectedSettleTarget(null);
            setIsSettleModalOpen(true);
          }}
        >
          {t('recordPaymentBtn')}
        </Button>
      </View>

      {/* Balance Summary Cards */}
      <View style={styles.gridRow}>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{t('totalOwedCard')}</Text>
          <Text style={[styles.cardVal, { color: colors.negative }]}>
            Rs. {totalRoomOwe.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{t('receivableCard')}</Text>
          <Text style={[styles.cardVal, { color: colors.positive }]}>
            Rs. {totalRoomGet.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{t('yourNetCard')}</Text>
          <Text
            style={[
              styles.cardVal,
              { color: userNet >= 0 ? colors.positive : colors.negative }
            ]}
          >
            {userNet >= 0 ? '+' : ''}Rs. {Math.round(userNet).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Smart Optimization Banner */}
      <View style={[styles.optBanner, { backgroundColor: colors.secondaryLight, borderColor: colors.border }]}>
        <View style={[styles.sparkleCircle, { backgroundColor: colors.primary }]}>
          <Sparkles size={16} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.optTitle, { color: colors.textMain }]}>
            {t('smartDebtActiveTitle')}
          </Text>
          <Text style={[styles.optDesc, { color: colors.textMuted }]}>
            {t('smartDebtActiveDesc')}
          </Text>
        </View>
      </View>

      {/* WHO OWES WHOM Section */}
      <View>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
          {t('whoOwesWhomTitle', { count: optimizedSettlements.length })}
        </Text>

        {optimizedSettlements.length > 0 ? (
          <View style={{ gap: 10 }}>
            {optimizedSettlements.map(item => {
              const fromMem = members.find(m => m.id === item.fromId);
              const toMem = members.find(m => m.id === item.toId);
              const isMyDebt = item.fromId === currentUser.id;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.optRow,
                    {
                      backgroundColor: colors.bgCard,
                      borderColor: isMyDebt ? colors.negative : colors.border
                    }
                  ]}
                >
                  {/* Left Side: Payer -> Receiver */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 }}>
                      <Text style={{ fontSize: 15 }}>{fromMem?.avatar || '👤'}</Text>
                      <Text style={[styles.nameText, { color: colors.textMain }]} numberOfLines={1}>
                        {fromMem?.name || item.fromName}
                      </Text>
                    </View>

                    <ArrowRight size={13} color={colors.textMuted} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 }}>
                      <Text style={{ fontSize: 15 }}>{toMem?.avatar || '👤'}</Text>
                      <Text style={[styles.nameText, { color: colors.textMain }]} numberOfLines={1}>
                        {toMem?.name || item.toName}
                      </Text>
                    </View>
                  </View>

                  {/* Right Side: Amount + Settle Button */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={[styles.amtText, { color: colors.textMain }]}>
                      Rs. {item.amount.toLocaleString()}
                    </Text>

                    <TouchableOpacity
                      style={[styles.settleBtn, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        setSelectedSettleTarget(item);
                        setIsSettleModalOpen(true);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.settleBtnText}>{t('settleBtnText')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.bgSurface }]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🎉</Text>
            <Text style={[styles.emptyTitle, { color: colors.textMain }]}>{t('everyoneBalanced')}</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>{t('noDebtsPending')}</Text>
          </View>
        )}
      </View>

      {/* SETTLEMENT HISTORY Section */}
      <View>
        <View style={styles.historyHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textMain, marginBottom: 0 }]}>
            {t('settlementHistoryTitle')}
          </Text>

          <View style={{ flexDirection: 'row', gap: 4 }}>
            {['all', 'settled', 'pending'].map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setHistoryFilter(f)}
                style={[
                  styles.filterPill,
                  { backgroundColor: historyFilter === f ? colors.primary : colors.bgSubtle }
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: historyFilter === f ? '#ffffff' : colors.textMuted }
                  ]}
                >
                  {f === 'all' ? t('historyFilterAll') : f === 'settled' ? t('historyFilterSettled') : t('historyFilterPending')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredHistory.length > 0 ? (
          <View style={{ gap: 10 }}>
            {filteredHistory.map(stl => {
              const fromMem = members.find(m => m.id === stl.fromId);
              const toMem = members.find(m => m.id === stl.toId);

              return (
                <View
                  key={stl.id}
                  style={[styles.historyRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.historyMainText, { color: colors.textMain }]} numberOfLines={1}>
                      {fromMem?.name} {language === 'ne' ? '➔' : 'paid'} {toMem?.name}
                    </Text>
                    <Text style={[styles.historySubText, { color: colors.textMuted }]}>
                      {stl.date} • {stl.method} {stl.note ? `• ${stl.note}` : ''}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.historyAmt, { color: colors.textMain }]}>
                        Rs. {stl.amount.toLocaleString()}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: colors.positiveLight }]}>
                        <Text style={[styles.statusText, { color: colors.positive }]}>{stl.status}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.deleteStlBtn, { backgroundColor: colors.bgSubtle }]}
                      onPress={() => deleteSettlement(stl.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={13} color={colors.negative} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.emptyHistoryText, { color: colors.textMuted }]}>
            {t('noPastSettlements')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    gap: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  subTitle: {
    fontSize: 12,
    marginTop: 2
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center'
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  cardVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4
  },
  optBanner: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  sparkleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  optDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10
  },
  optRow: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700'
  },
  amtText: {
    fontSize: 14,
    fontWeight: '800'
  },
  settleBtn: {
    height: 34,
    minWidth: 70,
    paddingHorizontal: 12,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settleBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  emptyBox: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  filterPill: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  historyRow: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  historyMainText: {
    fontSize: 13,
    fontWeight: '700'
  },
  historySubText: {
    fontSize: 11,
    marginTop: 2
  },
  historyAmt: {
    fontSize: 14,
    fontWeight: '800'
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginTop: 2
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800'
  },
  deleteStlBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyHistoryText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 12
  }
});
