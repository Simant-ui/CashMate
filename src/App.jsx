import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { ExpensesView } from './views/ExpensesView';
import { SettlementsView } from './views/SettlementsView';
import { ReportsView } from './views/ReportsView';
import { ProfileView } from './views/ProfileView';
import { AddExpenseModal } from './views/AddExpenseModal';
import { ExpenseDetailModal } from './views/ExpenseDetailModal';
import { SettlePaymentModal } from './views/SettlePaymentModal';
import { AdminPanelModal } from './views/AdminPanelModal';
import { NotificationsModal } from './views/NotificationsModal';

const MainAppContent = () => {
  const { authScreen, activeTab, colors } = useApp();

  if (authScreen !== 'authenticated') {
    return <AuthView />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'expenses':
        return <ExpensesView />;
      case 'settlements':
        return <SettlementsView />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <View style={[styles.appWrapper, { backgroundColor: colors.bgApp }]}>
      <Header />

      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>

      <BottomNav />

      <AddExpenseModal />
      <ExpenseDetailModal />
      <SettlePaymentModal />
      <AdminPanelModal />
      <NotificationsModal />
      <Toast />
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DeviceFrame>
        <MainAppContent />
      </DeviceFrame>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1
  }
});
