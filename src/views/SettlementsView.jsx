import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react-native';

export const SettlementsView = () => {
  const {
    balances,
    currentUser,
    members,
    optimizedSettlements,
    settlements,
    setSelectedSettleTarget,
    setIsSettleModalOpen,
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
      {/* Header */}
      <View>
        <Text style={[styles.title, { color: colors.textMain }]}>Settlement Hub</Text>
        <Text style={[styles.subTitle, { color: colors.textMuted }]}>
          Optimized debt minimization and payment records
        </Text>
      </View>

      {/* Balance Summary Cards */}
      <View style={styles.gridRow}>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>TOTAL OWED</Text>
          <Text style={[styles.cardVal, { color: colors.negative }]}>
            Rs. {totalRoomOwe.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>RECEIVABLE</Text>
          <Text style={[styles.cardVal, { color: colors.positive }]}>
            Rs. {totalRoomGet.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>YOUR NET</Text>
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
          <Sparkles size={18} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.optTitle, { color: colors.textMain }]}>
            Smart Debt Optimization Active
          </Text>
          <Text style={[styles.optDesc, { color: colors.textMuted }]}>
            CashMate automatically minimized room debt graph into the fewest possible transactions!
          </Text>
        </View>
      </View>

      {/* WHO OWES WHOM Section */}
      <View>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
          Who Owes Whom ({optimizedSettlements.length} Instructions)
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 16 }}>{fromMem?.avatar || '👤'}</Text>
                      <Text style={[styles.nameText, { color: colors.textMain }]}>{fromMem?.name}</Text>
                    </View>

                    <ArrowRight size={14} color={colors.textMuted} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 16 }}>{toMem?.avatar || '👤'}</Text>
                      <Text style={[styles.nameText, { color: colors.textMain }]}>{toMem?.name}</Text>
                    </View>
                  </View>

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
                    >
                      <Text style={styles.settleBtnText}>Settle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={[styles.emptyBox, { backgroundColor: colors.bgSurface }]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🎉</Text>
            <Text style={[styles.emptyTitle, { color: colors.textMain }]}>Everyone is Currently Balanced!</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>No pending room debts to settle.</Text>
          </View>
        )}
      </View>

      {/* SETTLEMENT HISTORY Section */}
      <View>
        <View style={styles.historyHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Settlement History</Text>

          <View style={{ flexDirection: 'row', gap: 4 }}>
            {['all', 'settled', 'pending'].map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setHistoryFilter(f)}
                style={[
                  styles.filterPill,
                  { backgroundColor: historyFilter === f ? colors.primary : colors.bgSubtle }
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: historyFilter === f ? '#ffffff' : colors.textMuted }
                  ]}
                >
                  {f}
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
                  <View>
                    <Text style={[styles.historyMainText, { color: colors.textMain }]}>
                      {fromMem?.name} paid {toMem?.name}
                    </Text>
                    <Text style={[styles.historySubText, { color: colors.textMuted }]}>
                      {stl.date} • {stl.method} {stl.note ? `• ${stl.note}` : ''}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.historyAmt, { color: colors.textMain }]}>
                      Rs. {stl.amount.toLocaleString()}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: colors.positiveLight }]}>
                      <Text style={[styles.statusText, { color: colors.positive }]}>{stl.status}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.emptyHistoryText, { color: colors.textMuted }]}>
            No past settlements recorded under this filter.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '800'
  },
  subTitle: {
    fontSize: 13,
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
    fontSize: 10,
    fontWeight: '700'
  },
  cardVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4
  },
  optBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  sparkleCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  optDesc: {
    fontSize: 11,
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12
  },
  optRow: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700'
  },
  amtText: {
    fontSize: 15,
    fontWeight: '800'
  },
  settleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999
  },
  settleBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  emptyBox: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 16
  },
  emptyTitle: {
    fontSize: 16,
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
    marginBottom: 12
  },
  filterPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 9999
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
    justifyContent: 'space-between',
    alignItems: 'center'
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
    fontSize: 15,
    fontWeight: '800'
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    marginTop: 2
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700'
  },
  emptyHistoryText: {
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 13
  }
});
