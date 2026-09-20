import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
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
        <View style={styles.overlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Settings color={colors.primary} size={24} />
                <View>
                  <Text style={[styles.modalTitle, { color: colors.textMain }]}>Room Settings & Management</Text>
                  <Text style={[styles.modalSub, { color: colors.textMuted }]}>Configure room preferences, members, categories & month closing</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setIsAdminPanelOpen(false)} activeOpacity={0.7}>
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
                { id: 'general', label: 'Room Info' },
                { id: 'members', label: 'Members' },
                { id: 'categories', label: 'Categories' },
                { id: 'split', label: 'Split Rules' },
                { id: 'close_month', label: 'Close Month' },
                { id: 'danger', label: 'Danger Zone' },
              ].map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[
                    styles.tabPill,
                    {
                      backgroundColor: activeTab === tab.id ? colors.primary : colors.bgSurface,
                      borderColor: colors.border
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

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* TAB 1: General Info */}
              {activeTab === 'general' && (
                <View>
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textMain }]}>Room Name</Text>
                    <TextInput
                      style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                      value={roomName}
                      onChangeText={setRoomName}
                      editable={userRole === 'admin'}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textMain }]}>Description</Text>
                    <TextInput
                      style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                      value={roomDesc}
                      onChangeText={setRoomDesc}
                      editable={userRole === 'admin'}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textMain }]}>Currency Symbol</Text>
                    <TextInput
                      style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                      value={currency}
                      onChangeText={setCurrency}
                      editable={userRole === 'admin'}
                    />
                  </View>

                  {userRole === 'admin' && (
                    <TouchableOpacity
                      style={[styles.submitBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
                      onPress={handleSaveRoomSettings}
                    >
                      <Text style={styles.submitBtnText}>Save Changes</Text>
                    </TouchableOpacity>
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

                    <TouchableOpacity
                      style={[styles.closeMonthBtn, { backgroundColor: colors.primary }]}
                      onPress={() => setIsCloseMonthConfirmOpen(true)}
                      disabled={userRole !== 'admin'}
                    >
                      <Text style={styles.closeMonthBtnText}>Close {currentMonth} & Reset to 0</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Past Archived Months */}
                  <View>
                    <Text style={[styles.label, { color: colors.textMain, marginBottom: 8 }]}>
                      Archived Past Months ({closedMonths.length})
                    </Text>
                    <View style={{ gap: 8 }}>
                      {closedMonths.map(m => (
                        <View key={m.id} style={[styles.rowCard, { backgroundColor: colors.bgSubtle }]}>
                          <View>
                            <Text style={[styles.rowMainText, { color: colors.textMain }]}>{m.monthName}</Text>
                            <Text style={[styles.rowSubText, { color: colors.textMuted }]}>
                              Archived on {m.closedDate} • Total Rs. {m.totalExpenses.toLocaleString()}
                            </Text>
                          </View>
                          <View style={[styles.roleBtn, { backgroundColor: colors.positiveLight }]}>
                            <Text style={[styles.roleBtnText, { color: colors.positive }]}>Archived</Text>
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 18 }}>{m.avatar}</Text>
                        <View>
                          <Text style={[styles.rowMainText, { color: colors.textMain }]}>{m.name}</Text>
                          <Text style={[styles.rowSubText, { color: colors.textMuted }]}>{m.email}</Text>
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
                    <Text style={[styles.label, { color: colors.textMain }]}>Expense Categories ({categories.length})</Text>
                    {userRole === 'admin' && (
                      <TouchableOpacity onPress={() => setIsAddCatFormOpen(!isAddCatFormOpen)} activeOpacity={0.7}>
                        <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
                          {isAddCatFormOpen ? 'Cancel' : '+ Custom Category'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {isAddCatFormOpen && (
                    <View style={[styles.rowCard, { backgroundColor: colors.primaryLight, flexDirection: 'column', alignItems: 'stretch', gap: 8 }]}>
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Create New Category</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TextInput
                          style={[styles.input, { flex: 0.2, textAlign: 'center', color: colors.textMain, borderColor: colors.border }]}
                          value={newCatIcon}
                          onChangeText={setNewCatIcon}
                        />
                        <TextInput
                          style={[styles.input, { flex: 0.8, color: colors.textMain, borderColor: colors.border }]}
                          placeholder="Category Name (e.g. WiFi Bill)"
                          placeholderTextColor={colors.textMuted}
                          value={newCatName}
                          onChangeText={setNewCatName}
                        />
                      </View>
                      <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                        onPress={handleAddCustomCategory}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.submitBtnText}>Add Category</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {categories.map(cat => (
                    <View key={cat.id} style={[styles.rowCard, { backgroundColor: colors.bgSubtle }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
                        <Text style={[styles.rowMainText, { color: colors.textMain }]}>{cat.name}</Text>
                      </View>
                      <View style={[styles.roleBtn, { backgroundColor: colors.positiveLight }]}>
                        <Text style={[styles.roleBtnText, { color: colors.positive }]}>Active</Text>
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
                    style={[styles.rowCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderWidth: 1 }]}
                    onPress={() => showToast('Equal split set as room default.')}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 22 }}>⚖️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowMainText, { color: colors.primary, fontWeight: '700' }]}>Equal Split (Everyone)</Text>
                      <Text style={[styles.rowSubText, { color: colors.textMuted }]}>
                        Automatically divides all room expenses equally among active members.
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.rowCard, { backgroundColor: colors.bgSubtle }]}
                    onPress={() => showToast('Custom shares split rule configured.')}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 22 }}>✏️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowMainText, { color: colors.textMain }]}>Custom Shares / Fixed Percentages</Text>
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
                      Hides room from dashboard but preserves expenses.
                    </Text>
                    <TouchableOpacity
                      style={[styles.dangerBtn, { borderColor: colors.negative }]}
                      onPress={() => setConfirmDangerAction('archive')}
                      disabled={userRole !== 'admin'}
                    >
                      <Text style={[styles.dangerBtnText, { color: colors.negative }]}>Archive Room</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
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
    gap: 6,
    paddingBottom: 12
  },
  tabPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 46,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  closeMonthBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 14
  },
  closeMonthTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  closeMonthDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14
  },
  closeMonthBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeMonthBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  rowCard: {
    padding: 12,
    minHeight: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowMainText: {
    fontSize: 13,
    fontWeight: '700'
  },
  rowSubText: {
    fontSize: 11
  },
  roleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  dangerBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4
  },
  dangerDesc: {
    fontSize: 12,
    marginBottom: 12
  },
  dangerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dangerBtnText: {
    fontSize: 12,
    fontWeight: '700'
  }
});
