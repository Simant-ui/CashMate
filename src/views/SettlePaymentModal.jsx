import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import { X, Check, HandCoins, ArrowRight } from 'lucide-react-native';

export const SettlePaymentModal = () => {
  const {
    isSettleModalOpen,
    setIsSettleModalOpen,
    selectedSettleTarget,
    setSelectedSettleTarget,
    members,
    currentUser,
    recordSettlement,
    showToast,
    language,
    t,
    colors
  } = useApp();

  const [fromId, setFromId] = useState(currentUser.id);
  const [toId, setToId] = useState(members.find(m => m.id !== currentUser.id)?.id || '');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('eSewa');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (selectedSettleTarget) {
      setFromId(selectedSettleTarget.fromId);
      setToId(selectedSettleTarget.toId);
      setAmount(String(selectedSettleTarget.amount || ''));
    } else {
      setFromId(currentUser.id);
      setToId(members.find(m => m.id !== currentUser.id)?.id || '');
      setAmount('');
    }
  }, [selectedSettleTarget, isSettleModalOpen, currentUser.id, members]);

  if (!isSettleModalOpen) return null;

  const handleClose = () => {
    setIsSettleModalOpen(false);
    setSelectedSettleTarget(null);
  };

  const handleSettleSubmit = () => {
    const cleanAmount = parseFloat(String(amount).replace(/,/g, ''));
    if (!cleanAmount || cleanAmount <= 0 || isNaN(cleanAmount)) {
      showToast(t('invalidSettleAmount'), 'error');
      return;
    }

    if (fromId === toId) {
      showToast(t('samePayerReceiverError'), 'error');
      return;
    }

    recordSettlement({
      fromId,
      toId,
      amount: cleanAmount,
      method,
      note: note.trim()
    });

    handleClose();
  };

  const paymentMethods = [
    { id: 'eSewa', name: 'eSewa', icon: '📱' },
    { id: 'Fonepay', name: 'Fonepay', icon: '💳' },
    { id: 'Bank Transfer', name: language === 'ne' ? 'बैंक' : 'Bank', icon: '🏦' },
    { id: 'Cash', name: language === 'ne' ? 'नगद' : 'Cash', icon: '💵' },
    { id: 'Other', name: language === 'ne' ? 'अन्य' : 'Other', icon: '📦' },
  ];

  const fromMember = members.find(m => m.id === fromId);
  const toMember = members.find(m => m.id === toId);

  return (
    <Modal visible={isSettleModalOpen} transparent animationType="slide" onRequestClose={handleClose}>
      <SwipeBackWrapper onSwipeBack={handleClose} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HandCoins color={colors.primary} size={22} />
              <View>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>
                  {t('settlePaymentModalTitle')}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>
                  {t('settleSubTitle')}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            {/* PAYER & RECEIVER VISUAL CARDS */}
            <View style={[styles.membersBox, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
              {/* Payer Selector */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.pickerRoleLabel, { color: colors.textMuted }]}>
                  {t('payerLabel').split('*')[0]}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {members.map(m => (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setFromId(m.id)}
                        style={[
                          styles.memberPill,
                          fromId === m.id
                            ? { backgroundColor: colors.primary, borderColor: colors.primary }
                            : { backgroundColor: colors.bgCard, borderColor: colors.border }
                        ]}
                      >
                        <Text style={{ fontSize: 12 }}>{m.avatar || '👤'}</Text>
                        <Text
                          style={[
                            styles.memberPillText,
                            { color: fromId === m.id ? '#ffffff' : colors.textMain }
                          ]}
                          numberOfLines={1}
                        >
                          {m.name.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Arrow */}
              <View style={{ paddingHorizontal: 6, paddingTop: 16 }}>
                <ArrowRight size={16} color={colors.primary} />
              </View>

              {/* Receiver Selector */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.pickerRoleLabel, { color: colors.textMuted }]}>
                  {t('receiverLabel').split('*')[0]}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {members.map(m => (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setToId(m.id)}
                        style={[
                          styles.memberPill,
                          toId === m.id
                            ? { backgroundColor: colors.secondary, borderColor: colors.secondary }
                            : { backgroundColor: colors.bgCard, borderColor: colors.border }
                        ]}
                      >
                        <Text style={{ fontSize: 12 }}>{m.avatar || '👤'}</Text>
                        <Text
                          style={[
                            styles.memberPillText,
                            { color: toId === m.id ? '#ffffff' : colors.textMain }
                          ]}
                          numberOfLines={1}
                        >
                          {m.name.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* Selected Summary Text */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                {fromMember?.name || 'Someone'} ➔ {toMember?.name || 'Someone'}
              </Text>
            </View>

            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>{t('settlementAmountLabel')}</Text>
              <View style={styles.inputWrapper}>
                <Text style={[styles.currencyPrefix, { color: colors.primary }]}>Rs.</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.textMain,
                      borderColor: colors.border,
                      backgroundColor: colors.bgSubtle,
                      paddingLeft: 46,
                      fontSize: 18,
                      fontWeight: '800'
                    }
                  ]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            {/* Payment Method Options */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>{t('paymentMethodLabel')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pmRow}>
                {paymentMethods.map(pm => (
                  <TouchableOpacity
                    key={pm.id}
                    onPress={() => setMethod(pm.id)}
                    style={[
                      styles.pmCard,
                      {
                        backgroundColor: method === pm.id ? colors.primaryLight : colors.bgSubtle,
                        borderColor: method === pm.id ? colors.primary : colors.border
                      }
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13 }}>{pm.icon}</Text>
                    <Text
                      style={[
                        styles.pmName,
                        { color: method === pm.id ? colors.primary : colors.textMain }
                      ]}
                    >
                      {pm.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Note */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>{t('optionalNoteLabel')}</Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }
                ]}
                placeholder={t('notePlaceholder')}
                placeholderTextColor={colors.textMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Action Buttons: Cancel + Mark as Settled */}
            <View style={styles.btnRow}>
              <Button
                variant="secondary"
                size="lg"
                style={{ flex: 1 }}
                onPress={handleClose}
              >
                {t('cancel')}
              </Button>

              <Button
                variant="primary"
                size="lg"
                style={{ flex: 1.5 }}
                icon={<Check size={18} color="#ffffff" />}
                onPress={handleSettleSubmit}
              >
                {t('markAsSettledBtn')}
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
    marginBottom: 14
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
  membersBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  pickerRoleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1
  },
  memberPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  formGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  currencyPrefix: {
    position: 'absolute',
    left: 14,
    fontSize: 16,
    fontWeight: '800',
    zIndex: 2
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 13
  },
  pmRow: {
    gap: 8,
    paddingBottom: 2
  },
  pmCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pmName: {
    fontSize: 12,
    fontWeight: '700'
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8
  }
});
