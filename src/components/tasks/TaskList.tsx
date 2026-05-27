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
  const overdue = tasks.filter(t => t.overdue);
  const incompleteOverdue = overdue.filter(t => !t.completed);
  const today = tasks.filter(t => !t.overdue);
  const completedCount = today.filter(t => t.completed).length;

  return (
    <View style={styles.list}>
      {overdue.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <SectionLabel color="#D85A30">⚠ Overdue · {incompleteOverdue.length}</SectionLabel>
            <Text style={styles.penalty}>
              −{incompleteOverdue.reduce((s, t) => s + (t.overduePoints ?? 0), 0)} health
            </Text>
          </View>
          {overdue.map(t => (
            <TaskRow key={t.id} task={t} onToggle={onToggle} />
          ))}
        </>
      )}
      <View style={[styles.sectionHeader, overdue.length > 0 && styles.sectionSpacing]}>
        <SectionLabel>Today</SectionLabel>
        <Text style={styles.count}>
          {completedCount}/{today.length}
        </Text>
      </View>
      {today.map(t => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionSpacing: { marginTop: 10 },
  penalty: { fontSize: 11, color: '#D85A30', fontWeight: '600' },
  count: { fontSize: 11, color: 'rgba(60,60,67,0.55)', fontWeight: '600' },
});
