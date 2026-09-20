import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { X, Bell, Receipt, HandCoins, BarChart3, UserCheck } from 'lucide-react-native';

export const NotificationsModal = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    setNotifications,
    showToast,
    colors
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'expense':
        return <Receipt size={18} color={colors.primary} />;
      case 'settlement':
        return <HandCoins size={18} color={colors.secondary} />;
      case 'report':
        return <BarChart3 size={18} color={colors.warning} />;
      default:
        return <UserCheck size={18} color={colors.primary} />;
    }
  };

  return (
    <Modal visible={isNotificationsOpen} transparent animationType="slide" onRequestClose={() => setIsNotificationsOpen(false)}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Bell color={colors.primary} size={22} />
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>Notifications</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity onPress={handleMarkAllRead}>
                <Text style={[styles.markReadText, { color: colors.primary }]}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsNotificationsOpen(false)}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {notifications.length > 0 ? (
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              {notifications.map(n => (
                <View
                  key={n.id}
                  style={[
                    styles.notifRow,
                    {
                      backgroundColor: n.read ? colors.bgSubtle : colors.primaryLight,
                      borderColor: colors.border
                    }
                  ]}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.bgSurface }]}>
                    {getNotificationIcon(n.type)}
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[styles.notifTitle, { color: colors.textMain }]}>{n.title}</Text>
                      <Text style={[styles.notifTime, { color: colors.textMuted }]}>{n.time}</Text>
                    </View>
                    <Text style={[styles.notifText, { color: colors.textMuted }]}>{n.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No new notifications.</Text>
          )}
        </View>
      </View>
    </Modal>
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
    maxHeight: '85%'
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
  markReadText: {
    fontSize: 12,
    fontWeight: '700'
  },
  notifRow: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  iconCircle: {
    padding: 8,
    borderRadius: 20
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  notifTime: {
    fontSize: 10
  },
  notifText: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40
  }
});
