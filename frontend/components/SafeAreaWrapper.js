// components/SafeAreaWrapper.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function SafeAreaWrapper({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // ajuste conforme o tema do seu app
  },
});
