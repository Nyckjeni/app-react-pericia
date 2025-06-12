import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditarUsuarioScreen({ route, navigation }) {
  const { usuario } = route.params;
  const [nome, setNome]           = useState(usuario.nome);
  const [email, setEmail]         = useState(usuario.email);
  const [matricula]               = useState(usuario.matricula);
  const [role, setRole]           = useState(usuario.role);
  const [senha, setSenha]         = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [openRole, setOpenRole]   = useState(false);
  const [roles, setRoles]         = useState([
    { label: 'Administrador', value: 'admin' },
    { label: 'Perito',        value: 'perito' },
    { label: 'Assistente',    value: 'assistente' },
  ]);
  const [showSenha, setShowSenha]     = useState(false);
  const [showConf, setShowConf]       = useState(false);

  const handleSalvar = useCallback(async () => {
    Keyboard.dismiss();
    if (!nome || !email || !role) {
      return Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
    }
    if (senha && senha !== confSenha) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token não encontrado.');
      await axios.put(
        `https://dentcase-backend.onrender.com/api/users/${usuario._id}`,
        { nome, email, matricula, role, ...(senha ? { senha } : {}) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Sucesso', 'Usuário atualizado!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', err.response?.data?.message || 'Não foi possível atualizar.');
    }
  }, [nome, email, role, senha, confSenha, navigation]);

  const handleExcluir = useCallback(() => {
    Alert.alert('Excluir usuário', 'Deseja realmente excluir este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) throw new Error('Token não encontrado.');
            await axios.delete(
              `https://dentcase-backend.onrender.com/api/users/${usuario._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Sucesso', 'Usuário excluído!');
            navigation.goBack();
          } catch (err) {
            console.error(err);
            Alert.alert('Erro', err.response?.data?.message || 'Não foi possível excluir.');
          }
        }
      }
    ]);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <View style={{ zIndex: 3000, marginBottom: 12 }}>
        <DropDownPicker
          open={openRole}
          value={role}
          items={roles}
          setOpen={setOpenRole}
          setValue={setRole}
          setItems={setRoles}
          placeholder="Selecione o tipo"
        />
      </View>

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
        editable={false}
        placeholder="Matrícula"
        style={[styles.input, { backgroundColor: '#eee' }]}
      />

      <View style={styles.pwdContainer}>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Nova Senha"
          secureTextEntry={!showSenha}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowSenha(v => !v)} style={styles.eyeBtn}>
          <Ionicons name={showSenha ? 'eye-off' : 'eye'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.pwdContainer}>
        <TextInput
          value={confSenha}
          onChangeText={setConfSenha}
          placeholder="Confirmar Senha"
          secureTextEntry={!showConf}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
        />
        <TouchableOpacity onPress={() => setShowConf(v => !v)} style={styles.eyeBtn}>
          <Ionicons name={showConf ? 'eye-off' : 'eye'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
        <Text style={styles.saveText}>Salvar Alterações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleExcluir}>
        <Text style={styles.deleteText}>Excluir Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, backgroundColor: '#fff'
  },
  pwdContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  eyeBtn: { padding: 10 },
  saveBtn: {
    backgroundColor: '#6B0D0D', padding: 12,
    borderRadius: 8, marginTop: 10, alignItems: 'center'
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  deleteBtn: {
    backgroundColor: '#dc3545', padding: 12,
    borderRadius: 8, marginTop: 12, alignItems: 'center'
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});
