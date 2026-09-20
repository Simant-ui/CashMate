import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Plus, HandCoins, BarChart3, ArrowUpRight, ArrowDownLeft, ChevronRight, Receipt, CheckCircle } from 'lucide-react-native';

export const HomeView = () => {
  const {
    currentUser,
    expenses,
    balances,
    optimizedSettlements,
    setIsAddExpenseOpen,
    setActiveTab,
    setSelectedSettleTarget,
    setIsSettleModalOpen,
    setSelectedExpense,
    isLoading,
    colors
  } = useApp();

  const userBalance = balances[currentUser.id] || { totalPaid: 0, totalShare: 0, netBalance: 0 };
  const totalRoomExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const mySettlements = optimizedSettlements.filter(
    s => s.fromId === currentUser.id || s.toId === currentUser.id
  );
  const otherSettlements = optimizedSettlements.filter(
    s => s.fromId !== currentUser.id && s.toId !== currentUser.id
  );
  const displaySettlements = [...mySettlements, ...otherSettlements].slice(0, 3);

  const getBalanceCardDetails = () => {
    const net = userBalance.netBalance;
    if (net < -0.01) {
      return {
        label: 'You Owe',
        amount: `Rs. ${Math.abs(Math.round(net)).toLocaleString()}`,
        bgColor: '#1e293b',
        subtext: 'Pay your room share before month end',
        icon: <ArrowUpRight color={colors.negative} size={24} />
      };
    } else if (net > 0.01) {
      return {
        label: 'You Get',
        amount: `Rs. ${Math.round(net).toLocaleString()}`,
        bgColor: '#1e293b',
        subtext: 'Your roommates owe you money',
        icon: <ArrowDownLeft color={colors.positive} size={24} />
      };
    } else {
      return {
        label: 'Settled',
        amount: 'Rs. 0',
        bgColor: '#1e293b',
        subtext: 'All your room balances are clear!',
        icon: <CheckCircle color={colors.positive} size={24} />
      };
    }
  };

  const balanceCard = getBalanceCardDetails();

  if (isLoading) {
    return (
      <View style={{ padding: 20, gap: 16 }}>
        <SkeletonLoader type="balance" />
        <SkeletonLoader type="summaryGrid" />
        <SkeletonLoader type="list" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting Header */}
      <View>
        <Text style={[styles.greeting, { color: colors.textMain }]}>
          Good Morning, {currentUser.name} 👋
        </Text>
        <Text style={[styles.subGreeting, { color: colors.textMuted }]}>
          Here is your Kathmandu room expense summary.
        </Text>
      </View>

      {/* Hero Balance Card */}
      <View style={[styles.heroCard, { backgroundColor: balanceCard.bgColor }]}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroBadgeText}>YOUR NET POSITION</Text>
            <Text style={styles.heroAmount}>{balanceCard.amount}</Text>
            <Text style={styles.heroSubtext}>{balanceCard.subtext}</Text>
          </View>
          <View style={styles.heroIconBox}>
            {balanceCard.icon}
          </View>
        </View>

        <View style={styles.heroBtnRow}>
          <TouchableOpacity
            style={[styles.heroBtnPrimary, { backgroundColor: colors.primary }]}
            onPress={() => setIsAddExpenseOpen(true)}
          >
            <Plus size={16} color="#ffffff" />
            <Text style={styles.heroBtnTextWhite}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroBtnSecondary}
            onPress={() => setActiveTab('settlements')}
          >
            <HandCoins size={16} color="#ffffff" />
            <Text style={styles.heroBtnTextWhite}>Settle Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4 Summary Cards Grid */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>TOTAL EXPENSES</Text>
          <Text style={[styles.summaryVal, { color: colors.textMain }]}>
            Rs. {totalRoomExpenses.toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>5 active members</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>YOUR PAID</Text>
          <Text style={[styles.summaryVal, { color: colors.positive }]}>
            Rs. {userBalance.totalPaid.toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>Total cash out</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>YOUR SHARE</Text>
          <Text style={[styles.summaryVal, { color: colors.secondary }]}>
            Rs. {userBalance.totalShare.toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>Your equal share</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>YOUR BALANCE</Text>
          <Text
            style={[
              styles.summaryVal,
              { color: userBalance.netBalance >= 0 ? colors.positive : colors.negative }
            ]}
          >
            {userBalance.netBalance >= 0 ? '+' : ''}Rs. {Math.round(userBalance.netBalance).toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>Net difference</Text>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={styles.quickActionItem} onPress={() => setIsAddExpenseOpen(true)}>
          <View style={[styles.quickIconCircle, { backgroundColor: colors.primaryLight }]}>
            <Plus size={22} color={colors.primary} />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('settlements')}>
          <View style={[styles.quickIconCircle, { backgroundColor: colors.secondaryLight }]}>
            <HandCoins size={22} color={colors.secondary} />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>Settle Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('reports')}>
          <View style={[styles.quickIconCircle, { backgroundColor: colors.warningLight }]}>
            <BarChart3 size={22} color={colors.warning} />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('expenses')}>
          <View style={[styles.quickIconCircle, { backgroundColor: colors.bgSubtle }]}>
            <Receipt size={22} color={colors.textMain} />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>All Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Settlement Preview */}
      {displaySettlements.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Settlement Suggestions</Text>
            <TouchableOpacity onPress={() => setActiveTab('settlements')} style={styles.viewAllBtn}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {displaySettlements.map(item => (
              <View key={item.id} style={[styles.settleRow, { backgroundColor: colors.bgSubtle }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.personName, { color: colors.textMain }]}>{item.fromName}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>→</Text>
                  <Text style={[styles.personName, { color: colors.textMain }]}>{item.toName}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={[styles.settleAmt, { color: colors.textMain }]}>
                    Rs. {item.amount.toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={[styles.miniSettleBtn, { borderColor: colors.primary }]}
                    onPress={() => {
                      setSelectedSettleTarget(item);
                      setIsSettleModalOpen(true);
                    }}
                  >
                    <Text style={[styles.miniSettleText, { color: colors.primary }]}>Settle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recent Expenses List */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => setActiveTab('expenses')} style={styles.viewAllBtn}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10 }}>
          {expenses.slice(0, 4).map(exp => (
            <TouchableOpacity
              key={exp.id}
              style={[styles.expCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              onPress={() => setSelectedExpense(exp)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[styles.catIconBox, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={{ fontSize: 22 }}>{exp.categoryIcon}</Text>
                </View>

                <View>
                  <Text style={[styles.expTitle, { color: colors.textMain }]}>{exp.title}</Text>
                  <Text style={[styles.expSub, { color: colors.textMuted }]}>
                    Paid by {exp.paidBy === 'user-ram' ? 'Ram' : exp.paidBy === 'user-hari' ? 'Hari' : exp.paidBy === 'user-shyam' ? 'Shyam' : exp.paidBy === 'user-sita' ? 'Sita' : 'Gita'} • {exp.date}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.expAmt, { color: colors.textMain }]}>
                  Rs. {exp.amount.toLocaleString()}
                </Text>
                <Text style={[styles.expShare, { color: colors.textMuted }]}>
                  Rs. {(exp.shares?.[currentUser.id] || 0).toLocaleString()} share
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800'
  },
  subGreeting: {
    fontSize: 13,
    marginTop: 2
  },
  heroCard: {
    borderRadius: 24,
    padding: 24
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#a7f3d0'
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginVertical: 4
  },
  heroSubtext: {
    fontSize: 12,
    color: '#cbd5e1'
  },
  heroIconBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 20
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 16
  },
  heroBtnPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  heroBtnSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  heroBtnTextWhite: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  summaryCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700'
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4
  },
  summarySub: {
    fontSize: 10,
    marginTop: 2
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 6
  },
  quickIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600'
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700'
  },
  settleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14
  },
  personName: {
    fontSize: 13,
    fontWeight: '700'
  },
  settleAmt: {
    fontSize: 14,
    fontWeight: '800'
  },
  miniSettleBtn: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  miniSettleText: {
    fontSize: 11,
    fontWeight: '700'
  },
  expCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  catIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  expSub: {
    fontSize: 11,
    marginTop: 2
  },
  expAmt: {
    fontSize: 15,
    fontWeight: '800'
  },
  expShare: {
    fontSize: 10
  }
});
