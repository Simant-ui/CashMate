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
import { X, Check, Plus, ArrowDownLeft, Shield, User, Tag } from 'lucide-react-native';

export const AddIncomeModal = () => {
  const {
    isAddIncomeOpen,
    setIsAddIncomeOpen,
    incomeCategories,
    addIncomeCategory,
    members,
    currentUser,
    addIncome,
    showToast,
    language,
    t,
    colors
  } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    incomeCategories && incomeCategories.length > 0 ? incomeCategories[0] : { id: 'cat-inc-contrib', name: 'Member Contribution', icon: '🤝', accountingTreatment: 'MEMBER_CONTRIBUTION' }
  );
  const [receivedBy, setReceivedBy] = useState(currentUser.id);
  const [contributedBy, setContributedBy] = useState('all');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💵');
  const [newCatTreatment, setNewCatTreatment] = useState('ROOM_FUND');

  if (!isAddIncomeOpen) return null;

  const numAmount = Number(amount) || 0;

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast(language === 'ne' ? 'कृपया आम्दानी शीर्षक राख्नुहोस्' : 'Please enter income title', 'error');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      showToast(language === 'ne' ? 'कृपया मान्य रकम राख्नुहोस्' : 'Please enter a valid positive amount', 'error');
      return;
    }

    addIncome({
      title: title.trim(),
      amount: numAmount,
      categoryId: selectedCategory?.id || 'cat-inc-contrib',
      categoryName: selectedCategory?.name || 'Member Contribution',
      categoryIcon: selectedCategory?.icon || '🤝',
      receivedById: receivedBy,
      contributedById: contributedBy,
      date,
      description: description.trim(),
      accountingTreatment: selectedCategory?.accountingTreatment || 'MEMBER_CONTRIBUTION',
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setDescription('');
    setIsAddIncomeOpen(false);
  };

  const handleCreateCustomCategory = () => {
    if (!newCatName.trim()) {
      showToast(language === 'ne' ? 'कोटिको नाम राख्नुहोस्' : 'Category name required', 'error');
      return;
    }
    const created = addIncomeCategory({
      name: newCatName.trim(),
      icon: newCatIcon || '💵',
      accountingTreatment: newCatTreatment
    });
    if (created) {
      setSelectedCategory(created);
    }
    setNewCatName('');
    setIsAddCatOpen(false);
  };

  const isContrib = selectedCategory?.accountingTreatment === 'MEMBER_CONTRIBUTION';

  return (
    <Modal visible={isAddIncomeOpen} transparent animationType="slide" onRequestClose={() => setIsAddIncomeOpen(false)}>
      <SwipeBackWrapper onSwipeBack={() => setIsAddIncomeOpen(false)} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.incomeBadgeBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <ArrowDownLeft size={18} color="#10b981" />
                </View>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? '+ नयाँ आम्दानी थप्नुहोस्' : '+ Add Room Income'}
                </Text>
              </View>

              <TouchableOpacity onPress={() => setIsAddIncomeOpen(false)} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {/* Amount Hero Input */}
              <View style={[styles.amountHero, { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)', borderWidth: 1 }]}>
                <Text style={[styles.amountLabel, { color: '#10b981' }]}>
                  {language === 'ne' ? 'आम्दानी रकम (NPR)' : 'INCOME AMOUNT (NPR)'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[styles.currencyPrefix, { color: '#10b981' }]}>Rs. </Text>
                  <TextInput
                    style={[styles.amountInput, { color: '#10b981' }]}
                    placeholder="0"
                    placeholderTextColor="rgba(16, 185, 129, 0.4)"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                  />
                </View>
                <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                  {language === 'ne' ? 'कोठा कोषमा स्वतः थपिनेछ' : 'Increases Room Cash Balance'}
                </Text>
              </View>

              {/* Title */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>
                  {language === 'ne' ? 'शीर्षक / स्रोत विवरण *' : 'Income Title / Source *'}
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  placeholder={language === 'ne' ? 'जस्तै: मासिक कोठा कोष, भाडा फिर्ता, उप-भाडा...' : 'e.g. Monthly Room Contribution, Refund, Sublet...'}
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Categories */}
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, { color: colors.textMain }]}>
                    {language === 'ne' ? 'आम्दानी विधा *' : 'Income Category *'}
                  </Text>
                  <TouchableOpacity onPress={() => setIsAddCatOpen(!isAddCatOpen)}>
                    <Text style={[styles.linkText, { color: '#10b981' }]}>
                      {isAddCatOpen ? (language === 'ne' ? 'रद्द' : 'Cancel') : (language === 'ne' ? '+ नयाँ विधा' : '+ New Category')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isAddCatOpen && (
                  <View style={[styles.inlineAddCatBox, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                    <Text style={[styles.label, { fontSize: 11, color: colors.textMuted }]}>
                      {language === 'ne' ? 'नयाँ आम्दानी विधा थप्नुहोस्:' : 'Add Custom Income Category:'}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <TextInput
                        style={[styles.input, { flex: 1, height: 38, fontSize: 12, color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
                        placeholder="e.g. Balcony Rent, Scrap Sale"
                        placeholderTextColor={colors.textMuted}
                        value={newCatName}
                        onChangeText={setNewCatName}
                      />
                      <TextInput
                        style={[styles.input, { width: 50, height: 38, textAlign: 'center', fontSize: 16, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
                        value={newCatIcon}
                        onChangeText={setNewCatIcon}
                        maxLength={4}
                      />
                      <Button variant="primary" size="sm" onPress={handleCreateCustomCategory}>
                        {language === 'ne' ? 'थप्नुहोस्' : 'Add'}
                      </Button>
                    </View>
                  </View>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                  {incomeCategories && incomeCategories.map(cat => {
                    const isSelected = selectedCategory?.id === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat)}
                        style={[
                          styles.catCard,
                          isSelected
                            ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' }
                            : { backgroundColor: colors.bgCard, borderColor: colors.border }
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                        <Text style={[styles.catName, { color: isSelected ? '#10b981' : colors.textMain }]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Received By */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>
                  {language === 'ne' ? 'रकम बुझ्ने / प्राप्त गर्ने सदस्य *' : 'Received By (Who Collected Cash) *'}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {members.map(m => {
                    const isSelected = receivedBy === m.id;
                    return (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setReceivedBy(m.id)}
                        style={[
                          styles.payerPill,
                          isSelected
                            ? { backgroundColor: '#10b981', borderColor: '#10b981' }
                            : { backgroundColor: colors.bgSubtle, borderColor: colors.border }
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 13 }}>{m.avatar || '👤'}</Text>
                        <Text
                          style={[
                            styles.payerPillText,
                            { color: isSelected ? '#ffffff' : colors.textMain }
                          ]}
                        >
                          {m.name.split(' ')[0]} {m.id === currentUser.id ? '(You)' : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Contributed By (If Member Contribution) */}
              {isContrib && (
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.textMain }]}>
                    {language === 'ne' ? 'सहयोगकर्ता (Contributed By)' : 'Contributed By'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    <TouchableOpacity
                      onPress={() => setContributedBy('all')}
                      style={[
                        styles.payerPill,
                        contributedBy === 'all'
                          ? { backgroundColor: colors.primary, borderColor: colors.primary }
                          : { backgroundColor: colors.bgSubtle, borderColor: colors.border }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.payerPillText, { color: contributedBy === 'all' ? '#ffffff' : colors.textMain }]}>
                        👥 {language === 'ne' ? 'सबै सदस्यहरू (Equal Share)' : 'All Members (Equal Fund)'}
                      </Text>
                    </TouchableOpacity>

                    {members.map(m => (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setContributedBy(m.id)}
                        style={[
                          styles.payerPill,
                          contributedBy === m.id
                            ? { backgroundColor: colors.primary, borderColor: colors.primary }
                            : { backgroundColor: colors.bgSubtle, borderColor: colors.border }
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.payerPillText, { color: contributedBy === m.id ? '#ffffff' : colors.textMain }]}>
                          {m.name.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Date */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>
                  {language === 'ne' ? 'प्राप्त मिति *' : 'Income Date *'}
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Description / Remarks */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>
                  {language === 'ne' ? 'कैफियत / विवरण (वैकल्पिक)' : 'Remarks / Note (Optional)'}
                </Text>
                <TextInput
                  style={[styles.input, { height: 60, paddingTop: 8, color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  placeholder={language === 'ne' ? 'थप विवरण यहाँ लेख्नुहोस्...' : 'Add notes, payment ref number, or bank deposit details...'}
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.btnRow}>
                <Button
                  variant="secondary"
                  size="lg"
                  style={{ flex: 1 }}
                  onPress={() => setIsAddIncomeOpen(false)}
                >
                  {t('cancel')}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  style={{ flex: 1.6, backgroundColor: '#10b981', borderColor: '#10b981' }}
                  icon={<Check size={18} color="#ffffff" />}
                  onPress={handleSubmit}
                >
                  {language === 'ne' ? 'आम्दानी सुरक्षित गर्नुहोस्' : 'Save Income (+)'}
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
  incomeBadgeBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
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
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  }
});
