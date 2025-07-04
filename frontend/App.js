// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import MainTabs from './navigation/MainTabs';
import CadastrarCaso from './screens/CadastrarCaso';
import UsuariosScreen from './screens/UsuariosScreen';
import CasosScreen from './screens/CasosScreen';
import DashboardScreen from './screens/DashboardScreen';
import DetalhesCasoScreen from './screens/DetalhesCasoScreen';
import CadastrarUsuario from './screens/CadastrarUsuario';
import CadastroEvidenciaScreen from './screens/CadastroEvidenciaScreen';
import EditarUsuarioScreen from './screens/EditarUsuarioScreen';
import EditarCasoScreen from './screens/EditarCasoScreen';

import SafeAreaWrapper from './components/SafeAreaWrapper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaWrapper>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="CadastrarCaso" component={CadastrarCaso} />
            <Stack.Screen name="Usuarios" component={UsuariosScreen} />
            <Stack.Screen name="Casos" component={CasosScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="DetalhesCaso"
              component={DetalhesCasoScreen}
              options={{ headerShown: true, title: 'Detalhes do Caso' }}
            />
            <Stack.Screen
              name="EditarCaso"
              component={EditarCasoScreen}
              options={{ title: 'Editar Caso' }}
            />
            <Stack.Screen
              name="CadastrarUsuario"
              component={CadastrarUsuario}
              options={{ headerShown: true, title: 'Novo Usuário' }}
            />
            <Stack.Screen
              name="CadastroEvidencia"
              component={CadastroEvidenciaScreen}
              options={{ headerShown: true, title: 'Nova Evidência' }}
            />
            <Stack.Screen
              name="EditarUsuario"
              component={EditarUsuarioScreen}
              options={{ headerShown: true, title: 'Editar Usuário' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaWrapper>
    </SafeAreaProvider>
  );
}
