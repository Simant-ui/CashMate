import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Minus,
  HandCoins,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Receipt,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react-native';
import { getTranslatedCategoryName } from '../i18n/searchHelper';

export const HomeView = () => {
  const {
    currentUser,
    incomes,
    expenses,
    balances,
    optimizedSettlements,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
    setActiveTab,
    setSelectedSettleTarget,
    setIsSettleModalOpen,
    setSelectedExpense,
    totalRoomIncome,
    totalRoomExpenses,
    roomCashBalance,
    totalTransactionsCount,
    getAllTransactions,
    isLoading,
    language,
    t,
    colors
  } = useApp();

  const [dateFilter, setDateFilter] = useState('all'); // 'today' | 'week' | 'month' | 'last_month' | 'all'

  // Filtered transactions for the selected date filter
  const filteredTransactions = getAllTransactions ? getAllTransactions('all', dateFilter) : [];
  
  // Dynamically calculate metrics based on dateFilter
  const filteredIncomeSum = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const filteredExpenseSum = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const displayIncome = dateFilter === 'all' ? totalRoomIncome : filteredIncomeSum;
  const displayExpense = dateFilter === 'all' ? totalRoomExpenses : filteredExpenseSum;
  const displayBalance = displayIncome - displayExpense;
  const displayTxnCount = dateFilter === 'all' ? totalTransactionsCount : filteredTransactions.length;

  const userBalance = balances[currentUser.id] || { totalPaid: 0, totalShare: 0, netBalance: 0 };

  const mySettlements = optimizedSettlements.filter(
    s => s.fromId === currentUser.id || s.toId === currentUser.id
  );
  const otherSettlements = optimizedSettlements.filter(
    s => s.fromId !== currentUser.id && s.toId !== currentUser.id
  );
  const displaySettlements = [...mySettlements, ...otherSettlements].slice(0, 3);

  // Income vs Expense Ratio calculation
  const totalFlow = displayIncome + displayExpense;
  const incomePct = totalFlow > 0 ? Math.round((displayIncome / totalFlow) * 100) : 50;
  const expensePct = totalFlow > 0 ? 100 - incomePct : 50;

  if (isLoading) {
    return (
      <View style={{ padding: 16, gap: 16 }}>
        <SkeletonLoader type="balance" />
        <SkeletonLoader type="summaryGrid" />
        <SkeletonLoader type="list" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Greeting Header */}
      <View>
        <Text style={[styles.greeting, { color: colors.textMain }]}>
          {t('welcomeUser', { name: currentUser.name })}
        </Text>
        <Text style={[styles.subGreeting, { color: colors.textMuted }]}>
          {language === 'ne'
            ? 'यहाँ तपाईंको कोठाको आम्दानी, खर्च र ब्यालेन्स सारांश छ:'
            : 'Here is your unified room cash flow & balance summary:'}
        </Text>
      </View>

      {/* 2. Hero Room Cash Balance Card with + Add Income & - Add Expense Buttons */}
      <View style={[styles.heroCard, { backgroundColor: '#0f172a' }]}>
        <View style={styles.heroTopRow}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Wallet size={14} color="#38bdf8" />
              <Text style={styles.heroBadgeText}>
                {language === 'ne' ? 'कोठा नगद मौज्दात (ROOM CASH)' : 'ROOM CASH BALANCE'}
              </Text>
            </View>

            <Text
              style={[
                styles.heroAmount,
                { color: displayBalance >= 0 ? '#34d399' : '#fb7185' }
              ]}
            >
              {displayBalance >= 0 ? '+' : '−'} Rs. {Math.abs(Math.round(displayBalance)).toLocaleString()}
            </Text>

            <Text style={styles.heroSubtext}>
              {displayBalance >= 0
                ? (language === 'ne' ? '✓ बचत स्थितिमा (Surplus Fund Available)' : '✓ Positive Cash in Room Box')
                : (language === 'ne' ? '⚠️ घाटा स्थिति (Deficit: Expenses exceed income)' : '⚠️ Deficit: Expenses exceed cash')}
            </Text>
          </View>

          <View style={[styles.heroIconBox, { backgroundColor: displayBalance >= 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)' }]}>
            {displayBalance >= 0 ? (
              <TrendingUp color="#34d399" size={24} />
            ) : (
              <TrendingDown color="#fb7185" size={24} />
            )}
          </View>
        </View>

        {/* TWO PROMINENT ACTION BUTTONS: + Add Income & - Add Expense */}
        <View style={styles.heroBtnRow}>
          <TouchableOpacity
            style={[styles.heroBtnIncome, { backgroundColor: '#10b981' }]}
            onPress={() => setIsAddIncomeOpen(true)}
            activeOpacity={0.85}
          >
            <Plus size={16} color="#ffffff" strokeWidth={3} />
            <Text style={styles.heroBtnTextWhite}>
              {language === 'ne' ? '+ आम्दानी' : '+ Add Income'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.heroBtnExpense, { backgroundColor: '#f43f5e' }]}
            onPress={() => setIsAddExpenseOpen(true)}
            activeOpacity={0.85}
          >
            <Minus size={16} color="#ffffff" strokeWidth={3} />
            <Text style={styles.heroBtnTextWhite}>
              {language === 'ne' ? '− खर्च' : '− Add Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Date Range Filter Bar */}
      <View style={styles.dateFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {[
            { id: 'all', labelEn: 'All Time', labelNe: 'सबै समय' },
            { id: 'today', labelEn: 'Today', labelNe: 'आज' },
            { id: 'week', labelEn: 'This Week', labelNe: 'यो हप्ता' },
            { id: 'month', labelEn: 'This Month', labelNe: 'यो महिना' },
            { id: 'last_month', labelEn: 'Last Month', labelNe: 'गत महिना' },
          ].map(f => {
            const isSelected = dateFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setDateFilter(f.id)}
                style={[
                  styles.datePill,
                  isSelected
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.bgCard, borderColor: colors.border }
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.datePillText,
                    { color: isSelected ? '#ffffff' : colors.textMuted, fontWeight: isSelected ? '800' : '600' }
                  ]}
                >
                  {language === 'ne' ? f.labelNe : f.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. FOUR FINANCIAL SUMMARY CARDS */}
      <View style={styles.summaryGrid}>
        {/* CARD 1: TOTAL INCOME */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ArrowDownLeft size={13} color="#10b981" />
            <Text style={[styles.summaryLabel, { color: '#10b981' }]}>
              {language === 'ne' ? 'कुल आम्दानी (+)' : 'TOTAL INCOME (+)'}
            </Text>
          </View>
          <Text style={[styles.summaryVal, { color: '#10b981' }]}>
            + Rs. {displayIncome.toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>
            {language === 'ne' ? 'कोठा कोषमा प्राप्त' : 'Money Received'}
          </Text>
        </View>

        {/* CARD 2: TOTAL EXPENSES */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={13} color="#f43f5e" />
            <Text style={[styles.summaryLabel, { color: '#f43f5e' }]}>
              {language === 'ne' ? 'कुल खर्च (−)' : 'TOTAL EXPENSES (−)'}
            </Text>
          </View>
          <Text style={[styles.summaryVal, { color: '#f43f5e' }]}>
            − Rs. {displayExpense.toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>
            {language === 'ne' ? 'कोठाबाट खर्च' : 'Money Spent'}
          </Text>
        </View>

        {/* CARD 3: REMAINING BALANCE */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
            {language === 'ne' ? 'बाँकी मौज्दात' : 'REMAINING BALANCE'}
          </Text>
          <Text
            style={[
              styles.summaryVal,
              { color: displayBalance >= 0 ? '#10b981' : '#f43f5e' }
            ]}
          >
            {displayBalance >= 0 ? '+' : '−'} Rs. {Math.abs(Math.round(displayBalance)).toLocaleString()}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>
            {displayBalance >= 0
              ? (language === 'ne' ? 'नगद मौज्दात' : 'Cash in hand')
              : (language === 'ne' ? 'ऋणात्मक (घाटा)' : 'Deficit / Shortage')}
          </Text>
        </View>

        {/* CARD 4: TOTAL TRANSACTIONS */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
            {language === 'ne' ? 'कुल कारोबार' : 'TOTAL RECORDS'}
          </Text>
          <Text style={[styles.summaryVal, { color: colors.textMain }]}>
            {displayTxnCount} {language === 'ne' ? 'प्रविष्टि' : 'Entries'}
          </Text>
          <Text style={[styles.summarySub, { color: colors.textMuted }]}>
            {language === 'ne' ? 'आम्दानी र खर्च' : 'Incomes & Expenses'}
          </Text>
        </View>
      </View>

      {/* 5. Financial Overview Progress Comparison */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textMain }}>
            {language === 'ne' ? 'आम्दानी विरुद्ध खर्च अनुपात' : 'Income vs Expense Breakdown'}
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted }}>
            {displayIncome > 0 || displayExpense > 0 ? `${incomePct}% Income / ${expensePct}% Expense` : 'No transactions'}
          </Text>
        </View>

        <View style={styles.flowProgressBar}>
          <View style={[styles.flowIncomeSegment, { width: `${incomePct}%` }]} />
          <View style={[styles.flowExpenseSegment, { width: `${expensePct}%` }]} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {language === 'ne' ? 'आम्दानी:' : 'Income:'} Rs. {displayIncome.toLocaleString()}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f43f5e' }} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {language === 'ne' ? 'खर्च:' : 'Expense:'} Rs. {displayExpense.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* 6. Quick Action Icons Row */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={styles.quickActionItem} onPress={() => setIsAddIncomeOpen(true)} activeOpacity={0.7}>
          <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Plus size={20} color="#10b981" />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>
            {language === 'ne' ? 'आम्दानी' : 'Income'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionItem} onPress={() => setIsAddExpenseOpen(true)} activeOpacity={0.7}>
          <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
            <Minus size={20} color="#f43f5e" />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>
            {language === 'ne' ? 'खर्च' : 'Expense'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('settlements')} activeOpacity={0.7}>
          <View style={[styles.quickIconCircle, { backgroundColor: colors.secondaryLight }]}>
            <HandCoins size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>
            {t('actionSettleUp')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('reports')} activeOpacity={0.7}>
          <View style={[styles.quickIconCircle, { backgroundColor: colors.warningLight }]}>
            <BarChart3 size={20} color={colors.warning} />
          </View>
          <Text style={[styles.quickActionText, { color: colors.textMain }]}>
            {t('actionReports')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 7. Settlement Suggestions Preview (Who Owes Whom) */}
      {displaySettlements.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{t('settlementSuggestions')}</Text>
            <TouchableOpacity onPress={() => setActiveTab('settlements')} style={styles.viewAllBtn} activeOpacity={0.7}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>{t('viewAllExpenses')}</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 8 }}>
            {displaySettlements.map(item => (
              <View key={item.id} style={[styles.settleRow, { backgroundColor: colors.bgSubtle }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: 8 }}>
                  <Text style={[styles.personName, { color: colors.textMain }]} numberOfLines={1}>
                    {item.fromName.split(' ')[0]}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>→</Text>
                  <Text style={[styles.personName, { color: colors.textMain }]} numberOfLines={1}>
                    {item.toName.split(' ')[0]}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.settleAmt, { color: colors.textMain }]}>
                    Rs. {item.amount.toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={[styles.miniSettleBtn, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setSelectedSettleTarget(item);
                      setIsSettleModalOpen(true);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.miniSettleText}>{t('settleBtnText')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 8. Combined Recent Transactions (Incomes & Expenses) */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
            {language === 'ne' ? 'भर्खरका कारोबारहरू (Recent Activity)' : 'Recent Transactions'}
          </Text>
          <TouchableOpacity onPress={() => setActiveTab('expenses')} style={styles.viewAllBtn} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}
            </Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10 }}>
          {filteredTransactions.slice(0, 5).map(txn => {
            const isInc = txn.type === 'income';

            return (
              <TouchableOpacity
                key={txn.id}
                style={[
                  styles.expCard,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: isInc ? 'rgba(16, 185, 129, 0.3)' : colors.border,
                    borderLeftWidth: 3,
                    borderLeftColor: isInc ? '#10b981' : '#f43f5e'
                  }
                ]}
                onPress={() => {
                  if (!isInc && setSelectedExpense) {
                    setSelectedExpense(txn);
                  }
                }}
                activeOpacity={0.75}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 10 }}>
                  <View style={[styles.catIconBox, { backgroundColor: isInc ? 'rgba(16, 185, 129, 0.12)' : colors.bgSubtle }]}>
                    <Text style={{ fontSize: 20 }}>{txn.categoryIcon || (isInc ? '💵' : '📌')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.expTitle, { color: colors.textMain }]} numberOfLines={1}>
                      {txn.title}
                    </Text>
                    <Text style={[styles.expSub, { color: colors.textMuted }]} numberOfLines={1}>
                      {isInc
                        ? `${language === 'ne' ? 'बुझ्ने' : 'Received by'} ${(txn.receivedById || '').replace('user-', '')} • ${txn.categoryName}`
                        : `${t('paidBy')} ${(txn.paidBy || '').replace('user-', '')} • ${txn.categoryName}`}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end', minWidth: 85 }}>
                  <Text
                    style={[
                      styles.expAmt,
                      { color: isInc ? '#10b981' : colors.textMain }
                    ]}
                  >
                    {isInc ? '+' : '−'} Rs. {Number(txn.amount).toLocaleString()}
                  </Text>
                  <Text style={[styles.expShare, { color: colors.textMuted }]}>
                    {txn.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  greeting: {
    fontSize: 20,
    fontWeight: '800'
  },
  subGreeting: {
    fontSize: 12,
    marginTop: 2
  },
  heroCard: {
    borderRadius: 20,
    padding: 18
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  heroBadgeText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  heroAmount: {
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 4
  },
  heroSubtext: {
    color: '#cbd5e1',
    fontSize: 12
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18
  },
  heroBtnIncome: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  heroBtnExpense: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  heroBtnTextWhite: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  dateFilterContainer: {
    marginTop: -4,
    marginBottom: -4
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  datePillText: {
    fontSize: 11
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  summaryCard: {
    width: '48.5%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '900',
    marginVertical: 4
  },
  summarySub: {
    fontSize: 10
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14
  },
  flowProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  flowIncomeSegment: {
    height: '100%',
    backgroundColor: '#10b981'
  },
  flowExpenseSegment: {
    height: '100%',
    backgroundColor: '#f43f5e'
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '700'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
    borderRadius: 12
  },
  personName: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 80
  },
  settleAmt: {
    fontSize: 13,
    fontWeight: '800'
  },
  miniSettleBtn: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  miniSettleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  expCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1
  },
  catIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  expTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  expSub: {
    fontSize: 11,
    marginTop: 2
  },
  expAmt: {
    fontSize: 14,
    fontWeight: '800'
  },
  expShare: {
    fontSize: 10,
    marginTop: 2
  }
});
