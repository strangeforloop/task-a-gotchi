import React from 'react';
import { useRouter } from 'expo-router';
import { WeeklyModal } from '../src/components/weekly/WeeklyModal';

export default function WeeklyScreen() {
  const router = useRouter();
  return <WeeklyModal open onClose={() => router.back()} currentDay="wed" />;
}
