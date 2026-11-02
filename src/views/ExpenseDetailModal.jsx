import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../components/ui/Button';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import { X, Trash2, Info } from 'lucide-react-native';

export const ExpenseDetailModal = () => {
  const {
    selectedExpense,
    setSelectedExpense,
    currentUser,
    userRole,
    members,
    deleteExpense,
    t,
    getCategoryName,
    colors
  } = useApp();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (!selectedExpense) return null;

  const paidByMember = members.find(m => m.id === selectedExpense.paidBy);
  const canModify = userRole === 'admin' || selectedExpense.paidBy === currentUser?.id;
  const categoryDisplayName = getCategoryName ? getCategoryName(selectedExpense.categoryName) : selectedExpense.categoryName;

  return (
    <>
      <Modal visible={!!selectedExpense} transparent animationType="slide" onRequestClose={() => setSelectedExpense(null)}>
        <SwipeBackWrapper onSwipeBack={() => setSelectedExpense(null)} style={{ flex: 1 }}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 28 }}>{selectedExpense.categoryIcon}</Text>
                <View style={{ flex: 1 }}>
                  <View style={[styles.badge, { backgroundColor: colors.secondaryLight }]}>
                    <Text style={[styles.badgeText, { color: colors.secondary }]}>{categoryDisplayName}</Text>
                  </View>
                  <Text style={[styles.modalTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedExpense.title}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedExpense(null)}
                style={styles.closeIconBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
              {/* Hero Banner */}
              <View style={[styles.heroBanner, { backgroundColor: colors.bgSubtle }]}>
                <Text style={[styles.heroLabel, { color: colors.textMuted }]}>{t('totalAmount') || 'TOTAL EXPENSE AMOUNT'}</Text>
                <Text style={[styles.heroAmount, { color: colors.textMain }]}>
                  Rs. {selectedExpense.amount?.toLocaleString()}
                </Text>
                <Text style={[styles.heroSub, { color: colors.textMuted }]}>
                  {t('paidBy')}: {paidByMember?.name || 'Unknown'} • {selectedExpense.date}
                </Text>
              </View>

              {/* Description */}
              {selectedExpense.description ? (
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                  <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{t('description') || 'NOTE / DESCRIPTION'}</Text>
                  <Text style={[styles.cardText, { color: colors.textMain }]}>{selectedExpense.description}</Text>
                </View>
              ) : null}

              {/* Participant Share Breakdown */}
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
                  {t('splitDetails')} ({selectedExpense.participants?.length || members.length} {t('members')})
                </Text>

                <View style={{ gap: 8 }}>
                  {members.map(m => {
                    const shareAmt = selectedExpense.shares?.[m.id] || 0;
                    const isPayer = m.id === selectedExpense.paidBy;

                    if (shareAmt === 0 && !isPayer) return null;

                    return (
                      <View key={m.id} style={[styles.memberShareRow, { backgroundColor: colors.bgSubtle }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                          <Text style={{ fontSize: 16 }}>{m.avatar}</Text>
                          <Text style={[styles.memberName, { color: colors.textMain }]} numberOfLines={1}>
                            {m.name} {m.id === currentUser?.id ? `(${t('you')})` : ''}
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
                  {paidByMember?.name} paid Rs. {selectedExpense.amount?.toLocaleString()}. Each participant owes {paidByMember?.name} their share.
                </Text>
              </View>

              {/* Action Buttons Row */}
              <View style={styles.actionRow}>
                <Button
                  label={t('close')}
                  variant="outline"
                  onPress={() => setSelectedExpense(null)}
                  style={{ flex: 1 }}
                />

                {canModify && (
                  <Button
                    label={t('delete')}
                    variant="danger"
                    icon={<Trash2 size={16} color="#ffffff" />}
                    onPress={() => setIsConfirmDeleteOpen(true)}
                    style={{ flex: 1 }}
                  />
                )}
              </View>

              {!canModify && (
                <Text style={[styles.lockText, { color: colors.textMuted }]}>
                  🔒 Only Admin or expense creator ({paidByMember?.name}) can modify this expense.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </SwipeBackWrapper>
    </Modal>

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => deleteExpense(selectedExpense.id)}
        title={t('deleteExpense')}
        description={`Are you sure you want to delete "${selectedExpense.title}"? This will automatically update all room balances.`}
        confirmText={t('delete')}
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
    marginBottom: 16
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 2
  },
  badgeText: {
    fontSize: 10,
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
    fontWeight: '700',
    letterSpacing: 0.5
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
    fontSize: 13,
    lineHeight: 18
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
    marginBottom: 16
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 8
  },
  lockText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 10
  }
});
