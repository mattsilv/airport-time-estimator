import React from 'react';
import { View, Text } from 'react-native';

export default function ResultDisplay({ result }) {
  return (
    <View>
      <Text>{result}</Text>
    </View>
  );
}
