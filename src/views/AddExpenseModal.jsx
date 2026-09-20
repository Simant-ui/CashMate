import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react-native';

export const AddExpenseModal = () => {
  const {
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    categories,
    addCategory,
    members,
    currentUser,
    addExpense,
    showToast,
    colors
  } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const [splitMode, setSplitMode] = useState('everyone');
  const [selectedMembers, setSelectedMembers] = useState(members.map(m => m.id));

  const [customAmounts, setCustomAmounts] = useState(() => {
    const init = {};
    members.forEach(m => { init[m.id] = 0; });
    return init;
  });

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🎉');

  if (!isAddExpenseOpen) return null;

  const numAmount = Number(amount) || 0;

  const getCalculatedShares = () => {
    const shares = {};
    if (splitMode === 'everyone') {
      const perPerson = members.length > 0 ? numAmount / members.length : 0;
      members.forEach(m => {
        shares[m.id] = Math.round(perPerson);
      });
    } else if (splitMode === 'selected') {
      const count = selectedMembers.length;
      const perPerson = count > 0 ? numAmount / count : 0;
      members.forEach(m => {
        shares[m.id] = selectedMembers.includes(m.id) ? Math.round(perPerson) : 0;
      });
    } else if (splitMode === 'custom') {
      members.forEach(m => {
        shares[m.id] = Number(customAmounts[m.id]) || 0;
      });
    }
    return shares;
  };

  const calculatedShares = getCalculatedShares();
  const customSum = Object.values(customAmounts).reduce((a, b) => a + Number(b || 0), 0);
  const isCustomValid = splitMode !== 'custom' || Math.abs(customSum - numAmount) < 1;

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast('Please enter an expense title.', 'error');
      return;
    }
    if (numAmount <= 0) {
      showToast('Please enter a valid amount greater than 0.', 'error');
      return;
    }

    const participants = splitMode === 'everyone'
      ? members.map(m => m.id)
      : splitMode === 'selected'
      ? selectedMembers
      : Object.keys(customAmounts).filter(mId => Number(customAmounts[mId]) > 0);

    addExpense({
      title,
      amount: numAmount,
      paidBy,
      date,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      description,
      splitType: splitMode,
      participants,
      shares: calculatedShares
    });

    setTitle('');
    setAmount('');
    setDescription('');
    setIsAddExpenseOpen(false);
  };

  return (
    <Modal visible={isAddExpenseOpen} transparent animationType="slide" onRequestClose={() => setIsAddExpenseOpen(false)}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textMain }]}>Add Expense</Text>
            <TouchableOpacity onPress={() => setIsAddExpenseOpen(false)} activeOpacity={0.7}>
              <X size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Hero Amount Input */}
            <View style={[styles.amountHero, { backgroundColor: colors.bgSubtle }]}>
              <Text style={[styles.amountLabel, { color: colors.textMuted }]}>AMOUNT (NPR)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Text style={[styles.currencyPrefix, { color: colors.primary }]}>Rs.</Text>
                <TextInput
                  style={[styles.amountInput, { color: colors.textMain }]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            {/* Expense Title */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Expense Title</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                placeholder="e.g. Room Rent, Electricity, Groceries"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.textMain }]}>Category</Text>
                <TouchableOpacity onPress={() => setIsAddCatOpen(true)}>
                  <Text style={[styles.linkText, { color: colors.primary }]}>+ Custom Category</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.catCard,
                      {
                        backgroundColor: selectedCategory.id === cat.id ? colors.primaryLight : colors.bgSurface,
                        borderColor: selectedCategory.id === cat.id ? colors.primary : colors.border
                      }
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                    <Text style={[styles.catName, { color: colors.textMain }]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Split Among Options */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Split Among</Text>

              <View style={[styles.tabBar, { backgroundColor: colors.bgSubtle }]}>
                {['everyone', 'selected', 'custom'].map(mode => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setSplitMode(mode)}
                    style={[
                      styles.tabBtn,
                      splitMode === mode && { backgroundColor: colors.bgSurface }
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabBtnText,
                        { color: splitMode === mode ? colors.primary : colors.textMuted }
                      ]}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {splitMode === 'everyone' && (
                <View style={[styles.splitPreviewBox, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.splitPreviewText, { color: colors.primary }]}>
                    Divided equally among 5 members: Rs. {numAmount > 0 ? Math.round(numAmount / 5).toLocaleString() : 0} / person
                  </Text>
                </View>
              )}

              {splitMode === 'selected' && (
                <View style={{ gap: 8 }}>
                  {members.map(m => {
                    const isChecked = selectedMembers.includes(m.id);
                    return (
                      <TouchableOpacity
                        key={m.id}
                        style={[styles.memberRow, { backgroundColor: colors.bgSubtle }]}
                        onPress={() => {
                          if (isChecked) {
                            setSelectedMembers(prev => prev.filter(id => id !== m.id));
                          } else {
                            setSelectedMembers(prev => [...prev, m.id]);
                          }
                        }}
                      >
                        <Text style={[styles.memberName, { color: colors.textMain }]}>{m.avatar} {m.name}</Text>
                        {isChecked && (
                          <Text style={[styles.memberShare, { color: colors.primary }]}>
                            Rs. {selectedMembers.length > 0 ? Math.round(numAmount / selectedMembers.length).toLocaleString() : 0}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Note / Remarks */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Note / Remark (Optional)</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                placeholder="Add details e.g. store name"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>Save Expense</Text>
              <Check size={18} color="#ffffff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800'
  },
  amountHero: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700'
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: '800'
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '800',
    minWidth: 120,
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700'
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14
  },
  catRow: {
    gap: 8,
    paddingBottom: 4
  },
  catCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  catName: {
    fontSize: 13,
    fontWeight: '600'
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  splitPreviewBox: {
    padding: 12,
    borderRadius: 14
  },
  splitPreviewText: {
    fontSize: 13,
    fontWeight: '600'
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600'
  },
  memberShare: {
    fontSize: 12,
    fontWeight: '700'
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  }
});
