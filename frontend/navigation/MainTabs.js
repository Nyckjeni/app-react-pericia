// MainTabs.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from '../screens/DashboardScreen';
import CasosScreen from '../screens/CasosScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import BottomNavbar from '../components/BottomNavbar';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const Stack = createNativeStackNavigator();

export default function MainTabs({ navigation }) {
  return (
    <SafeAreaWrapper>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard">
          {() => (
            <Dashboard
              navigation={navigation}
              renderFooter={() => (
                <BottomNavbar
                  navigation={navigation}
                  activeRoute="Dashboard"
                  onAddPress={() => navigation.navigate('CadastrarCaso')}
                />
              )}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Casos">
          {() => (
            <CasosScreen
              navigation={navigation}
              renderFooter={() => (
                <BottomNavbar
                  navigation={navigation}
                  activeRoute="Casos"
                  onAddPress={() => navigation.navigate('CadastrarCaso')}
                />
              )}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Usuarios">
          {() => (
            <UsuariosScreen
              navigation={navigation}
              renderFooter={() => (
                <BottomNavbar
                  navigation={navigation}
                  activeRoute="Usuarios"
                  onAddPress={() => navigation.navigate('CadastrarCaso')}
                />
              )}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </SafeAreaWrapper>
  );
}
