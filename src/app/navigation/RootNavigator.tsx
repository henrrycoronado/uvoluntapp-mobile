import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../../features/auth/SignInScreen';
import { HomeScreen } from '../../features/profile/HomeScreen';
import { useSession } from '../../shared/session/SessionProvider';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Sesión restaurada => Home; sin sesión (o refresh fallido) => SignIn. */
export function RootNavigator() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator accessibilityLabel="Cargando" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {status === 'authenticated' ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Inicio' }}
          />
        ) : (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: 'Iniciar sesión' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
});
