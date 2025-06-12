import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBase = 'https://dentcase-backend.onrender.com/api';

export default function CadastroUsuario({ navigation, route }) {
  /* ---------------- estado ---------------- */
  const [userId, setUserId]     = useState(null);
  const [openRole, setOpenRole] = useState(false);
  const [role, setRole]         = useState(null);
  const [roles]                 = useState([
    { label: 'Administrador', value: 'admin' },
    { label: 'Perito',        value: 'perito' },
    { label: 'Assistente',    value: 'assistente' },
  ]);

  const [nome, setNome]           = useState('');
  const [email, setEmail]         = useState('');
  const [senha, setSenha]         = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  /* carrega dados de edição, se houver */
  useEffect(() => {
    if (route.params?.user) {
      const u = route.params.user;
      setUserId(u.id || u._id);
      setNome(u.nome || '');
      setEmail(u.email || '');
      setRole(u.role || null);
    }
  }, [route.params]);

  /* ---------------- handler ---------------- */
  const handleCadastro = useCallback(async () => {
    Keyboard.dismiss();

    // Validações básicas
    if (!nome || !email || !role) {
      return Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
    }
    if (!userId) {
      // novo usuário: senha obrigatória e confirmação
      if (!senha || !confSenha) {
        return Alert.alert('Erro', 'Preencha a senha e a confirmação.');
      }
      if (senha.length < 6) {
        return Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres.');
      }
      if (senha !== confSenha) {
        return Alert.alert('Erro', 'As senhas não coincidem.');
      }
    } else if (senha && senha.length < 6) {
      return Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return Alert.alert('Erro', 'Email inválido.');
    }

    setLoading(true);

    try {
      const payload = { nome, email, role };
      if (senha) payload.senha = senha;

      const endpoint = userId ? `/users/${userId}` : '/auth/register';
      const method   = userId ? 'put' : 'post';
      const token    = await AsyncStorage.getItem('accessToken');
      const headers  = { 'Content-Type': 'application/json' };
      if (userId && token) headers.Authorization = `Bearer ${token}`;

      const resposta = await axios({
        url: apiBase + endpoint,
        method,
        data: payload,
        headers,
      });

      // sucesso
      Alert.alert(
        'Sucesso',
        userId ? 'Usuário atualizado!' : 'Cadastro realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate(userId ? 'Usuarios' : 'Main'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      let msg = 'Erro ao processar requisição.';
      if (error.response?.status === 409) msg = 'E‑mail já está em uso.';
      else if (error.response?.data?.message) msg = error.response.data.message;
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }, [nome, email, senha, confSenha, role, userId, navigation]);

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userId ? 'Editar Usuário' : 'Cadastro de Usuário'}</Text>

      <View style={{ zIndex: 3000, marginBottom: 12 }}>
        <DropDownPicker
          open={openRole}
          value={role}
          items={roles}
          setOpen={setOpenRole}
          setValue={setRole}
          placeholder="Selecione o cargo*"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      <TextInput
        placeholder="Nome completo*"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email*"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* senha */}
      <View style={styles.pwdContainer}>
        <TextInput
          placeholder={userId ? 'Senha (deixe em branco para não alterar)' : 'Senha* (mínimo 6 caracteres)'}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          secureTextEntry={!showSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setShowSenha(v => !v)} style={styles.eyeBtn}>
          <Ionicons name={showSenha ? 'eye-off' : 'eye'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* confirmar senha */}
      {!userId && (
        <View style={styles.pwdContainer}>
          <TextInput
            placeholder="Confirmar senha*"
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            secureTextEntry={!showConf}
            value={confSenha}
            onChangeText={setConfSenha}
          />
          <TouchableOpacity onPress={() => setShowConf(v => !v)} style={styles.eyeBtn}>
            <Ionicons name={showConf ? 'eye-off' : 'eye'} size={24} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{userId ? 'Atualizar' : 'Cadastrar'}</Text>}
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- estilos ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 40 },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#6B0D0D',
    marginBottom: 20, textAlign: 'center',
  },
  dropdown:       { borderColor: '#ccc', borderWidth: 1, borderRadius: 8 },
  dropdownContainer:{ borderColor: '#ccc', borderWidth: 1, borderRadius: 8 },
  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 15, marginBottom: 16, backgroundColor: '#fff',
  },
  pwdContainer: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 16, borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
    paddingRight: 15,
  },
  eyeBtn: { padding: 10 },
  button: {
    backgroundColor: '#6B0D0D', paddingVertical: 15, borderRadius: 8,
    alignItems: 'center', marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
