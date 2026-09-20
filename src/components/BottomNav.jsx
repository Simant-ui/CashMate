import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Home, Receipt, HandCoins, BarChart3, User, Plus } from 'lucide-react-native';

export const BottomNav = () => {
  const { activeTab, setActiveTab, setIsAddExpenseOpen, optimizedSettlements, colors } = useApp();

  const pendingCount = optimizedSettlements.length;

  return (
    <View style={[styles.navContainer, { backgroundColor: colors.bgSurface, borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('home')}
      >
        <Home size={20} color={activeTab === 'home' ? colors.primary : colors.textMuted} />
        <Text style={[styles.navText, { color: activeTab === 'home' ? colors.primary : colors.textMuted }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('expenses')}
      >
        <Receipt size={20} color={activeTab === 'expenses' ? colors.primary : colors.textMuted} />
        <Text style={[styles.navText, { color: activeTab === 'expenses' ? colors.primary : colors.textMuted }]}>
          Expenses
        </Text>
      </TouchableOpacity>

      {/* Floating Center Action Button (+ Add) */}
      <TouchableOpacity
        style={[styles.fabBtn, { backgroundColor: colors.primary }]}
        onPress={() => setIsAddExpenseOpen(true)}
        activeOpacity={0.8}
      >
        <Plus size={26} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('settlements')}
      >
        <View style={{ position: 'relative' }}>
          <HandCoins size={20} color={activeTab === 'settlements' ? colors.primary : colors.textMuted} />
          {pendingCount > 0 && (
            <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          )}
        </View>
        <Text style={[styles.navText, { color: activeTab === 'settlements' ? colors.primary : colors.textMuted }]}>
          Settle
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('reports')}
      >
        <BarChart3 size={20} color={activeTab === 'reports' ? colors.primary : colors.textMuted} />
        <Text style={[styles.navText, { color: activeTab === 'reports' ? colors.primary : colors.textMuted }]}>
          Reports
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab('profile')}
      >
        <User size={20} color={activeTab === 'profile' ? colors.primary : colors.textMuted} />
        <Text style={[styles.navText, { color: activeTab === 'profile' ? colors.primary : colors.textMuted }]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    height: 64,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4
  },
  navText: {
    fontSize: 10,
    fontWeight: '600'
  },
  fabBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4
  }
});
