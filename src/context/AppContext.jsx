import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { translations } from '../i18n/translations';
import { getTranslatedCategoryName } from '../i18n/searchHelper';

const AppContext = createContext();

export const INITIAL_MEMBERS = [
  { id: 'user-ram', name: 'Ram Sharma', email: 'ram@cashmate.app', mobile: '+977 9801234567', avatar: '👦', role: 'admin', status: 'ACTIVE', joinedDate: '2026-08-15' },
  { id: 'user-hari', name: 'Hari Thapa', email: 'hari@cashmate.app', mobile: '+977 9812345678', avatar: '👨', role: 'member', status: 'ACTIVE', joinedDate: '2026-08-16' },
  { id: 'user-shyam', name: 'Shyam Karki', email: 'shyam@cashmate.app', mobile: '+977 9823456789', avatar: '🧔', role: 'member', status: 'ACTIVE', joinedDate: '2026-08-16' },
  { id: 'user-sita', name: 'Sita Adhikari', email: 'sita@cashmate.app', mobile: '+977 9834567890', avatar: '👩', role: 'member', status: 'ACTIVE', joinedDate: '2026-08-18' },
  { id: 'user-gita', name: 'Gita Basnet', email: 'gita@cashmate.app', mobile: '+977 9845678901', avatar: '👩‍🦰', role: 'member', status: 'ACTIVE', joinedDate: '2026-08-20' },
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-rent', name: 'Rent', icon: '🏠', color: '#6366f1', defaultSplitAll: true },
  { id: 'cat-elec', name: 'Electricity', icon: '⚡', color: '#f59e0b', defaultSplitAll: true },
  { id: 'cat-water', name: 'Water', icon: '💧', color: '#3b82f6', defaultSplitAll: true },
  { id: 'cat-garb', name: 'Garbage', icon: '🗑', color: '#64748b', defaultSplitAll: true },
  { id: 'cat-net', name: 'Internet', icon: '🌐', color: '#8b5cf6', defaultSplitAll: true },
  { id: 'cat-groc', name: 'Grocery', icon: '🛒', color: '#10b981', defaultSplitAll: true },
  { id: 'cat-gas', name: 'Gas', icon: '🔥', color: '#ef4444', defaultSplitAll: true },
  { id: 'cat-clean', name: 'Cleaning', icon: '🧹', color: '#06b6d4', defaultSplitAll: true },
  { id: 'cat-maint', name: 'Maintenance', icon: '🔧', color: '#d97706', defaultSplitAll: true },
  { id: 'cat-trans', name: 'Transport', icon: '🚕', color: '#ec4899', defaultSplitAll: true },
  { id: 'cat-other', name: 'Other', icon: '📦', color: '#64748b', defaultSplitAll: true },
];

export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Room Rent',
    amount: 25000,
    paidBy: 'user-hari',
    date: '2026-09-01',
    categoryId: 'cat-rent',
    categoryName: 'Rent',
    categoryIcon: '🏠',
    description: 'September 2026 Monthly Room Rent Payment',
    splitType: 'everyone',
    participants: ['user-ram', 'user-hari', 'user-shyam', 'user-sita', 'user-gita'],
    shares: {
      'user-ram': 5000,
      'user-hari': 5000,
      'user-shyam': 5000,
      'user-sita': 5000,
      'user-gita': 5000,
    }
  },
  {
    id: 'exp-2',
    title: 'Electricity Bill',
    amount: 5000,
    paidBy: 'user-ram',
    date: '2026-09-03',
    categoryId: 'cat-elec',
    categoryName: 'Electricity',
    categoryIcon: '⚡',
    description: 'NEA Electricity Bill for August usage',
    splitType: 'everyone',
    participants: ['user-ram', 'user-hari', 'user-shyam', 'user-sita', 'user-gita'],
    shares: {
      'user-ram': 1000,
      'user-hari': 1000,
      'user-shyam': 1000,
      'user-sita': 1000,
      'user-gita': 1000,
    }
  },
  {
    id: 'exp-3',
    title: 'Drinking Water Jar',
    amount: 2000,
    paidBy: 'user-shyam',
    date: '2026-09-05',
    categoryId: 'cat-water',
    categoryName: 'Water',
    categoryIcon: '💧',
    description: '10 Mineral Water Jars for room',
    splitType: 'everyone',
    participants: ['user-ram', 'user-hari', 'user-shyam', 'user-sita', 'user-gita'],
    shares: {
      'user-ram': 400,
      'user-hari': 400,
      'user-shyam': 400,
      'user-sita': 400,
      'user-gita': 400,
    }
  },
  {
    id: 'exp-4',
    title: 'WorldLink Fiber Internet',
    amount: 3000,
    paidBy: 'user-sita',
    date: '2026-09-08',
    categoryId: 'cat-net',
    categoryName: 'Internet',
    categoryIcon: '🌐',
    description: 'Monthly high-speed internet subscription',
    splitType: 'everyone',
    participants: ['user-ram', 'user-hari', 'user-shyam', 'user-sita', 'user-gita'],
    shares: {
      'user-ram': 600,
      'user-hari': 600,
      'user-shyam': 600,
      'user-sita': 600,
      'user-gita': 600,
    }
  },
  {
    id: 'exp-5',
    title: 'Monthly Grocery & Supplies',
    amount: 10000,
    paidBy: 'user-gita',
    date: '2026-09-12',
    categoryId: 'cat-groc',
    categoryName: 'Grocery',
    categoryIcon: '🛒',
    description: 'BhatBhateni supermarket groceries, rice, oil & vegetables',
    splitType: 'everyone',
    participants: ['user-ram', 'user-hari', 'user-shyam', 'user-sita', 'user-gita'],
    shares: {
      'user-ram': 2000,
      'user-hari': 2000,
      'user-shyam': 2000,
      'user-sita': 2000,
      'user-gita': 2000,
    }
  }
];

export const INITIAL_SETTLEMENTS = [
  {
    id: 'stl-100',
    fromId: 'user-ram',
    toId: 'user-hari',
    amount: 1000,
    date: '2026-08-25',
    method: 'eSewa',
    note: 'August partial rent settlement',
    status: 'Settled'
  }
];

export const INITIAL_INCOME_CATEGORIES = [
  { id: 'cat-inc-contrib', name: 'Member Contribution', icon: '🤝', accountingTreatment: 'MEMBER_CONTRIBUTION', status: 'ACTIVE' },
  { id: 'cat-inc-rent', name: 'Rent Collection', icon: '🏠', accountingTreatment: 'ROOM_FUND', status: 'ACTIVE' },
  { id: 'cat-inc-refund', name: 'Refund Received', icon: '↩️', accountingTreatment: 'EXPENSE_REIMBURSEMENT', status: 'ACTIVE' },
  { id: 'cat-inc-biz', name: 'Business Income', icon: '💼', accountingTreatment: 'GENERAL_INCOME', status: 'ACTIVE' },
  { id: 'cat-inc-interest', name: 'Interest Income', icon: '📈', accountingTreatment: 'GENERAL_INCOME', status: 'ACTIVE' },
  { id: 'cat-inc-other', name: 'Other Income', icon: '💵', accountingTreatment: 'GENERAL_INCOME', status: 'ACTIVE' }
];

export const INITIAL_INCOMES = [
  {
    id: 'inc-1',
    title: 'September Room Fund Contribution',
    amount: 40000,
    categoryId: 'cat-inc-contrib',
    categoryName: 'Member Contribution',
    categoryIcon: '🤝',
    receivedById: 'user-ram',
    contributedById: 'all',
    date: '2026-09-01',
    description: 'Monthly flat contribution collected from room members (Rs. 8,000 each)',
    accountingTreatment: 'MEMBER_CONTRIBUTION',
    receiptUrl: null,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'inc-2',
    title: 'Water Jar Deposit Refund',
    amount: 1500,
    categoryId: 'cat-inc-refund',
    categoryName: 'Refund Received',
    categoryIcon: '↩️',
    receivedById: 'user-hari',
    contributedById: null,
    date: '2026-09-06',
    description: 'Water supplier returned deposit for 3 empty jars',
    accountingTreatment: 'EXPENSE_REIMBURSEMENT',
    receiptUrl: null,
    createdAt: '2026-09-06T12:00:00Z'
  },
  {
    id: 'inc-3',
    title: 'Study Room Sublease Rent',
    amount: 5000,
    categoryId: 'cat-inc-rent',
    categoryName: 'Rent Collection',
    categoryIcon: '🏠',
    receivedById: 'user-ram',
    contributedById: null,
    date: '2026-09-10',
    description: 'Collected rent from guest for 1-week study room sublet',
    accountingTreatment: 'ROOM_FUND',
    receiptUrl: null,
    createdAt: '2026-09-10T14:30:00Z'
  }
];

// Helper: Permanent Unique Room Code Generator (e.g. CM-7K4P9X)
export const generateUniqueRoomCode = (existingRooms = []) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  let isDuplicate = true;

  while (isDuplicate) {
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `CM-${randomPart}`;
    isDuplicate = existingRooms.some(r => r.code?.toUpperCase() === code);
  }
  return code;
};

// AD to BS Converter Utility
export const convertADtoBS = (adDateStr) => {
  if (!adDateStr) return '';
  const date = new Date(adDateStr);
  if (isNaN(date.getTime())) return adDateStr;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let bsYear = year + 56;
  if (month > 4 || (month === 4 && day >= 14)) {
    bsYear = year + 57;
  }

  const bsMonths = [
    'Poush', 'Magh', 'Phalgun', 'Chaitra', 'Baisakh', 'Jestha',
    'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir'
  ];

  const bsMonthIdx = (month + 8) % 12;
  const bsMonthName = bsMonths[bsMonthIdx];
  const bsDay = ((day + 14) % 30) + 1;

  return `${bsYear} ${bsMonthName} ${bsDay} B.S.`;
};

// Persistent Local Storage Helper (Cross-Platform Web & Native Fallback)
const getStorageItem = (key, defaultVal) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultVal;
    }
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return defaultVal;
};

const setStorageItem = (key, val) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(val));
    }
  } catch (e) {
    console.warn('Storage write error:', e);
  }
};

const removeStorageItem = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('Storage delete error:', e);
  }
};

export const clearAllLocalStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
      console.log('✓ All local storage data cleared.');
    }
  } catch (e) {
    console.warn('Storage clear error:', e);
  }
};

const INITIAL_USER_ACCOUNTS = [
  { id: 'user-ram', fullName: 'Ram Sharma', email: 'ram@cashmate.app', mobile: '+977 9801234567', password: 'password123', assignedRoomId: 'room-ktm-1', role: 'admin' },
  { id: 'user-hari', fullName: 'Hari Thapa', email: 'hari@cashmate.app', mobile: '+977 9812345678', password: 'password123', assignedRoomId: 'room-ktm-1', role: 'member' },
  { id: 'user-shyam', fullName: 'Shyam Karki', email: 'shyam@cashmate.app', mobile: '+977 9823456789', password: 'password123', assignedRoomId: 'room-ktm-1', role: 'member' },
  { id: 'user-sita', fullName: 'Sita Adhikari', email: 'sita@cashmate.app', mobile: '+977 9834567890', password: 'password123', assignedRoomId: 'room-ktm-1', role: 'member' },
  { id: 'user-gita', fullName: 'Gita Basnet', email: 'gita@cashmate.app', mobile: '+977 9845678901', password: 'password123', assignedRoomId: 'room-ktm-1', role: 'member' }
];

const INITIAL_ROOMS = [
  {
    id: 'room-ktm-1',
    name: 'Kathmandu Boys Room',
    code: 'CM-7K4P9X',
    currency: 'NPR (Rs.)',
    description: 'Room 304 Shared Expense Management',
    createdBy: 'user-ram',
    adminName: 'Ram Sharma',
    createdAt: '2026-08-01',
    status: 'ACTIVE'
  },
  {
    id: 'room-pkr-2',
    name: 'Pokhara Lakeside Flat',
    code: 'CM-P82LQ4',
    currency: 'NPR (Rs.)',
    description: 'Flat 2B Vacation & Monthly Sharing',
    createdBy: 'user-ram',
    adminName: 'Ram Sharma',
    createdAt: '2026-09-01',
    status: 'ACTIVE'
  }
];

export const DEFAULT_ROOMS_DATA = {
  'room-ktm-1': {
    members: INITIAL_MEMBERS,
    categories: INITIAL_CATEGORIES,
    incomeCategories: INITIAL_INCOME_CATEGORIES,
    incomes: INITIAL_INCOMES,
    expenses: INITIAL_EXPENSES,
    settlements: INITIAL_SETTLEMENTS,
    closedMonths: [
      {
        id: 'closed-aug-2026',
        monthName: 'August 2026',
        closedDate: '2026-08-31',
        totalExpenses: 38000,
        totalIncome: 40000,
        expenses: [
          { id: 'exp-aug-1', title: 'August Rent', amount: 25000, paidBy: 'user-hari', date: '2026-08-01', categoryIcon: '🏠', categoryName: 'Rent', shares: { 'user-ram': 5000, 'user-hari': 5000, 'user-shyam': 5000, 'user-sita': 5000, 'user-gita': 5000 } },
          { id: 'exp-aug-2', title: 'August Groceries', amount: 13000, paidBy: 'user-gita', date: '2026-08-15', categoryIcon: '🛒', categoryName: 'Grocery', shares: { 'user-ram': 2600, 'user-hari': 2600, 'user-shyam': 2600, 'user-sita': 2600, 'user-gita': 2600 } }
        ],
        settlements: [
          { id: 'stl-aug-1', fromId: 'user-ram', toId: 'user-hari', amount: 5000, date: '2026-08-28', method: 'eSewa', status: 'Settled' }
        ]
      }
    ]
  },
  'room-pkr-2': {
    members: [
      { id: 'user-ram', name: 'Ram Sharma', email: 'ram@cashmate.app', mobile: '+977 9801234567', avatar: '👦', role: 'admin', status: 'ACTIVE', joinedDate: '2026-09-01' },
      { id: 'user-anita', name: 'Anita Shrestha', email: 'anita@cashmate.app', mobile: '+977 9856789012', avatar: '👩‍💼', role: 'member', status: 'ACTIVE', joinedDate: '2026-09-02' }
    ],
    categories: INITIAL_CATEGORIES,
    incomeCategories: INITIAL_INCOME_CATEGORIES,
    incomes: [],
    expenses: [
      {
        id: 'exp-pkr-1',
        title: 'Lakeside Flat Advance',
        amount: 18000,
        paidBy: 'user-ram',
        date: '2026-09-02',
        categoryId: 'cat-rent',
        categoryName: 'Rent',
        categoryIcon: '🏠',
        description: 'Pokhara September Apartment Rent',
        splitType: 'everyone',
        participants: ['user-ram', 'user-anita'],
        shares: {
          'user-ram': 9000,
          'user-anita': 9000
        }
      }
    ],
    settlements: [],
    closedMonths: []
  }
};

export const AppProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => getStorageItem('cashmate_theme', 'light'));
  const [deviceFrame, setDeviceFrame] = useState('iphone');
  const [userRole, setUserRole] = useState(() => getStorageItem('cashmate_user_role', 'admin')); // 'admin' | 'member'
  const [activeTab, setActiveTabState] = useState('home');
  const [tabHistory, setTabHistory] = useState(['home']);

  const setActiveTab = (tab) => {
    setActiveTabState(prev => {
      const nextTab = typeof tab === 'function' ? tab(prev) : tab;
      if (nextTab !== prev) {
        setTabHistory(h => [...h.filter(t => t !== nextTab), nextTab]);
      }
      return nextTab;
    });
  };

  const goBackTab = () => {
    setTabHistory(prev => {
      if (prev.length <= 1) {
        setActiveTabState('home');
        return ['home'];
      }
      const newHistory = [...prev];
      newHistory.pop();
      const previous = newHistory[newHistory.length - 1] || 'home';
      setActiveTabState(previous);
      return newHistory;
    });
  };
  const [authScreen, setAuthScreen] = useState(() => getStorageItem('cashmate_auth_screen', 'authenticated')); // Default to logged in session

  const [isLoading, setIsLoading] = useState(false);
  const [calendarSystem, setCalendarSystem] = useState('AD');
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  // Registered User Accounts Database
  const [userAccounts, setUserAccounts] = useState(() => getStorageItem('cashmate_user_accounts', INITIAL_USER_ACCOUNTS));

  const [currentUser, setCurrentUser] = useState(() => getStorageItem('cashmate_current_user', INITIAL_MEMBERS[0]));

  // Multi-Room State Management with permanent Room Codes
  const [rooms, setRooms] = useState(() => getStorageItem('cashmate_rooms', INITIAL_ROOMS));

  const [activeRoomId, setActiveRoomId] = useState(() => getStorageItem('cashmate_active_room_id', 'room-ktm-1'));
  const [pendingJoinRoom, setPendingJoinRoom] = useState(null);
  const [newlyCreatedRoom, setNewlyCreatedRoom] = useState(null);

  const [roomsData, setRoomsData] = useState(() => getStorageItem('cashmate_rooms_data', DEFAULT_ROOMS_DATA));

  const room = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const currentRoomData = roomsData[activeRoomId] || {
    members: INITIAL_MEMBERS,
    categories: INITIAL_CATEGORIES,
    incomeCategories: INITIAL_INCOME_CATEGORIES,
    incomes: INITIAL_INCOMES,
    expenses: [],
    settlements: [],
    closedMonths: []
  };

  const members = currentRoomData.members || [];
  const categories = currentRoomData.categories || INITIAL_CATEGORIES;
  const incomeCategories = currentRoomData.incomeCategories || INITIAL_INCOME_CATEGORIES;
  const incomes = currentRoomData.incomes || [];
  const expenses = currentRoomData.expenses || [];
  const settlements = currentRoomData.settlements || [];
  const closedMonths = currentRoomData.closedMonths || [];

  const updateActiveRoomData = (updater) => {
    setRoomsData(prev => {
      const existing = prev[activeRoomId] || {
        members: INITIAL_MEMBERS,
        categories: INITIAL_CATEGORIES,
        incomeCategories: INITIAL_INCOME_CATEGORIES,
        incomes: INITIAL_INCOMES,
        expenses: [],
        settlements: [],
        closedMonths: []
      };
      const updatedData = typeof updater === 'function' ? updater(existing) : updater;
      return {
        ...prev,
        [activeRoomId]: {
          ...existing,
          ...updatedData
        }
      };
    });
  };

  const setExpenses = (val) => {
    updateActiveRoomData(prev => ({
      expenses: typeof val === 'function' ? val(prev.expenses || []) : val
    }));
  };

  const setIncomes = (val) => {
    updateActiveRoomData(prev => ({
      incomes: typeof val === 'function' ? val(prev.incomes || []) : val
    }));
  };

  const setIncomeCategories = (val) => {
    updateActiveRoomData(prev => ({
      incomeCategories: typeof val === 'function' ? val(prev.incomeCategories || INITIAL_INCOME_CATEGORIES) : val
    }));
  };

  const setMembers = (val) => {
    updateActiveRoomData(prev => ({
      members: typeof val === 'function' ? val(prev.members) : val
    }));
  };

  const setSettlements = (val) => {
    updateActiveRoomData(prev => ({
      settlements: typeof val === 'function' ? val(prev.settlements) : val
    }));
  };

  const setCategories = (val) => {
    updateActiveRoomData(prev => ({
      categories: typeof val === 'function' ? val(prev.categories) : val
    }));
  };

  const setClosedMonths = (val) => {
    updateActiveRoomData(prev => ({
      closedMonths: typeof val === 'function' ? val(prev.closedMonths) : val
    }));
  };

  // Create New Room with Admin Account Setup
  const createNewRoom = ({ name, description, currency, adminName, mobile, email, password }) => {
    const newRoomId = `room-${Date.now()}`;
    const newRoomCode = generateUniqueRoomCode(rooms);
    const userId = `user-${Date.now()}`;

    const adminUser = {
      id: userId,
      fullName: adminName || 'Admin User',
      email: email || 'admin@cashmate.app',
      mobile: mobile || '+977 9800000000',
      password: password || 'password123',
      assignedRoomId: newRoomId,
      role: 'admin'
    };

    const newRoomObj = {
      id: newRoomId,
      name: name || 'Shared Apartment',
      code: newRoomCode,
      currency: currency || 'NPR (Rs.)',
      description: description || 'Shared Room Expense Management',
      createdBy: userId,
      adminName: adminUser.fullName,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    const adminMemberProfile = {
      id: userId,
      name: adminUser.fullName,
      email: adminUser.email,
      mobile: adminUser.mobile,
      avatar: '👑',
      role: 'admin',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const initialData = {
      members: [adminMemberProfile],
      categories: INITIAL_CATEGORIES,
      incomeCategories: INITIAL_INCOME_CATEGORIES,
      incomes: [],
      expenses: [],
      settlements: [],
      closedMonths: []
    };

    setUserAccounts(prev => [...prev, adminUser]);
    setRooms(prev => [...prev, newRoomObj]);
    setRoomsData(prev => ({
      ...prev,
      [newRoomId]: initialData
    }));

    setCurrentUser(adminMemberProfile);
    setUserRole('admin');
    setActiveRoomId(newRoomId);
    setNewlyCreatedRoom(newRoomObj);

    showToast(`✓ Room "${name}" created with Permanent Code: ${newRoomCode}`);
    return newRoomObj;
  };

  // Join Room using Permanent Room Code with complete status verification
  const findRoomByCode = (code) => {
    if (!code || !code.trim()) {
      return { success: false, error: 'EMPTY_CODE', message: 'Please enter a Room Code.' };
    }
    const cleanCode = code.trim().toUpperCase();
    const found = rooms.find(r => r.code?.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, error: 'NOT_FOUND', message: 'Invalid Room Code. Please check and try again.' };
    }

    if (found.status === 'SUSPENDED') {
      return { success: false, error: 'SUSPENDED', message: 'This room is currently unavailable.' };
    }

    const rData = roomsData[found.id] || { members: [] };
    const isMemberAlready = rData.members.some(m => m.id === currentUser.id);
    if (isMemberAlready) {
      return { success: false, error: 'ALREADY_MEMBER', message: 'You are already a member of this room.' };
    }

    if (rData.members.length >= 50) {
      return { success: false, error: 'ROOM_FULL', message: 'This room has reached its maximum member limit.' };
    }

    const activeMemsCount = rData.members.filter(m => m.status === 'ACTIVE').length;

    return {
      success: true,
      room: found,
      adminName: found.adminName || 'Room Admin',
      membersCount: activeMemsCount,
      currency: found.currency || 'NPR (Rs.)',
      orgName: found.orgName || 'CashMate Shared Flat'
    };
  };

  const confirmJoinRoom = (foundRoom) => {
    if (!foundRoom) return false;

    const memberUser = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      mobile: currentUser.mobile,
      avatar: '👤',
      role: 'member',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setRoomsData(prev => {
      const roomData = prev[foundRoom.id] || {
        members: [],
        categories: INITIAL_CATEGORIES,
        incomeCategories: INITIAL_INCOME_CATEGORIES,
        incomes: [],
        expenses: [],
        settlements: [],
        closedMonths: []
      };
      const alreadyIn = roomData.members.some(m => m.id === currentUser.id);
      const updatedMems = alreadyIn
        ? roomData.members.map(m => m.id === currentUser.id ? { ...m, status: 'ACTIVE' } : m)
        : [...roomData.members, memberUser];

      return {
        ...prev,
        [foundRoom.id]: {
          ...roomData,
          members: updatedMems
        }
      };
    });

    setUserRole('member');
    setActiveRoomId(foundRoom.id);
    showToast(`✓ Successfully Joined "${foundRoom.name}"!`);
    return true;
  };

  // Admin Add Member Functionality (Admin Only)
  const addMemberByAdmin = ({ fullName, mobile, email, password }) => {
    if (userRole !== 'admin') {
      showToast('Only Room Admin can add members.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // Check duplicate email
    const duplicateEmail = userAccounts.some(u => u.email.toLowerCase() === cleanEmail);
    if (duplicateEmail) {
      showToast(`Email ${cleanEmail} is already registered.`, 'error');
      return { success: false, error: 'Duplicate Email' };
    }

    const newUserId = `user-${Date.now()}`;
    const newAccount = {
      id: newUserId,
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      password: password,
      assignedRoomId: activeRoomId,
      role: 'member'
    };

    const newMemberProfile = {
      id: newUserId,
      name: fullName.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      avatar: '👦',
      role: 'member',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setUserAccounts(prev => [...prev, newAccount]);

    updateActiveRoomData(prev => ({
      members: [...prev.members, newMemberProfile]
    }));

    showToast(`✓ Member ${fullName} added to ${room.name}!`);

    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: 'New Member Added',
        text: `${fullName} has been added to ${room.name} by Admin.`,
        time: 'Just now',
        read: false,
        type: 'member'
      },
      ...prev
    ]);

    return { success: true, member: newMemberProfile };
  };

  // Member Soft Deactivation / Removal (Preserves Historical Data!)
  const removeMember = (memberId) => {
    if (userRole !== 'admin') {
      showToast('Only Admin can remove members.', 'error');
      return;
    }

    const mem = members.find(m => m.id === memberId);
    if (!mem) return;

    // Soft delete: Change status to REMOVED instead of deleting historical data
    updateActiveRoomData(prev => ({
      members: prev.members.map(m => m.id === memberId ? { ...m, status: 'REMOVED' } : m)
    }));

    showToast(`✓ Member "${mem.name}" removed. Historical expenses & settlements preserved.`, 'info');
  };

  // Member / User Authentication with Email & Password
  const loginWithCredentials = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const account = userAccounts.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!account) {
      // Check default fallback accounts
      if (cleanEmail === 'ram@cashmate.app' && password === 'password123') {
        setCurrentUser(INITIAL_MEMBERS[0]);
        setUserRole('admin');
        setActiveRoomId('room-ktm-1');
        showToast('Welcome back, Ram!');
        setAuthScreen('authenticated');
        return true;
      }
      if (cleanEmail === 'hari@cashmate.app' && password === 'password123') {
        setCurrentUser(INITIAL_MEMBERS[1]);
        setUserRole('member');
        setActiveRoomId('room-ktm-1');
        showToast('Welcome back, Hari!');
        setAuthScreen('authenticated');
        return true;
      }
      showToast('Invalid email or password. Please try again.', 'error');
      return false;
    }

    const matchedRoomId = account.assignedRoomId || 'room-ktm-1';
    const activeRoomData = roomsData[matchedRoomId] || { members: [] };
    let memberProfile = activeRoomData.members?.find(m => m.id === account.id || m.email?.toLowerCase() === cleanEmail);
    
    if (!memberProfile) {
      memberProfile = {
        id: account.id,
        name: account.fullName,
        email: account.email,
        mobile: account.mobile,
        avatar: account.role === 'admin' ? '👑' : '👦',
        role: account.role || 'member',
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setRoomsData(prev => ({
        ...prev,
        [matchedRoomId]: {
          ...(prev[matchedRoomId] || {}),
          members: [...((prev[matchedRoomId] && prev[matchedRoomId].members) || []), memberProfile]
        }
      }));
    }

    setCurrentUser(memberProfile);
    setUserRole(account.role || 'member');
    setActiveRoomId(matchedRoomId);
    showToast(`Welcome back, ${account.fullName}!`);
    setAuthScreen('authenticated');
    return true;
  };

  const switchRoom = (roomId) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (targetRoom) {
      setActiveRoomId(roomId);
      showToast(`🏠 Switched to "${targetRoom.name}"`);
    }
  };

  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'New Expense Added', text: 'Gita added Grocery expense of Rs. 10,000', time: '2 hours ago', read: false, type: 'expense' },
    { id: 'n2', title: 'Payment Reminder', text: 'You owe Hari Rs. 4,000 for room expenses.', time: '1 day ago', read: false, type: 'settlement' },
    { id: 'n3', title: 'Monthly Report Ready', text: 'September 2026 expense breakdown is now ready.', time: '3 days ago', read: true, type: 'report' }
  ]);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedSettleTarget, setSelectedSettleTarget] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMemberDetailOpen, setIsMemberDetailOpen] = useState(null);

  // Bilingual Language Support: 'en' (English) or 'ne' (नेपाली)
  const [language, setLanguageState] = useState(() => {
    return getStorageItem('cashmate_language', 'en');
  });

  const setLanguage = (lang) => {
    const nextLang = lang === 'ne' ? 'ne' : 'en';
    setLanguageState(nextLang);
    setStorageItem('cashmate_language', nextLang);
  };

  const t = (key, params = {}) => {
    const dict = translations[language] || translations.en;
    let text = dict[key] ?? translations.en[key] ?? key;
    if (typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const getCategoryName = (cat) => getTranslatedCategoryName(cat, language);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    setStorageItem('cashmate_theme', theme);
  }, [theme]);

  useEffect(() => {
    setCurrentUser(prev => ({ ...prev, role: userRole }));
    setStorageItem('cashmate_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    setStorageItem('cashmate_auth_screen', authScreen);
  }, [authScreen]);

  useEffect(() => {
    setStorageItem('cashmate_current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStorageItem('cashmate_active_room_id', activeRoomId);
  }, [activeRoomId]);

  useEffect(() => {
    setStorageItem('cashmate_rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    setStorageItem('cashmate_rooms_data', roomsData);
  }, [roomsData]);

  useEffect(() => {
    setStorageItem('cashmate_user_accounts', userAccounts);
  }, [userAccounts]);

  const logoutUser = () => {
    removeStorageItem('cashmate_auth_screen');
    removeStorageItem('cashmate_current_user');
    setAuthScreen('welcome');
    showToast('Signed out of CashMate.', 'info');
  };

  // Income Management State and Actions
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  const addIncome = ({ title, amount, categoryId, categoryName, categoryIcon, receivedById, contributedById, date, description, accountingTreatment, receiptUrl }) => {
    const numAmount = parseFloat(String(amount).replace(/,/g, ''));
    if (!numAmount || numAmount <= 0 || isNaN(numAmount)) {
      showToast('Please enter a valid positive income amount.', 'error');
      return false;
    }

    const matchedCat = incomeCategories.find(c => c.id === categoryId);

    const newIncome = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title ? title.trim() : 'Room Income',
      amount: numAmount,
      categoryId: categoryId || 'cat-inc-contrib',
      categoryName: categoryName || matchedCat?.name || 'Member Contribution',
      categoryIcon: categoryIcon || matchedCat?.icon || '🤝',
      receivedById: receivedById || currentUser.id,
      contributedById: contributedById || null,
      date: date || new Date().toISOString().split('T')[0],
      description: description ? description.trim() : '',
      accountingTreatment: accountingTreatment || matchedCat?.accountingTreatment || 'MEMBER_CONTRIBUTION',
      receiptUrl: receiptUrl || null,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    setIncomes(prev => [newIncome, ...(prev || [])]);
    setIsAddIncomeOpen(false);
    showToast(`✓ Income added: +Rs. ${numAmount.toLocaleString()}`);
    return newIncome;
  };

  const deleteIncome = (incomeId) => {
    setIncomes(prev => (prev || []).filter(i => i.id !== incomeId));
    showToast('Income record removed.');
  };

  const editIncome = (incomeId, updatedData) => {
    setIncomes(prev => (prev || []).map(i => i.id === incomeId ? { ...i, ...updatedData } : i));
    showToast('Income updated successfully.');
  };

  const addIncomeCategory = ({ name, icon, accountingTreatment }) => {
    const newCat = {
      id: `cat-inc-${Date.now()}`,
      name: name.trim(),
      icon: icon || '💵',
      accountingTreatment: accountingTreatment || 'GENERAL_INCOME',
      status: 'ACTIVE'
    };
    setIncomeCategories(prev => [...(prev || []), newCat]);
    showToast(`✓ Income category "${name}" added.`);
    return newCat;
  };

  // Exact Financial Calculation Logic: Both Room Cash Balance & Member Settlement Balances
  const calculateBalances = () => {
    const balances = {};

    members.forEach(m => {
      balances[m.id] = {
        member: m,
        totalPaid: 0,
        totalShare: 0,
        totalExpensesPaid: 0,
        totalContributed: 0,
        totalIncomeReceived: 0,
        netBalance: 0
      };
    });

    // 1. Process Expenses
    expenses.forEach(exp => {
      const expAmount = Number(exp.amount) || 0;
      if (balances[exp.paidBy]) {
        balances[exp.paidBy].totalPaid += expAmount;
        balances[exp.paidBy].totalExpensesPaid += expAmount;
      }
      if (exp.shares) {
        Object.entries(exp.shares).forEach(([mId, shareAmt]) => {
          if (balances[mId]) {
            balances[mId].totalShare += Number(shareAmt) || 0;
          }
        });
      } else if (exp.participants && exp.participants.length > 0) {
        const perPerson = expAmount / exp.participants.length;
        exp.participants.forEach(pId => {
          if (balances[pId]) {
            balances[pId].totalShare += perPerson;
          }
        });
      }
    });

    // 2. Process Incomes
    incomes.forEach(inc => {
      const incAmt = Number(inc.amount) || 0;
      if (inc.receivedById && balances[inc.receivedById]) {
        balances[inc.receivedById].totalIncomeReceived += incAmt;
      }

      // Member Contribution accounting treatment
      if (inc.accountingTreatment === 'MEMBER_CONTRIBUTION') {
        if (inc.contributedById && inc.contributedById !== 'all') {
          if (balances[inc.contributedById]) {
            balances[inc.contributedById].totalContributed += incAmt;
            balances[inc.contributedById].totalPaid += incAmt;
          }
        } else if ((!inc.contributedById || inc.contributedById === 'all') && members.length > 0) {
          const share = incAmt / members.length;
          members.forEach(m => {
            if (balances[m.id]) {
              balances[m.id].totalContributed += share;
              balances[m.id].totalPaid += share;
            }
          });
        }
      }
    });

    // 3. Factor in completed debt settlements
    settlements.forEach(stl => {
      if (stl.status === 'Settled') {
        const stlAmt = Number(stl.amount) || 0;
        if (balances[stl.fromId]) {
          balances[stl.fromId].totalPaid += stlAmt;
        }
        if (balances[stl.toId]) {
          balances[stl.toId].totalPaid -= stlAmt;
        }
      }
    });

    Object.keys(balances).forEach(mId => {
      // Precise accounting rounding to 2 decimal places
      balances[mId].totalPaid = Math.round(balances[mId].totalPaid * 100) / 100;
      balances[mId].totalShare = Math.round(balances[mId].totalShare * 100) / 100;
      balances[mId].totalExpensesPaid = Math.round(balances[mId].totalExpensesPaid * 100) / 100;
      balances[mId].totalContributed = Math.round(balances[mId].totalContributed * 100) / 100;
      balances[mId].totalIncomeReceived = Math.round(balances[mId].totalIncomeReceived * 100) / 100;
      balances[mId].netBalance = Math.round((balances[mId].totalPaid - balances[mId].totalShare) * 100) / 100;
    });

    return balances;
  };

  const balances = calculateBalances();

  // Dual Financial Summaries: Room Cash Balance & Total Transactions
  const totalRoomIncome = incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalRoomExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const roomCashBalance = totalRoomIncome - totalRoomExpenses;
  const totalTransactionsCount = incomes.length + expenses.length;

  // Combined Unified Transaction List Getter
  const getAllTransactions = (filterType = 'all', dateRange = 'all') => {
    let combined = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...incomes.map(i => ({ ...i, type: 'income' }))
    ];

    if (filterType === 'income') {
      combined = combined.filter(t => t.type === 'income');
    } else if (filterType === 'expense') {
      combined = combined.filter(t => t.type === 'expense');
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      if (dateRange === 'today') {
        combined = combined.filter(t => t.date === todayStr);
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        combined = combined.filter(t => new Date(t.date) >= weekAgo);
      } else if (dateRange === 'month') {
        const currentYearMonth = todayStr.substring(0, 7);
        combined = combined.filter(t => t.date?.startsWith(currentYearMonth));
      } else if (dateRange === 'last_month') {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthStr = lastMonthDate.toISOString().substring(0, 7);
        combined = combined.filter(t => t.date?.startsWith(lastMonthStr));
      }
    }

    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return combined;
  };

  const getOptimizedSettlements = () => {
    const debtors = [];
    const creditors = [];

    Object.values(balances).forEach(b => {
      if (b.member.status !== 'ACTIVE') return;
      if (b.netBalance < -0.01) {
        debtors.push({ id: b.member.id, name: b.member.name, amount: Math.abs(b.netBalance) });
      } else if (b.netBalance > 0.01) {
        creditors.push({ id: b.member.id, name: b.member.name, amount: b.netBalance });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transactions = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const minAmount = Math.min(debtor.amount, creditor.amount);

      if (minAmount > 0) {
        transactions.push({
          id: `opt-${debtor.id}-${creditor.id}-${minAmount}`,
          fromId: debtor.id,
          fromName: debtor.name,
          toId: creditor.id,
          toName: creditor.name,
          amount: Math.round(minAmount)
        });

        debtor.amount -= minAmount;
        creditor.amount -= minAmount;
      }

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return transactions;
  };

  const optimizedSettlements = getOptimizedSettlements();

  const closeCurrentMonth = () => {
    const totalMonthExp = expenses.reduce((a, b) => a + Number(b.amount), 0);

    const monthArchive = {
      id: `closed-${Date.now()}`,
      monthName: currentMonth,
      closedDate: new Date().toISOString().split('T')[0],
      totalExpenses: totalMonthExp,
      expenses: [...expenses],
      settlements: [...settlements],
      finalBalances: { ...balances },
      optimizedSettlements: [...optimizedSettlements]
    };

    setClosedMonths(prev => [monthArchive, ...prev]);

    const nextMonthName = currentMonth === 'September 2026' ? 'October 2026' : currentMonth === 'October 2026' ? 'November 2026' : 'December 2026';
    setCurrentMonth(nextMonthName);

    setExpenses([]);
    setSettlements([]);

    showToast(`🔒 ${currentMonth} archived! ${nextMonthName} reset to 0.`);

    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: 'Month Closed & Archived',
        text: `${currentMonth} has been closed. ${nextMonthName} expense tracking starts fresh at 0.`,
        time: 'Just now',
        read: false,
        type: 'report'
      },
      ...prev
    ]);
  };

  const addExpense = (newExp) => {
    const createdExp = {
      id: `exp-${Date.now()}`,
      ...newExp
    };
    setExpenses(prev => [createdExp, ...prev]);
    showToast(`✓ Expense "${newExp.title}" added successfully!`);

    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: 'New Expense Added',
        text: `${members.find(m=>m.id===newExp.paidBy)?.name || 'Someone'} added ${newExp.title} (Rs. ${newExp.amount.toLocaleString()})`,
        time: 'Just now',
        read: false,
        type: 'expense'
      },
      ...prev
    ]);
  };

  const deleteExpense = (expId) => {
    const exp = expenses.find(e => e.id === expId);
    setExpenses(prev => prev.filter(e => e.id !== expId));
    if (selectedExpense?.id === expId) setSelectedExpense(null);
    showToast(`Expense "${exp?.title || ''}" deleted.`, 'info');
  };

  const recordSettlement = ({ fromId, toId, amount, method, note }) => {
    const newSettlement = {
      id: `stl-${Date.now()}`,
      fromId,
      toId,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      method: method || 'Cash',
      note: note || '',
      status: 'Settled'
    };

    setSettlements(prev => [newSettlement, ...prev]);
    const fromMember = members.find(m => m.id === fromId)?.name;
    const toMember = members.find(m => m.id === toId)?.name;

    showToast(`✓ Payment of Rs. ${Number(amount).toLocaleString()} from ${fromMember} to ${toMember} settled!`);

    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: 'Settlement Recorded',
        text: `${fromMember} paid Rs. ${Number(amount).toLocaleString()} to ${toMember}`,
        time: 'Just now',
        read: false,
        type: 'settlement'
      },
      ...prev
    ]);
  };

  const deleteSettlement = (stlId) => {
    setSettlements(prev => prev.filter(s => s.id !== stlId));
    showToast(t('delete') + ' ✓', 'info');
  };

  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      ...categoryData,
      defaultSplitAll: true
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${categoryData.name}" added.`);
  };

  const clearAllData = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    setRoomsData(DEFAULT_ROOMS_DATA);
    setRooms(INITIAL_ROOMS);
    setUserAccounts(INITIAL_USER_ACCOUNTS);
    setCurrentUser(INITIAL_MEMBERS[0]);
    setUserRole('admin');
    setActiveRoomId('room-ktm-1');
    setAuthScreen('authenticated');
    showToast('✓ All local storage data has been cleaned and reset to defaults.');
  };

  const setTheme = (t) => {
    setThemeState(t);
  };

  const isDark = theme === 'dark';
  const colors = {
    bgApp: isDark ? '#0b0f19' : '#f4f6fb',
    bgSurface: isDark ? '#111827' : '#ffffff',
    bgCard: isDark ? '#1e293b' : '#ffffff',
    bgSubtle: isDark ? '#151e2e' : '#f1f5f9',
    textMain: isDark ? '#f8fafc' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#2e3c51' : '#e2e8f0',
    primary: '#10b981',
    primaryLight: isDark ? 'rgba(16, 185, 129, 0.16)' : '#ecfdf5',
    secondary: isDark ? '#818cf8' : '#6366f1',
    secondaryLight: isDark ? 'rgba(129, 140, 248, 0.16)' : '#eef2ff',
    positive: isDark ? '#34d399' : '#10b981',
    positiveLight: isDark ? 'rgba(52, 211, 153, 0.15)' : '#d1fae5',
    negative: isDark ? '#fb7185' : '#f43f5e',
    negativeLight: isDark ? 'rgba(251, 113, 133, 0.15)' : '#ffe4e6',
    warning: isDark ? '#fbbf24' : '#f59e0b',
    warningLight: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fef3c7',
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        colors,
        deviceFrame,
        setDeviceFrame,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        goBackTab,
        tabHistory,
        authScreen,
        setAuthScreen,
        isLoading,
        setIsLoading,
        calendarSystem,
        setCalendarSystem,
        convertADtoBS,
        currentMonth,
        setCurrentMonth,
        closedMonths,
        closeCurrentMonth,
        currentUser,
        setCurrentUser,
        userAccounts,
        rooms,
        activeRoomId,
        pendingJoinRoom,
        setPendingJoinRoom,
        newlyCreatedRoom,
        setNewlyCreatedRoom,
        createNewRoom,
        findRoomByCode,
        confirmJoinRoom,
        addMemberByAdmin,
        removeMember,
        loginWithCredentials,
        logoutUser,
        switchRoom,
        room,
        members,
        setMembers,
        categories,
        setCategories,
        expenses,
        setExpenses,
        settlements,
        setSettlements,
        notifications,
        setNotifications,
        balances,
        optimizedSettlements,
        addExpense,
        deleteExpense,
        recordSettlement,
        addCategory,
        toast,
        showToast,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isSettleModalOpen,
        setIsSettleModalOpen,
        selectedSettleTarget,
        setSelectedSettleTarget,
        selectedExpense,
        setSelectedExpense,
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isMemberDetailOpen,
        setIsMemberDetailOpen,
        language,
        setLanguage,
        t,
        getCategoryName,
        deleteSettlement,
        incomes,
        setIncomes,
        incomeCategories,
        setIncomeCategories,
        addIncome,
        editIncome,
        deleteIncome,
        addIncomeCategory,
        isAddIncomeOpen,
        setIsAddIncomeOpen,
        totalRoomIncome,
        totalRoomExpenses,
        roomCashBalance,
        totalTransactionsCount,
        getAllTransactions,
        clearAllData,
        clearAllLocalStorage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
