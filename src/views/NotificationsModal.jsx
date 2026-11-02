import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { SwipeBackWrapper } from '../components/SwipeBackWrapper';
import { X, Bell, Receipt, HandCoins, BarChart3, UserCheck, CheckCheck } from 'lucide-react-native';

export const NotificationsModal = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    setNotifications,
    showToast,
    t,
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
      <SwipeBackWrapper onSwipeBack={() => setIsNotificationsOpen(false)} style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgSurface }]}>
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.bellBox, { backgroundColor: colors.primaryLight }]}>
                <Bell color={colors.primary} size={18} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>{t('notifications') || 'Notifications'}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {notifications.some(n => !n.read) && (
                <TouchableOpacity
                  onPress={handleMarkAllRead}
                  style={[styles.markReadBtn, { backgroundColor: colors.bgSubtle }]}
                  activeOpacity={0.7}
                >
                  <CheckCheck size={14} color={colors.primary} />
                  <Text style={[styles.markReadText, { color: colors.primary }]}>{t('markAllAsRead') || 'Mark read'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setIsNotificationsOpen(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {notifications.length > 0 ? (
            <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
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
                      <Text style={[styles.notifTitle, { color: colors.textMain }]} numberOfLines={1}>{n.title}</Text>
                      <Text style={[styles.notifTime, { color: colors.textMuted }]}>{n.time}</Text>
                    </View>
                    <Text style={[styles.notifText, { color: colors.textMuted }]}>{n.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
              <Text style={{ fontSize: 32 }}>🔔</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('noNotifications') || 'No new notifications.'}</Text>
            </View>
          )}
        </View>
      </View>
    </SwipeBackWrapper>
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
  bellBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: 13
  }
});
