import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Bell, ChevronDown, Plus, ShieldCheck, UserCheck, Globe } from 'lucide-react-native';

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
    language,
    setLanguage,
    t,
    colors
  } = useApp();

  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.bgSurface, borderBottomColor: colors.border }]}>
      {/* Room Selector Dropdown Trigger */}
      <View style={{ position: 'relative', zIndex: 60, flex: 1, maxWidth: 170 }}>
        <TouchableOpacity
          onPress={() => {
            setIsRoomDropdownOpen(!isRoomDropdownOpen);
            setIsLangDropdownOpen(false);
          }}
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
              {t('yourRooms')} ({rooms.length})
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
                    <Text style={{ fontSize: 9, color: colors.textMuted }}>{t('roomCodeLabel')}: {r.code}</Text>
                  </View>
                  {r.id === activeRoomId && (
                    <View style={[styles.activeBadge, { backgroundColor: colors.positiveLight }]}>
                      <Text style={[styles.activeBadgeText, { color: colors.positive }]}>{t('activeBadge')}</Text>
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
              <Text style={[styles.dropdownOptionText, { color: colors.primary, fontWeight: '700' }]}>{t('createNewRoom')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsRoomDropdownOpen(false);
                setAuthScreen('join_room');
              }}
              style={styles.dropdownOption}
            >
              <Text style={{ fontSize: 14 }}>🔑</Text>
              <Text style={[styles.dropdownOptionText, { color: colors.textMain }]}>{t('joinRoomByCode')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Right Action Icons: Language Selector + Admin Status + Notifications Bell */}
      <View style={styles.rightActions}>
        {/* Language Selector Dropdown */}
        <View style={{ position: 'relative', zIndex: 70 }}>
          <TouchableOpacity
            onPress={() => {
              setIsLangDropdownOpen(!isLangDropdownOpen);
              setIsRoomDropdownOpen(false);
            }}
            style={[styles.langBtn, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Globe size={13} color={colors.primary} />
            <Text style={[styles.langBtnText, { color: colors.textMain }]}>
              {language === 'ne' ? 'नेपाली' : 'English'}
            </Text>
            <ChevronDown size={11} color={colors.textMuted} />
          </TouchableOpacity>

          {isLangDropdownOpen && (
            <View style={[styles.langDropdown, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.langOption,
                  language === 'en' && { backgroundColor: colors.primaryLight }
                ]}
                onPress={() => {
                  setLanguage('en');
                  setIsLangDropdownOpen(false);
                }}
              >
                <Text style={{ fontSize: 13 }}>🇬🇧</Text>
                <Text
                  style={[
                    styles.langOptionText,
                    {
                      color: language === 'en' ? colors.primary : colors.textMain,
                      fontWeight: language === 'en' ? '800' : '600'
                    }
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.langOption,
                  language === 'ne' && { backgroundColor: colors.primaryLight }
                ]}
                onPress={() => {
                  setLanguage('ne');
                  setIsLangDropdownOpen(false);
                }}
              >
                <Text style={{ fontSize: 13 }}>🇳🇵</Text>
                <Text
                  style={[
                    styles.langOptionText,
                    {
                      color: language === 'ne' ? colors.primary : colors.textMain,
                      fontWeight: language === 'ne' ? '800' : '600'
                    }
                  ]}
                >
                  नेपाली
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {userRole === 'admin' ? (
          <TouchableOpacity
            onPress={() => setIsAdminPanelOpen(true)}
            style={[styles.roleBadge, { backgroundColor: colors.secondaryLight }]}
          >
            <ShieldCheck size={13} color={colors.secondary} />
            <Text style={[styles.roleText, { color: colors.secondary }]}>{t('admin')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.roleBadge, { backgroundColor: colors.bgSubtle }]}>
            <UserCheck size={12} color={colors.textMuted} />
            <Text style={[styles.roleText, { color: colors.textMuted }]}>{t('member')}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setIsNotificationsOpen(true)}
          style={[styles.bellBtn, { backgroundColor: colors.bgSubtle }]}
        >
          <Bell size={17} color={colors.textMain} />
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50
  },
  roomBtn: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  roomName: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 105
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700'
  },
  langDropdown: {
    position: 'absolute',
    top: 36,
    right: 0,
    width: 120,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8
  },
  langOptionText: {
    fontSize: 12
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700'
  },
  bellBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeCount: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800'
  },
  dropdownBox: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: 240,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10
  },
  dropdownHeader: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  activeRoomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 10
  },
  activeRoomText: {
    fontSize: 12,
    fontWeight: '700'
  },
  activeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    marginVertical: 8
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4
  },
  dropdownOptionText: {
    fontSize: 12
  }
});
