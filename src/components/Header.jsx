import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Bell, ChevronDown, Plus, ShieldCheck, UserCheck } from 'lucide-react-native';

export const Header = () => {
  const {
    room,
    rooms,
    activeRoomId,
    switchRoom,
    notifications,
    setIsNotificationsOpen,
    setIsAdminPanelOpen,
    setAuthScreen,
    userRole,
    colors
  } = useApp();

  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.bgSurface, borderBottomColor: colors.border }]}>
      {/* Room Selector Dropdown Trigger */}
      <View style={{ position: 'relative', zIndex: 60 }}>
        <TouchableOpacity
          onPress={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
          style={[styles.roomBtn, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}
        >
          <Text style={{ fontSize: 14 }}>🏠</Text>
          <Text style={[styles.roomName, { color: colors.textMain }]} numberOfLines={1}>
            {room.name}
          </Text>
          <ChevronDown size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Room Switcher Dropdown */}
        {isRoomDropdownOpen && (
          <View style={[styles.dropdownBox, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
            <Text style={[styles.dropdownHeader, { color: colors.textMuted }]}>
              YOUR ROOMS ({rooms.length})
            </Text>

            <View style={{ gap: 6, marginBottom: 6 }}>
              {rooms.map(r => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => {
                    switchRoom(r.id);
                    setIsRoomDropdownOpen(false);
                  }}
                  style={[
                    styles.activeRoomBadge,
                    {
                      backgroundColor: r.id === activeRoomId ? colors.primaryLight : colors.bgSubtle,
                      borderColor: r.id === activeRoomId ? colors.primary : 'transparent',
                      borderWidth: 1
                    }
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.activeRoomText, { color: colors.textMain }]} numberOfLines={1}>
                      {r.name}
                    </Text>
                    <Text style={{ fontSize: 9, color: colors.textMuted }}>Code: {r.code}</Text>
                  </View>
                  {r.id === activeRoomId && (
                    <View style={[styles.activeBadge, { backgroundColor: colors.positiveLight }]}>
                      <Text style={[styles.activeBadgeText, { color: colors.positive }]}>Active</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              onPress={() => {
                setIsRoomDropdownOpen(false);
                setAuthScreen('create_room');
              }}
              style={styles.dropdownOption}
            >
              <Plus size={14} color={colors.primary} />
              <Text style={[styles.dropdownOptionText, { color: colors.primary, fontWeight: '700' }]}>+ Create New Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsRoomDropdownOpen(false);
                setAuthScreen('join_room');
              }}
              style={styles.dropdownOption}
            >
              <Text style={{ fontSize: 14 }}>🔑</Text>
              <Text style={[styles.dropdownOptionText, { color: colors.textMain }]}>Join Room by Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Right Action Icons: Admin Status + Notifications Bell */}
      <View style={styles.rightActions}>
        {userRole === 'admin' ? (
          <TouchableOpacity
            onPress={() => setIsAdminPanelOpen(true)}
            style={[styles.roleBadge, { backgroundColor: colors.secondaryLight }]}
          >
            <ShieldCheck size={14} color={colors.secondary} />
            <Text style={[styles.roleText, { color: colors.secondary }]}>Admin</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.roleBadge, { backgroundColor: colors.bgSubtle }]}>
            <UserCheck size={12} color={colors.textMuted} />
            <Text style={[styles.roleText, { color: colors.textMuted }]}>Member</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setIsNotificationsOpen(true)}
          style={[styles.bellBtn, { backgroundColor: colors.bgSubtle }]}
        >
          <Bell size={18} color={colors.textMain} />
          {unreadCount > 0 && (
            <View style={[styles.badgeDot, { backgroundColor: colors.negative }]}>
              <Text style={styles.badgeCount}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50
  },
  roomBtn: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roomName: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 140
  },
  dropdownBox: {
    position: 'absolute',
    top: 42,
    left: 0,
    width: 230,
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  dropdownHeader: {
    fontSize: 10,
    fontWeight: '700',
    padding: 6
  },
  activeRoomBadge: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  activeRoomText: {
    fontSize: 13,
    fontWeight: '700'
  },
  activeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    marginVertical: 4
  },
  dropdownOption: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 6
  },
  dropdownOptionText: {
    fontSize: 12,
    fontWeight: '600'
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700'
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  badgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeCount: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800'
  }
});
