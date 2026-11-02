import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../components/ui/Button';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import { X, Settings, AlertTriangle, Lock, Users, Tag, Sliders, Shield } from 'lucide-react-native';

export const AdminPanelModal = () => {
  const {
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    room,
    setRoom,
    members,
    setMembers,
    categories,
    addCategory,
    removeMember,
    userRole,
    currentMonth,
    closedMonths,
    closeCurrentMonth,
    showToast,
    t,
    getCategoryName,
    colors
  } = useApp();

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (typeof isAdminPanelOpen === 'string') {
      setActiveTab(isAdminPanelOpen);
    }
  }, [isAdminPanelOpen]);

  const [roomName, setRoomName] = useState(room.name);
  const [roomDesc, setRoomDesc] = useState(room.description);
  const [currency, setCurrency] = useState(room.currency);

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📌');
  const [isAddCatFormOpen, setIsAddCatFormOpen] = useState(false);

  const [confirmDangerAction, setConfirmDangerAction] = useState(null);
  const [isCloseMonthConfirmOpen, setIsCloseMonthConfirmOpen] = useState(false);

  if (!isAdminPanelOpen) return null;

  const handleSaveRoomSettings = () => {
    setRoom(prev => ({
      ...prev,
      name: roomName,
      description: roomDesc,
      currency
    }));
    showToast('Room settings updated successfully!');
  };

  const handleAddCustomCategory = () => {
    if (!newCatName.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }
    addCategory({ name: newCatName.trim(), icon: newCatIcon || '📌' });
    setNewCatName('');
    setIsAddCatFormOpen(false);
  };

  return (
    <>
      <Modal visible={Boolean(isAdminPanelOpen)} transparent animationType="slide" onRequestClose={() => setIsAdminPanelOpen(false)}>
        <SwipeBackWrapper onSwipeBack={() => setIsAdminPanelOpen(false)} style={{ flex: 1 }}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 8 }}>
                <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                  <Settings color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: colors.textMain }]} numberOfLines={1}>{t('adminPanel') || 'Room Settings & Management'}</Text>
                  <Text style={[styles.modalSub, { color: colors.textMuted }]} numberOfLines={1}>Configure preferences, members & month closing</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setIsAdminPanelOpen(false)}
                activeOpacity={0.7}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Warning if Member Mode */}
            {userRole !== 'admin' && (
              <View style={[styles.warnBanner, { backgroundColor: colors.warningLight }]}>
                <AlertTriangle size={16} color={colors.warning} />
                <Text style={[styles.warnText, { color: colors.warning }]}>
                  You are viewing in Member Mode. Switch to Admin mode in top toolbar to edit settings.
                </Text>
              </View>
            )}

            {/* Nav Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
              {[
                { id: 'general', label: t('roomPreferences') || 'Room Info' },
                { id: 'members', label: t('members') || 'Members' },
                { id: 'categories', label: t('allCategories') || 'Categories' },
                { id: 'split', label: t('split') || 'Split Rules' },
                { id: 'close_month', label: t('close') + ' Month' },
                { id: 'danger', label: 'Danger Zone' },
              ].map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[
                    styles.tabPill,
                    {
                      backgroundColor: activeTab === tab.id ? colors.primary : colors.bgSurface,
                      borderColor: activeTab === tab.id ? colors.primary : colors.border
                    }
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabPillText,
                      { color: activeTab === tab.id ? '#ffffff' : colors.textMain }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
              {/* TAB 1: General Info */}
              {activeTab === 'general' && (
                <View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textMain }]}>{t('roomName') || 'Room Name'}</Text>
                    <TextInput
                      style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      value={roomName}
                      onChangeText={setRoomName}
                      editable={userRole === 'admin'}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textMain }]}>{t('description') || 'Description'}</Text>
                    <TextInput
                      style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      value={roomDesc}
                      onChangeText={setRoomDesc}
                      editable={userRole === 'admin'}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textMain }]}>{t('currency') || 'Currency Symbol'}</Text>
                    <TextInput
                      style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      value={currency}
                      onChangeText={setCurrency}
                      editable={userRole === 'admin'}
                    />
                  </View>

                  {userRole === 'admin' && (
                    <Button
                      label={t('save')}
                      variant="primary"
                      onPress={handleSaveRoomSettings}
                      style={{ marginTop: 12 }}
                    />
                  )}
                </View>
              )}

              {/* TAB: Close Month */}
              {activeTab === 'close_month' && (
                <View style={{ gap: 14 }}>
                  <View style={[styles.closeMonthBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Lock size={20} color={colors.primary} />
                      <Text style={[styles.closeMonthTitle, { color: colors.primary }]}>
                        Close Active Month ({currentMonth})
                      </Text>
                    </View>
                    <Text style={[styles.closeMonthDesc, { color: colors.textMain }]}>
                      Closing {currentMonth} will archive all expenses and settlements safely into Month History, and reset active room balances to 0 for next month.
                    </Text>

                    <Button
                      label={`Close ${currentMonth} & Reset to 0`}
                      variant="primary"
                      onPress={() => setIsCloseMonthConfirmOpen(true)}
                      disabled={userRole !== 'admin'}
                      style={{ marginTop: 12 }}
                    />
                  </View>

                  {/* Past Archived Months */}
                  <View>
                    <Text style={[styles.label, { color: colors.textMain, marginBottom: 8 }]}>
                      Archived Past Months ({closedMonths.length})
                    </Text>
                    <View style={{ gap: 8 }}>
                      {closedMonths.map(m => (
                        <View key={m.id} style={[styles.rowCard, { backgroundColor: colors.bgSubtle }]}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.rowMainText, { color: colors.textMain }]}>{m.monthName}</Text>
                            <Text style={[styles.rowSubText, { color: colors.textMuted }]}>
                              Archived on {m.closedDate} • Total Rs. {m.totalExpenses.toLocaleString()}
                            </Text>
                          </View>
                          <View style={[styles.roleBadge, { backgroundColor: colors.positiveLight }]}>
                            <Text style={[styles.roleBadgeText, { color: colors.positive }]}>Archived</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* TAB 2: Members */}
              {activeTab === 'members' && (
                <View style={{ gap: 10 }}>
                  {members.map(m => (
                    <View key={m.id} style={[styles.rowCard, { backgroundColor: colors.bgSubtle }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <Text style={{ fontSize: 20 }}>{m.avatar}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.rowMainText, { color: colors.textMain }]} numberOfLines={1}>{m.name}</Text>
                          <Text style={[styles.rowSubText, { color: colors.textMuted }]} numberOfLines={1}>{m.email}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[styles.roleBtn, { backgroundColor: colors.primaryLight }]}
                        onPress={() => {
                          if (userRole === 'admin') {
                            const newRole = m.role === 'admin' ? 'member' : 'admin';
                            setMembers(prev => prev.map(item => item.id === m.id ? { ...item, role: newRole } : item));
                            showToast(`Updated ${m.name}'s role to ${newRole}.`);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.roleBtnText, { color: colors.primary }]}>{m.role}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 3: Categories */}
              {activeTab === 'categories' && (
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={[styles.label, { color: colors.textMain }]}>{t('allCategories')} ({categories.length})</Text>
                    {userRole === 'admin' && (
                      <TouchableOpacity onPress={() => setIsAddCatFormOpen(!isAddCatFormOpen)} activeOpacity={0.7}>
                        <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
                          {isAddCatFormOpen ? t('cancel') : '+ Custom Category'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {isAddCatFormOpen && (
                    <View style={[styles.addCatBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>Create New Category</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                        <TextInput
                          style={[styles.input, { flex: 0.25, textAlign: 'center', color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
                          value={newCatIcon}
                          onChangeText={setNewCatIcon}
                        />
                        <TextInput
                          style={[styles.input, { flex: 0.75, color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
                          placeholder="Category Name (e.g. WiFi Bill)"
                          placeholderTextColor={colors.textMuted}
                          value={newCatName}
                          onChangeText={setNewCatName}
                        />
                      </View>
                      <Button
                        label={t('addCategory') || 'Add Category'}
                        variant="primary"
                        size="sm"
                        onPress={handleAddCustomCategory}
                      />
                    </View>
                  )}

                  {categories.map(cat => (
                    <View key={cat.id} style={[styles.rowCard, { backgroundColor: colors.bgSubtle }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
                        <Text style={[styles.rowMainText, { color: colors.textMain }]} numberOfLines={1}>
                          {getCategoryName ? getCategoryName(cat.name) : cat.name}
                        </Text>
                      </View>
                      <View style={[styles.roleBadge, { backgroundColor: colors.positiveLight }]}>
                        <Text style={[styles.roleBadgeText, { color: colors.positive }]}>Active</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB: Split Rules */}
              {activeTab === 'split' && (
                <View style={{ gap: 14 }}>
                  <Text style={[styles.label, { color: colors.textMain }]}>Default Expense Split Rules</Text>
                  
                  <TouchableOpacity
                    style={[styles.splitCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => showToast('Equal split set as room default.')}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 24 }}>⚖️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowMainText, { color: colors.primary, fontWeight: '700' }]}>{t('equalSplit') || 'Equal Split (Everyone)'}</Text>
                      <Text style={[styles.rowSubText, { color: colors.textMuted }]}>
                        Automatically divides all room expenses equally among active members.
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.splitCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}
                    onPress={() => showToast('Custom shares split rule configured.')}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 24 }}>✏️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowMainText, { color: colors.textMain }]}>{t('customSplit') || 'Custom Shares / Fixed Percentages'}</Text>
                      <Text style={[styles.rowSubText, { color: colors.textMuted }]}>
                        Allows specifying exact custom rupee shares or fixed percentages per member.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* TAB 4: Danger Zone */}
              {activeTab === 'danger' && (
                <View style={{ gap: 14 }}>
                  <View style={[styles.dangerBox, { borderColor: colors.negativeLight, backgroundColor: colors.negativeLight }]}>
                    <Text style={[styles.dangerTitle, { color: colors.negative }]}>Archive Room</Text>
                    <Text style={[styles.dangerDesc, { color: colors.negative }]}>
                      Hides room from dashboard but preserves expenses and balance records safely.
                    </Text>
                    <Button
                      label="Archive Room"
                      variant="danger"
                      onPress={() => setConfirmDangerAction('archive')}
                      disabled={userRole !== 'admin'}
                      style={{ marginTop: 8 }}
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </SwipeBackWrapper>
    </Modal>

      {/* Confirmation Modal for Danger Actions */}
      <ConfirmModal
        isOpen={confirmDangerAction !== null}
        onClose={() => setConfirmDangerAction(null)}
        onConfirm={() => {
          showToast(`Room ${confirmDangerAction === 'archive' ? 'archived' : 'deleted'}.`);
          setConfirmDangerAction(null);
          setIsAdminPanelOpen(false);
        }}
        title={`${confirmDangerAction === 'archive' ? 'Archive' : 'Delete'} Room?`}
        description="Are you sure you want to proceed with this action?"
        confirmText={confirmDangerAction === 'archive' ? 'Archive' : 'Delete'}
        confirmVariant="danger"
      />

      {/* Confirmation Modal for Close Month */}
      <ConfirmModal
        isOpen={isCloseMonthConfirmOpen}
        onClose={() => setIsCloseMonthConfirmOpen(false)}
        onConfirm={() => {
          closeCurrentMonth();
          setIsCloseMonthConfirmOpen(false);
          setIsAdminPanelOpen(false);
        }}
        title={`Close ${currentMonth}?`}
        description={`Are you sure you want to close ${currentMonth}? All ${currentMonth} expenses and settlements will be archived safely in Month History, and active room balances will reset to 0 for next month.`}
        confirmText="Confirm Close Month"
        confirmVariant="primary"
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  modalSub: {
    fontSize: 11
  },
  warnBanner: {
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  warnText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  tabsRow: {
    gap: 8,
    paddingBottom: 14
  },
  tabPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1.5,
    minHeight: 36,
    justifyContent: 'center'
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  formGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14
  },
  closeMonthBox: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5
  },
  closeMonthTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  closeMonthDesc: {
    fontSize: 12,
    lineHeight: 18
  },
  rowCard: {
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  rowMainText: {
    fontSize: 13,
    fontWeight: '700'
  },
  rowSubText: {
    fontSize: 11,
    marginTop: 2
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  roleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    minWidth: 64,
    alignItems: 'center'
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  addCatBox: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1
  },
  splitCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  dangerBox: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  dangerDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8
  }
});
