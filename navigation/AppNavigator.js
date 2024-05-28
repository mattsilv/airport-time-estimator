import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CalculatorScreen from '../screens/CalculatorScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}
