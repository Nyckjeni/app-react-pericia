import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetalhesCasoScreen({ route }) {
  const { caso } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{caso.titulo}</Text>
      <Text style={styles.label}>ID: <Text style={styles.value}>#{caso.id}</Text></Text>
      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.value}>{caso.descricao}</Text>
      <Text style={styles.label}>Data:</Text>
      <Text style={styles.value}>{caso.data}</Text>
      <Text style={styles.label}>Responsável:</Text>
      <Text style={styles.value}>{caso.responsavel}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{caso.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#333',
    fontSize: 16,
  },
});
