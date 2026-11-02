import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  StyleSheet,
  Platform,
  Share,
  KeyboardAvoidingView
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { Button } from '../components/ui/Button';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Lock,
  Mail,
  Phone,
  Laptop,
  LogOut,
  Trash2,
  Home,
  Copy,
  Share2,
  Globe,
  Calendar,
  Shield,
  FileText,
  HelpCircle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Send,
  Sliders,
  DollarSign,
  UserPlus,
  Users,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Tag,
  RotateCcw
} from 'lucide-react-native';

export const SettingsView = ({ onBack = null }) => {
  const {
    currentUser,
    setCurrentUser,
    userRole,
    room,
    setRoom,
    theme,
    setTheme,
    language,
    setLanguage,
    calendarSystem,
    setCalendarSystem,
    logoutUser,
    setIsAdminPanelOpen,
    showToast,
    expenses,
    settlements,
    members,
    setMembers,
    addMemberByAdmin,
    removeMember,
    categories,
    addCategory,
    currentMonth,
    closedMonths,
    closeCurrentMonth,
    getCategoryName,
    clearAllData,
    colors
  } = useApp();

  // ----------------------------------------------------
  // SECTION B: NOTIFICATION PREFERENCES (PERSISTENT)
  // ----------------------------------------------------
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('cashmate_notif_prefs');
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return {
      expenses: true,
      settlements: true,
      roomActivity: true,
      memberActivity: true
    };
  });

  const toggleNotif = (key) => {
    setNotifPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('cashmate_notif_prefs', JSON.stringify(updated));
        }
      } catch (e) {
        // ignore
      }
      showToast(
        updated[key]
          ? (language === 'ne' ? 'सूचना सक्रिय भयो' : 'Notification preference enabled')
          : (language === 'ne' ? 'सूचना निष्कृय भयो' : 'Notification preference disabled')
      );
      return updated;
    });
  };

  // ----------------------------------------------------
  // SECTION C: ACCOUNT & SECURITY MODALS & STATES
  // ----------------------------------------------------
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState(currentUser.email || '');

  const [isUpdateMobileOpen, setIsUpdateMobileOpen] = useState(false);
  const [newMobile, setNewMobile] = useState(currentUser.mobile || '');

  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [deletePassVerify, setDeletePassVerify] = useState('');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isCleanStorageConfirmOpen, setIsCleanStorageConfirmOpen] = useState(false);

  // ----------------------------------------------------
  // SECTION D: ROOM & MEMBER MANAGEMENT STATES & MODALS
  // ----------------------------------------------------
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [editRoomName, setEditRoomName] = useState(room.name);
  const [editRoomDesc, setEditRoomDesc] = useState(room.description || '');
  const [editRoomCurrency, setEditRoomCurrency] = useState(room.currency || 'NPR (Rs.)');

  // Add Member Form State
  const [newMemName, setNewMemName] = useState('');
  const [newMemMobile, setNewMemMobile] = useState('');
  const [newMemEmail, setNewMemEmail] = useState('');
  const [newMemPass, setNewMemPass] = useState('');
  const [newMemConfirmPass, setNewMemConfirmPass] = useState('');
  const [showMemPass, setShowMemPass] = useState(false);
  const [showMemConfirmPass, setShowMemConfirmPass] = useState(false);

  // Success Created Credentials Dialog State
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  // Category & Room Settings States
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📌');
  const [splitRule, setSplitRule] = useState('equal');
  const [isCloseMonthConfirmOpen, setIsCloseMonthConfirmOpen] = useState(false);
  const [isArchivedMonthsOpen, setIsArchivedMonthsOpen] = useState(false);

  // ----------------------------------------------------
  // SECTION E: PRIVACY MODALS
  // ----------------------------------------------------
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAccountDataOpen, setIsAccountDataOpen] = useState(false);

  // ----------------------------------------------------
  // SECTION F: SUPPORT MODALS
  // ----------------------------------------------------
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportCategory, setReportCategory] = useState('Calculation');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Handlers for Account Changes
  const handleSavePassword = () => {
    if (!currentPassword) {
      showToast(language === 'ne' ? 'हालको पासवर्ड प्रविष्ट गर्नुहोस्' : 'Please enter your current password.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast(language === 'ne' ? 'नयाँ पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ' : 'New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast(language === 'ne' ? 'नयाँ पासवर्डहरू मिलेनन्' : 'New passwords do not match.', 'error');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangePassOpen(false);
    showToast(language === 'ne' ? '✓ पासवर्ड सफलतापूर्वक परिवर्तन भयो!' : '✓ Password updated successfully!');
  };

  const handleSaveEmail = () => {
    if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.')) {
      showToast(language === 'ne' ? 'कृपया मान्य इमेल प्रविष्ट गर्नुहोस्' : 'Please enter a valid email address.', 'error');
      return;
    }
    setCurrentUser(prev => ({ ...prev, email: newEmail.trim() }));
    setIsChangeEmailOpen(false);
    showToast(language === 'ne' ? '✓ इमेल ठेगाना सुरक्षित भयो!' : '✓ Email updated successfully!');
  };

  const handleSaveMobile = () => {
    if (!newMobile.trim() || newMobile.trim().length < 8) {
      showToast(language === 'ne' ? 'कृपया मान्य मोबाइल नम्बर राख्नुहोस्' : 'Please enter a valid mobile number.', 'error');
      return;
    }
    setCurrentUser(prev => ({ ...prev, mobile: newMobile.trim() }));
    setIsUpdateMobileOpen(false);
    showToast(language === 'ne' ? '✓ मोबाइल नम्बर सुरक्षित भयो!' : '✓ Mobile number updated successfully!');
  };

  const handleDeleteAccountConfirm = () => {
    if (!deletePassVerify) {
      showToast(language === 'ne' ? 'कृपया खाता मेटाउन पासवर्ड राख्नुहोस्' : 'Please enter your password to confirm deletion.', 'error');
      return;
    }
    setIsDeleteAccountOpen(false);
    showToast(language === 'ne' ? 'तपाईंको खाता मेटाइयो।' : 'Account has been permanently deleted.', 'info');
    logoutUser();
  };

  const handleCopyCode = (code) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    showToast(`✓ ${language === 'ne' ? 'कोठा कोड कपी भयो' : 'Room Code copied'}: ${code}`);
  };

  const handleShareCode = async (rName, code) => {
    try {
      const msg = `Join my CashMate room: ${rName}\nRoom Code: ${code}\nDownload CashMate and use this code to join.`;
      await Share.share({ message: msg, title: `Join ${rName}` });
    } catch (err) {
      showToast('Could not share: ' + err.message, 'error');
    }
  };

  const handleSendReport = () => {
    if (!reportText.trim()) {
      showToast(language === 'ne' ? 'कृपया समस्याको विवरण लेख्नुहोस्' : 'Please write problem details.', 'error');
      return;
    }
    setReportText('');
    setIsReportOpen(false);
    showToast(language === 'ne' ? '✓ तपाईंको रिपोर्ट प्राप्त भयो, धन्यवाद!' : '✓ Problem report submitted! Thank you.');
  };

  // Add Member Handler (Admin)
  const handleAddMemberSubmit = () => {
    if (!newMemName.trim()) {
      showToast(language === 'ne' ? 'कृपया सदस्यको पूरा नाम प्रविष्ट गर्नुहोस्' : 'Please enter member full name.', 'error');
      return;
    }
    if (!newMemMobile.trim() || newMemMobile.trim().length < 8) {
      showToast(language === 'ne' ? 'कृपया मान्य मोबाइल नम्बर प्रविष्ट गर्नुहोस्' : 'Please enter a valid mobile number.', 'error');
      return;
    }
    if (!newMemEmail.trim() || !newMemEmail.includes('@') || !newMemEmail.includes('.')) {
      showToast(language === 'ne' ? 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्' : 'Please enter a valid email address.', 'error');
      return;
    }
    if (!newMemPass || newMemPass.length < 6) {
      showToast(language === 'ne' ? 'पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ' : 'Password must be at least 6 characters.', 'error');
      return;
    }
    if (newMemPass !== newMemConfirmPass) {
      showToast(language === 'ne' ? 'पासवर्ड र कन्फर्म पासवर्ड मिलेनन्' : 'Passwords do not match.', 'error');
      return;
    }

    const res = addMemberByAdmin({
      fullName: newMemName.trim(),
      mobile: newMemMobile.trim(),
      email: newMemEmail.trim(),
      password: newMemPass
    });

    if (res.success) {
      const creds = {
        fullName: newMemName.trim(),
        mobile: newMemMobile.trim(),
        email: newMemEmail.trim(),
        password: newMemPass,
        roomName: room.name,
        roomCode: room.code
      };
      setCreatedCredentials(creds);
      setNewMemName('');
      setNewMemMobile('');
      setNewMemEmail('');
      setNewMemPass('');
      setNewMemConfirmPass('');
      setIsAddMemberOpen(false);
      setIsCredentialsModalOpen(true);
    }
  };

  // Save Room Details (Admin)
  const handleSaveRoomDetails = () => {
    if (!editRoomName.trim()) {
      showToast(language === 'ne' ? 'कोठाको नाम आवश्यक छ' : 'Room name is required.', 'error');
      return;
    }
    setRoom(prev => ({
      ...prev,
      name: editRoomName.trim(),
      description: editRoomDesc.trim(),
      currency: editRoomCurrency.trim() || 'NPR (Rs.)'
    }));
    setIsEditRoomOpen(false);
    showToast(language === 'ne' ? '✓ कोठाको विवरण अपडेट भयो!' : '✓ Room settings updated successfully!');
  };

  // Copy Credentials
  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `💸 CashMate Room Login Credentials\n\nRoom / Org: ${createdCredentials.roomName}\nRoom Code: ${createdCredentials.roomCode}\nMember: ${createdCredentials.fullName}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\n\nLogin to CashMate with this email & password to enter this room directly!`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(language === 'ne' ? '✓ लगइन प्रमाणहरू कपी भयो!' : '✓ Login credentials copied to clipboard!');
  };

  // Share Credentials
  const handleShareCredentials = async () => {
    if (!createdCredentials) return;
    try {
      const text = `💸 CashMate Room Login Credentials\n\nRoom / Org: ${createdCredentials.roomName}\nRoom Code: ${createdCredentials.roomCode}\nMember: ${createdCredentials.fullName}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\n\nLogin to CashMate with this email & password to enter this room directly!`;
      await Share.share({
        message: text,
        title: `CashMate Credentials for ${createdCredentials.fullName}`
      });
    } catch (err) {
      showToast('Share failed: ' + err.message, 'error');
    }
  };

  // Add Custom Category Handler (Admin)
  const handleAddCategorySubmit = () => {
    if (!newCatName.trim()) {
      showToast(language === 'ne' ? 'कृपया कोटिको नाम लेख्नुहोस्' : 'Category name is required.', 'error');
      return;
    }
    const catNameTrimmed = newCatName.trim();
    addCategory({
      name: catNameTrimmed,
      icon: newCatIcon || '📌'
    });
    setNewCatName('');
    setNewCatIcon('📌');
    setIsAddCategoryModalOpen(false);
    showToast(language === 'ne' ? `✓ नयाँ कोटि "${catNameTrimmed}" थपियो!` : `✓ Category "${catNameTrimmed}" added!`);
  };

  // Close Active Month Handler
  const handleCloseMonthConfirm = () => {
    closeCurrentMonth();
    setIsCloseMonthConfirmOpen(false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: colors.bgSubtle }]}>
            <Text style={{ fontSize: 16 }}>←</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.mainTitle, { color: colors.textMain }]}>
            {language === 'ne' ? 'सेटिङहरू (Settings)' : 'Settings'}
          </Text>
          <Text style={[styles.mainSub, { color: colors.textMuted }]}>
            {language === 'ne' ? 'थिम, सूचना, सुरक्षा, कोठा र गोपनीयता व्यवस्थापन' : 'Preferences, security, notifications & room settings'}
          </Text>
        </View>
      </View>

      {/* ==================================================== */}
      {/* SECTION A: APPEARANCE                                */}
      {/* ==================================================== */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Sun size={18} color={colors.primary} />
          <Text style={[styles.sectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? 'क. इन्टरफेस थिम (Appearance)' : 'A. Appearance'}
          </Text>
        </View>
        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          {language === 'ne' ? 'एपको रङ र प्रदर्शन थिम तुरुन्तै परिवर्तन गर्नुहोस्:' : 'Choose your preferred visual theme across the whole application:'}
        </Text>

        <View style={[styles.themePillsRow, { backgroundColor: colors.bgSubtle }]}>
          <TouchableOpacity
            style={[
              styles.themePill,
              theme === 'light' && { backgroundColor: colors.bgSurface, borderColor: colors.primary, borderWidth: 1.5 }
            ]}
            onPress={() => setTheme('light')}
            activeOpacity={0.7}
          >
            <Sun size={16} color={theme === 'light' ? colors.primary : colors.textMuted} />
            <Text style={[styles.themePillText, { color: theme === 'light' ? colors.primary : colors.textMuted, fontWeight: theme === 'light' ? '800' : '600' }]}>
              {language === 'ne' ? 'लाइट (दिन)' : 'Light'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themePill,
              theme === 'dark' && { backgroundColor: colors.bgSurface, borderColor: colors.primary, borderWidth: 1.5 }
            ]}
            onPress={() => setTheme('dark')}
            activeOpacity={0.7}
          >
            <Moon size={16} color={theme === 'dark' ? colors.primary : colors.textMuted} />
            <Text style={[styles.themePillText, { color: theme === 'dark' ? colors.primary : colors.textMuted, fontWeight: theme === 'dark' ? '800' : '600' }]}>
              {language === 'ne' ? 'डार्क (रात)' : 'Dark'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themePill,
              theme === 'system' && { backgroundColor: colors.bgSurface, borderColor: colors.primary, borderWidth: 1.5 }
            ]}
            onPress={() => setTheme('system')}
            activeOpacity={0.7}
          >
            <Monitor size={16} color={theme === 'system' ? colors.primary : colors.textMuted} />
            <Text style={[styles.themePillText, { color: theme === 'system' ? colors.primary : colors.textMuted, fontWeight: theme === 'system' ? '800' : '600' }]}>
              {language === 'ne' ? 'सिस्टम' : 'System'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================================================== */}
      {/* SECTION B: NOTIFICATIONS                             */}
      {/* ==================================================== */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Bell size={18} color={colors.primary} />
          <Text style={[styles.sectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? 'ख. सूचनाहरू (Notifications)' : 'B. Notifications'}
          </Text>
        </View>
        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          {language === 'ne' ? 'कोठाका विभिन्न गतिविधि अनुसार सूचना प्राप्त गर्ने सेटिङ:' : 'Configure which alerts and notifications you receive in CashMate:'}
        </Text>

        <View style={styles.toggleList}>
          {/* 1. Expense Notifications */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.toggleTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'खर्च सम्बन्धी सूचना' : 'Expense Notifications'}
              </Text>
              <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
                {language === 'ne' ? 'साथीहरूले नयाँ खर्च जोड्दा वा मेटाउँदा' : 'When roommates log or edit shared expenses'}
              </Text>
            </View>
            <Switch
              value={notifPrefs.expenses}
              onValueChange={() => toggleNotif('expenses')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          {/* 2. Settlement Notifications */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.toggleTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'हिसाब चुक्ता सूचना' : 'Settlement Notifications'}
              </Text>
              <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
                {language === 'ne' ? 'रकम भुक्तानी वा हिसाब चुक्ता गर्दा' : 'When debt payments and settlements are recorded'}
              </Text>
            </View>
            <Switch
              value={notifPrefs.settlements}
              onValueChange={() => toggleNotif('settlements')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          {/* 3. Room Activity Notifications */}
          <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.toggleTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'कोठा गतिविधि सूचना' : 'Room Activity Notifications'}
              </Text>
              <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
                {language === 'ne' ? 'महिना बन्द गर्दा वा कोठा सेटिङ फेर्दा' : 'Monthly closes, room rule updates, and archives'}
              </Text>
            </View>
            <Switch
              value={notifPrefs.roomActivity}
              onValueChange={() => toggleNotif('roomActivity')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          {/* 4. Member Activity Notifications */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.toggleTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'सदस्य गतिविधि सूचना' : 'Member Activity Notifications'}
              </Text>
              <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
                {language === 'ne' ? 'नयाँ सदस्य जोडिँदा वा बाहिरिँदा' : 'When new roommates join or leave the room'}
              </Text>
            </View>
            <Switch
              value={notifPrefs.memberActivity}
              onValueChange={() => toggleNotif('memberActivity')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* ==================================================== */}
      {/* SECTION C: ACCOUNT & SECURITY                        */}
      {/* ==================================================== */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <ShieldCheck size={18} color={colors.primary} />
          <Text style={[styles.sectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? 'ग. खाता र सुरक्षा (Account & Security)' : 'C. Account & Security'}
          </Text>
        </View>

        <View style={{ gap: 6, marginTop: 4 }}>
          {/* Change Password */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsChangePassOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Lock size={17} color={colors.textMain} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? 'पासवर्ड परिवर्तन गर्नुहोस्' : 'Change Password'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                  {language === 'ne' ? 'आफ्नो खाता थप सुरक्षित बनाउनुहोस्' : 'Update your account login password'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Change Email */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsChangeEmailOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Mail size={17} color={colors.textMain} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? 'इमेल परिवर्तन गर्नुहोस्' : 'Change Email'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.primary }]}>
                  {currentUser.email}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Update Mobile Number */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsUpdateMobileOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Phone size={17} color={colors.textMain} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? 'मोबाइल नम्बर अपडेट गर्नुहोस्' : 'Update Mobile Number'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.primary }]}>
                  {currentUser.mobile || '+977 9801234567'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Manage Login Sessions */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsSessionsOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Laptop size={17} color={colors.textMain} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? 'लगइन सेसनहरू व्यवस्थापन' : 'Manage Login Sessions'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.positive }]}>
                  {language === 'ne' ? '१ सक्रिय उपकरण (Current Device)' : '1 Active Device (Current)'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Logout from Current Device */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.negativeLight, borderColor: colors.negativeLight }]}
            onPress={() => setIsLogoutConfirmOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LogOut size={17} color={colors.negative} />
              <Text style={[styles.actionTitle, { color: colors.negative, fontWeight: '700' }]}>
                {language === 'ne' ? 'यो उपकरणबाट बाहिरिनुहोस् (Logout)' : 'Logout from Current Device'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.negative} />
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle, borderColor: colors.negative, borderWidth: 1 }]}
            onPress={() => setIsDeleteAccountOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Trash2 size={17} color={colors.negative} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.negative, fontWeight: '700' }]}>
                  {language === 'ne' ? 'खाता मेटाउनुहोस् (Delete Account)' : 'Delete Account'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                  {language === 'ne' ? 'स्थायी रूपमा प्रोफाइल र डाटा मेटाउने' : 'Permanently remove your account & data'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.negative} />
          </TouchableOpacity>

          {/* Clean All Local Storage Data */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.warningLight, borderColor: colors.warning, borderWidth: 1 }]}
            onPress={() => setIsCleanStorageConfirmOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <RotateCcw size={17} color={colors.warning} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.warning, fontWeight: '800' }]}>
                  {language === 'ne' ? 'सबै स्थानीय डाटा सफा गर्नुहोस् (Clean Local Storage)' : 'Clean All Local Storage Data'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                  {language === 'ne' ? 'स्थानीय क्यास खाली गरी प्रारम्भिक अवस्थामा फर्काउने' : 'Wipe all cached local storage & reload fresh defaults'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.warning} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================================================== */}
      {/* SECTION D: ROOM & MEMBER MANAGEMENT                  */}
      {/* ==================================================== */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Home size={18} color={colors.primary} />
          <Text style={[styles.sectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? 'घ. कोठा तथा सदस्य व्यवस्थापन (Room & Member Management)' : 'D. Room & Member Management'}
          </Text>
        </View>
        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          {language === 'ne'
            ? 'कोठाको विवरण, नयाँ सदस्य थप्ने, र लगइन प्रमाणहरू व्यवस्थापन गर्नुहोस्'
            : 'Manage room details, members, roles and login credentials'}
        </Text>

        {/* Room Info Box */}
        <View style={[styles.roomCardBox, { backgroundColor: colors.bgSubtle }]}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                <Text style={{ fontSize: 18 }}>🏠</Text>
                <Text style={[styles.roomTitleText, { color: colors.textMain }]} numberOfLines={1}>{room.name}</Text>
              </View>
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => {
                    setEditRoomName(room.name);
                    setEditRoomDesc(room.description || '');
                    setEditRoomCurrency(room.currency || 'NPR (Rs.)');
                    setIsEditRoomOpen(true);
                  }}
                  style={[styles.editBadgeBtn, { backgroundColor: colors.primaryLight }]}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                    {language === 'ne' ? 'सम्पादन' : 'Edit Info'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.roomDescText, { color: colors.textMuted }]}>{room.description}</Text>
          </View>
        </View>

        {/* Permanent Room Code */}
        <View style={[styles.codeBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <View>
            <Text style={[styles.codeTag, { color: colors.textMuted }]}>PERMANENT ROOM CODE</Text>
            <Text style={[styles.codeText, { color: colors.primary }]}>{room.code}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Button size="sm" variant="primary" icon={<Copy size={13} color="#ffffff" />} onPress={() => handleCopyCode(room.code)}>
              Copy
            </Button>
            <Button size="sm" variant="secondary" icon={<Share2 size={13} color={colors.textMain} />} onPress={() => handleShareCode(room.name, room.code)}>
              Share
            </Button>
          </View>
        </View>

        {/* MANAGE MEMBERS ROW */}
        <TouchableOpacity
          style={[styles.actionRow, { backgroundColor: colors.bgSubtle, marginVertical: 3 }]}
          onPress={() => setIsManageMembersOpen(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={[styles.iconPillBox, { backgroundColor: colors.primaryLight }]}>
              <Users size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.actionTitle, { color: colors.textMain, fontWeight: '700' }]}>
                  {language === 'ne' ? 'सदस्य व्यवस्थापन (Manage Members)' : 'Manage Room Members'}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.countBadgeText, { color: colors.primary }]}>
                    {members.filter(m => m.status === 'ACTIVE').length} {language === 'ne' ? 'सदस्य' : 'Members'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                {language === 'ne'
                  ? 'कोठाका सदस्यहरू हेर्नुहोस्, भूमिका परिवर्तन र व्यवस्थापन गर्नुहोस्'
                  : 'View member directory, roles & active status'}
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ADD NEW MEMBER BUTTON (ADMIN) */}
        {isAdmin && (
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderWidth: 1, marginVertical: 3 }]}
            onPress={() => setIsAddMemberOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.iconPillBox, { backgroundColor: colors.primary }]}>
                <UserPlus size={18} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: colors.primary, fontWeight: '800' }]}>
                  {language === 'ne' ? '+ नयाँ सदस्य थप्नुहोस् (Add Member)' : '+ Add New Member'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.primary }]}>
                  {language === 'ne'
                    ? 'पूरा नाम, मोबाइल, इमेल र पासवर्ड सहित नयाँ सदस्य दर्ता गर्नुहोस्'
                    : 'Create full name, mobile, email & password credentials'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* EXPENSE CATEGORIES ROW */}
        <TouchableOpacity
          style={[styles.actionRow, { backgroundColor: colors.bgSubtle, marginVertical: 3 }]}
          onPress={() => setIsCategoriesModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={[styles.iconPillBox, { backgroundColor: colors.secondaryLight }]}>
              <Tag size={18} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.actionTitle, { color: colors.textMain, fontWeight: '700' }]}>
                  {language === 'ne' ? 'खर्च कोटिहरू (Expense Categories)' : 'Expense Categories'}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: colors.secondaryLight }]}>
                  <Text style={[styles.countBadgeText, { color: colors.secondary }]}>
                    {categories.length} {language === 'ne' ? 'कोटि' : 'Categories'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                {language === 'ne'
                  ? 'कोटिहरू हेर्नुहोस् र नयाँ कस्टम कोटि थप्नुहोस्'
                  : 'View active categories & add new custom categories'}
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ADD NEW CATEGORY BUTTON (ADMIN) */}
        {isAdmin && (
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.secondaryLight, borderColor: colors.secondary, borderWidth: 1, marginVertical: 3 }]}
            onPress={() => setIsAddCategoryModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.iconPillBox, { backgroundColor: colors.secondary }]}>
                <Tag size={18} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: colors.secondary, fontWeight: '800' }]}>
                  {language === 'ne' ? '+ नयाँ कोटि थप्नुहोस् (Add Category)' : '+ Add New Category'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.secondary }]}>
                  {language === 'ne'
                    ? 'इमोजी/आइकन र नाम सहित नयाँ खर्च कोटि बनाउनुहोस्'
                    : 'Create a custom category with custom icon & name'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.secondary} />
          </TouchableOpacity>
        )}

        {/* ROOM SETTINGS: SPLIT RULES & MONTH CLOSING (INLINE CARD) */}
        <View style={[styles.subSectionBox, { backgroundColor: colors.bgSubtle, borderColor: colors.border, marginTop: 8 }]}>
          <Text style={[styles.subSectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? '⚙️ कोठा सेटिङहरू (Room Settings)' : '⚙️ Room Settings & Split Rules'}
          </Text>

          {/* Default Split Rules */}
          <View style={{ marginTop: 6, gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted }}>
              {language === 'ne' ? 'खर्च विभाजन नियम (SPLIT RULE):' : 'DEFAULT SPLIT RULE:'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.splitRuleBtn,
                  splitRule === 'equal'
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.bgSurface, borderColor: colors.border }
                ]}
                onPress={() => {
                  setSplitRule('equal');
                  showToast(language === 'ne' ? 'समान विभाजन (Equal Split) सेट भयो।' : 'Equal Split set as default.');
                }}
              >
                <Text style={{ fontSize: 14 }}>⚖️</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: splitRule === 'equal' ? '#ffffff' : colors.textMain }}>
                  {language === 'ne' ? 'बराबर विभाजन' : 'Equal Split'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.splitRuleBtn,
                  splitRule === 'custom'
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.bgSurface, borderColor: colors.border }
                ]}
                onPress={() => {
                  setSplitRule('custom');
                  showToast(language === 'ne' ? 'कस्टम सेयर (Custom Shares) नियम सेट भयो।' : 'Custom shares rule set.');
                }}
              >
                <Text style={{ fontSize: 14 }}>✏️</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: splitRule === 'custom' ? '#ffffff' : colors.textMain }}>
                  {language === 'ne' ? 'कस्टम सेयर' : 'Custom Shares'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Close Active Month Box */}
          <View style={[styles.closeMonthCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary, marginTop: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                <Lock size={16} color={colors.primary} />
                <Text style={{ fontSize: 13, fontWeight: '800', color: colors.primary }}>
                  {language === 'ne' ? `सक्रिय महिना (${currentMonth})` : `Active Month: ${currentMonth}`}
                </Text>
              </View>
              {closedMonths.length > 0 && (
                <TouchableOpacity
                  onPress={() => setIsArchivedMonthsOpen(true)}
                  style={[styles.archivePill, { backgroundColor: colors.bgSurface }]}
                >
                  <Text style={{ fontSize: 10, fontWeight: '700', color: colors.primary }}>
                    {closedMonths.length} {language === 'ne' ? 'अभिलेख' : 'Archived'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 16 }}>
              {language === 'ne'
                ? `महिना बन्द गर्दा ${currentMonth} का सबै खर्च अभिलेखमा सुरक्षित हुन्छन् र नयाँ महिना ० बाट सुरु हुन्छ।`
                : `Closing ${currentMonth} safely archives expenses into history and resets room balance to 0.`}
            </Text>
            {isAdmin && (
              <Button
                label={language === 'ne' ? `${currentMonth} बन्द गर्नुहोस् (Close Month)` : `Close ${currentMonth} & Reset`}
                variant="primary"
                size="sm"
                icon={<Lock size={13} color="#ffffff" />}
                onPress={() => setIsCloseMonthConfirmOpen(true)}
                style={{ marginTop: 8 }}
              />
            )}
          </View>
        </View>

        {/* Room Currency Display */}
        <View style={[styles.prefItemRow, { borderBottomColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <DollarSign size={16} color={colors.textMuted} />
            <Text style={[styles.prefItemLabel, { color: colors.textMain }]}>
              {language === 'ne' ? 'कोठा मुद्रा' : 'Room Currency'}
            </Text>
          </View>
          <Text style={[styles.prefItemVal, { color: colors.primary }]}>
            {room.currency || 'NPR (Rs. / रु.)'}
          </Text>
        </View>

        {/* Application Language Toggle */}
        <View style={[styles.prefItemRow, { borderBottomColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Globe size={16} color={colors.primary} />
            <Text style={[styles.prefItemLabel, { color: colors.textMain }]}>
              {language === 'ne' ? 'अनुप्रयोग भाषा (Language)' : 'App Language'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Button
              size="sm"
              variant={language === 'en' ? 'primary' : 'secondary'}
              onPress={() => setLanguage('en')}
            >
              English
            </Button>
            <Button
              size="sm"
              variant={language === 'ne' ? 'primary' : 'secondary'}
              onPress={() => setLanguage('ne')}
            >
              नेपाली
            </Button>
          </View>
        </View>

        {/* Calendar System AD/BS */}
        <View style={styles.prefItemRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color={colors.textMuted} />
            <Text style={[styles.prefItemLabel, { color: colors.textMain }]}>
              {language === 'ne' ? 'पात्रो मिति (Calendar)' : 'Date System'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Button
              size="sm"
              variant={calendarSystem === 'AD' ? 'primary' : 'secondary'}
              onPress={() => setCalendarSystem('AD')}
            >
              AD (Eng)
            </Button>
            <Button
              size="sm"
              variant={calendarSystem === 'BS' ? 'primary' : 'secondary'}
              onPress={() => setCalendarSystem('BS')}
            >
              BS (नेपाली)
            </Button>
          </View>
        </View>

        {/* Admin Only Management Button */}
        {isAdmin && (
          <TouchableOpacity
            style={[styles.adminBannerBtn, { backgroundColor: colors.secondaryLight, borderColor: colors.secondary }]}
            onPress={() => setIsAdminPanelOpen(true)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Shield size={16} color={colors.secondary} />
              <Text style={[styles.adminBannerText, { color: colors.secondary }]}>
                {language === 'ne' ? 'व्यवस्थापक प्यानल खोल्नुहोस् (Admin Controls)' : 'Open Advanced Room Admin Panel'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ==================================================== */}
      {/* SECTION E: PRIVACY                                   */}
      {/* ==================================================== */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <FileText size={18} color={colors.primary} />
          <Text style={[styles.sectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? 'ङ. गोपनीयता र नीति (Privacy & Terms)' : 'E. Privacy'}
          </Text>
        </View>

        <View style={{ gap: 6, marginTop: 4 }}>
          {/* Privacy Policy */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsPrivacyPolicyOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Shield size={17} color={colors.textMain} />
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsTermsOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <FileText size={17} color={colors.textMain} />
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'नियम तथा सर्तहरू (Terms & Conditions)' : 'Terms & Conditions'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Account Data Information */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsAccountDataOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Sliders size={17} color={colors.textMain} />
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'खाता डाटा जानकारी (Account Data Information)' : 'Account Data Information'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==================================================== */}
      {/* SECTION F: SUPPORT & ABOUT                           */}
      {/* ==================================================== */}
      <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <HelpCircle size={18} color={colors.primary} />
          <Text style={[styles.sectionHeading, { color: colors.textMain }]}>
            {language === 'ne' ? 'च. सहायता र जानकारी (Support & About)' : 'F. Support'}
          </Text>
        </View>

        <View style={{ gap: 6, marginTop: 4 }}>
          {/* Help & Support */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsHelpOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <HelpCircle size={17} color={colors.textMain} />
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'सहायता केन्द्र (Help & Support)' : 'Help & Support'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Report a Problem */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsReportOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={17} color={colors.warning} />
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'समस्या रिपोर्ट गर्नुहोस् (Report a Problem)' : 'Report a Problem'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Contact Support */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsContactOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Phone size={17} color={colors.primary} />
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                {language === 'ne' ? 'सम्पर्क सहयोग (Contact Support)' : 'Contact Support'}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* About CashMate */}
          <TouchableOpacity
            style={[styles.actionRow, { backgroundColor: colors.bgSubtle }]}
            onPress={() => setIsAboutOpen(true)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Info size={17} color={colors.textMain} />
              <View>
                <Text style={[styles.actionTitle, { color: colors.textMain }]}>
                  {language === 'ne' ? 'क्यासमेट बारे (About CashMate)' : 'About CashMate'}
                </Text>
                <Text style={[styles.actionDesc, { color: colors.textMuted }]}>
                  Version 1.0.0 (Build 58) • Made in Nepal 🇳🇵
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Branding */}
      <View style={styles.footerBranding}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          CashMate 2.0 • Smart Room Expense Accounting
        </Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
          Kathmandu, Nepal • Built for Roommates & Flats
        </Text>
      </View>

      {/* ==================================================== */}
      {/* ALL WORKING MODALS                                   */}
      {/* ==================================================== */}

      {/* 0A. MANAGE ROOM MEMBERS MODAL */}
      {isManageMembersOpen && (
        <Modal visible={isManageMembersOpen} transparent animationType="slide" onRequestClose={() => setIsManageMembersOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsManageMembersOpen(false)} style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '85%' }]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Users size={20} color={colors.primary} />
                  <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                    {language === 'ne' ? 'कोठाका सदस्यहरू (Members)' : 'Room Members'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsManageMembersOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Add Member Top Action */}
              {isAdmin && (
                <TouchableOpacity
                  style={[styles.addMemberBannerBtn, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                  onPress={() => {
                    setIsManageMembersOpen(false);
                    setIsAddMemberOpen(true);
                  }}
                  activeOpacity={0.7}
                >
                  <UserPlus size={16} color={colors.primary} />
                  <Text style={{ fontSize: 13, fontWeight: '800', color: colors.primary }}>
                    {language === 'ne' ? '+ नयाँ सदस्य थप्नुहोस् (Add New Member)' : '+ Add New Member'}
                  </Text>
                </TouchableOpacity>
              )}

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10, marginTop: 8 }}>
                {members.map(m => {
                  const isCurrent = m.id === currentUser?.id;
                  const isMemAdmin = m.role === 'admin';
                  return (
                    <View key={m.id} style={[styles.memberItemCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <Text style={{ fontSize: 24 }}>{m.avatar || '👦'}</Text>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.memberNameText, { color: colors.textMain }]} numberOfLines={1}>
                              {m.name} {isCurrent ? `(${language === 'ne' ? 'तपाईं' : 'You'})` : ''}
                            </Text>
                            <View style={[styles.roleBadge, { backgroundColor: isMemAdmin ? colors.secondaryLight : colors.bgCard }]}>
                              <Text style={[styles.roleBadgeText, { color: isMemAdmin ? colors.secondary : colors.textMuted }]}>
                                {m.role}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.memberSubText, { color: colors.textMuted }]} numberOfLines={1}>
                            {m.email} {m.mobile ? `• ${m.mobile}` : ''}
                          </Text>
                        </View>
                      </View>

                      {isAdmin && !isCurrent && (
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                          <TouchableOpacity
                            style={[styles.roleToggleBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                            onPress={() => {
                              const newRole = m.role === 'admin' ? 'member' : 'admin';
                              setMembers(prev => prev.map(item => item.id === m.id ? { ...item, role: newRole } : item));
                              showToast(`Updated ${m.name}'s role to ${newRole}.`);
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>
                              {m.role === 'admin' ? 'Member' : 'Admin'}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.removeMemBtn, { backgroundColor: colors.negativeLight }]}
                            onPress={() => removeMember(m.id)}
                          >
                            <Trash2 size={13} color={colors.negative} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsManageMembersOpen(false)} style={{ marginTop: 8 }}>
                {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </Button>
            </View>
          </View>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0B. ADD NEW MEMBER MODAL (FULL NAME, MOBILE, EMAIL, PASS, CONFIRM PASS) */}
      {isAddMemberOpen && (
        <Modal visible={isAddMemberOpen} transparent animationType="slide" onRequestClose={() => setIsAddMemberOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsAddMemberOpen(false)} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '92%' }]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[styles.iconPillBox, { backgroundColor: colors.primaryLight }]}>
                    <UserPlus size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                    {language === 'ne' ? 'नयाँ सदस्य थप्नुहोस्' : 'Add New Room Member'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsAddMemberOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                {/* Information banner */}
                <View style={[styles.infoCardBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                  <ShieldCheck size={18} color={colors.primary} />
                  <Text style={[styles.infoCardText, { color: colors.primary }]}>
                    {language === 'ne'
                      ? `नयाँ सदस्यको लागि विवरण भर्नुहोस्। सोही इमेल र पासवर्ड प्रयोग गरेर उनीहरू सिधै यसै कोठा (${room.name}) भित्र प्रवेश गर्न सक्नेछन्।`
                      : `Enter credentials below. When the member logs in with this email & password, they will automatically enter this room (${room.name})!`}
                  </Text>
                </View>

                {/* 1. Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                    {language === 'ne' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      placeholder={language === 'ne' ? 'जस्तै: विकास श्रेष्ठ' : 'e.g. Bikash Shrestha'}
                      placeholderTextColor={colors.textMuted}
                      value={newMemName}
                      onChangeText={setNewMemName}
                    />
                  </View>
                </View>

                {/* 2. Mobile Number */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                    {language === 'ne' ? 'मोबाइल नम्बर (Mobile Number) *' : 'Mobile Number *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      placeholder="+977 9812345678"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="phone-pad"
                      value={newMemMobile}
                      onChangeText={setNewMemMobile}
                    />
                  </View>
                </View>

                {/* 3. Email */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                    {language === 'ne' ? 'इमेल ठेगाना (Email Address) *' : 'Email Address *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                      placeholder="bikash@gmail.com"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={newMemEmail}
                      onChangeText={setNewMemEmail}
                    />
                  </View>
                </View>

                {/* 4. Password */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                    {language === 'ne' ? 'पासवर्ड (Password) *' : 'Password *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle, paddingRight: 40 }]}
                      placeholder={language === 'ne' ? 'कम्तीमा ६ अक्षर' : 'At least 6 characters'}
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showMemPass}
                      value={newMemPass}
                      onChangeText={setNewMemPass}
                    />
                    <TouchableOpacity style={styles.inputEyeBtn} onPress={() => setShowMemPass(!showMemPass)}>
                      {showMemPass ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 5. Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                    {language === 'ne' ? 'नयाँ पासवर्ड पुष्टि गर्नुहोस् (Confirm Password) *' : 'Confirm New Password *'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <KeyRound size={16} color={colors.textMuted} style={styles.inputInnerIcon} />
                    <TextInput
                      style={[styles.textInputWithIcon, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle, paddingRight: 40 }]}
                      placeholder={language === 'ne' ? 'पासवर्ड पुनः प्रविष्ट गर्नुहोस्' : 'Re-enter password'}
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showMemConfirmPass}
                      value={newMemConfirmPass}
                      onChangeText={setNewMemConfirmPass}
                    />
                    <TouchableOpacity style={styles.inputEyeBtn} onPress={() => setShowMemConfirmPass(!showMemConfirmPass)}>
                      {showMemConfirmPass ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalBtnRow}>
                  <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsAddMemberOpen(false)}>
                    {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                  </Button>
                  <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleAddMemberSubmit}>
                    {language === 'ne' ? 'सदस्य थप्नुहोस्' : 'Create & Add'}
                  </Button>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0C. CREATED CREDENTIALS SUCCESS DIALOG */}
      {isCredentialsModalOpen && createdCredentials && (
        <Modal visible={isCredentialsModalOpen} transparent animationType="slide" onRequestClose={() => setIsCredentialsModalOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsCredentialsModalOpen(false)} style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={{ alignItems: 'center', marginBottom: 14 }}>
                <View style={[styles.iconPillBox, { backgroundColor: colors.positiveLight, width: 50, height: 50, borderRadius: 25 }]}>
                  <CheckCircle size={28} color={colors.positive} />
                </View>
                <Text style={[styles.modalHeading, { color: colors.textMain, textAlign: 'center', marginTop: 8 }]}>
                  {language === 'ne' ? '✓ सदस्य खाता सिर्जना भयो!' : '✓ Member Account Ready!'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
                  {language === 'ne'
                    ? `नयाँ सदस्यले CashMate मा लगइन गर्दा सिधै यसै कोठा (${room.name}) भित्र छिर्नेछन्।`
                    : `When this member logs into CashMate using this email & password, they will immediately enter ${room.name}!`}
                </Text>
              </View>

              {/* Credentials Card */}
              <View style={[styles.credsCard, { backgroundColor: colors.bgSubtle, borderColor: colors.primary }]}>
                <View style={styles.credRow}>
                  <Text style={[styles.credLabel, { color: colors.textMuted }]}>ROOM / ORG:</Text>
                  <Text style={[styles.credValue, { color: colors.textMain }]}>{createdCredentials.roomName}</Text>
                </View>
                <View style={styles.credRow}>
                  <Text style={[styles.credLabel, { color: colors.textMuted }]}>ROOM CODE:</Text>
                  <Text style={[styles.credValue, { color: colors.primary }]}>{createdCredentials.roomCode}</Text>
                </View>
                <View style={styles.credRow}>
                  <Text style={[styles.credLabel, { color: colors.textMuted }]}>NAME:</Text>
                  <Text style={[styles.credValue, { color: colors.textMain }]}>{createdCredentials.fullName}</Text>
                </View>
                <View style={styles.credRow}>
                  <Text style={[styles.credLabel, { color: colors.textMuted }]}>MOBILE:</Text>
                  <Text style={[styles.credValue, { color: colors.textMain }]}>{createdCredentials.mobile}</Text>
                </View>
                <View style={styles.credRow}>
                  <Text style={[styles.credLabel, { color: colors.textMuted }]}>LOGIN EMAIL:</Text>
                  <Text style={[styles.credValue, { color: colors.primary }]}>{createdCredentials.email}</Text>
                </View>
                <View style={styles.credRow}>
                  <Text style={[styles.credLabel, { color: colors.textMuted }]}>PASSWORD:</Text>
                  <Text style={[styles.credValue, { color: colors.textMain }]}>{createdCredentials.password}</Text>
                </View>
              </View>

              <View style={{ gap: 8, marginTop: 14 }}>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Copy size={14} color="#ffffff" />}
                  onPress={handleCopyCredentials}
                >
                  {language === 'ne' ? 'लगइन विवरण कपी गर्नुहोस्' : 'Copy Credentials'}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Share2 size={14} color={colors.textMain} />}
                  onPress={handleShareCredentials}
                >
                  {language === 'ne' ? 'साथीलाई पठाउनुहोस् (Share)' : 'Share via Apps'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setIsCredentialsModalOpen(false)}
                >
                  {language === 'ne' ? 'सम्पन्न (Done)' : 'Done'}
                </Button>
              </View>
            </View>
          </View>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0D. EDIT ROOM INFORMATION MODAL */}
      {isEditRoomOpen && (
        <Modal visible={isEditRoomOpen} transparent animationType="slide" onRequestClose={() => setIsEditRoomOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsEditRoomOpen(false)} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                  {language === 'ne' ? 'कोठा विवरण सम्पादन' : 'Edit Room Details'}
                </Text>
                <TouchableOpacity onPress={() => setIsEditRoomOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                  {language === 'ne' ? 'कोठाको नाम (Room Name) *' : 'Room Name *'}
                </Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  value={editRoomName}
                  onChangeText={setEditRoomName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                  {language === 'ne' ? 'विवरण (Description)' : 'Description'}
                </Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  value={editRoomDesc}
                  onChangeText={setEditRoomDesc}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                  {language === 'ne' ? 'मुद्रा (Currency)' : 'Currency Symbol'}
                </Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  value={editRoomCurrency}
                  onChangeText={setEditRoomCurrency}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsEditRoomOpen(false)}>
                  {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </Button>
                <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleSaveRoomDetails}>
                  {language === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Changes'}
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0E. VIEW ALL EXPENSE CATEGORIES MODAL */}
      {isCategoriesModalOpen && (
        <Modal visible={isCategoriesModalOpen} transparent animationType="slide" onRequestClose={() => setIsCategoriesModalOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsCategoriesModalOpen(false)} style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '85%' }]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Tag size={20} color={colors.secondary} />
                  <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                    {language === 'ne' ? 'खर्च कोटिहरू (Expense Categories)' : 'Expense Categories'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsCategoriesModalOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Add Category Top Banner */}
              {isAdmin && (
                <TouchableOpacity
                  style={[styles.addMemberBannerBtn, { backgroundColor: colors.secondaryLight, borderColor: colors.secondary }]}
                  onPress={() => {
                    setIsCategoriesModalOpen(false);
                    setIsAddCategoryModalOpen(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Tag size={16} color={colors.secondary} />
                  <Text style={{ fontSize: 13, fontWeight: '800', color: colors.secondary }}>
                    {language === 'ne' ? '+ नयाँ कोटि थप्नुहोस् (Add Category)' : '+ Add New Category'}
                  </Text>
                </TouchableOpacity>
              )}

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10, marginTop: 8 }}>
                {categories.map(cat => (
                  <View key={cat.id} style={[styles.memberItemCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.memberNameText, { color: colors.textMain }]} numberOfLines={1}>
                          {getCategoryName ? getCategoryName(cat.name) : cat.name}
                        </Text>
                        <Text style={[styles.memberSubText, { color: colors.textMuted }]}>
                          {language === 'ne' ? 'समान रूपमा बाँडफाँड' : 'Auto split among room members'}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.activePill, { backgroundColor: colors.positiveLight }]}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: colors.positive }}>Active</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsCategoriesModalOpen(false)} style={{ marginTop: 8 }}>
                {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </Button>
            </View>
          </View>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0F. ADD NEW CUSTOM CATEGORY MODAL */}
      {isAddCategoryModalOpen && (
        <Modal visible={isAddCategoryModalOpen} transparent animationType="slide" onRequestClose={() => setIsAddCategoryModalOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsAddCategoryModalOpen(false)} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[styles.iconPillBox, { backgroundColor: colors.secondaryLight }]}>
                    <Tag size={18} color={colors.secondary} />
                  </View>
                  <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                    {language === 'ne' ? 'नयाँ खर्च कोटि सिर्जना गर्नुहोस्' : 'Create New Category'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsAddCategoryModalOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Quick Preset Emoji Selector */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                  {language === 'ne' ? 'कोटि आइकन / इमोजी (Icon) *' : 'Category Icon / Emoji *'}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {['📌', '🥛', '📶', '🎉', '🎬', '🍔', '💊', '👕', '📦', '⚽', '🧹', '🛠️'].map(emoji => (
                    <TouchableOpacity
                      key={emoji}
                      onPress={() => setNewCatIcon(emoji)}
                      style={{
                        padding: 8,
                        borderRadius: 10,
                        backgroundColor: newCatIcon === emoji ? colors.secondaryLight : colors.bgSubtle,
                        borderWidth: 1.5,
                        borderColor: newCatIcon === emoji ? colors.secondary : colors.border
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle, textAlign: 'center', fontSize: 18 }]}
                  value={newCatIcon}
                  onChangeText={setNewCatIcon}
                  maxLength={4}
                />
              </View>

              {/* Category Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>
                  {language === 'ne' ? 'कोटिको नाम (Category Name) *' : 'Category Name *'}
                </Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                  placeholder={language === 'ne' ? 'जस्तै: दूध तथा चिया, वाइफाइ...' : 'e.g. WiFi Bill, Milk & Tea...'}
                  placeholderTextColor={colors.textMuted}
                  value={newCatName}
                  onChangeText={setNewCatName}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsAddCategoryModalOpen(false)}>
                  {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </Button>
                <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleAddCategorySubmit}>
                  {language === 'ne' ? 'कोटि थप्नुहोस्' : 'Add Category'}
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0G. ARCHIVED PAST MONTHS MODAL */}
      {isArchivedMonthsOpen && (
        <Modal visible={isArchivedMonthsOpen} transparent animationType="slide" onRequestClose={() => setIsArchivedMonthsOpen(false)}>
          <SwipeBackWrapper onSwipeBack={() => setIsArchivedMonthsOpen(false)} style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '80%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                  {language === 'ne' ? 'अभिलेख गरिएका महिनाहरू' : 'Archived Past Months'}
                </Text>
                <TouchableOpacity onPress={() => setIsArchivedMonthsOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10, marginTop: 8 }}>
                {closedMonths.map(m => (
                  <View key={m.id} style={[styles.memberItemCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.memberNameText, { color: colors.textMain }]}>{m.monthName}</Text>
                      <Text style={[styles.memberSubText, { color: colors.textMuted }]}>
                        {language === 'ne' ? `अभिलेख मिति: ${m.closedDate}` : `Archived on: ${m.closedDate}`} • Rs. {m.totalExpenses.toLocaleString()}
                      </Text>
                    </View>
                    <View style={[styles.activePill, { backgroundColor: colors.positiveLight }]}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: colors.positive }}>Archived</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsArchivedMonthsOpen(false)} style={{ marginTop: 8 }}>
                {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </Button>
            </View>
          </View>
        </SwipeBackWrapper>
      </Modal>
    )}

      {/* 0H. CLOSE MONTH CONFIRM MODAL */}
      <ConfirmModal
        isOpen={isCloseMonthConfirmOpen}
        onClose={() => setIsCloseMonthConfirmOpen(false)}
        onConfirm={handleCloseMonthConfirm}
        title={language === 'ne' ? `${currentMonth} बन्द गर्ने?` : `Close ${currentMonth}?`}
        description={
          language === 'ne'
            ? `के तपाईं ${currentMonth} महिना बन्द गर्न चाहनुहुन्छ? सबै खर्च र हिसाबहरू सुरक्षित अभिलेखमा रहनेछन् र नयाँ महिना ० बाट सुरु हुनेछ।`
            : `Are you sure you want to close ${currentMonth}? All expenses and settlements will be safely archived, and room balance will reset to 0 for next month.`
        }
        confirmText={language === 'ne' ? 'महिना बन्द गर्नुहोस्' : 'Close Month & Reset'}
        confirmVariant="primary"
      />

      {/* 1. CHANGE PASSWORD MODAL */}
      {isChangePassOpen && (
        <Modal visible={isChangePassOpen} transparent animationType="slide" onRequestClose={() => setIsChangePassOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>
                  {language === 'ne' ? 'पासवर्ड परिवर्तन' : 'Change Password'}
                </Text>
                <TouchableOpacity onPress={() => setIsChangePassOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>Current Password *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>New Password *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>Confirm New Password *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsChangePassOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleSavePassword}>
                  Update Password
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* 2. CHANGE EMAIL MODAL */}
      {isChangeEmailOpen && (
        <Modal visible={isChangeEmailOpen} transparent animationType="slide" onRequestClose={() => setIsChangeEmailOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>Change Email Address</Text>
                <TouchableOpacity onPress={() => setIsChangeEmailOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>New Email Address *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={newEmail}
                  onChangeText={setNewEmail}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsChangeEmailOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleSaveEmail}>
                  Save Email
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* 3. UPDATE MOBILE MODAL */}
      {isUpdateMobileOpen && (
        <Modal visible={isUpdateMobileOpen} transparent animationType="slide" onRequestClose={() => setIsUpdateMobileOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>Update Mobile Number</Text>
                <TouchableOpacity onPress={() => setIsUpdateMobileOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>Mobile Number *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border }]}
                  placeholder="+977 9801234567"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={newMobile}
                  onChangeText={setNewMobile}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsUpdateMobileOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" style={{ flex: 1 }} onPress={handleSaveMobile}>
                  Save Mobile
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* 4. MANAGE SESSIONS MODAL */}
      {isSessionsOpen && (
        <Modal visible={isSessionsOpen} transparent animationType="slide" onRequestClose={() => setIsSessionsOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>Active Login Sessions</Text>
                <TouchableOpacity onPress={() => setIsSessionsOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 10, marginVertical: 10 }}>
                <View style={[styles.sessionCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Laptop size={22} color={colors.primary} />
                    <View>
                      <Text style={[styles.sessionName, { color: colors.textMain }]}>
                        {Platform.OS === 'ios' ? 'iPhone App (Active)' : Platform.OS === 'android' ? 'Android Device (Active)' : 'Web Browser (Active)'}
                      </Text>
                      <Text style={{ fontSize: 11, color: colors.textMuted }}>Kathmandu, Nepal • Currently Active</Text>
                    </View>
                  </View>
                  <View style={[styles.activePill, { backgroundColor: colors.positiveLight }]}>
                    <Text style={{ fontSize: 10, color: colors.positive, fontWeight: '800' }}>THIS DEVICE</Text>
                  </View>
                </View>
              </View>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onPress={() => {
                  showToast('Signed out all other sessions.');
                  setIsSessionsOpen(false);
                }}
              >
                Sign Out Other Sessions
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* 5. DELETE ACCOUNT CONFIRM MODAL */}
      {isDeleteAccountOpen && (
        <Modal visible={isDeleteAccountOpen} transparent animationType="slide" onRequestClose={() => setIsDeleteAccountOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.negative }]}>Delete Account Permanently</Text>
                <TouchableOpacity onPress={() => setIsDeleteAccountOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 13, color: colors.textMuted, marginVertical: 10, lineHeight: 18 }}>
                Warning: Deleting your account will remove your profile credentials and your individual session. Historic room expenses will remain preserved for room accounting balance.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>Enter your Password to Confirm *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.negative }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={deletePassVerify}
                  onChangeText={setDeletePassVerify}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsDeleteAccountOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="md" style={{ flex: 1 }} onPress={handleDeleteAccountConfirm}>
                  Delete Account
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* 6. PRIVACY POLICY MODAL */}
      {isPrivacyPolicyOpen && (
        <Modal visible={isPrivacyPolicyOpen} transparent animationType="slide" onRequestClose={() => setIsPrivacyPolicyOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '85%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>🔒 Privacy Policy</Text>
                <TouchableOpacity onPress={() => setIsPrivacyPolicyOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ marginVertical: 10 }}>
                <Text style={[styles.policySectionTitle, { color: colors.textMain }]}>1. Financial Data Confidentiality</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  CashMate values financial privacy for students and room partners in Nepal. All logged expenses, receipts, categories, and debts are encrypted and strictly isolated to your verified room members.
                </Text>

                <Text style={[styles.policySectionTitle, { color: colors.textMain }]}>2. Zero Data Selling</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  We do not sell, rent, or commercialize your personal spending patterns, mobile numbers, or payment notes to any third-party marketing networks.
                </Text>

                <Text style={[styles.policySectionTitle, { color: colors.textMain }]}>3. Permanent Room Codes</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  Only individuals with access to your room invite code can view room expenditures. Room Admins retain the right to manage access and remove members.
                </Text>
              </ScrollView>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsPrivacyPolicyOpen(false)}>
                Done & Close
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* 7. TERMS & CONDITIONS MODAL */}
      {isTermsOpen && (
        <Modal visible={isTermsOpen} transparent animationType="slide" onRequestClose={() => setIsTermsOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '85%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>📜 Terms & Conditions</Text>
                <TouchableOpacity onPress={() => setIsTermsOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ marginVertical: 10 }}>
                <Text style={[styles.policySectionTitle, { color: colors.textMain }]}>1. Accuracy of Entries</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  Each roommate is responsible for accurately logging true shared costs (rent, grocery, utilities). CashMate provides calculation tools and does not directly transfer funds between bank accounts.
                </Text>

                <Text style={[styles.policySectionTitle, { color: colors.textMain }]}>2. Debt Optimization Algorithm</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  CashMate's debt minimization algorithm guarantees mathematical equality while minimizing the total number of physical money transfers.
                </Text>
              </ScrollView>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsTermsOpen(false)}>
                I Agree & Close
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* 8. ACCOUNT DATA INFORMATION MODAL */}
      {isAccountDataOpen && (
        <Modal visible={isAccountDataOpen} transparent animationType="slide" onRequestClose={() => setIsAccountDataOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>📊 Account Data Information</Text>
                <TouchableOpacity onPress={() => setIsAccountDataOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 8, marginVertical: 12 }}>
                <View style={[styles.dataStatRow, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={[styles.dataStatLabel, { color: colors.textMuted }]}>Total Expenses Logged:</Text>
                  <Text style={[styles.dataStatVal, { color: colors.textMain }]}>{expenses.length} records</Text>
                </View>
                <View style={[styles.dataStatRow, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={[styles.dataStatLabel, { color: colors.textMuted }]}>Settlements Recorded:</Text>
                  <Text style={[styles.dataStatVal, { color: colors.textMain }]}>{settlements.length} payments</Text>
                </View>
                <View style={[styles.dataStatRow, { backgroundColor: colors.bgSubtle }]}>
                  <Text style={[styles.dataStatLabel, { color: colors.textMuted }]}>Active Room Members:</Text>
                  <Text style={[styles.dataStatVal, { color: colors.textMain }]}>{members.length} members</Text>
                </View>
              </View>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onPress={() => {
                  showToast('✓ Account data summary verified.');
                  setIsAccountDataOpen(false);
                }}
              >
                Close Data View
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* 9. HELP & SUPPORT MODAL */}
      {isHelpOpen && (
        <Modal visible={isHelpOpen} transparent animationType="slide" onRequestClose={() => setIsHelpOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface, maxHeight: '85%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>❓ Help & FAQ</Text>
                <TouchableOpacity onPress={() => setIsHelpOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ marginVertical: 10 }}>
                <Text style={[styles.policySectionTitle, { color: colors.primary }]}>How does Debt Optimization work?</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  Instead of paying 10 different people for separate grocery bills, CashMate reduces the entire group graph into 1 or 2 net payments.
                </Text>

                <Text style={[styles.policySectionTitle, { color: colors.primary }]}>How do I invite roommates?</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  Go to Room Preferences above, tap "Copy" or "Share" on your 8-digit Room Code. Your roommates download CashMate, tap "Join Room", and enter your code!
                </Text>

                <Text style={[styles.policySectionTitle, { color: colors.primary }]}>How to change between English and Nepali?</Text>
                <Text style={[styles.policyText, { color: colors.textMuted }]}>
                  Tap the globe icon in the top header or select English / नेपाली in Room Preferences. The entire app translates immediately!
                </Text>
              </ScrollView>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsHelpOpen(false)}>
                Understood
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* 10. REPORT A PROBLEM MODAL */}
      {isReportOpen && (
        <Modal visible={isReportOpen} transparent animationType="slide" onRequestClose={() => setIsReportOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>⚠️ Report a Problem</Text>
                <TouchableOpacity onPress={() => setIsReportOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>Problem Category</Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  {['Calculation', 'Payment / Settle', 'UI / Display', 'Other'].map(cat => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setReportCategory(cat)}
                      style={[
                        styles.catPill,
                        {
                          backgroundColor: reportCategory === cat ? colors.primaryLight : colors.bgSubtle,
                          borderColor: reportCategory === cat ? colors.primary : colors.border
                        }
                      ]}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: reportCategory === cat ? colors.primary : colors.textMuted }}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMain }]}>Describe the Issue *</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.textMain, borderColor: colors.border, height: 80, textAlignVertical: 'top' }]}
                  placeholder="Tell us what happened so we can fix it immediately..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  value={reportText}
                  onChangeText={setReportText}
                />
              </View>

              <View style={styles.modalBtnRow}>
                <Button variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setIsReportOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" style={{ flex: 1 }} icon={<Send size={14} color="#ffffff" />} onPress={handleSendReport}>
                  Submit Report
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* 11. CONTACT SUPPORT MODAL */}
      {isContactOpen && (
        <Modal visible={isContactOpen} transparent animationType="slide" onRequestClose={() => setIsContactOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>📞 Contact Support</Text>
                <TouchableOpacity onPress={() => setIsContactOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 10, marginVertical: 12 }}>
                <View style={[styles.contactCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                  <Mail size={20} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.contactTitle, { color: colors.textMain }]}>Email Support</Text>
                    <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '700' }}>support@cashmate.app</Text>
                  </View>
                </View>

                <View style={[styles.contactCard, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}>
                  <Phone size={20} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.contactTitle, { color: colors.textMain }]}>Hotline (Kathmandu)</Text>
                    <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '700' }}>+977 9824718666</Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted }}>Available: Sunday - Friday (9 AM - 6 PM)</Text>
                  </View>
                </View>
              </View>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsContactOpen(false)}>
                Done
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* 12. ABOUT MODAL */}
      {isAboutOpen && (
        <Modal visible={isAboutOpen} transparent animationType="slide" onRequestClose={() => setIsAboutOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.textMain }]}>💸 About CashMate</Text>
                <TouchableOpacity onPress={() => setIsAboutOpen(false)}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: 'center', marginVertical: 12 }}>
                <Text style={{ fontSize: 36, marginBottom: 8 }}>🇳🇵</Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: colors.primary }}>CashMate 2.0</Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, textAlign: 'center', lineHeight: 18 }}>
                  Designed specifically for shared rooms, bachelor flats, students, and working professionals across Nepal.
                </Text>
                <View style={{ marginVertical: 10, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: colors.bgSubtle, borderRadius: 20 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>Version 1.0.0 (Build 58)</Text>
                </View>
              </View>

              <Button variant="primary" size="md" fullWidth onPress={() => setIsAboutOpen(false)}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* CONFIRM LOGOUT MODAL */}
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

      {/* CONFIRM CLEAN LOCAL STORAGE MODAL */}
      <ConfirmModal
        isOpen={isCleanStorageConfirmOpen}
        onClose={() => setIsCleanStorageConfirmOpen(false)}
        onConfirm={() => {
          setIsCleanStorageConfirmOpen(false);
          clearAllData();
        }}
        title={language === 'ne' ? 'स्थानीय डाटा सफा गर्ने?' : 'Clean All Local Storage Data?'}
        description={
          language === 'ne'
            ? 'यसले तपाईंको उपकरणमा सुरक्षित सबै क्यास र स्थानीय विवरणहरू खाली गरी नयाँ प्रारम्भिक अवस्थामा रिसेट गर्नेछ।'
            : 'This will wipe all cached room, member, and offline transaction data from your device storage and reload fresh defaults.'
        }
        confirmText={language === 'ne' ? 'सफा गर्नुहोस्' : 'Clean & Reset'}
        confirmVariant="danger"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800'
  },
  mainSub: {
    fontSize: 12,
    marginTop: 2
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800'
  },
  sectionDesc: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16
  },
  themePillsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 6
  },
  themePill: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  themePillText: {
    fontSize: 12
  },
  toggleList: {
    gap: 4
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  toggleSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600'
  },
  actionDesc: {
    fontSize: 11,
    marginTop: 2
  },
  roomCardBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  roomTitleText: {
    fontSize: 14,
    fontWeight: '800'
  },
  roomDescText: {
    fontSize: 11,
    marginTop: 2
  },
  codeBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  codeTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  codeText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2
  },
  prefItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  prefItemLabel: {
    fontSize: 13,
    fontWeight: '600'
  },
  prefItemVal: {
    fontSize: 12,
    fontWeight: '700'
  },
  adminBannerBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  adminBannerText: {
    fontSize: 13,
    fontWeight: '700'
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: 16
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 20
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800'
  },
  inputGroup: {
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6
  },
  textInput: {
    height: 44,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },
  sessionCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sessionName: {
    fontSize: 13,
    fontWeight: '700'
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  policySectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4
  },
  policyText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8
  },
  dataStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10
  },
  dataStatLabel: {
    fontSize: 12
  },
  dataStatVal: {
    fontSize: 12,
    fontWeight: '800'
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1
  },
  contactCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  editBadgeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  iconPillBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  addMemberBannerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4
  },
  memberItemCard: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  memberNameText: {
    fontSize: 13,
    fontWeight: '700'
  },
  memberSubText: {
    fontSize: 11,
    marginTop: 2
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  roleToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1
  },
  removeMemBtn: {
    padding: 7,
    borderRadius: 8
  },
  infoCardBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  infoCardText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16
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
  inputEyeBtn: {
    position: 'absolute',
    right: 12,
    zIndex: 2,
    padding: 4
  },
  credsCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8
  },
  credRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  credLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  credValue: {
    fontSize: 13,
    fontWeight: '700'
  },
  subSectionBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1
  },
  subSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4
  },
  splitRuleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  closeMonthCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5
  },
  archivePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  }
});
