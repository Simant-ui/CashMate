import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Share } from 'react-native';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Download, Share2, PieChart, BarChart, Calendar, Globe } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const ReportsView = () => {
  const {
    expenses,
    members,
    balances,
    optimizedSettlements,
    room,
    currentMonth,
    closedMonths,
    calendarSystem,
    setCalendarSystem,
    convertADtoBS,
    showToast,
    language,
    t,
    getCategoryName,
    colors
  } = useApp();

  const [timeframe, setTimeframe] = useState('this_month'); // 'this_month', 'last_month', 'custom'
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [selectedMonthName, setSelectedMonthName] = useState(currentMonth);

  const archivedData = closedMonths.find(m => m.monthName === selectedMonthName);
  const isArchived = !!archivedData;

  const rawExpenses = isArchived ? archivedData.expenses : expenses;
  const rawSettlements = isArchived ? archivedData.settlements : [];
  const rawBalances = isArchived ? archivedData.finalBalances : balances;
  const rawOptimized = isArchived ? (archivedData.optimizedSettlements || []) : optimizedSettlements;

  // Filter expenses based on timeframe selection
  const filteredExpenses = rawExpenses.filter(e => {
    if (timeframe === 'this_month') {
      return e.date.startsWith('2026-09');
    }
    if (timeframe === 'last_month') {
      return e.date.startsWith('2026-08');
    }
    if (timeframe === 'custom') {
      return e.date >= fromDate && e.date <= toDate;
    }
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((a, b) => a + Number(b.amount), 0);
  const avgPerMember = members.length > 0 ? totalExpenses / members.length : 0;
  const highestExp = filteredExpenses.reduce((max, e) => (e.amount > max.amount ? e : max), filteredExpenses[0] || { amount: 0, title: 'None' });

  const catBreakdown = {};
  filteredExpenses.forEach(e => {
    catBreakdown[e.categoryName] = (catBreakdown[e.categoryName] || 0) + Number(e.amount);
  });

  const catColors = {
    Rent: '#6366f1',
    Electricity: '#f59e0b',
    Water: '#3b82f6',
    Internet: '#8b5cf6',
    Grocery: '#10b981',
    Other: '#64748b'
  };

  const formatDateDisplay = (adDateStr) => {
    if (calendarSystem === 'BS') {
      return `${convertADtoBS(adDateStr)} (${adDateStr} A.D.)`;
    }
    return `${adDateStr} A.D.`;
  };

  const generateHTMLReport = () => {
    const memberRows = members.map(m => {
      const b = rawBalances[m.id] || { totalPaid: 0, totalShare: 0, netBalance: 0 };
      const statusColor = b.netBalance >= 0 ? '#10b981' : '#f43f5e';
      const statusText = b.netBalance > 0 ? `Gets Rs. ${Math.round(b.netBalance).toLocaleString()}` : b.netBalance < 0 ? `Owes Rs. ${Math.abs(Math.round(b.netBalance)).toLocaleString()}` : 'Settled';
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${m.avatar} <strong>${m.name}</strong> (${m.role})</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">Rs. ${b.totalPaid.toLocaleString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">Rs. ${b.totalShare.toLocaleString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: ${statusColor}; font-weight: bold;">${statusText}</td>
        </tr>
      `;
    }).join('');

    const settlementRows = rawOptimized.map(s => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${s.fromName}</strong> pays <strong>${s.toName}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #10b981;">Rs. ${s.amount.toLocaleString()}</td>
      </tr>
    `).join('');

    const expenseRows = filteredExpenses.map(e => {
      const payer = members.find(m => m.id === e.paidBy)?.name || 'Someone';
      const formattedDate = formatDateDisplay(e.date);
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${e.categoryIcon} <strong>${e.title}</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${payer}</td>
          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${formattedDate}</td>
          <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">Rs. ${e.amount.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    const periodStr = timeframe === 'custom' ? `Custom Range (${fromDate} to ${toDate})` : selectedMonthName;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>CashMate Room Expense Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0f172a; padding: 30px; background-color: #ffffff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #10b981; padding-bottom: 15px; margin-bottom: 25px; }
            .brand { font-size: 26px; font-weight: 800; color: #10b981; }
            .tagline { font-size: 13px; color: #64748b; }
            .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-left: 4px solid #10b981; padding-left: 10px; }
            .grid { display: flex; gap: 15px; margin-bottom: 20px; }
            .card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; }
            .card-label { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; }
            .card-val { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; padding: 10px; text-align: left; }
            td { font-size: 13px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">💸 CashMate</div>
              <div class="tagline">Track. Split. Settle. — Shared Expense Management</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 16px; font-weight: 700;">${room.name}</div>
              <div style="font-size: 12px; color: #64748b;">Report Period: ${periodStr}</div>
              <div style="font-size: 11px; color: #10b981; font-weight: bold;">Calendar: ${calendarSystem === 'BS' ? 'Nepali B.S. (Bikram Sambat)' : 'English A.D.'}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-label">Total Expenses</div>
              <div class="card-val">Rs. ${totalExpenses.toLocaleString()}</div>
            </div>
            <div class="card">
              <div class="card-label">Per Member Share</div>
              <div class="card-val" style="color: #6366f1;">Rs. ${Math.round(avgPerMember).toLocaleString()}</div>
            </div>
            <div class="card">
              <div class="card-label">Filtered Expenses</div>
              <div class="card-val">${filteredExpenses.length} Items</div>
            </div>
          </div>

          <div class="section-title">Member Financial Summary</div>
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th style="text-align: right;">Total Paid</th>
                <th style="text-align: right;">Total Share</th>
                <th style="text-align: right;">Net Position</th>
              </tr>
            </thead>
            <tbody>
              ${memberRows}
            </tbody>
          </table>

          <div class="section-title">Optimized Settlement Instructions</div>
          <table>
            <thead>
              <tr>
                <th>Payment Instruction</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${settlementRows.length > 0 ? settlementRows : '<tr><td colspan="2" style="padding:10px; text-align:center;">All room balances settled!</td></tr>'}
            </tbody>
          </table>

          <div class="section-title">Filtered Expense List (${periodStr})</div>
          <table>
            <thead>
              <tr>
                <th>Expense Title</th>
                <th>Paid By</th>
                <th>Date (${calendarSystem})</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows.length > 0 ? expenseRows : '<tr><td colspan="4" style="padding:10px; text-align:center;">No expenses match selected date range.</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            Generated automatically by CashMate Application for ${room.name} on ${new Date().toLocaleDateString()}.
          </div>
        </body>
      </html>
    `;
  };

  const handleGeneratePDF = async () => {
    try {
      showToast('📄 Exporting Custom PDF Report...');
      const html = generateHTMLReport();
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `${room.name} Custom Expense Report`
        });
      } else {
        await Print.printAsync({ html });
      }
    } catch (err) {
      showToast('Could not generate PDF: ' + err.message, 'error');
    }
  };

  const handleShareReport = async () => {
    try {
      const summaryText = `💸 CashMate - ${room.name} Report (${timeframe === 'custom' ? `${fromDate} to ${toDate}` : selectedMonthName})\n\n` +
        `Total Room Expenses: Rs. ${totalExpenses.toLocaleString()}\n` +
        `Per Member Share: Rs. ${Math.round(avgPerMember).toLocaleString()}\n\n` +
        `Tracked with CashMate!`;

      if (await Sharing.isAvailableAsync()) {
        const html = generateHTMLReport();
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share PDF Report'
        });
      } else {
        await Share.share({
          message: summaryText
        });
      }
      showToast('Report shared successfully!');
    } catch (err) {
      showToast('Share failed: ' + err.message, 'error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={[styles.title, { color: colors.textMain }]} numberOfLines={1}>{t('reports') || 'Reports & Analytics'}</Text>
          <Text style={[styles.subTitle, { color: colors.textMuted }]} numberOfLines={1}>
            {language === 'ne' ? 'वित्तीय विवरण र मिति अनुसारको विश्लेषण' : 'Financial breakdown & custom date analytics'}
          </Text>
        </View>

        <Button
          label={t('exportPdf') || 'Export PDF'}
          variant="primary"
          size="sm"
          icon={<Download size={14} color="#ffffff" />}
          onPress={handleGeneratePDF}
        />
      </View>

      {/* Calendar Format Switcher (AD English vs BS Bikram Sambat) */}
      <View style={[styles.calendarSwitchRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Globe size={16} color={colors.primary} />
          <Text style={[styles.calendarLabelText, { color: colors.textMain }]}>Calendar System:</Text>
        </View>

        <View style={[styles.calendarToggleBox, { backgroundColor: colors.bgSubtle }]}>
          <TouchableOpacity
            onPress={() => setCalendarSystem('AD')}
            style={[
              styles.calendarToggleBtn,
              calendarSystem === 'AD' && { backgroundColor: colors.primary }
            ]}
          >
            <Text style={[styles.calendarToggleText, { color: calendarSystem === 'AD' ? '#ffffff' : colors.textMuted }]}>
              🇬🇧 English (A.D.)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCalendarSystem('BS')}
            style={[
              styles.calendarToggleBtn,
              calendarSystem === 'BS' && { backgroundColor: colors.primary }
            ]}
          >
            <Text style={[styles.calendarToggleText, { color: calendarSystem === 'BS' ? '#ffffff' : colors.textMuted }]}>
              🇳🇵 Nepali (B.S. 2083)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeframe Filter Switcher */}
      <View style={[styles.tabBar, { backgroundColor: colors.bgSubtle }]}>
        {[
          { id: 'this_month', label: language === 'ne' ? 'यो महिना' : 'This Month' },
          { id: 'last_month', label: language === 'ne' ? 'अघिल्लो महिना' : 'Last Month' },
          { id: 'custom', label: language === 'ne' ? 'कस्टम मिति' : 'Custom Range' }
        ].map(tb => (
          <TouchableOpacity
            key={tb.id}
            onPress={() => setTimeframe(tb.id)}
            style={[
              styles.tabBtn,
              timeframe === tb.id && { backgroundColor: colors.bgSurface }
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: timeframe === tb.id ? colors.primary : colors.textMuted }
              ]}
            >
              {tb.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Date Range Picker Input */}
      {timeframe === 'custom' && (
        <View style={[styles.customRangeCard, { backgroundColor: colors.bgCard, borderColor: colors.primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[styles.customRangeTitle, { color: colors.primary }]}>
              🗓️ Custom Date Range ({calendarSystem})
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.secondary }}>
              {Math.max(1, Math.round((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1)} Days Selected
            </Text>
          </View>

          {/* Quick Preset Date Buttons */}
          <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 4 }}>
            QUICK PRESETS:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {[
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 15 Days', days: 15 },
              { label: 'Last 30 Days', days: 30 },
              { label: 'This Month', type: 'this_month' },
              { label: 'Last Month', type: 'last_month' }
            ].map((p, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  const now = new Date();
                  if (p.type === 'this_month') {
                    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    setFromDate(firstDay.toISOString().split('T')[0]);
                    setToDate(lastDay.toISOString().split('T')[0]);
                  } else if (p.type === 'last_month') {
                    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
                    setFromDate(firstDay.toISOString().split('T')[0]);
                    setToDate(now.toISOString().split('T')[0]);
                  } else {
                    const pastDate = new Date(now.getTime() - (p.days - 1) * 24 * 60 * 60 * 1000);
                    setFromDate(pastDate.toISOString().split('T')[0]);
                    setToDate(now.toISOString().split('T')[0]);
                  }
                }}
                style={{
                  backgroundColor: colors.bgSubtle,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.border
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMain }}>⚡ {p.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.datePickerGrid}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>📅 From Date ( From)</Text>
              <TextInput
                style={[styles.dateInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                value={fromDate}
                onChangeText={setFromDate}
                placeholder="YYYY-MM-DD"
              />
              {calendarSystem === 'BS' && (
                <Text style={[styles.bsDateSub, { color: colors.primary }]}>🇳🇵 {convertADtoBS(fromDate)}</Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>📅 To Date (TO)</Text>
              <TextInput
                style={[styles.dateInput, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.bgSubtle }]}
                value={toDate}
                onChangeText={setToDate}
                placeholder="YYYY-MM-DD"
              />
              {calendarSystem === 'BS' && (
                <Text style={[styles.bsDateSub, { color: colors.primary }]}>🇳🇵 {convertADtoBS(toDate)}</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Month History Selector Bar */}
      {timeframe !== 'custom' && (
        <View>
          <Text style={[styles.monthSelectorLabel, { color: colors.textMuted }]}>SELECT MONTH REPORT:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthSelectorRow}>
            <TouchableOpacity
              onPress={() => setSelectedMonthName(currentMonth)}
              style={[
                styles.monthPill,
                {
                  backgroundColor: selectedMonthName === currentMonth ? colors.primary : colors.bgCard,
                  borderColor: selectedMonthName === currentMonth ? colors.primary : colors.border
                }
              ]}
            >
              <Text
                style={[
                  styles.monthPillText,
                  { color: selectedMonthName === currentMonth ? '#ffffff' : colors.textMain }
                ]}
              >
                ● Active: {currentMonth}
              </Text>
            </TouchableOpacity>

            {closedMonths.map(m => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMonthName(m.monthName)}
                style={[
                  styles.monthPill,
                  {
                    backgroundColor: selectedMonthName === m.monthName ? colors.primary : colors.bgCard,
                    borderColor: selectedMonthName === m.monthName ? colors.primary : colors.border
                  }
                ]}
              >
                <Text
                  style={[
                    styles.monthPillText,
                    { color: selectedMonthName === m.monthName ? '#ffffff' : colors.textMain }
                  ]}
                >
                  🔒 {m.monthName} (Closed)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Summary Metrics */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>TOTAL ROOM EXPENSES</Text>
          <Text style={[styles.metricVal, { color: colors.textMain }]}>
            Rs. {totalExpenses.toLocaleString()}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]}>
            {timeframe === 'custom' ? `${fromDate} - ${toDate}` : selectedMonthName}
          </Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>AVERAGE PER MEMBER</Text>
          <Text style={[styles.metricVal, { color: colors.secondary }]}>
            Rs. {Math.round(avgPerMember).toLocaleString()}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]}>Equal split share</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>HIGHEST EXPENSE</Text>
          <Text style={[styles.metricVal, { color: colors.negative }]}>
            Rs. {highestExp.amount.toLocaleString()}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]}>{highestExp.title}</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <Text style={[styles.metricLabel, { color: colors.textMuted }]}>FILTERED ITEMS</Text>
          <Text style={[styles.metricVal, { color: colors.primary }]}>
            {filteredExpenses.length} Items
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]}>Matching date criteria</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <PieChart size={18} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.textMain }]}>Expense by Category</Text>
        </View>

        <View style={{ gap: 10 }}>
          {Object.keys(catBreakdown).length > 0 ? (
            Object.entries(catBreakdown).map(([catName, amt]) => {
              const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
              const barColor = catColors[catName] || colors.primary;

              return (
                <View key={catName}>
                  <View style={styles.barLabelRow}>
                    <Text style={[styles.barLabelText, { color: colors.textMain }]}>{catName}</Text>
                    <Text style={[styles.barValueText, { color: colors.textMain }]}>
                      Rs. {amt.toLocaleString()} ({pct}%)
                    </Text>
                  </View>

                  <View style={[styles.barTrack, { backgroundColor: colors.bgSubtle }]}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: 10 }}>
              No expenses match selected date range.
            </Text>
          )}
        </View>
      </View>

      {/* Itemized Filtered Expenses List */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textMain, marginBottom: 12 }]}>
          Filtered Expenses ({filteredExpenses.length})
        </Text>

        <View style={{ gap: 8 }}>
          {filteredExpenses.map(e => {
            const payer = members.find(m => m.id === e.paidBy)?.name || 'Someone';
            return (
              <View key={e.id} style={[styles.expItemRow, { backgroundColor: colors.bgSubtle }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 18 }}>{e.categoryIcon}</Text>
                  <View>
                    <Text style={[styles.expItemTitle, { color: colors.textMain }]}>{e.title}</Text>
                    <Text style={[styles.expItemSub, { color: colors.textMuted }]}>
                      {payer} • {formatDateDisplay(e.date)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.expItemAmt, { color: colors.textMain }]}>
                  Rs. {e.amount.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Report Share Footer */}
      <View style={[styles.card, { backgroundColor: colors.bgSurface, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={[styles.cardTitle, { color: colors.textMain }]}>Custom PDF Statement</Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]}>Export PDF report in {calendarSystem === 'BS' ? 'Nepali B.S.' : 'English A.D.'}.</Text>
        </View>

        <Button
          label="Share PDF"
          variant="primary"
          size="sm"
          icon={<Share2 size={14} color="#ffffff" />}
          onPress={handleShareReport}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '800'
  },
  subTitle: {
    fontSize: 13,
    marginTop: 2
  },
  pdfBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pdfBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  calendarSwitchRow: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  calendarLabelText: {
    fontSize: 12,
    fontWeight: '700'
  },
  calendarToggleBox: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2
  },
  calendarToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  calendarToggleText: {
    fontSize: 11,
    fontWeight: '700'
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  customRangeCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 10
  },
  customRangeTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  datePickerGrid: {
    flexDirection: 'row',
    gap: 12
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '600'
  },
  bsDateSub: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4
  },
  monthSelectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5
  },
  monthSelectorRow: {
    gap: 8,
    paddingBottom: 4
  },
  monthPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1.5
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  metricCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700'
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4
  },
  metricSub: {
    fontSize: 10,
    marginTop: 2
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  barLabelText: {
    fontSize: 13,
    fontWeight: '600'
  },
  barValueText: {
    fontSize: 12,
    fontWeight: '600'
  },
  barTrack: {
    height: 8,
    borderRadius: 9999,
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: 9999
  },
  expItemRow: {
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  expItemTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  expItemSub: {
    fontSize: 10,
    marginTop: 2
  },
  expItemAmt: {
    fontSize: 14,
    fontWeight: '800'
  },
  shareBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  }
});
