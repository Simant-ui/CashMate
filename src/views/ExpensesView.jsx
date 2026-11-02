import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Search, Plus, Minus, Receipt, X, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react-native';
import { matchExpenseBilingual, getTranslatedCategoryName } from '../i18n/searchHelper';

export const ExpensesView = () => {
  const {
    expenses,
    incomes,
    categories,
    incomeCategories,
    members,
    currentUser,
    setSelectedExpense,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
    getAllTransactions,
    language,
    t,
    colors
  } = useApp();

  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');

  // Combined transactions
  const allTxns = getAllTransactions ? getAllTransactions(typeFilter) : [];

  const filteredTransactions = allTxns.filter(txn => {
    // Search match
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = !q || (txn.title || '').toLowerCase().includes(q) || (txn.description || '').toLowerCase().includes(q);
    const catMatch = selectedCategoryFilter === 'all' || txn.categoryId === selectedCategoryFilter;
    const memberMatch = selectedMemberFilter === 'all' || txn.paidBy === selectedMemberFilter || txn.receivedById === selectedMemberFilter || txn.contributedById === selectedMemberFilter;

    return titleMatch && catMatch && memberMatch;
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Type Selector & Action Buttons */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.textMain }]}>
            {language === 'ne' ? 'कारोबार इतिहास' : 'Transactions & Cash Flow'}
          </Text>
          <Text style={[styles.subTitle, { color: colors.textMuted }]}>
            {filteredTransactions.length} {language === 'ne' ? 'कारोबार रेकर्डहरू' : 'records found'}
          </Text>
        </View>

        {/* Dual Actions: + Add Income & - Add Expense */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            style={[styles.smallActionBtn, { backgroundColor: '#10b981' }]}
            onPress={() => setIsAddIncomeOpen(true)}
            activeOpacity={0.8}
          >
            <Plus size={14} color="#ffffff" strokeWidth={3} />
            <Text style={styles.smallActionBtnText}>{language === 'ne' ? 'आम्दानी' : 'Income'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallActionBtn, { backgroundColor: '#f43f5e' }]}
            onPress={() => setIsAddExpenseOpen(true)}
            activeOpacity={0.8}
          >
            <Minus size={14} color="#ffffff" strokeWidth={3} />
            <Text style={styles.smallActionBtnText}>{language === 'ne' ? 'खर्च' : 'Expense'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Type Filter: All / Income Only / Expenses Only */}
      <View style={[styles.typeTabBar, { backgroundColor: colors.bgSubtle }]}>
        <TouchableOpacity
          style={[
            styles.typeTabItem,
            typeFilter === 'all' && { backgroundColor: colors.bgSurface, elevation: 1 }
          ]}
          onPress={() => setTypeFilter('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.typeTabText,
              { color: typeFilter === 'all' ? colors.primary : colors.textMuted, fontWeight: typeFilter === 'all' ? '800' : '600' }
            ]}
          >
            {language === 'ne' ? 'सबै कारोबार' : 'All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeTabItem,
            typeFilter === 'income' && { backgroundColor: colors.bgSurface, elevation: 1 }
          ]}
          onPress={() => setTypeFilter('income')}
          activeOpacity={0.7}
        >
          <ArrowDownLeft size={13} color={typeFilter === 'income' ? '#10b981' : colors.textMuted} />
          <Text
            style={[
              styles.typeTabText,
              { color: typeFilter === 'income' ? '#10b981' : colors.textMuted, fontWeight: typeFilter === 'income' ? '800' : '600' }
            ]}
          >
            {language === 'ne' ? 'आम्दानी (+)' : 'Income (+)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeTabItem,
            typeFilter === 'expense' && { backgroundColor: colors.bgSurface, elevation: 1 }
          ]}
          onPress={() => setTypeFilter('expense')}
          activeOpacity={0.7}
        >
          <ArrowUpRight size={13} color={typeFilter === 'expense' ? '#f43f5e' : colors.textMuted} />
          <Text
            style={[
              styles.typeTabText,
              { color: typeFilter === 'expense' ? '#f43f5e' : colors.textMuted, fontWeight: typeFilter === 'expense' ? '800' : '600' }
            ]}
          >
            {language === 'ne' ? 'खर्च (−)' : 'Expense (−)'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }
          ]}
          placeholder={language === 'ne' ? 'खोज्नुहोस्: भाडा, किराना, बिजुली, पानी...' : 'Search: rent, grocery, wifi, water...'}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSearchQuery('')}
          >
            <X size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Member Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        <TouchableOpacity
          onPress={() => setSelectedMemberFilter('all')}
          style={[
            styles.pillBtn,
            {
              backgroundColor: selectedMemberFilter === 'all' ? colors.primary : colors.bgCard,
              borderColor: colors.border
            }
          ]}
        >
          <Text style={[styles.pillText, { color: selectedMemberFilter === 'all' ? '#ffffff' : colors.textMain }]}>
            👥 {t('all')}
          </Text>
        </TouchableOpacity>

        {members.map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelectedMemberFilter(m.id)}
            style={[
              styles.pillBtn,
              {
                backgroundColor: selectedMemberFilter === m.id ? colors.primary : colors.bgCard,
                borderColor: colors.border
              }
            ]}
          >
            <Text style={[styles.pillText, { color: selectedMemberFilter === m.id ? '#ffffff' : colors.textMain }]}>
              {m.avatar || '👤'} {m.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <View style={{ gap: 10, marginTop: 4 }}>
          {filteredTransactions.map(txn => {
            const isInc = txn.type === 'income';

            return (
              <TouchableOpacity
                key={txn.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: isInc ? 'rgba(16, 185, 129, 0.3)' : colors.border,
                    borderLeftWidth: 3.5,
                    borderLeftColor: isInc ? '#10b981' : '#f43f5e'
                  }
                ]}
                onPress={() => {
                  if (!isInc && setSelectedExpense) {
                    setSelectedExpense(txn);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 10 }}>
                  <View style={[styles.iconBox, { backgroundColor: isInc ? 'rgba(16, 185, 129, 0.12)' : colors.bgSubtle }]}>
                    <Text style={{ fontSize: 22 }}>{txn.categoryIcon || (isInc ? '💵' : '📌')}</Text>
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

                <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
                  <Text
                    style={[
                      styles.expAmt,
                      { color: isInc ? '#10b981' : colors.textMain }
                    ]}
                  >
                    {isInc ? '+' : '−'} Rs. {Number(txn.amount).toLocaleString()}
                  </Text>
                  <Text style={[styles.shareText, { color: colors.textMuted }]}>
                    {txn.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Receipt size={32} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textMain }]}>
            {searchQuery ? t('noExpensesMatch') : 'No transactions recorded.'}
          </Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Add income or expenses to see them here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    gap: 14
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
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10
  },
  smallActionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  typeTabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    gap: 4
  },
  typeTabItem: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  typeTabText: {
    fontSize: 12
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 42,
    paddingRight: 36,
    fontSize: 13
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    zIndex: 1
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1
  },
  iconBox: {
    width: 40,
    height: 40,
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
  shareText: {
    fontSize: 10,
    marginTop: 2
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  emptySub: {
    fontSize: 12
  }
});
