import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../components/ui/Button';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import { SettingsView } from './SettingsView';
import {
  Edit3,
  Shield,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react-native';

export const ProfileView = () => {
  const {
    currentUser,
    setCurrentUser,
    userRole,
    room,
    balances,
    logoutUser,
    showToast,
    language,
    t,
    colors
  } = useApp();

  // Top sub-tab selector: 'profile' | 'settings'
  const [subTab, setSubTab] = useState('profile');

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editMobile, setEditMobile] = useState(currentUser.mobile || '');

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast(language === 'ne' ? 'कृपया पूरा नाम राख्नुहोस्' : 'Name is required', 'error');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@') || !editEmail.includes('.')) {
      showToast(language === 'ne' ? 'कृपया मान्य इमेल राख्नुहोस्' : 'Valid email is required', 'error');
      return;
    }
    setCurrentUser(prev => ({
      ...prev,
      name: editName.trim(),
      email: editEmail.trim(),
      mobile: editMobile.trim()
    }));
    setIsEditProfileOpen(false);
    showToast(language === 'ne' ? '✓ प्रोफाइल सुरक्षित भयो!' : '✓ Profile updated successfully!');
  };

  const isAdmin = userRole === 'admin';
  const myBalance = balances[currentUser.id] || { totalPaid: 0, totalShare: 0, netBalance: 0 };
  const net = Math.round(myBalance.netBalance);

  return (
    <SwipeBackWrapper
      onSwipeBack={() => {
        if (subTab === 'settings') {
          setSubTab('profile');
        }
      }}
      enabled={subTab === 'settings'}
    >
      <View style={styles.outerContainer}>
        {/* Top Profile / Settings Toggle Header */}
        <View style={[styles.topTabsWrapper, { backgroundColor: colors.bgSurface, borderBottomColor: colors.border }]}>
          <View style={[styles.tabBarPill, { backgroundColor: colors.bgSubtle }]}>
            <TouchableOpacity
              style={[
                styles.tabPillItem,
                subTab === 'profile' && {
                  backgroundColor: colors.bgSurface,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 3,
                  elevation: 2
                }
              ]}
              onPress={() => setSubTab('profile')}
              activeOpacity={0.8}
            >
              <User size={15} color={subTab === 'profile' ? colors.primary : colors.textMuted} />
              <Text style={[styles.tabPillText, { color: subTab === 'profile' ? colors.primary : colors.textMuted, fontWeight: subTab === 'profile' ? '800' : '600' }]}>
                {language === 'ne' ? 'मेरो प्रोफाइल' : 'My Profile'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabPillItem,
                subTab === 'settings' && {
                  backgroundColor: colors.bgSurface,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 3,
                  elevation: 2
                }
              ]}
              onPress={() => setSubTab('settings')}
              activeOpacity={0.8}
            >
              <Settings size={15} color={subTab === 'settings' ? colors.primary : colors.textMuted} />
              <Text style={[styles.tabPillText, { color: subTab === 'settings' ? colors.primary : colors.textMuted, fontWeight: subTab === 'settings' ? '800' : '600' }]}>
                {language === 'ne' ? 'एप सेटिङहरू' : 'Settings'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RENDER SETTINGS TAB */}
        {subTab === 'settings' ? (
          <SettingsView onBack={() => setSubTab('profile')} />
        ) : (
          /* RENDER CLEAN PROFILE TAB (ROOM MANAGEMENT REMOVED) */
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* 1. Profile Card Header */}
            <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border, alignItems: 'center', position: 'relative' }]}>
              <View style={[styles.avatarCircle, { backgroundColor: isAdmin ? colors.secondaryLight : colors.primaryLight }]}>
                <Text style={{ fontSize: 36 }}>{currentUser.avatar || (isAdmin ? '👑' : '👦')}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.userName, { color: colors.textMain }]}>{currentUser.name}</Text>
                {isAdmin ? (
                  <View style={[styles.roleBadge, { backgroundColor: colors.secondaryLight }]}>
                    <Shield size={10} color={colors.secondary} />
                    <Text style={[styles.roleBadgeText, { color: colors.secondary }]}>ADMIN</Text>
                  </View>
                ) : (
                  <View style={[styles.roleBadge, { backgroundColor: colors.bgSubtle }]}>
                    <Text style={[styles.roleBadgeText, { color: colors.textMuted }]}>MEMBER</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{currentUser.email}</Text>
              {currentUser.mobile ? (
                <Text style={[styles.userMobile, { color: colors.primary }]}>
                  📱 {currentUser.mobile}
                </Text>
              ) : null}

              {/* Edit Icon Button */}
              <TouchableOpacity
                onPress={() => {
                  setEditName(currentUser.name);
                  setEditEmail(currentUser.email);
                  setEditMobile(currentUser.mobile || '');
                  setIsEditProfileOpen(true);
                }}
                style={[styles.editIconBtn, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Edit3 size={15} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            {/* 2. My Financial Stats in this Room */}
            <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Wallet size={16} color={colors.primary} />
                <Text style={[styles.sectionHeader, { color: colors.textMain, marginBottom: 0 }]}>
                  {language === 'ne' ? 'मेरो वित्तीय स्थिति (My Balance)' : 'My Financial Summary'}
                </Text>
              </View>

              <View style={styles.statsGrid}>
                {/* Total Paid */}
                <View style={[styles.statBox, { backgroundColor: colors.bgSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ArrowUpRight size={14} color={colors.positive} />
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                      {language === 'ne' ? 'तिरेको रकम' : 'Total Paid'}
                    </Text>
                  </View>
                  <Text style={[styles.statVal, { color: colors.textMain }]}>
                    Rs. {myBalance.totalPaid.toLocaleString()}
                  </Text>
                </View>

                {/* Total Share */}
                <View style={[styles.statBox, { backgroundColor: colors.bgSubtle }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <ArrowDownLeft size={14} color={colors.negative} />
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                      {language === 'ne' ? 'मेरो हिस्सा' : 'My Share'}
                    </Text>
                  </View>
                  <Text style={[styles.statVal, { color: colors.textMain }]}>
                    Rs. {myBalance.totalShare.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Net Position Banner */}
              <View
                style={[
                  styles.netPositionBanner,
                  {
                    backgroundColor: net > 0 ? colors.positiveLight : net < 0 ? colors.negativeLight : colors.bgSubtle,
                    borderColor: net > 0 ? colors.positive : net < 0 ? colors.negative : colors.border
                  }
                ]}
              >
                {net === 0 ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} color={colors.positive} />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.positive }}>
                      {language === 'ne' ? 'सबै हिसाब बराबर छ (All Settled)' : 'All accounts settled!'}
                    </Text>
                  </View>
                ) : net > 0 ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.positive }}>
                      {language === 'ne' ? 'तपाईंले पाउनुपर्ने रकम (You Get):' : 'You are owed:'}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.positive }}>
                      + Rs. {net.toLocaleString()}
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.negative }}>
                      {language === 'ne' ? 'तपाईंले तिर्नुपर्ने रकम (You Owe):' : 'You owe:'}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.negative }}>
                      - Rs. {Math.abs(net).toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 3. Account Details Info Card */}
            <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
                {language === 'ne' ? 'खाता विवरण (ACCOUNT INFO)' : 'ACCOUNT INFORMATION'}
              </Text>

              <View style={{ gap: 8 }}>
                <View style={[styles.infoRow, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={[styles.infoRowLabel, { color: colors.textMuted }]}>
                    {language === 'ne' ? 'सम्बद्ध कोठा' : 'Active Room'}
                  </Text>
                  <Text style={[styles.infoRowVal, { color: colors.textMain }]}>{room.name}</Text>
                </View>

                <View style={[styles.infoRow, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={[styles.infoRowLabel, { color: colors.textMuted }]}>
                    {language === 'ne' ? 'सदस्य भूमिका' : 'Role'}
                  </Text>
                  <Text style={[styles.infoRowVal, { color: colors.primary }]}>
                    {isAdmin ? 'Room Admin' : 'Member'}
                  </Text>
                </View>

                <View style={[styles.infoRow, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={[styles.infoRowLabel, { color: colors.textMuted }]}>
                    {language === 'ne' ? 'खाता स्थिति' : 'Account Status'}
                  </Text>
                  <View style={[styles.statusPill, { backgroundColor: colors.positiveLight }]}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.positive }}>Active</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 4. Link to All App Settings */}
            <TouchableOpacity
              style={[styles.settingsLinkBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              onPress={() => setSubTab('settings')}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={[styles.linkIconBox, { backgroundColor: colors.primaryLight }]}>
                  <Settings size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.linkTitle, { color: colors.textMain }]}>
                    {language === 'ne' ? 'एप तथा कोठा सेटिङहरू' : 'Settings & Room Management'}
                  </Text>
                  <Text style={[styles.linkSub, { color: colors.textMuted }]}>
                    {language === 'ne' ? 'थिम, सूचना, सदस्य, कोटि र सुरक्षा सेटिङहरू' : 'Appearance, members, categories & security'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>

            {/* 5. Sign Out Button */}
            <Button
              variant="danger"
              size="lg"
              fullWidth
              icon={<LogOut size={18} color="#ffffff" />}
              onPress={() => setIsLogoutConfirmOpen(true)}
              style={{ marginTop: 8 }}
            >
              {t('signOutBtn')}
            </Button>
          </ScrollView>
        )}

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <Modal visible={isEditProfileOpen} transparent animationType="slide" onRequestClose={() => setIsEditProfileOpen(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
                <Text style={[styles.modalTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? 'प्रोफाइल सम्पादन' : 'Edit Profile'}
                </Text>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.textMain }]}>
                    {language === 'ne' ? 'पूरा नाम *' : 'Full Name *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      value={editName}
                      onChangeText={setEditName}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.textMain }]}>
                    {language === 'ne' ? 'इमेल ठेगाना *' : 'Email Address *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      value={editEmail}
                      onChangeText={setEditEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: colors.textMain }]}>
                    {language === 'ne' ? 'मोबाइल नम्बर' : 'Mobile Number'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      value={editMobile}
                      onChangeText={setEditMobile}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.modalBtnRow}>
                  <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsEditProfileOpen(false)}>
                    {language === 'ne' ? 'रद्द' : 'Cancel'}
                  </Button>
                  <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleSaveProfile}>
                    {language === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Profile'}
                  </Button>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}

        {/* Confirm Logout Modal */}
        <ConfirmModal
          isOpen={isLogoutConfirmOpen}
          onClose={() => setIsLogoutConfirmOpen(false)}
          onConfirm={() => {
            setIsLogoutConfirmOpen(false);
            logoutUser();
          }}
          title={language === 'ne' ? 'लगआउट गर्नुहुन्छ?' : 'Sign Out?'}
          description={language === 'ne' ? 'के तपाईं क्यासमेटबाट बाहिरिन निश्चित हुनुहुन्छ?' : 'Are you sure you want to sign out of CashMate?'}
          confirmText={language === 'ne' ? 'लगआउट' : 'Sign Out'}
          confirmVariant="danger"
        />
      </View>
    </SwipeBackWrapper>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  topTabsWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  tabBarPill: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    gap: 4
  },
  tabPillItem: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  tabPillText: {
    fontSize: 12
  },
  container: {
    padding: 16,
    paddingBottom: 110,
    gap: 16
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  userName: {
    fontSize: 18,
    fontWeight: '800'
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2
  },
  userMobile: {
    marginTop: 4,
    fontWeight: '700',
    fontSize: 13
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800'
  },
  editIconBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    gap: 4
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600'
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900'
  },
  netPositionBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  infoRowLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
  infoRowVal: {
    fontSize: 12,
    fontWeight: '800'
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  settingsLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1
  },
  linkIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  linkSub: {
    fontSize: 11,
    marginTop: 2
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    borderRadius: 20,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16
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
  inputInnerIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 2
  },
  textInputWithIcon: {
    height: 44,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingLeft: 38,
    paddingRight: 14,
    fontSize: 13
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10
  }
});
