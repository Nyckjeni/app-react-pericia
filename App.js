import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import MainTabs from './navigation/MainTabs';
import CadastrarCaso from './screens/CadastrarCaso';
import UsuariosScreen from './screens/UsuariosScreen';
import CasosScreen from './screens/CasosScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="CadastrarCaso" component={CadastrarCaso} />
          <Stack.Screen name="Usuarios" component={UsuariosScreen} />
          <Stack.Screen name="Casos" component={CasosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
