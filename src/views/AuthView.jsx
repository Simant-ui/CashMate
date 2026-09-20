import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Share, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, ArrowRight, Smartphone, Mail, Lock, User, Sparkles, Hash, CheckCircle, Copy, Share2, Shield, Users, AlertCircle } from 'lucide-react-native';

export const AuthView = () => {
  const {
    authScreen,
    setAuthScreen,
    createNewRoom,
    findRoomByCode,
    confirmJoinRoom,
    loginWithCredentials,
    newlyCreatedRoom,
    pendingJoinRoom,
    setPendingJoinRoom,
    showToast,
    colors
  } = useApp();

  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('ram@cashmate.app');
  const [loginPass, setLoginPass] = useState('password123');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');

  // Create Room Form State
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [roomCurrency, setRoomCurrency] = useState('NPR (Rs.)');

  // Join Room State
  const [inputRoomCode, setInputRoomCode] = useState('CM-7K4P9X');
  const [codeError, setCodeError] = useState(null);

  // Copy Room Code to Clipboard
  const handleCopyCode = (code) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    showToast(`✓ Room Code ${code} copied to clipboard!`);
  };

  // Share Room Code via Native Share Sheet
  const handleShareCode = async (roomName, code) => {
    try {
      const shareMessage = `Join my CashMate room: ${roomName}\nRoom Code: ${code}\nDownload CashMate and use this code to join.`;
      await Share.share({
        message: shareMessage,
        title: `Join ${roomName} on CashMate`
      });
    } catch (err) {
      showToast('Could not share room code: ' + err.message, 'error');
    }
  };

  // 1. FIRST-TIME WELCOME SCREEN
  if (authScreen === 'welcome' || authScreen === 'splash') {
    return (
      <ScrollView contentContainerStyle={[styles.welcomeContainer, { backgroundColor: colors.bgApp }]}>
        <View style={styles.brandHeroBox}>
          <View style={[styles.brandLogoBox, { backgroundColor: colors.primary }]}>
            <Text style={{ fontSize: 44 }}>💸</Text>
          </View>
          <Text style={[styles.brandTitle, { color: colors.textMain }]}>Welcome to CashMate</Text>
          <Text style={[styles.brandTagline, { color: colors.primary }]}>Track. Split. Settle.</Text>
          <Text style={[styles.brandDesc, { color: colors.textMuted }]}>
            Simplified shared expense management for roommates, flats, and trip groups.
          </Text>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.actionBox}>
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
            onPress={() => setAuthScreen('create_room')}
          >
            <Text style={{ fontSize: 20 }}>🏠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryActionTitle}>Create a Room</Text>
              <Text style={styles.primaryActionSub}>Set up a new shared room & become Admin</Text>
            </View>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: colors.secondary }]}
            onPress={() => setAuthScreen('join_room')}
          >
            <Text style={{ fontSize: 20 }}>🔑</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryActionTitle}>Join a Room</Text>
              <Text style={styles.primaryActionSub}>Enter Room Code or login with credentials</Text>
            </View>
            <ArrowRight size={20} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.authRowDivider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>Existing User?</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[styles.secondaryLinkBtn, { backgroundColor: colors.bgSurface, borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => setAuthScreen('login')}
            >
              <Text style={[styles.secondaryLinkText, { color: colors.textMain }]}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryLinkBtn, { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderWidth: 1 }]}
              onPress={() => setAuthScreen('register')}
            >
              <Text style={[styles.secondaryLinkText, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 2. CREATE ROOM FORM (CLEAN & SIMPLE LIKE BEFORE)
  if (authScreen === 'create_room') {
    const handleCreateRoomSubmit = () => {
      if (!roomName.trim()) {
        showToast('Please enter a Room Name.', 'error');
        return;
      }

      createNewRoom({
        name: roomName.trim(),
        description: roomDesc.trim(),
        currency: roomCurrency
      });

      setAuthScreen('create_success');
    };

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.bgSurface }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <Text style={[styles.headerTitle, { color: colors.textMain }]}>Create a Room</Text>
            <Text style={[styles.headerSub, { color: colors.textMuted }]}>
              Set up your shared room. The room creator automatically becomes the Room Admin.
            </Text>

            <View style={[styles.adminBanner, { backgroundColor: colors.secondaryLight, borderColor: colors.secondary }]}>
              <Shield size={18} color={colors.secondary} />
              <Text style={[styles.adminBannerText, { color: colors.secondary }]}>
                👑 Room Creator Admin Setup: You will own & manage this room as Admin.
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Room / Group Name *</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                placeholder="e.g. Kathmandu Boys Room"
                placeholderTextColor={colors.textMuted}
                value={roomName}
                onChangeText={setRoomName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Optional Description</Text>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
                placeholder="e.g. Room 304 Shared Expense Management"
                placeholderTextColor={colors.textMuted}
                value={roomDesc}
                onChangeText={setRoomDesc}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textMain }]}>Default Currency</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.bgSubtle }]}>
                <TextInput
                  style={[styles.input, { color: colors.textMain, borderColor: colors.border, fontWeight: '700' }]}
                  value={roomCurrency}
                  onChangeText={setRoomCurrency}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
            onPress={handleCreateRoomSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>Create Room</Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelBtn, { marginTop: 10 }]}
            onPress={() => setAuthScreen('welcome')}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Back to Welcome</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // 3. CREATE ROOM SUCCESS SCREEN (Permanent Room Code Card)
  if (authScreen === 'create_success' && newlyCreatedRoom) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: colors.bgSurface, justifyContent: 'center' }]}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={[styles.iconCircle, { backgroundColor: colors.positiveLight }]}>
            <CheckCircle size={48} color={colors.positive} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textMain, textAlign: 'center' }]}>✓ Room Created!</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted, textAlign: 'center', marginTop: 4 }]}>
            {newlyCreatedRoom.name} is ready for shared expense tracking.
          </Text>
        </View>

        {/* Permanent Room Code Box */}
        <View style={[styles.roomCodeCard, { backgroundColor: colors.bgSubtle, borderColor: colors.primary }]}>
          <Text style={[styles.roomCodeHeaderLabel, { color: colors.textMuted }]}>PERMANENT ROOM CODE</Text>
          <Text style={[styles.roomCodeBigText, { color: colors.primary }]}>{newlyCreatedRoom.code}</Text>

          <Text style={[styles.roomCodeSubText, { color: colors.textMuted }]}>
            Share this code with your roommates so they can join {newlyCreatedRoom.name}.
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <TouchableOpacity
              style={[styles.codeActionBtn, { backgroundColor: colors.primary }]}
              onPress={() => handleCopyCode(newlyCreatedRoom.code)}
            >
              <Copy size={14} color="#ffffff" />
              <Text style={styles.codeActionText}>Copy Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.codeActionBtn, { backgroundColor: colors.secondary }]}
              onPress={() => handleShareCode(newlyCreatedRoom.name, newlyCreatedRoom.code)}
            >
              <Share2 size={14} color="#ffffff" />
              <Text style={styles.codeActionText}>Share Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 24 }]}
          onPress={() => setAuthScreen('authenticated')}
        >
          <Text style={styles.primaryBtnText}>Go to Dashboard</Text>
          <Sparkles size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }

  // 4. JOIN ROOM SCREEN (Join with Code OR Join with Credentials)
  if (authScreen === 'join_room') {
    const handleFindRoomSubmit = () => {
      setCodeError(null);
      if (!inputRoomCode.trim()) {
        setCodeError('Please enter a Room Code.');
        return;
      }
      const preview = findRoomByCode(inputRoomCode.trim());
      if (!preview) {
        setCodeError('Room Not Found: The Room Code you entered is invalid or does not exist.');
        return;
      }
      setPendingJoinRoom(preview);
      setAuthScreen('join_preview');
    };

    return (
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.bgSurface }]}>
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Text style={[styles.headerTitle, { color: colors.textMain }]}>Join a Room</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Ask your room Admin for the permanent Room Code.
          </Text>
        </View>

        {/* METHOD 1: JOIN WITH ROOM CODE (PRIMARY) */}
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.primary, borderWidth: 1.5 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Hash size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>Method 1: Join with Room Code</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textMuted }]}>ROOM CODE (e.g. CM-7K4P9X)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { color: colors.textMain, borderColor: colors.border, fontWeight: '800', letterSpacing: 1.5, fontSize: 16 }]}
                placeholder="CM-7K4P9X"
                placeholderTextColor={colors.textMuted}
                value={inputRoomCode}
                onChangeText={val => {
                  setInputRoomCode(val.toUpperCase());
                  setCodeError(null);
                }}
              />
            </View>
          </View>

          {codeError && (
            <View style={[styles.errorBox, { backgroundColor: colors.negativeLight }]}>
              <AlertCircle size={16} color={colors.negative} />
              <Text style={[styles.errorText, { color: colors.negative }]}>{codeError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10 }]}
            onPress={handleFindRoomSubmit}
          >
            <Text style={styles.primaryBtnText}>Find Room</Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* METHOD 2: JOIN WITH EMAIL & PASSWORD (FOR ADMIN-CREATED MEMBERS) */}
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border, marginTop: 16 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Lock size={18} color={colors.textMuted} />
            <Text style={[styles.cardTitle, { color: colors.textMain }]}>Method 2: Member Account Login</Text>
          </View>
          <Text style={[styles.subText, { color: colors.textMuted, marginBottom: 12 }]}>
            If your Admin has already created your member account, log in with your credentials to open your assigned room.
          </Text>

          <TouchableOpacity
            style={[styles.secondaryLinkBtn, { backgroundColor: colors.bgSubtle, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => setAuthScreen('login')}
          >
            <Mail size={16} color={colors.textMain} />
            <Text style={[styles.secondaryLinkText, { color: colors.textMain }]}>Login with Member Credentials</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.cancelBtn, { marginTop: 16 }]}
          onPress={() => setAuthScreen('welcome')}
        >
          <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Back to Welcome</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // 5. ROOM CARD PREVIEW SCREEN (BEFORE CONFIRMING JOIN)
  if (authScreen === 'join_preview' && pendingJoinRoom) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: colors.bgSurface, justifyContent: 'center' }]}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <CheckCircle size={44} color={colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textMain, textAlign: 'center' }]}>Room Found ✓</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted, textAlign: 'center', marginTop: 4 }]}>
            Review details below to join this room.
          </Text>
        </View>

        {/* Room Preview Card */}
        <View style={[styles.previewCard, { backgroundColor: colors.bgCard, borderColor: colors.primary }]}>
          <Text style={[styles.previewRoomName, { color: colors.textMain }]}>{pendingJoinRoom.room.name}</Text>
          <Text style={[styles.previewRoomDesc, { color: colors.textMuted }]}>{pendingJoinRoom.room.description}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.previewGrid}>
            <View style={styles.previewItem}>
              <Shield size={16} color={colors.secondary} />
              <View>
                <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Admin</Text>
                <Text style={[styles.previewVal, { color: colors.textMain }]}>{pendingJoinRoom.adminName}</Text>
              </View>
            </View>

            <View style={styles.previewItem}>
              <Users size={16} color={colors.primary} />
              <View>
                <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Members</Text>
                <Text style={[styles.previewVal, { color: colors.textMain }]}>{pendingJoinRoom.membersCount} Members</Text>
              </View>
            </View>

            <View style={styles.previewItem}>
              <Hash size={16} color={colors.warning} />
              <View>
                <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Room Code</Text>
                <Text style={[styles.previewVal, { color: colors.primary }]}>{pendingJoinRoom.room.code}</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 20 }]}
          onPress={() => {
            confirmJoinRoom(pendingJoinRoom.room);
            setAuthScreen('authenticated');
          }}
        >
          <Text style={styles.primaryBtnText}>Join Room</Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelBtn, { marginTop: 12 }]}
          onPress={() => setAuthScreen('join_room')}
        >
          <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Cancel & Search Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 6. LOGIN SCREEN
  if (authScreen === 'login') {
    return (
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.bgSurface }]}>
        <View style={{ marginTop: 20, marginBottom: 28 }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>👋</Text>
          <Text style={[styles.headerTitle, { color: colors.textMain }]}>Sign In to CashMate</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Enter your credentials to access your assigned room.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textMain }]}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
              placeholder="name@cashmate.app"
              placeholderTextColor={colors.textMuted}
              value={loginEmail}
              onChangeText={setLoginEmail}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textMain }]}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSurface }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              value={loginPass}
              onChangeText={setLoginPass}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
          onPress={() => loginWithCredentials(loginEmail, loginPass)}
        >
          <Text style={styles.primaryBtnText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelBtn, { marginTop: 16 }]}
          onPress={() => setAuthScreen('welcome')}
        >
          <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Back to Welcome</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // 7. REGISTER SCREEN
  if (authScreen === 'register') {
    const handleRegister = () => {
      if (!regName.trim() || !regEmail.trim() || !regPass) {
        showToast('Please fill all required fields.', 'error');
        return;
      }
      setAuthScreen('create_room');
    };

    return (
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.bgSurface }]}>
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Text style={[styles.headerTitle, { color: colors.textMain }]}>Create Account</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>Start managing room expenses with CashMate.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textMain }]}>Full Name *</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
              placeholder="Ram Sharma"
              placeholderTextColor={colors.textMuted}
              value={regName}
              onChangeText={setRegName}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textMain }]}>Email Address *</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
              placeholder="ram@example.com"
              placeholderTextColor={colors.textMuted}
              value={regEmail}
              onChangeText={setRegEmail}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textMain }]}>Mobile Number *</Text>
          <View style={styles.inputWrapper}>
            <Smartphone size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
              placeholder="+977 9800000000"
              placeholderTextColor={colors.textMuted}
              value={regMobile}
              onChangeText={setRegMobile}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.textMain }]}>Password *</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textMain, borderColor: colors.border }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              value={regPass}
              onChangeText={setRegPass}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
          onPress={handleRegister}
        >
          <Text style={styles.primaryBtnText}>Continue to Room Setup</Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelBtn, { marginTop: 16 }]}
          onPress={() => setAuthScreen('welcome')}
        >
          <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>Back to Welcome</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  welcomeContainer: {
    padding: 24,
    minHeight: '100%',
    justifyContent: 'center'
  },
  brandHeroBox: {
    alignItems: 'center',
    marginBottom: 36
  },
  brandLogoBox: {
    width: 84,
    height: 84,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800'
  },
  brandTagline: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4
  },
  brandDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 18
  },
  actionBox: {
    gap: 12
  },
  primaryActionBtn: {
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  primaryActionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  primaryActionSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2
  },
  authRowDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10
  },
  line: {
    flex: 1,
    height: 1
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700'
  },
  secondaryLinkBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  secondaryLinkText: {
    fontSize: 13,
    fontWeight: '700'
  },
  screenContainer: {
    flex: 1,
    padding: 24
  },
  scrollContainer: {
    padding: 24,
    flexGrow: 1
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800'
  },
  headerSub: {
    fontSize: 13,
    marginTop: 4
  },
  formSection: {
    marginBottom: 18
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
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
  inputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 2
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    zIndex: 2
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  roomCodeCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center'
  },
  roomCodeHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  roomCodeBigText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    marginVertical: 8
  },
  roomCodeSubText: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260
  },
  codeActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  codeActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  subText: {
    fontSize: 12,
    lineHeight: 18
  },
  errorBox: {
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  previewCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 2
  },
  previewRoomName: {
    fontSize: 20,
    fontWeight: '800'
  },
  previewRoomDesc: {
    fontSize: 12,
    marginTop: 4
  },
  divider: {
    height: 1,
    marginVertical: 14
  },
  previewGrid: {
    gap: 12
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700'
  },
  previewVal: {
    fontSize: 14,
    fontWeight: '800'
  },
  adminBanner: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10
  },
  adminBannerText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    lineHeight: 16
  }
});
