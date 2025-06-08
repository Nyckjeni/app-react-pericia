import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditarUsuarioScreen({ route, navigation }) {
  const { usuario } = route.params;

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [matricula, setMatricula] = useState(usuario.matricula);
  const [tipo, setTipo] = useState(usuario.tipo);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados para controlar visibilidade das senhas
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleSalvar = async () => {
    Keyboard.dismiss();

    if (!nome || !email || !tipo) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha && senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      await axios.put(`http://192.168.0.125:3000/api/users/${usuario._id}`, {
        nome,
        email,
        matricula,
        tipo,
        ...(senha ? { senha } : {}), // só envia a senha se ela for preenchida
      });

      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o usuário.');
    }
  };

  const handleExcluir = async () => {
    Alert.alert('Excluir usuário', 'Tem certeza que deseja excluir este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.0.125:3000/api/users/${usuario._id}`);
            Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o usuário.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={matricula}
        onChangeText={setMatricula}
        placeholder="Matrícula"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o tipo de usuário" value="" />
          <Picker.Item label="Administrador" value="Administrador" />
          <Picker.Item label="Perito" value="Perito" />
          <Picker.Item label="Assistente" value="Assistente" />
        </Picker>
      </View>

      {/* Campo senha com botão para mostrar/esconder */}
      <View style={styles.passwordContainer}>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Nova Senha"
          secureTextEntry={!showSenha}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowSenha(!showSenha)} style={styles.eyeButton}>
          <Ionicons name={showSenha ? 'eye-off' : 'eye'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Campo confirmar senha com botão para mostrar/esconder */}
      <View style={styles.passwordContainer}>
        <TextInput
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="Confirmar Nova Senha"
          secureTextEntry={!showConfirmarSenha}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowConfirmarSenha(!showConfirmarSenha)} style={styles.eyeButton}>
          <Ionicons name={showConfirmarSenha ? 'eye-off' : 'eye'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
        <Text style={styles.deleteButtonText}>Excluir Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeButton: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#6B0D0D',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
