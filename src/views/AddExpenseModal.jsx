import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import { X, Check, Plus } from 'lucide-react-native';
import { getTranslatedCategoryName } from '../i18n/searchHelper';

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
    language,
    t,
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
  const [newCatIcon, setNewCatIcon] = useState('📌');

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

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast(t('fillRequiredFields'), 'error');
      return;
    }
    if (numAmount <= 0) {
      showToast(t('invalidAmount'), 'error');
      return;
    }

    const participants = splitMode === 'everyone'
      ? members.map(m => m.id)
      : splitMode === 'selected'
      ? selectedMembers
      : Object.keys(customAmounts).filter(mId => Number(customAmounts[mId]) > 0);

    addExpense({
      title: title.trim(),
      amount: numAmount,
      paidBy,
      date,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      description: description.trim(),
      splitType: splitMode,
      participants,
      shares: calculatedShares
    });

    setTitle('');
    setAmount('');
    setDescription('');
    setIsAddExpenseOpen(false);
  };

  const handleCreateCustomCategory = () => {
    if (!newCatName.trim()) {
      showToast(language === 'ne' ? 'विधाको नाम राख्नुहोस्' : 'Category name required', 'error');
      return;
    }
    addCategory({ name: newCatName.trim(), icon: newCatIcon || '📌' });
    setNewCatName('');
    setIsAddCatOpen(false);
    showToast(language === 'ne' ? 'नयाँ विधा थपियो!' : 'New category added!');
  };

  return (
    <Modal visible={isAddExpenseOpen} transparent animationType="slide" onRequestClose={() => setIsAddExpenseOpen(false)}>
      <SwipeBackWrapper onSwipeBack={() => setIsAddExpenseOpen(false)} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textMain }]}>{t('newExpenseTitle')}</Text>
            <TouchableOpacity onPress={() => setIsAddExpenseOpen(false)} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Amount Input */}
            <View style={[styles.amountHero, { backgroundColor: colors.bgSubtle }]}>
              <Text style={[styles.amountLabel, { color: colors.textMuted }]}>{t('amountLabel')}</Text>
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
              <Text style={[styles.label, { color: colors.textMain }]}>{t('titleLabel')}</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                placeholder={t('titlePlaceholder')}
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Paid By Selector */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>{t('paidByLabel')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {members.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setPaidBy(m.id)}
                    style={[
                      styles.payerPill,
                      {
                        backgroundColor: paidBy === m.id ? colors.primary : colors.bgSubtle,
                        borderColor: paidBy === m.id ? colors.primary : colors.border
                      }
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13 }}>{m.avatar || '👤'}</Text>
                    <Text
                      style={[
                        styles.payerPillText,
                        { color: paidBy === m.id ? '#ffffff' : colors.textMain }
                      ]}
                    >
                      {m.name.split(' ')[0]} {m.id === currentUser.id ? '(You)' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Category Selector */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.textMain }]}>{t('categoryLabel')}</Text>
                <TouchableOpacity onPress={() => setIsAddCatOpen(!isAddCatOpen)}>
                  <Text style={[styles.linkText, { color: colors.primary }]}>+ {t('addNewCategoryBtn')}</Text>
                </TouchableOpacity>
              </View>

              {isAddCatOpen && (
                <View style={[styles.inlineAddCatBox, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface, marginBottom: 8 }]}
                    placeholder={t('newCategoryPlaceholder')}
                    placeholderTextColor={colors.textMuted}
                    value={newCatName}
                    onChangeText={setNewCatName}
                  />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button size="sm" variant="secondary" onPress={() => setIsAddCatOpen(false)}>
                      {t('cancel')}
                    </Button>
                    <Button size="sm" variant="primary" onPress={handleCreateCustomCategory}>
                      {t('save')}
                    </Button>
                  </View>
                </View>
              )}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {categories.map(cat => {
                  const catName = getTranslatedCategoryName(cat, language);
                  const isSelected = selectedCategory?.id === cat.id;

                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.catCard,
                        {
                          backgroundColor: isSelected ? colors.primaryLight : colors.bgSubtle,
                          borderColor: isSelected ? colors.primary : colors.border
                        }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.catName,
                          { color: isSelected ? colors.primary : colors.textMain }
                        ]}
                      >
                        {catName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Split Among Options */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>{t('splitTypeLabel')}</Text>

              <View style={[styles.tabBar, { backgroundColor: colors.bgSubtle }]}>
                {['everyone', 'selected', 'custom'].map(mode => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setSplitMode(mode)}
                    style={[
                      styles.tabBtn,
                      splitMode === mode && { backgroundColor: colors.bgSurface }
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tabBtnText,
                        { color: splitMode === mode ? colors.primary : colors.textMuted }
                      ]}
                    >
                      {mode === 'everyone' ? t('splitEqual') : mode === 'selected' ? (language === 'ne' ? 'छानिएका सदस्य' : 'Selected') : t('splitCustom')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {splitMode === 'everyone' && (
                <View style={[styles.splitPreviewBox, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.splitPreviewText, { color: colors.primary }]}>
                    {t('splitBetween', { count: members.length })}: Rs. {numAmount > 0 ? Math.round(numAmount / members.length).toLocaleString() : 0} / person
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
              <Text style={[styles.label, { color: colors.textMain }]}>{t('notesLabel')}</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                placeholder={t('notesPlaceholder')}
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Aligned Action Buttons: Cancel + Save Expense */}
            <View style={styles.btnRow}>
              <Button
                variant="secondary"
                size="lg"
                style={{ flex: 1 }}
                onPress={() => setIsAddExpenseOpen(false)}
              >
                {t('cancel')}
              </Button>

              <Button
                variant="primary"
                size="lg"
                style={{ flex: 1.6 }}
                icon={<Check size={18} color="#ffffff" />}
                onPress={handleSubmit}
              >
                {t('saveExpenseBtn')}
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SwipeBackWrapper>
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
    padding: 20,
    maxHeight: '92%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  amountHero: {
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 16
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  currencyPrefix: {
    fontSize: 26,
    fontWeight: '800'
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '800',
    minWidth: 100,
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700'
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13
  },
  payerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1
  },
  payerPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  inlineAddCatBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10
  },
  catRow: {
    gap: 8,
    paddingBottom: 4
  },
  catCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  catName: {
    fontSize: 12,
    fontWeight: '700'
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 10
  },
  tabBtn: {
    flex: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700'
  },
  splitPreviewBox: {
    padding: 10,
    borderRadius: 12
  },
  splitPreviewText: {
    fontSize: 12,
    fontWeight: '600'
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600'
  },
  memberShare: {
    fontSize: 12,
    fontWeight: '700'
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  }
});
