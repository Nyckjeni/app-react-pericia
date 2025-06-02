import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();

  const [open, setOpen] = useState(false);
  const [cargo, setCargo] = useState(null);
  const [itens] = useState([
    { label: 'Administrador', value: 'admin' },
    { label: 'Perito', value: 'perito' },
    { label: 'Assistente', value: 'Assistente' },
  ]);

  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    // Navega para a tela 'Casos' dentro do navigator 'Main'
    navigation.navigate('Main', { screen: 'Casos' });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/tooth.png')} 
        style={styles.logo}
      />

      <Text style={styles.title}></Text>

      <Text style={styles.label}>Cargo</Text>
      <DropDownPicker
        open={open}
        value={cargo}
        items={itens}
        setOpen={setOpen}
        setValue={setCargo}
        setItems={() => {}}
        placeholder="Selecione o cargo"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={{ color: cargo ? '#000' : '#999' }}
        placeholderStyle={{ color: '#999' }}
        listItemLabelStyle={{ color: '#000' }}
        arrowIconStyle={{ tintColor: '#6B0D0D' }}
      />

      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua matrícula"
        value={matricula}
        onChangeText={setMatricula}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputSenha}
          placeholder="Digite sua senha"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={22} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#6B0D0D',
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginBottom: 4,
    marginTop: 10,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 6,
    height: 45,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  inputSenha: {
    flex: 1,
    color: '#000',
  },
  botao: {
    backgroundColor: '#6B0D0D',
    paddingVertical: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
