import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Task } from '../../types';
import { CheckCircle } from './CheckCircle';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskRow({ task, onToggle }: Props) {
  const isOverdue = task.overdue && !task.completed;
  const sourceDot = task.source === 'template' ? '#7F77DD' : '#1D9E75';
  const checkColor = isOverdue ? '#D85A30' : task.completed ? '#639922' : '#378ADD';

  return (
    <View style={[styles.row, task.completed && styles.completed, isOverdue && styles.overdue]}>
      <CheckCircle checked={task.completed} color={checkColor} onPress={() => onToggle(task.id)} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: sourceDot }]} />
          <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={1}>
            {task.title}
          </Text>
        </View>
        {isOverdue && (
          <Text style={styles.overdueLabel}>Overdue · from {task.overdueFrom}</Text>
        )}
      </View>
      {isOverdue && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>−{task.overduePoints}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 12 },
  completed: { backgroundColor: '#EAF3DE', opacity: 0.62 },
  overdue: { backgroundColor: '#FAECE7' },
  content: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  title: { fontSize: 16, fontWeight: '500', color: '#1a1a1a', flex: 1 },
  titleDone: { color: 'rgba(60,60,67,0.55)', textDecorationLine: 'line-through' },
  overdueLabel: { fontSize: 12, fontWeight: '600', color: '#D85A30', marginTop: 4, marginLeft: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(216,90,48,0.12)' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#D85A30' },
});
