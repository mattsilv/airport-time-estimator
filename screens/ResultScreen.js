import React from 'react';
import { View } from 'react-native';
import ResultDisplay from '../components/ResultDisplay';
import { useCalculateLeaveTime } from '../hooks/useCalculateLeaveTime';

export default function ResultScreen() {
  const { result } = useCalculateLeaveTime();

  return (
    <View>
      <ResultDisplay result={result} />
    </View>
  );
}
