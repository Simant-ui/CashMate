import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { X, Trash2, Info } from 'lucide-react-native';

export const ExpenseDetailModal = () => {
  const {
    selectedExpense,
    setSelectedExpense,
    currentUser,
    userRole,
    members,
    deleteExpense,
    colors
  } = useApp();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (!selectedExpense) return null;

  const paidByMember = members.find(m => m.id === selectedExpense.paidBy);
  const canModify = userRole === 'admin' || selectedExpense.paidBy === currentUser.id;

  return (
    <>
      <Modal visible={!!selectedExpense} transparent animationType="slide" onRequestClose={() => setSelectedExpense(null)}>
        <View style={styles.overlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 28 }}>{selectedExpense.categoryIcon}</Text>
                <View>
                  <View style={[styles.badge, { backgroundColor: colors.secondaryLight }]}>
                    <Text style={[styles.badgeText, { color: colors.secondary }]}>{selectedExpense.categoryName}</Text>
                  </View>
                  <Text style={[styles.modalTitle, { color: colors.textMain }]}>{selectedExpense.title}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setSelectedExpense(null)}>
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Hero Banner */}
              <View style={[styles.heroBanner, { backgroundColor: colors.bgSubtle }]}>
                <Text style={[styles.heroLabel, { color: colors.textMuted }]}>TOTAL EXPENSE AMOUNT</Text>
                <Text style={[styles.heroAmount, { color: colors.textMain }]}>
                  Rs. {selectedExpense.amount.toLocaleString()}
                </Text>
                <Text style={[styles.heroSub, { color: colors.textMuted }]}>
                  Paid by {paidByMember?.name || 'Unknown'} on {selectedExpense.date}
                </Text>
              </View>

              {/* Description */}
              {selectedExpense.description ? (
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                  <Text style={[styles.cardLabel, { color: colors.textMuted }]}>NOTE / DESCRIPTION</Text>
                  <Text style={[styles.cardText, { color: colors.textMain }]}>{selectedExpense.description}</Text>
                </View>
              ) : null}

              {/* Participant Share Breakdown */}
              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
                  Split Breakdown ({selectedExpense.participants?.length || 5} Participants)
                </Text>

                <View style={{ gap: 8 }}>
                  {members.map(m => {
                    const shareAmt = selectedExpense.shares?.[m.id] || 0;
                    const isPayer = m.id === selectedExpense.paidBy;

                    if (shareAmt === 0 && !isPayer) return null;

                    return (
                      <View key={m.id} style={[styles.memberShareRow, { backgroundColor: colors.bgSubtle }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 16 }}>{m.avatar}</Text>
                          <Text style={[styles.memberName, { color: colors.textMain }]}>
                            {m.name} {m.id === currentUser.id ? '(You)' : ''}
                          </Text>
                          {isPayer && (
                            <View style={[styles.paidBadge, { backgroundColor: colors.positiveLight }]}>
                              <Text style={[styles.paidBadgeText, { color: colors.positive }]}>Paid All</Text>
                            </View>
                          )}
                        </View>

                        <Text style={[styles.shareAmountText, { color: colors.textMain }]}>
                          Rs. {shareAmt.toLocaleString()}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Impact Explainer */}
              <View style={[styles.infoBanner, { backgroundColor: colors.primaryLight }]}>
                <Info size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.primary }]}>
                  {paidByMember?.name} paid Rs. {selectedExpense.amount.toLocaleString()}. Each participant owes {paidByMember?.name} their share.
                </Text>
              </View>

              {/* Action Buttons */}
              {canModify ? (
                <TouchableOpacity
                  style={[styles.deleteBtn, { backgroundColor: colors.negative }]}
                  onPress={() => setIsConfirmDeleteOpen(true)}
                >
                  <Trash2 size={16} color="#ffffff" />
                  <Text style={styles.deleteBtnText}>Delete Expense</Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.lockText, { color: colors.textMuted }]}>
                  🔒 Only Admin or expense creator ({paidByMember?.name}) can modify this expense.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => deleteExpense(selectedExpense.id)}
        title="Delete Expense?"
        description={`Are you sure you want to delete "${selectedExpense.title}"? This will automatically update all room balances.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start'
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  heroBanner: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700'
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 4
  },
  heroSub: {
    fontSize: 12
  },
  card: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },
  cardText: {
    fontSize: 13
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10
  },
  memberShareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14
  },
  memberName: {
    fontSize: 13,
    fontWeight: '700'
  },
  paidBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999
  },
  paidBadgeText: {
    fontSize: 9,
    fontWeight: '700'
  },
  shareAmountText: {
    fontSize: 13,
    fontWeight: '800'
  },
  infoBanner: {
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  deleteBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  deleteBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  lockText: {
    textAlign: 'center',
    fontSize: 11
  }
});
