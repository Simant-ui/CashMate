import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { Smartphone, Monitor, Sun, Moon, Shield, UserCheck, RefreshCw, KeyRound, Check } from 'lucide-react-native';

export const DeviceFrame = ({ children }) => {
  const {
    theme,
    setTheme,
    deviceFrame,
    setDeviceFrame,
    userRole,
    setUserRole,
    authScreen,
    setAuthScreen,
    showToast,
    setExpenses,
    INITIAL_EXPENSES,
    setSettlements,
    INITIAL_SETTLEMENTS,
    colors
  } = useApp();

  const handleResetData = () => {
    setExpenses(INITIAL_EXPENSES);
    setSettlements(INITIAL_SETTLEMENTS);
    showToast('Reset to Kathmandu Boys Room sample data!');
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.bgApp }]}>
      <ExpoStatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      {/* Demo Prototype Toolbar on Web / Full View */}
      {Platform.OS === 'web' && (
        <View style={styles.demoBar}>
          <View style={styles.demoTitleGroup}>
            <Text style={{ fontSize: 16 }}>💸</Text>
            <Text style={styles.demoTitleText}>CashMate</Text>
          </View>

          <View style={styles.demoControls}>
            <TouchableOpacity
              style={[styles.demoBtn, theme === 'light' && styles.demoBtnActive]}
              onPress={() => setTheme('light')}
            >
              <Sun size={12} color="#ffffff" />
              <Text style={styles.demoBtnText}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, theme === 'dark' && styles.demoBtnActive]}
              onPress={() => setTheme('dark')}
            >
              <Moon size={12} color="#ffffff" />
              <Text style={styles.demoBtnText}>Dark</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, userRole === 'admin' && styles.demoBtnActive]}
              onPress={() => setUserRole(userRole === 'admin' ? 'member' : 'admin')}
            >
              <Shield size={12} color="#ffffff" />
              <Text style={styles.demoBtnText}>{userRole === 'admin' ? 'Admin' : 'Member'}</Text>
            </TouchableOpacity>

            {authScreen === 'authenticated' ? (
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => setAuthScreen('splash')}
              >
                <KeyRound size={12} color="#ffffff" />
                <Text style={styles.demoBtnText}>Auth Flow</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.demoBtn, styles.demoBtnActive]}
                onPress={() => setAuthScreen('authenticated')}
              >
                <Check size={12} color="#ffffff" />
                <Text style={styles.demoBtnText}>Main App</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.demoBtn} onPress={handleResetData}>
              <RefreshCw size={12} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Screen App Body */}
      <View style={[styles.screenBody, { backgroundColor: colors.bgApp }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  },
  demoBar: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap'
  },
  demoTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  demoTitleText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  demoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  demoBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  demoBtnActive: {
    backgroundColor: '#10b981'
  },
  demoBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600'
  },
  screenBody: {
    flex: 1
  }
});
