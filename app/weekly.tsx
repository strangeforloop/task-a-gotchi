import React from 'react';
import { useRouter } from 'expo-router';
import { WeeklyModal } from '../src/components/weekly/WeeklyModal';
import { useWeeklyPlan } from '../src/context/WeeklyPlanContext';

export default function WeeklyScreen() {
  const router = useRouter();
  const {
    weekDays,
    todayId,
    templates,
    oneoffs,
    addTemplate,
    removeTemplate,
    addOneoff,
    removeOneoff,
  } = useWeeklyPlan();

  return (
    <WeeklyModal
      onClose={() => router.back()}
      weekDays={weekDays}
      todayId={todayId}
      templates={templates}
      oneoffs={oneoffs}
      addTemplate={addTemplate}
      removeTemplate={removeTemplate}
      addOneoff={addOneoff}
      removeOneoff={removeOneoff}
    />
  );
}
