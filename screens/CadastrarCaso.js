import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BottomNavbar from '../components/BottomNavbar';

export default function CadastrarCaso({ navigation }) {
  const [casoId, setCasoId] = useState('');
  const [status, setStatus] = useState('Em Andamento');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const gerarIdAleatorio = () => {
      const idAleatorio = Math.floor(1000 + Math.random() * 9000);
      setCasoId(`CASO-${idAleatorio}`);
    };
    gerarIdAleatorio();
  }, []);

  const handleSubmit = () => {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'A descrição detalhada é obrigatória.');
      return;
    }
    Alert.alert('Sucesso', 'Caso cadastrado com sucesso!');
    setDescricao('');
  };

  return (
    <View style={styles.wrapper}>  {/* Container externo que abrange toda a tela */}
      <View style={styles.container}>  {/* Conteúdo da tela */}
        <Text style={styles.title}>Cadastrar Novo Caso</Text>

        <View style={styles.card}>
          <Text style={styles.label}>ID do Caso</Text>
          <TextInput
            value={casoId}
            editable={false}
            style={styles.inputDisabled}
          />
          <Text style={styles.info}>Gerado automaticamente pelo sistema</Text>

          <Text style={styles.label}>Status*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={value => setStatus(value)}
              style={styles.picker}
            >
              <Picker.Item label="Em Andamento" value="Em Andamento" />
              <Picker.Item label="Finalizado" value="Finalizado" />
              <Picker.Item label="Arquivado" value="Arquivado" />
            </Picker>
          </View>

          <Text style={styles.label}>Descrição Detalhada do Caso*</Text>
          <TextInput
            multiline
            numberOfLines={5}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o caso com detalhes relevantes..."
            style={styles.textArea}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomNavbar
        navigation={navigation}
        activeRoute="Casos"
        onAddPress={() => navigation.navigate('CadastrarCaso')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',  // Garante que o container fique no topo e a navbar na base
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  info: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  pickerContainer: {
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  textArea: {
    backgroundColor: '#f0f0f0',
    textAlignVertical: 'top',
    padding: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6B0D0D',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
