import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import type { DayId } from '../../types';
import { DAYS, WEEKLY_TEMPLATE, WEEKLY_ONEOFFS } from '../../constants/data';
import { SectionLabel } from '../tasks/SectionLabel';

interface Props {
  open: boolean;
  onClose: () => void;
  currentDay?: DayId;
}

export function WeeklyModal({ open, onClose, currentDay = 'wed' }: Props) {
  const [activeDay, setActiveDay] = useState<DayId>(currentDay);
  const day = DAYS.find(d => d.id === activeDay)!;
  const templates = WEEKLY_TEMPLATE[activeDay] ?? [];
  const oneoffs = WEEKLY_ONEOFFS[activeDay] ?? [];

  return (
    <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Weekly Plan</Text>
            <Text style={styles.headerTitle}>April 21 – 27</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>✕</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
          {DAYS.map(d => {
            const active = d.id === activeDay;
            return (
              <Pressable key={d.id} onPress={() => setActiveDay(d.id)} style={[styles.tab, active && styles.tabActive]}>
                <Text style={[styles.tabShort, active && styles.tabTextActive]}>{d.short}</Text>
                <Text style={[styles.tabNum, active && styles.tabTextActive]}>{d.num}</Text>
                {d.today && <View style={[styles.todayDot, active && styles.todayDotActive]} />}
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          <Text style={styles.dayTitle}>{day.long}{day.today ? ' · today' : ''}</Text>
          <Text style={styles.dayMeta}>{templates.length + oneoffs.length} tasks · {templates.length} recurring</Text>

          <View style={styles.sectionRow}>
            <View style={[styles.sourceDot, { backgroundColor: '#7F77DD' }]} />
            <SectionLabel>Recurring template</SectionLabel>
          </View>
          {templates.map((t, i) => (
            <View key={i} style={styles.templateRow}>
              <View style={[styles.sourceDot, { backgroundColor: '#7F77DD' }]} />
              <Text style={styles.templateTitle}>{t}</Text>
              <Pressable style={styles.removeBtn}><Text style={styles.removeTxt}>−</Text></Pressable>
            </View>
          ))}

          <Pressable style={styles.addRecurring}>
            <Text style={styles.addRecurringTxt}>+ Add recurring task to {day.short}</Text>
          </Pressable>

          {oneoffs.length > 0 && (
            <>
              <View style={[styles.sectionRow, { marginTop: 22 }]}>
                <View style={[styles.sourceDot, { backgroundColor: '#1D9E75' }]} />
                <SectionLabel>One-off · this week only</SectionLabel>
              </View>
              {oneoffs.map((t, i) => (
                <View key={i} style={styles.templateRow}>
                  <View style={[styles.sourceDot, { backgroundColor: '#1D9E75' }]} />
                  <Text style={styles.templateTitle}>{t}</Text>
                  <Pressable style={styles.removeBtn}><Text style={styles.removeTxt}>−</Text></Pressable>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: '#FAF7F0' },
  handle: { width: 38, height: 5, borderRadius: 100, backgroundColor: 'rgba(60,60,67,0.25)', alignSelf: 'center', marginTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(60,60,67,0.55)', textTransform: 'uppercase', letterSpacing: 1.4 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(60,60,67,0.08)', alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 14, color: '#1a1a1a' },
  tabs: { maxHeight: 74 },
  tabsContent: { paddingHorizontal: 16, gap: 6 },
  tab: { width: 44, paddingVertical: 8, borderRadius: 12, alignItems: 'center', gap: 2 },
  tabActive: { backgroundColor: '#1a1a1a' },
  tabShort: { fontSize: 10, fontWeight: '600', color: 'rgba(60,60,67,0.55)', textTransform: 'uppercase' },
  tabNum: { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },
  tabTextActive: { color: '#fff' },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#378ADD' },
  todayDotActive: { backgroundColor: '#FFD86B' },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 32, gap: 6 },
  dayTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  dayMeta: { fontSize: 13, color: 'rgba(60,60,67,0.55)', marginBottom: 8 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceDot: { width: 6, height: 6, borderRadius: 3 },
  templateRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, padding: 10 },
  templateTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  removeBtn: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(60,60,67,0.08)', alignItems: 'center', justifyContent: 'center' },
  removeTxt: { fontSize: 14, color: 'rgba(60,60,67,0.6)' },
  addRecurring: { padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(127,119,221,0.4)', borderStyle: 'dashed', alignItems: 'flex-start' },
  addRecurringTxt: { fontSize: 14, fontWeight: '600', color: '#7F77DD' },
});
