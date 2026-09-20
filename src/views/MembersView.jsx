import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { UserPlus, X, Mail, Phone, Trash2, Shield, UserCheck } from 'lucide-react-native';

export const MembersView = () => {
  const {
    room,
    members,
    balances,
    currentUser,
    userRole,
    addMemberByAdmin,
    removeMember,
    isMemberDetailOpen,
    setIsMemberDetailOpen,
    showToast,
    colors
  } = useApp();

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [removeConfirmTarget, setRemoveConfirmTarget] = useState(null);

  const [newMemName, setNewMemName] = useState('');
  const [newMemMobile, setNewMemMobile] = useState('');
  const [newMemEmail, setNewMemEmail] = useState('');
  const [newMemPass, setNewMemPass] = useState('password123');
  const [newMemConfirmPass, setNewMemConfirmPass] = useState('password123');

  const handleAddMemberSubmit = () => {
    if (!newMemName.trim()) {
      showToast('Please enter member full name.', 'error');
      return;
    }
    if (!newMemMobile.trim()) {
      showToast('Please enter mobile number.', 'error');
      return;
    }
    if (!newMemEmail.trim()) {
      showToast('Please enter email address.', 'error');
      return;
    }
    if (!newMemPass || newMemPass.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newMemPass !== newMemConfirmPass) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    const res = addMemberByAdmin({
      fullName: newMemName.trim(),
      mobile: newMemMobile.trim(),
      email: newMemEmail.trim(),
      password: newMemPass
    });

    if (res.success) {
      setNewMemName('');
      setNewMemMobile('');
      setNewMemEmail('');
      setNewMemPass('password123');
      setNewMemConfirmPass('password123');
      setIsAddMemberModalOpen(false);
    }
  };

  const isAdmin = userRole === 'admin';
  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.textMain }]}>Room Members</Text>
          <Text style={[styles.subTitle, { color: colors.textMuted }]}>
            {activeMembersCount} active members in {room.name}
          </Text>
        </View>

        {/* Add Member Button — VISIBLE ONLY TO ADMIN! */}
        {isAdmin && (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => setIsAddMemberModalOpen(true)}
          >
            <UserPlus size={16} color="#ffffff" />
            <Text style={styles.addBtnText}>Add Member</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Members List */}
      <View style={{ gap: 10 }}>
        {members.map(m => {
          const mBal = balances[m.id] || { totalPaid: 0, totalShare: 0, netBalance: 0 };
          const net = mBal.netBalance;
          const isRemoved = m.status === 'REMOVED';

          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.memberCard,
                {
                  backgroundColor: isRemoved ? colors.bgSubtle : colors.bgCard,
                  borderColor: colors.border,
                  opacity: isRemoved ? 0.6 : 1
                }
              ]}
              onPress={() => setIsMemberDetailOpen(m)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[styles.avatarBox, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={{ fontSize: 24 }}>{m.avatar || '👦'}</Text>
                </View>

                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.memberName, { color: colors.textMain }]}>
                      {m.name} {m.id === currentUser.id ? '(You)' : ''}
                    </Text>
                    {m.role === 'admin' ? (
                      <View style={[styles.roleBadge, { backgroundColor: colors.secondaryLight }]}>
                        <Shield size={10} color={colors.secondary} />
                        <Text style={[styles.roleBadgeText, { color: colors.secondary }]}>Admin</Text>
                      </View>
                    ) : (
                      <View style={[styles.roleBadge, { backgroundColor: colors.bgSubtle }]}>
                        <UserCheck size={10} color={colors.textMuted} />
                        <Text style={[styles.roleBadgeText, { color: colors.textMuted }]}>Member</Text>
                      </View>
                    )}

                    {isRemoved && (
                      <View style={[styles.roleBadge, { backgroundColor: colors.negativeLight }]}>
                        <Text style={[styles.roleBadgeText, { color: colors.negative }]}>Removed</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.memberSub, { color: colors.textMuted }]}>
                    Paid Rs. {mBal.totalPaid.toLocaleString()} • Share Rs. {mBal.totalShare.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View>
                {net < -0.01 ? (
                  <View style={[styles.posBadge, { backgroundColor: colors.negativeLight }]}>
                    <Text style={[styles.posText, { color: colors.negative }]}>
                      Owes Rs. {Math.abs(Math.round(net)).toLocaleString()}
                    </Text>
                  </View>
                ) : net > 0.01 ? (
                  <View style={[styles.posBadge, { backgroundColor: colors.positiveLight }]}>
                    <Text style={[styles.posText, { color: colors.positive }]}>
                      Gets Rs. {Math.round(net).toLocaleString()}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.posBadge, { backgroundColor: colors.bgSubtle }]}>
                    <Text style={[styles.posText, { color: colors.textMuted }]}>Settled</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Member Detail Sheet Modal */}
      {isMemberDetailOpen && (
        <Modal visible={!!isMemberDetailOpen} transparent animationType="slide" onRequestClose={() => setIsMemberDetailOpen(null)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>Member Profile Details</Text>
                <TouchableOpacity onPress={() => setIsMemberDetailOpen(null)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={[styles.largeAvatar, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={{ fontSize: 36 }}>{isMemberDetailOpen.avatar || '👦'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.profileName, { color: colors.textMain }]}>{isMemberDetailOpen.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: isMemberDetailOpen.role === 'admin' ? colors.secondaryLight : colors.bgSubtle }]}>
                    <Text style={[styles.roleBadgeText, { color: isMemberDetailOpen.role === 'admin' ? colors.secondary : colors.textMuted }]}>
                      {isMemberDetailOpen.role?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.profileSub, { color: colors.textMuted }]}>
                  Joined {isMemberDetailOpen.joinedDate || '2026-08-15'} • Status: {isMemberDetailOpen.status || 'ACTIVE'}
                </Text>
              </View>

              <View style={{ gap: 8, marginBottom: 16 }}>
                <View style={[styles.infoRow, { backgroundColor: colors.bgSubtle }]}>
                  <Mail size={18} color={colors.textMuted} />
                  <Text style={[styles.infoText, { color: colors.textMain }]}>{isMemberDetailOpen.email}</Text>
                </View>
                <View style={[styles.infoRow, { backgroundColor: colors.bgSubtle }]}>
                  <Phone size={18} color={colors.textMuted} />
                  <Text style={[styles.infoText, { color: colors.textMain }]}>{isMemberDetailOpen.mobile}</Text>
                </View>
              </View>

              {/* Financial Summary */}
              <View style={[styles.finSummaryBox, { backgroundColor: colors.bgSubtle }]}>
                <Text style={[styles.finHeader, { color: colors.textMuted }]}>FINANCIAL POSITION</Text>
                <View style={styles.finGrid}>
                  <View style={styles.finCol}>
                    <Text style={[styles.finLabel, { color: colors.textMuted }]}>Total Paid</Text>
                    <Text style={[styles.finVal, { color: colors.textMain }]}>
                      Rs. {(balances[isMemberDetailOpen.id]?.totalPaid || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.finCol}>
                    <Text style={[styles.finLabel, { color: colors.textMuted }]}>Total Share</Text>
                    <Text style={[styles.finVal, { color: colors.secondary }]}>
                      Rs. {(balances[isMemberDetailOpen.id]?.totalShare || 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Remove Member Button (ADMIN ONLY!) */}
              {isAdmin && isMemberDetailOpen.id !== currentUser.id && isMemberDetailOpen.status !== 'REMOVED' && (
                <TouchableOpacity
                  style={[styles.removeBtn, { backgroundColor: colors.negative }]}
                  onPress={() => setRemoveConfirmTarget(isMemberDetailOpen)}
                >
                  <Trash2 size={16} color="#ffffff" />
                  <Text style={styles.removeBtnText}>Remove Member from Room</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Add Member Modal (ADMIN ONLY) */}
      {isAddMemberModalOpen && (
        <Modal visible={isAddMemberModalOpen} transparent animationType="slide" onRequestClose={() => setIsAddMemberModalOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>Add New Member</Text>
                <TouchableOpacity onPress={() => setIsAddMemberModalOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Full Name *</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="e.g. Hari Thapa"
                  placeholderTextColor={colors.textMuted}
                  value={newMemName}
                  onChangeText={setNewMemName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Mobile Number *</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="+977 9801234567"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={newMemMobile}
                  onChangeText={setNewMemMobile}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Email Address *</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="hari@gmail.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  value={newMemEmail}
                  onChangeText={setNewMemEmail}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>New Password *</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={newMemPass}
                  onChangeText={setNewMemPass}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Confirm Password *</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={newMemConfirmPass}
                  onChangeText={setNewMemConfirmPass}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.primary, marginTop: 14 }]}
                onPress={handleAddMemberSubmit}
              >
                <Text style={styles.submitBtnText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Confirmation Modal for Removing Member (Preserves Historical Data) */}
      <ConfirmModal
        isOpen={removeConfirmTarget !== null}
        onClose={() => setRemoveConfirmTarget(null)}
        onConfirm={() => {
          if (removeConfirmTarget) {
            removeMember(removeConfirmTarget.id);
            setRemoveConfirmTarget(null);
            setIsMemberDetailOpen(null);
          }
        }}
        title={`Remove ${removeConfirmTarget?.name}?`}
        description={`Are you sure you want to remove ${removeConfirmTarget?.name} from ${room.name}? Previous expenses and settlement history will be safely preserved.`}
        confirmText="Remove Member"
        confirmVariant="danger"
      />
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
    paddingHorizontal: 14,
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
  memberCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700'
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '700'
  },
  memberSub: {
    fontSize: 11,
    marginTop: 2
  },
  posBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  posText: {
    fontSize: 11,
    fontWeight: '700'
  },
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
  largeAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800'
  },
  profileSub: {
    fontSize: 12,
    marginTop: 2
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600'
  },
  finSummaryBox: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12
  },
  finHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  finGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  finCol: {
    alignItems: 'center'
  },
  finLabel: {
    fontSize: 10,
    fontWeight: '700'
  },
  finVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2
  },
  removeBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6
  },
  removeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  formGroup: {
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 13
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  }
});
