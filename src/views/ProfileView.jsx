import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, StyleSheet, Share } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { Sun, Moon, Monitor, Bell, HelpCircle, FileText, LogOut, ChevronRight, Edit3, Globe, Shield, UserPlus, Users, Settings, Tag, Sliders, Copy, Share2, Phone } from 'lucide-react-native';

export const ProfileView = () => {
  const {
    currentUser,
    setCurrentUser,
    userRole,
    room,
    theme,
    setTheme,
    calendarSystem,
    setCalendarSystem,
    deviceFrame,
    setDeviceFrame,
    setAuthScreen,
    logoutUser,
    setIsAdminPanelOpen,
    addMemberByAdmin,
    showToast,
    colors
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Add Member Modal State (Admin Only)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemName, setNewMemName] = useState('');
  const [newMemMobile, setNewMemMobile] = useState('');
  const [newMemEmail, setNewMemEmail] = useState('');
  const [newMemPass, setNewMemPass] = useState('password123');
  const [newMemConfirmPass, setNewMemConfirmPass] = useState('password123');

  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editMobile, setEditMobile] = useState(currentUser.mobile);

  const handleSaveProfile = () => {
    setCurrentUser(prev => ({
      ...prev,
      name: editName,
      email: editEmail,
      mobile: editMobile
    }));
    setIsEditProfileOpen(false);
    showToast('Profile updated successfully!');
  };

  const handleCopyCode = (code) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    showToast(`✓ Room Code ${code} copied to clipboard!`);
  };

  const handleShareCode = async (rName, code) => {
    try {
      const shareMessage = `Join my CashMate room: ${rName}\nRoom Code: ${code}\nDownload CashMate and use this code to join.`;
      await Share.share({
        message: shareMessage,
        title: `Join ${rName} on CashMate`
      });
    } catch (err) {
      showToast('Could not share room code: ' + err.message, 'error');
    }
  };

  const handleAddMemberSubmit = () => {
    if (!newMemName.trim()) {
      showToast('Member Full Name is required.', 'error');
      return;
    }
    if (!newMemMobile.trim()) {
      showToast('Mobile Number is required.', 'error');
      return;
    }
    if (!newMemEmail.trim()) {
      showToast('Email Address is required.', 'error');
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
      setIsAddMemberOpen(false);
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card Header */}
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
          <Text style={[styles.userMobile, { color: colors.primary, marginTop: 4, fontWeight: '700', fontSize: 13 }]}>
            📱 {currentUser.mobile || '+977 9801234567'}
          </Text>

          <TouchableOpacity
            onPress={() => setIsEditProfileOpen(true)}
            style={[styles.editIconBtn, { backgroundColor: colors.bgSubtle }]}
          >
            <Edit3 size={16} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        {/* Room Info & Permanent Room Code Box */}
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
            CURRENT ROOM INFORMATION
          </Text>

          <View style={[styles.roomInfoBox, { backgroundColor: colors.bgSubtle }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.roomInfoName, { color: colors.textMain }]}>{room.name}</Text>
              <Text style={[styles.roomInfoDesc, { color: colors.textMuted }]}>{room.description}</Text>
            </View>
          </View>

          {/* PERMANENT ROOM CODE (DISPLAYED PROMINENTLY) */}
          <View style={[styles.codeDisplayCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <View>
              <Text style={[styles.codeLabel, { color: colors.textMuted }]}>PERMANENT ROOM CODE</Text>
              <Text style={[styles.codeBigText, { color: colors.primary }]}>{room.code}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                style={[styles.codeBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleCopyCode(room.code)}
              >
                <Copy size={12} color="#ffffff" />
                <Text style={styles.codeBtnText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.codeBtn, { backgroundColor: colors.secondary }]}
                onPress={() => handleShareCode(room.name, room.code)}
              >
                <Share2 size={12} color="#ffffff" />
                <Text style={styles.codeBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ADMIN ROOM MANAGEMENT SECTION (ADMIN ONLY!) */}
        {isAdmin && (
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.secondary, borderWidth: 1.5 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Shield size={16} color={colors.secondary} />
              <Text style={[styles.sectionHeader, { color: colors.secondary, marginBottom: 0 }]}>
                ROOM MANAGEMENT (ADMIN ONLY)
              </Text>
            </View>

            <View style={{ gap: 6 }}>
              <TouchableOpacity
                style={[styles.adminOptionRow, { backgroundColor: colors.primaryLight }]}
                onPress={() => setIsAddMemberOpen(true)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <UserPlus size={18} color={colors.primary} />
                  <Text style={[styles.adminOptionText, { color: colors.primary, fontWeight: '700' }]}>Add Member</Text>
                </View>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminOptionRow}
                onPress={() => setIsAdminPanelOpen('members')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Users size={18} color={colors.textMuted} />
                  <Text style={[styles.adminOptionText, { color: colors.textMain }]}>Manage Members</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminOptionRow}
                onPress={() => setIsAdminPanelOpen('categories')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Tag size={18} color={colors.textMuted} />
                  <Text style={[styles.adminOptionText, { color: colors.textMain }]}>Categories</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminOptionRow}
                onPress={() => setIsAdminPanelOpen('split')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Sliders size={18} color={colors.textMuted} />
                  <Text style={[styles.adminOptionText, { color: colors.textMain }]}>Split Settings</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminOptionRow}
                onPress={() => setIsAdminPanelOpen('general')}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Settings size={18} color={colors.textMuted} />
                  <Text style={[styles.adminOptionText, { color: colors.textMain }]}>Room Settings</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ACCOUNT & PREFERENCES MAIN SECTION */}
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
            ACCOUNT & SUPPORT
          </Text>

          <View style={{ gap: 4 }}>
            {/* 1. Mobile Number */}
            <View style={styles.optionRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Phone size={18} color={colors.textMuted} />
                <Text style={[styles.optionText, { color: colors.textMain }]}>Mobile Number</Text>
              </View>
              <Text style={[styles.optionSub, { color: colors.primary, fontWeight: '700' }]}>
                {currentUser.mobile || '+977 9801234567'}
              </Text>
            </View>

            {/* 2. Settings (Submenu containing all system toggles) */}
            <TouchableOpacity style={styles.optionRow} onPress={() => setIsSettingsOpen(true)} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Settings size={18} color={colors.primary} />
                <Text style={[styles.optionText, { color: colors.textMain, fontWeight: '700' }]}>Settings</Text>
              </View>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>

            {/* 3. Help & Support */}
            <TouchableOpacity style={styles.optionRow} onPress={() => setIsHelpOpen(true)} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <HelpCircle size={18} color={colors.textMuted} />
                <Text style={[styles.optionText, { color: colors.textMain }]}>Help & Support</Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* 4. Terms & Privacy */}
            <TouchableOpacity style={styles.optionRow} onPress={() => setIsTermsOpen(true)} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <FileText size={18} color={colors.textMuted} />
                <Text style={[styles.optionText, { color: colors.textMain }]}>Terms & Privacy</Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.negativeLight, borderColor: colors.negativeLight }]}
          onPress={() => setIsLogoutConfirmOpen(true)}
          activeOpacity={0.7}
        >
          <LogOut size={18} color={colors.negative} />
          <Text style={[styles.logoutBtnText, { color: colors.negative }]}>Sign Out of CashMate</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <Modal visible={isEditProfileOpen} transparent animationType="slide" onRequestClose={() => setIsEditProfileOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>Edit Profile</Text>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  value={editEmail}
                  onChangeText={setEditEmail}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textMain }]}>Mobile Number</Text>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                  value={editMobile}
                  onChangeText={setEditMobile}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.bgSubtle, borderColor: colors.border, borderWidth: 1 }]}
                  onPress={() => setIsEditProfileOpen(false)}
                >
                  <Text style={{ color: colors.textMain, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.primary }]}
                  onPress={handleSaveProfile}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '700' }}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ADD MEMBER MODAL (ADMIN ONLY) */}
      {isAddMemberOpen && (
        <Modal visible={isAddMemberOpen} transparent animationType="slide" onRequestClose={() => setIsAddMemberOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>Add New Member to Room</Text>

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
                <Text style={[styles.label, { color: colors.textMain }]}>New Member Password *</Text>
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

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.bgSubtle, borderColor: colors.border, borderWidth: 1 }]}
                  onPress={() => setIsAddMemberOpen(false)}
                >
                  <Text style={{ color: colors.textMain, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: colors.primary }]}
                  onPress={handleAddMemberSubmit}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '700' }}>Add Member</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <Modal visible={isHelpOpen} transparent animationType="slide" onRequestClose={() => setIsHelpOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>Help & Support</Text>
              <Text style={[styles.helpText, { color: colors.textMuted }]}>
                Need assistance with room expense calculations or settlement optimization? Contact our support team.
              </Text>
              <View style={[styles.helpBox, { backgroundColor: colors.bgSubtle }]}>
                <Text style={[styles.helpBoxText, { color: colors.textMain }]}>📧 shrestha.finance2082@gmail.com</Text>
                <Text style={[styles.helpBoxText, { color: colors.textMain }]}>📞 +977 9824718666</Text>
              </View>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, marginTop: 12 }]} onPress={() => setIsHelpOpen(false)} activeOpacity={0.7}>
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* SETTINGS SUBMENU MODAL (CONTAINS ALL ON/OFF TOGGLE SYSTEMS) */}
      {isSettingsOpen && (
        <Modal visible={isSettingsOpen} transparent animationType="slide" onRequestClose={() => setIsSettingsOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>⚙️ App Settings & Toggles</Text>
              <Text style={[styles.helpText, { color: colors.textMuted, marginBottom: 16 }]}>
                Configure your app preferences, theme switches, and notification settings below.
              </Text>

              {/* 1. Theme On/Off Switch */}
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.label, { color: colors.textMain, marginBottom: 8 }]}>Theme & Appearance Mode</Text>
                <View style={[styles.tabBar, { backgroundColor: colors.bgSubtle }]}>
                  <TouchableOpacity
                    onPress={() => setTheme('light')}
                    style={[styles.tabBtn, theme === 'light' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Sun size={14} color={theme === 'light' ? colors.primary : colors.textMuted} />
                    <Text style={[styles.tabBtnText, { color: theme === 'light' ? colors.primary : colors.textMuted }]}>Light</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setTheme('dark')}
                    style={[styles.tabBtn, theme === 'dark' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Moon size={14} color={theme === 'dark' ? colors.primary : colors.textMuted} />
                    <Text style={[styles.tabBtnText, { color: theme === 'dark' ? colors.primary : colors.textMuted }]}>Dark</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setTheme('system')}
                    style={[styles.tabBtn, theme === 'system' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Monitor size={14} color={theme === 'system' ? colors.primary : colors.textMuted} />
                    <Text style={[styles.tabBtnText, { color: theme === 'system' ? colors.primary : colors.textMuted }]}>System</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2. Push Notifications On/Off Toggle */}
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.label, { color: colors.textMain, marginBottom: 8 }]}>Push Notifications</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.bgSubtle, padding: 12, borderRadius: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Bell size={18} color={colors.primary} />
                    <Text style={{ color: colors.textMain, fontWeight: '600' }}>Enable Notifications</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setPushNotifications(!pushNotifications);
                      showToast(pushNotifications ? 'Notifications disabled' : 'Notifications enabled');
                    }}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 9999,
                      backgroundColor: pushNotifications ? colors.positiveLight : colors.bgSurface,
                      borderColor: pushNotifications ? colors.positive : colors.border,
                      borderWidth: 1
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: pushNotifications ? colors.positive : colors.textMuted, fontWeight: '700', fontSize: 12 }}>
                      {pushNotifications ? 'ON ✓' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 3. Nepali Calendar System AD/BS Toggle */}
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.label, { color: colors.textMain, marginBottom: 8 }]}>Calendar Date System</Text>
                <View style={[styles.tabBar, { backgroundColor: colors.bgSubtle }]}>
                  <TouchableOpacity
                    onPress={() => setCalendarSystem('AD')}
                    style={[styles.tabBtn, calendarSystem === 'AD' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Globe size={14} color={calendarSystem === 'AD' ? colors.primary : colors.textMuted} />
                    <Text style={[styles.tabBtnText, { color: calendarSystem === 'AD' ? colors.primary : colors.textMuted }]}>AD (English)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCalendarSystem('BS')}
                    style={[styles.tabBtn, calendarSystem === 'BS' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: calendarSystem === 'BS' ? colors.primary : colors.textMuted }}>ने</Text>
                    <Text style={[styles.tabBtnText, { color: calendarSystem === 'BS' ? colors.primary : colors.textMuted }]}>BS (Nepali)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4. App Device Frame Selector */}
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.label, { color: colors.textMain, marginBottom: 8 }]}>Device Frame View</Text>
                <View style={[styles.tabBar, { backgroundColor: colors.bgSubtle }]}>
                  <TouchableOpacity
                    onPress={() => setDeviceFrame('iphone')}
                    style={[styles.tabBtn, deviceFrame === 'iphone' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, color: deviceFrame === 'iphone' ? colors.primary : colors.textMuted }}>📱 iPhone</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setDeviceFrame('android')}
                    style={[styles.tabBtn, deviceFrame === 'android' && { backgroundColor: colors.bgSurface }]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, color: deviceFrame === 'android' ? colors.primary : colors.textMuted }}>🤖 Android</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, marginTop: 10 }]} onPress={() => setIsSettingsOpen(false)} activeOpacity={0.7}>
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Done & Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* TERMS & PRIVACY MODAL */}
      {isTermsOpen && (
        <Modal visible={isTermsOpen} transparent animationType="slide" onRequestClose={() => setIsTermsOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>📜 Terms & Privacy Policy</Text>
              <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
                <Text style={{ color: colors.textMain, fontWeight: '700', marginBottom: 4 }}>1. Data Privacy & Security</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>
                  CashMate values your financial privacy. All room expenses, balances, and member entries remain strictly confidential to your room members.
                </Text>

                <Text style={{ color: colors.textMain, fontWeight: '700', marginBottom: 4 }}>2. Shared Room Accounting Rules</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>
                  Room expenses are divided according to selected split methods (Equal, Custom, or Selected Members). Deactivating a member preserves historic expense balances.
                </Text>

                <Text style={{ color: colors.textMain, fontWeight: '700', marginBottom: 4 }}>3. Admin Rights & Ownership</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>
                  The creator of the room acts as Room Admin with authority to add or soft-deactivate members and manage permanent room codes.
                </Text>
              </ScrollView>

              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, marginTop: 10 }]} onPress={() => setIsTermsOpen(false)} activeOpacity={0.7}>
                <Text style={{ color: '#ffffff', fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          logoutUser();
        }}
        title="Sign Out?"
        description="Are you sure you want to sign out of CashMate?"
        confirmText="Sign Out"
        confirmVariant="danger"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  userName: {
    fontSize: 18,
    fontWeight: '800'
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2
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
    padding: 8,
    borderRadius: 20
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.5
  },
  roomInfoBox: {
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  roomInfoName: {
    fontSize: 14,
    fontWeight: '800'
  },
  roomInfoDesc: {
    fontSize: 11,
    marginTop: 2
  },
  codeDisplayCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  codeBigText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2
  },
  codeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  codeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  adminOptionRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  adminOptionText: {
    fontSize: 13,
    fontWeight: '600'
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cbd5e1',
    minHeight: 48
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600'
  },
  logoutBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  logoutBtnText: {
    fontSize: 14,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    minHeight: 46
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  helpText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16
  },
  helpBox: {
    padding: 12,
    borderRadius: 14,
    gap: 4,
    marginBottom: 20
  },
  helpBoxText: {
    fontSize: 13,
    fontWeight: '600'
  }
});
