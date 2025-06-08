import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CadastrarUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);  // <-- Adicionado aqui

  const [openCargo, setOpenCargo] = useState(false);
  const [cargo, setCargo] = useState(null);
  const [cargos] = useState([
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Perito', value: 'Perito' },
    { label: 'Assistente', value: 'Assistente' },
  ]);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha || !cargo) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.125:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cargo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        // Limpar os campos após o sucesso
        setNome('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');
        setCargo(null);
      } else {
        Alert.alert('Erro', data.message || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
      console.error('Erro no cadastro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <DropDownPicker
        open={openCargo}
        value={cargo}
        items={cargos}
        setOpen={setOpenCargo}
        setValue={setCargo}
        setItems={() => {}}
        placeholder="Selecione o cargo"
        containerStyle={{ marginBottom: openCargo ? 180 : 16, zIndex: 1000 }}
      />

      <TextInput
        placeholder="Nome completo"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          style={[styles.input, { flex: 1 }]}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity
          onPress={() => setMostrarSenha(!mostrarSenha)}
          style={styles.showHideButton}
        >
          <Text style={styles.showHideText}>{mostrarSenha ? 'Ocultar' : 'Mostrar'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirmar senha"
          style={[styles.input, { flex: 1 }]}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
        />
        <TouchableOpacity
          onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
          style={styles.showHideButton}
        >
          <Text style={styles.showHideText}>{mostrarConfirmarSenha ? 'Ocultar' : 'Mostrar'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  showHideButton: {
    marginLeft: 8,
  },
  showHideText: {
    color: '#6B0D0D',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6B0D0D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
