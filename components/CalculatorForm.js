import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TimeInput from './TimeInput';
import { Input, Stack } from 'tamagui';

export default function CalculatorForm() {
  const navigation = useNavigation();

  return (
    <Stack space>
      <TimeInput label="Departure Time" />
      <TimeInput label="Boarding Time" />
      <Input placeholder="Driving Time to Airport With Traffic (minutes)" keyboardType="numeric" />
      <Button title="Calculate" onPress={() => navigation.navigate('Result')} />
    </Stack>
  );
}
