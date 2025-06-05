import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BottomNavbar({ navigation, activeRoute, onAddPress }) {
  const renderButton = (route, iconName, label, iconSize = 24) => {
    const isActive = activeRoute === route;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(route)}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons name={iconName} size={iconSize} color={isActive ? '#FFD700' : '#fff'} />
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {renderButton('Dashboard', 'grid-outline', 'Dashboard')}
        {renderButton('Casos', 'folder-open-outline', 'Casos')}

        <View style={styles.addButtonWrapper}>
          <TouchableOpacity onPress={onAddPress} activeOpacity={0.8} style={styles.addButton}>
            <Ionicons name="add-circle" size={64} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {renderButton('Usuarios', 'people-outline', 'Usuários')}
        {renderButton('Login', 'log-out-outline', 'Sair')}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#6B0D0D',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#6B0D0D',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  labelActive: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  addButtonWrapper: {
    position: 'relative',
    top: -20,
    zIndex: 1,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
