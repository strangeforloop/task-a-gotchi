import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Task } from '../../types';
import { TaskRow } from './TaskRow';
import { SectionLabel } from './SectionLabel';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export function TaskList({ tasks, onToggle }: Props) {
  const incompleteOverdue = tasks.filter(t => t.overdue && !t.completed);
  const incompleteToday = tasks.filter(t => !t.overdue && !t.completed);
  const done = tasks.filter(t => t.completed);

  const completedTodayCount = done.filter(t => !t.overdue).length;
  const totalToday = incompleteToday.length + completedTodayCount;

  if (tasks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No tasks yet 🐾</Text>
        <Text style={styles.emptyBody}>Add your first task to feed your pet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {incompleteOverdue.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <SectionLabel color="#D85A30">⚠ Overdue · {incompleteOverdue.length}</SectionLabel>
            <Text style={styles.penalty}>
              −{incompleteOverdue.reduce((s, t) => s + (t.overduePoints ?? 0), 0)} health
            </Text>
          </View>
          {incompleteOverdue.map(t => (
            <TaskRow key={t.id} task={t} onToggle={onToggle} />
          ))}
        </>
      )}

      <View style={[styles.sectionHeader, incompleteOverdue.length > 0 && styles.sectionSpacing]}>
        <SectionLabel>Today</SectionLabel>
        <Text style={styles.count}>
          {completedTodayCount}/{totalToday}
        </Text>
      </View>
      {incompleteToday.map(t => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} />
      ))}

      {done.length > 0 && (
        <>
          <View style={[styles.sectionHeader, styles.sectionSpacing]}>
            <SectionLabel color="rgba(60,60,67,0.4)">Done · {done.length}</SectionLabel>
          </View>
          {done.map(t => (
            <TaskRow key={t.id} task={t} onToggle={onToggle} />
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 100 },
  empty: { paddingHorizontal: 16, paddingTop: 32, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#1a1a1a', fontFamily: 'monospace' },
  emptyBody: { fontSize: 13, color: 'rgba(60,60,67,0.6)', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionSpacing: { marginTop: 10 },
  penalty: { fontSize: 11, color: '#D85A30', fontWeight: '600' },
  count: { fontSize: 11, color: 'rgba(60,60,67,0.55)', fontWeight: '600' },
});
