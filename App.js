import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Theme>
    </TamaguiProvider>
  );
}
