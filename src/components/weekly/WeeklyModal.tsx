import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { Day, DayId, HabitFrequency, WeeklyTaskEntry } from '../../types';
import { SectionLabel } from '../tasks/SectionLabel';
import { HabitDots } from '../tasks/HabitDots';
import { useHabits } from '../../context/HabitContext';
import { computeHabitStreak, frequencyLabel, buildHabitDots } from '../../utils/habits';
import { getIsoDate, getWeekStart } from '../../utils/weeklyPlan';

// ─── Weekly Plan tab props ────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  weekDays: Day[];
  todayId: DayId;
  templates: Record<DayId, string[]>;
  oneoffs: Record<DayId, WeeklyTaskEntry[]>;
  addTemplate: (dayId: DayId, title: string) => void;
  removeTemplate: (dayId: DayId, title: string) => void;
  addOneoff: (dayId: DayId, title: string) => void;
  removeOneoff: (dayId: DayId, id: string) => void;
}

type TopTab = 'plan' | 'habits';
type AddingKind = 'template' | 'oneoff' | null;

const TEAL = '#16A8CA';
const DAY_IDS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// ─── Root component ───────────────────────────────────────────────────────────

export function WeeklyModal({
  onClose,
  weekDays,
  todayId,
  templates,
  oneoffs,
  addTemplate,
  removeTemplate,
  addOneoff,
  removeOneoff,
}: Props) {
  const [topTab, setTopTab] = useState<TopTab>('plan');

  const startWeek = weekDays[0];
  const endWeek = weekDays[6];
  const monthName = new Date().toLocaleString('default', { month: 'long' });
  const dateRange = `${monthName} ${startWeek.num} – ${endWeek.num}`;

  return (
    <SafeAreaView style={styles.sheet}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>{topTab === 'plan' ? 'Weekly Plan' : 'Habits'}</Text>
          <Text style={styles.headerTitle}>{dateRange}</Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeTxt}>✕</Text>
        </Pressable>
      </View>

      {/* Top-level PLAN / HABITS switcher */}
      <View style={styles.topTabs}>
        <Pressable
          onPress={() => setTopTab('plan')}
          style={[styles.topTab, topTab === 'plan' && styles.topTabActive]}
        >
          <Text style={[styles.topTabTxt, topTab === 'plan' && styles.topTabTxtActive]}>PLAN</Text>
        </Pressable>
        <Pressable
          onPress={() => setTopTab('habits')}
          style={[styles.topTab, topTab === 'habits' && styles.topTabActive]}
        >
          <Text style={[styles.topTabTxt, topTab === 'habits' && styles.topTabTxtActive]}>
            HABITS
          </Text>
        </Pressable>
      </View>

      {topTab === 'plan' ? (
        <PlanTab
          weekDays={weekDays}
          todayId={todayId}
          templates={templates}
          oneoffs={oneoffs}
          addTemplate={addTemplate}
          removeTemplate={removeTemplate}
          addOneoff={addOneoff}
          removeOneoff={removeOneoff}
        />
      ) : (
        <HabitsTab />
      )}
    </SafeAreaView>
  );
}

// ─── Plan tab (unchanged logic, extracted) ────────────────────────────────────

interface PlanTabProps {
  weekDays: Day[];
  todayId: DayId;
  templates: Record<DayId, string[]>;
  oneoffs: Record<DayId, WeeklyTaskEntry[]>;
  addTemplate: (dayId: DayId, title: string) => void;
  removeTemplate: (dayId: DayId, title: string) => void;
  addOneoff: (dayId: DayId, title: string) => void;
  removeOneoff: (dayId: DayId, id: string) => void;
}

function PlanTab({
  weekDays,
  todayId,
  templates,
  oneoffs,
  addTemplate,
  removeTemplate,
  addOneoff,
  removeOneoff,
}: PlanTabProps) {
  const [activeDay, setActiveDay] = useState<DayId>(todayId);
  const [adding, setAdding] = useState<AddingKind>(null);
  const [inputText, setInputText] = useState('');

  const day = weekDays.find(d => d.id === activeDay) ?? weekDays[0];
  const dayTemplates = templates[activeDay] ?? [];
  const dayOneoffs = oneoffs[activeDay] ?? [];

  function submitAdd() {
    const t = inputText.trim();
    if (!t) {
      setAdding(null);
      return;
    }
    if (adding === 'template') addTemplate(activeDay, t);
    else if (adding === 'oneoff') addOneoff(activeDay, t);
    setInputText('');
    setAdding(null);
  }

  function cancelAdd() {
    setInputText('');
    setAdding(null);
  }

  function switchDay(id: DayId) {
    cancelAdd();
    setActiveDay(id);
  }

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {weekDays.map(d => {
          const active = d.id === activeDay;
          return (
            <Pressable
              key={d.id}
              onPress={() => switchDay(d.id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabShort, active && styles.tabTextActive]}>{d.short}</Text>
              <Text style={[styles.tabNum, active && styles.tabTextActive]}>{d.num}</Text>
              {d.today && <View style={[styles.todayDot, active && styles.todayDotActive]} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.dayTitle}>
          {day.long}
          {day.today ? ' · today' : ''}
        </Text>
        <Text style={styles.dayMeta}>
          {dayTemplates.length + dayOneoffs.length} tasks · {dayTemplates.length} recurring
        </Text>

        {/* Recurring templates */}
        <View style={styles.sectionRow}>
          <View style={[styles.sourceDot, styles.sourceDotTemplate]} />
          <SectionLabel>Recurring</SectionLabel>
        </View>

        {dayTemplates.map((title, i) => (
          <View key={i} style={styles.taskRow}>
            <View style={[styles.sourceDot, styles.sourceDotTemplate]} />
            <Text style={styles.taskTitle}>{title}</Text>
            <Pressable onPress={() => removeTemplate(activeDay, title)} style={styles.removeBtn}>
              <Text style={styles.removeTxt}>−</Text>
            </Pressable>
          </View>
        ))}

        {adding === 'template' ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Recurring task name…"
              placeholderTextColor="rgba(60,60,67,0.35)"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitAdd}
              onBlur={submitAdd}
            />
            <Pressable onPress={cancelAdd} style={styles.cancelBtn}>
              <Text style={styles.cancelTxt}>✕</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.addBtn} onPress={() => setAdding('template')}>
            <Text style={styles.addBtnTxt}>+ Add recurring task to {day.short}</Text>
          </Pressable>
        )}

        {/* One-offs */}
        <View style={[styles.sectionRow, styles.sectionRowGap]}>
          <View style={[styles.sourceDot, styles.sourceDotOneoff]} />
          <SectionLabel>One-off · this week only</SectionLabel>
        </View>

        {dayOneoffs.map(entry => (
          <View key={entry.id} style={styles.taskRow}>
            <View style={[styles.sourceDot, styles.sourceDotOneoff]} />
            <Text style={styles.taskTitle}>{entry.title}</Text>
            <Pressable onPress={() => removeOneoff(activeDay, entry.id)} style={styles.removeBtn}>
              <Text style={styles.removeTxt}>−</Text>
            </Pressable>
          </View>
        ))}

        {adding === 'oneoff' ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="One-off task name…"
              placeholderTextColor="rgba(60,60,67,0.35)"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitAdd}
              onBlur={submitAdd}
            />
            <Pressable onPress={cancelAdd} style={styles.cancelBtn}>
              <Text style={styles.cancelTxt}>✕</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={[styles.addBtn, styles.addBtnGreen]}
            onPress={() => setAdding('oneoff')}
          >
            <Text style={[styles.addBtnTxt, styles.addBtnTxtGreen]}>
              + Add one-off task to {day.short}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

// ─── Habits tab ───────────────────────────────────────────────────────────────

type AddingHabitStep = null | 'title' | 'frequency' | 'time';
const TIME_PRESETS: { value: string; label: string; icon: string }[] = [
  { value: '06:00', label: '6:00 AM', icon: '🌅' },
  { value: '08:00', label: '8:00 AM', icon: '🌄' },
  { value: '12:00', label: '12:00 PM', icon: '☀️' },
  { value: '18:00', label: '6:00 PM', icon: '🌆' },
  { value: '21:00', label: '9:00 PM', icon: '🌙' },
];
const FREQ_OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'specific-days', label: 'Specific days…' },
];
const DAY_SHORTS: Record<DayId, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

function HabitsTab() {
  const { habits, completions, habitBonus, addHabit, removeHabit } = useHabits();

  const [step, setStep] = useState<AddingHabitStep>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newFreq, setNewFreq] = useState<HabitFrequency>('daily');
  const [selectedDays, setSelectedDays] = useState<DayId[]>([]);
  const [newTime, setNewTime] = useState<string | undefined>(undefined);

  const now = new Date();
  const todayIso = getIsoDate(now);
  const weekStart = getWeekStart(now);

  function cancelAdd() {
    setStep(null);
    setNewTitle('');
    setNewFreq('daily');
    setSelectedDays([]);
    setNewTime(undefined);
  }

  function submitHabit(scheduledTime?: string) {
    addHabit(
      newTitle,
      newFreq,
      newFreq === 'specific-days' ? selectedDays : undefined,
      scheduledTime,
    );
    cancelAdd();
  }

  function toggleDay(dayId: DayId) {
    setSelectedDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId],
    );
  }

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.contentInner}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.habitsMeta}>
        {habits.length === 0
          ? 'No habits yet — add one below'
          : `${habits.length} habit${habits.length === 1 ? '' : 's'} · +${habitBonus} HP today`}
      </Text>

      {/* Habit list */}
      {habits.map(habit => {
        const dots = buildHabitDots(habit.id, completions, weekStart);
        const streak = computeHabitStreak(habit.id, completions, todayIso);
        return (
          <View key={habit.id} style={styles.habitRow}>
            <View style={[styles.sourceDot, styles.sourceDotHabit]} />
            <View style={styles.habitContent}>
              <View style={styles.habitTitleRow}>
                <Text style={styles.taskTitle}>{habit.title}</Text>
                {streak > 0 && <Text style={styles.streakBadge}>🔥 {streak}</Text>}
              </View>
              <Text style={styles.habitMeta}>
                {frequencyLabel(habit.frequency, habit.daysOfWeek)}
              </Text>
              <HabitDots dots={dots} />
            </View>
            <Pressable
              onPress={() => removeHabit(habit.id)}
              style={[styles.removeBtn, styles.removeBtnHabit]}
            >
              <Text style={styles.removeTxt}>−</Text>
            </Pressable>
          </View>
        );
      })}

      {/* Add habit form */}
      {step === null && (
        <Pressable style={[styles.addBtn, styles.addBtnTeal]} onPress={() => setStep('title')}>
          <Text style={[styles.addBtnTxt, styles.addBtnTxtTeal]}>+ Add habit</Text>
        </Pressable>
      )}

      {step === 'title' && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>Habit name</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. Brush teeth"
              placeholderTextColor="rgba(60,60,67,0.35)"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => {
                if (newTitle.trim()) setStep('frequency');
              }}
            />
            <Pressable onPress={cancelAdd} style={styles.cancelBtn}>
              <Text style={styles.cancelTxt}>✕</Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.nextBtn, !newTitle.trim() && styles.nextBtnDisabled]}
            onPress={() => {
              if (newTitle.trim()) setStep('frequency');
            }}
          >
            <Text style={styles.nextBtnTxt}>Next →</Text>
          </Pressable>
        </View>
      )}

      {step === 'frequency' && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>How often?</Text>
          {FREQ_OPTIONS.map(opt => (
            <Pressable
              key={opt.value}
              style={[styles.freqOption, newFreq === opt.value && styles.freqOptionActive]}
              onPress={() => {
                setNewFreq(opt.value);
                setSelectedDays([]);
              }}
            >
              <Text
                style={[styles.freqOptionTxt, newFreq === opt.value && styles.freqOptionTxtActive]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}

          {newFreq === 'specific-days' && (
            <View style={styles.dayPicker}>
              {DAY_IDS.map(dayId => {
                const active = selectedDays.includes(dayId);
                return (
                  <Pressable
                    key={dayId}
                    onPress={() => toggleDay(dayId)}
                    style={[styles.dayChip, active && styles.dayChipActive]}
                  >
                    <Text style={[styles.dayChipTxt, active && styles.dayChipTxtActive]}>
                      {DAY_SHORTS[dayId]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.formActions}>
            <Pressable style={styles.backBtn} onPress={() => setStep('title')}>
              <Text style={styles.backBtnTxt}>← Back</Text>
            </Pressable>
            <Pressable
              style={[
                styles.nextBtn,
                newFreq === 'specific-days' && selectedDays.length === 0 && styles.nextBtnDisabled,
              ]}
              onPress={() => {
                if (newFreq === 'specific-days' && selectedDays.length === 0) return;
                setStep('time');
              }}
            >
              <Text style={styles.nextBtnTxt}>Next →</Text>
            </Pressable>
          </View>
        </View>
      )}
      {step === 'time' && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>When do you usually do it?</Text>
          <Text style={styles.formSubLabel}>Optional — skip if it varies</Text>
          <View style={styles.timeGrid}>
            {TIME_PRESETS.map(preset => (
              <Pressable
                key={preset.value}
                style={[styles.timeChip, newTime === preset.value && styles.timeChipActive]}
                onPress={() =>
                  setNewTime(prev => (prev === preset.value ? undefined : preset.value))
                }
              >
                <Text style={styles.timeChipIcon}>{preset.icon}</Text>
                <Text
                  style={[styles.timeChipTxt, newTime === preset.value && styles.timeChipTxtActive]}
                >
                  {preset.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.formActions}>
            <Pressable style={styles.backBtn} onPress={() => setStep('frequency')}>
              <Text style={styles.backBtnTxt}>← Back</Text>
            </Pressable>
            <Pressable
              style={[styles.nextBtn, styles.nextBtnOutline]}
              onPress={() => submitHabit(undefined)}
            >
              <Text style={[styles.nextBtnTxt, styles.nextBtnTxtOutline]}>No time</Text>
            </Pressable>
            <Pressable style={styles.nextBtn} onPress={() => submitHabit(newTime)}>
              <Text style={styles.nextBtnTxt}>Save</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: '#FAF7F0' },
  handle: {
    width: 38,
    height: 5,
    borderRadius: 100,
    backgroundColor: 'rgba(60,60,67,0.25)',
    alignSelf: 'center',
    marginTop: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(60,60,67,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(60,60,67,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: { fontSize: 14, color: '#1a1a1a' },

  // Top tabs (PLAN / HABITS)
  topTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 4,
    backgroundColor: 'rgba(60,60,67,0.07)',
    borderRadius: 10,
    padding: 3,
  },
  topTab: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  topTabActive: { backgroundColor: '#1a1a1a' },
  topTabTxt: { fontSize: 12, fontWeight: '700', color: 'rgba(60,60,67,0.5)', letterSpacing: 1 },
  topTabTxtActive: { color: '#fff' },

  // Day tabs (Plan tab)
  tabs: { maxHeight: 74 },
  tabsContent: { paddingHorizontal: 16, gap: 6 },
  tab: { width: 44, paddingVertical: 8, borderRadius: 12, alignItems: 'center', gap: 2 },
  tabActive: { backgroundColor: '#1a1a1a' },
  tabShort: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(60,60,67,0.55)',
    textTransform: 'uppercase',
  },
  tabNum: { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },
  tabTextActive: { color: '#fff' },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#378ADD' },
  todayDotActive: { backgroundColor: '#FFD86B' },

  // Content
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 48, gap: 6 },
  dayTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  dayMeta: { fontSize: 13, color: 'rgba(60,60,67,0.55)', marginBottom: 8 },
  habitsMeta: { fontSize: 13, color: 'rgba(60,60,67,0.55)', marginBottom: 8 },

  // Rows
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionRowGap: { marginTop: 22 },
  sourceDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  sourceDotTemplate: { backgroundColor: '#7F77DD' },
  sourceDotOneoff: { backgroundColor: '#1D9E75' },
  sourceDotHabit: { backgroundColor: TEAL, marginTop: 4 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  taskTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  habitContent: { flex: 1 },
  habitTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  streakBadge: { fontSize: 12, fontWeight: '700', color: TEAL },
  habitMeta: { fontSize: 11, color: 'rgba(60,60,67,0.45)', marginTop: 2 },
  removeBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(60,60,67,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnHabit: { marginTop: 2 },
  removeTxt: { fontSize: 14, color: 'rgba(60,60,67,0.6)' },

  // Add buttons
  addBtn: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(127,119,221,0.4)',
    borderStyle: 'dashed',
    alignItems: 'flex-start',
  },
  addBtnTxt: { fontSize: 14, fontWeight: '600', color: '#7F77DD' },
  addBtnGreen: { borderColor: 'rgba(29,158,117,0.4)' },
  addBtnTxtGreen: { color: '#1D9E75' },
  addBtnTeal: { borderColor: 'rgba(22,168,202,0.4)' },
  addBtnTxtTeal: { color: TEAL },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, color: '#1a1a1a', paddingVertical: 8 },
  cancelBtn: { padding: 4 },
  cancelTxt: { fontSize: 13, color: 'rgba(60,60,67,0.5)' },

  // Habit add form
  addForm: { backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 8 },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(60,60,67,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formSubLabel: { fontSize: 12, color: 'rgba(60,60,67,0.4)', marginTop: -4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(60,60,67,0.05)',
  },
  timeChipActive: { backgroundColor: TEAL },
  timeChipIcon: { fontSize: 14 },
  timeChipTxt: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  timeChipTxtActive: { color: '#fff', fontWeight: '600' },
  nextBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(60,60,67,0.2)',
  },
  nextBtnTxtOutline: { color: 'rgba(60,60,67,0.6)' },
  freqOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(60,60,67,0.05)',
  },
  freqOptionActive: { backgroundColor: TEAL },
  freqOptionTxt: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  freqOptionTxtActive: { color: '#fff', fontWeight: '600' },
  dayPicker: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 4 },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(60,60,67,0.06)',
  },
  dayChipActive: { backgroundColor: TEAL },
  dayChipTxt: { fontSize: 13, fontWeight: '600', color: 'rgba(60,60,67,0.6)' },
  dayChipTxtActive: { color: '#fff' },
  formActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  nextBtn: {
    flex: 1,
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(60,60,67,0.07)',
    alignItems: 'center',
  },
  backBtnTxt: { fontSize: 14, fontWeight: '600', color: 'rgba(60,60,67,0.6)' },
});
