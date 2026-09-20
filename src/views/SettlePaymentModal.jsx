import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { X, Check, HandCoins } from 'lucide-react-native';

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
    colors
  } = useApp();

  const [fromId, setFromId] = useState(selectedSettleTarget?.fromId || currentUser.id);
  const [toId, setToId] = useState(selectedSettleTarget?.toId || members.find(m => m.id !== currentUser.id)?.id);
  const [amount, setAmount] = useState(selectedSettleTarget?.amount ? String(selectedSettleTarget.amount) : '');
  const [method, setMethod] = useState('eSewa');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (selectedSettleTarget) {
      setFromId(selectedSettleTarget.fromId);
      setToId(selectedSettleTarget.toId);
      setAmount(String(selectedSettleTarget.amount));
    }
  }, [selectedSettleTarget]);

  if (!isSettleModalOpen) return null;

  const handleSettleSubmit = () => {
    if (!amount || Number(amount) <= 0) {
      showToast('Please enter a valid settlement amount.', 'error');
      return;
    }

    recordSettlement({
      fromId,
      toId,
      amount: Number(amount),
      method,
      note
    });

    setIsSettleModalOpen(false);
    setSelectedSettleTarget(null);
  };

  const paymentMethods = [
    { id: 'eSewa', name: 'eSewa', icon: '📱' },
    { id: 'Fonepay', name: 'Fonepay', icon: '💳' },
    { id: 'Bank Transfer', name: 'Bank Transfer', icon: '🏦' },
    { id: 'Cash', name: 'Cash', icon: '💵' },
    { id: 'Other', name: 'Other', icon: '📦' },
  ];

  return (
    <Modal visible={isSettleModalOpen} transparent animationType="slide" onRequestClose={() => setIsSettleModalOpen(false)}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HandCoins color={colors.primary} size={24} />
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>Settle Payment</Text>
            </View>

            <TouchableOpacity onPress={() => setIsSettleModalOpen(false)}>
              <X size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Settlement Amount (NPR)</Text>
              <View style={styles.inputWrapper}>
                <Text style={[styles.currencyPrefix, { color: colors.primary }]}>Rs.</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border, paddingLeft: 46, fontSize: 18, fontWeight: '800' }]}
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
              <Text style={[styles.label, { color: colors.textMain }]}>Payment Method</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pmRow}>
                {paymentMethods.map(pm => (
                  <TouchableOpacity
                    key={pm.id}
                    onPress={() => setMethod(pm.id)}
                    style={[
                      styles.pmCard,
                      {
                        backgroundColor: method === pm.id ? colors.primaryLight : colors.bgSurface,
                        borderColor: method === pm.id ? colors.primary : colors.border
                      }
                    ]}
                  >
                    <Text style={{ fontSize: 14 }}>{pm.icon}</Text>
                    <Text style={[styles.pmName, { color: colors.textMain }]}>{pm.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Note */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Optional Note / Reference</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                placeholder="e.g. eSewa Txn #92837192"
                placeholderTextColor={colors.textMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSettleSubmit}
            >
              <Text style={styles.submitBtnText}>Mark as Settled</Text>
              <Check size={18} color="#ffffff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
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
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14
  },
  pmRow: {
    gap: 8,
    paddingBottom: 4
  },
  pmCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pmName: {
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
