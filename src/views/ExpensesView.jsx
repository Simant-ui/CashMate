import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Search, Plus, Receipt } from 'lucide-react-native';

export const ExpensesView = () => {
  const {
    expenses,
    categories,
    members,
    currentUser,
    setSelectedExpense,
    setIsAddExpenseOpen,
    colors
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategoryFilter === 'all' || exp.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.textMain }]}>Room Expenses</Text>
          <Text style={[styles.subTitle, { color: colors.textMuted }]}>
            {filteredExpenses.length} total shared expenses
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setIsAddExpenseOpen(true)}
        >
          <Plus size={16} color="#ffffff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
          placeholder="Search expenses, rent, groceries..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills Slider */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
        <TouchableOpacity
          onPress={() => setSelectedCategoryFilter('all')}
          style={[
            styles.pillBtn,
            {
              backgroundColor: selectedCategoryFilter === 'all' ? colors.primary : colors.bgCard,
              borderColor: colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.pillText,
              { color: selectedCategoryFilter === 'all' ? '#ffffff' : colors.textMain }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategoryFilter(cat.id)}
            style={[
              styles.pillBtn,
              {
                backgroundColor: selectedCategoryFilter === cat.id ? colors.primary : colors.bgCard,
                borderColor: colors.border
              }
            ]}
          >
            <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
            <Text
              style={[
                styles.pillText,
                { color: selectedCategoryFilter === cat.id ? '#ffffff' : colors.textMain }
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expenses Cards */}
      {filteredExpenses.length > 0 ? (
        <View>
          <Text style={[styles.groupHeader, { color: colors.textMuted }]}>SEPTEMBER 2026</Text>

          <View style={{ gap: 10 }}>
            {filteredExpenses.map(exp => {
              const paidMember = members.find(m => m.id === exp.paidBy);
              const userShare = exp.shares?.[currentUser.id] || 0;

              return (
                <TouchableOpacity
                  key={exp.id}
                  style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                  onPress={() => setSelectedExpense(exp)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.iconBox, { backgroundColor: colors.bgSubtle }]}>
                      <Text style={{ fontSize: 24 }}>{exp.categoryIcon}</Text>
                    </View>

                    <View>
                      <Text style={[styles.expTitle, { color: colors.textMain }]}>{exp.title}</Text>
                      <Text style={[styles.expSub, { color: colors.textMuted }]}>
                        Paid by {paidMember?.name || 'Someone'} • {exp.date}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.expAmt, { color: colors.textMain }]}>
                      Rs. {exp.amount.toLocaleString()}
                    </Text>
                    <Text style={[styles.shareText, { color: colors.primary }]}>
                      Rs. {userShare.toLocaleString()} share
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Receipt size={32} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textMain }]}>No Expenses Found</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>No expenses match your search.</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
            onPress={() => setIsAddExpenseOpen(true)}
          >
            <Text style={styles.addBtnText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '800'
  },
  subTitle: {
    fontSize: 13,
    marginTop: 2
  },
  addBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 2
  },
  searchInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14
  },
  pillsRow: {
    gap: 6,
    paddingBottom: 4
  },
  pillBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 10
  },
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  expSub: {
    fontSize: 12,
    marginTop: 2
  },
  expAmt: {
    fontSize: 16,
    fontWeight: '800'
  },
  shareText: {
    fontSize: 10,
    fontWeight: '600'
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12
  },
  emptySub: {
    fontSize: 13,
    marginTop: 4
  }
});
