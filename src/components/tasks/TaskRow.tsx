import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Task } from '../../types';
import { CheckCircle } from './CheckCircle';
import { HabitDots } from './HabitDots';
import {
  formatAdded,
  formatHabitSince,
  formatScheduledTime,
  formatOverdueDuration,
} from '../../utils/format';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskRow({ task, onToggle }: Props) {
  const isOverdue = task.overdue && !task.completed;
  const sourceDot =
    task.source === 'habit' ? '#16A8CA' : task.source === 'template' ? '#7F77DD' : '#1D9E75';
  const checkColor = isOverdue ? '#D85A30' : task.completed ? '#639922' : '#378ADD';
  const overdueDuration = isOverdue && task.dueDate ? formatOverdueDuration(task.dueDate) : '';
  const showBadge = isOverdue && (task.overduePoints ?? 0) > 0;

  return (
    <View style={[styles.row, task.completed && styles.completed, isOverdue && styles.overdue]}>
      <CheckCircle checked={task.completed} color={checkColor} onPress={() => onToggle(task.id)} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: sourceDot }]} />
          <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={1}>
            {task.title}
          </Text>
          {task.habitScheduledTime && (
            <Text style={styles.timeBadge}>{formatScheduledTime(task.habitScheduledTime)}</Text>
          )}
        </View>
        {isOverdue && (
          <View style={styles.metaRow}>
            <Text style={styles.overdueFrom}>{task.overdueFrom}</Text>
            {overdueDuration ? <Text style={styles.overdueDuration}>{overdueDuration}</Text> : null}
          </View>
        )}
        {!task.overdue && task.createdAt != null && (
          <Text style={styles.addedLabel}>{formatAdded(task.createdAt)}</Text>
        )}
        {task.source === 'habit' && (task.habitCreatedAt || task.habitLateLabel) && (
          <View style={styles.habitMetaRow}>
            {task.habitCreatedAt && (
              <Text style={styles.habitSince}>{formatHabitSince(task.habitCreatedAt)}</Text>
            )}
            {task.habitCreatedAt && task.habitLateLabel && (
              <Text style={styles.habitMetaSep}> · </Text>
            )}
            {task.habitLateLabel && <Text style={styles.habitLate}>{task.habitLateLabel}</Text>}
          </View>
        )}
        {task.source === 'habit' && task.habitDots && <HabitDots dots={task.habitDots} />}
      </View>
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>−{task.overduePoints}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
  },
  completed: { backgroundColor: '#EAF3DE', opacity: 0.62 },
  overdue: { backgroundColor: '#FAECE7' },
  content: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  title: { fontSize: 16, fontWeight: '500', color: '#1a1a1a', flex: 1 },
  titleDone: { color: 'rgba(60,60,67,0.55)', textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3, marginLeft: 14 },
  overdueFrom: { fontSize: 11, fontWeight: '600', color: '#D85A30' },
  overdueDuration: { fontSize: 11, fontWeight: '400', color: 'rgba(216,90,48,0.55)' },
  addedLabel: { fontSize: 11, color: 'rgba(60,60,67,0.38)', marginTop: 2, marginLeft: 14 },
  timeBadge: { fontSize: 11, fontWeight: '600', color: '#16A8CA', marginLeft: 4 },
  habitMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginLeft: 14 },
  habitSince: { fontSize: 11, color: 'rgba(60,60,67,0.38)' },
  habitMetaSep: { fontSize: 11, color: 'rgba(60,60,67,0.25)' },
  habitLate: { fontSize: 11, fontWeight: '600', color: '#E8955A' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(216,90,48,0.12)',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#D85A30' },
});
