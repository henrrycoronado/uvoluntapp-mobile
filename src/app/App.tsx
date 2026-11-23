import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { sessionManager, setupApi } from '../shared/api';
import { SessionProvider } from '../shared/session/SessionProvider';
import { ThemeProvider } from '../ui';
import { RootNavigator } from './navigation/RootNavigator';

setupApi();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" />
        <SessionProvider manager={sessionManager}>
          <RootNavigator />
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
