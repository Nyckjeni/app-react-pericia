import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Dashboard({ navigation, renderFooter }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard</Text>
      {renderFooter && renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, marginTop: 40, textAlign: 'center' },
});
