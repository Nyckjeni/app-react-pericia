import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import BottomNavbar from '../components/BottomNavbar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function UsuariosScreen({ navigation }) {
  const [loading, setLoading]       = useState(true);
  const [usuarios, setUsuarios]     = useState([]);
  const [openRole, setOpenRole]     = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [roles, setRoles]           = useState([
    { label: 'Todos', value: 'all' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Perito', value: 'perito' },
    { label: 'Assistente', value: 'assistente' },
  ]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Token não encontrado. Faça login novamente.');
      const resp = await axios.get(
        'https://dentcase-backend.onrender.com/api/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios(resp.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', err.message || 'Não foi possível carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela volta a ficar em foco
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const usuariosFiltrados = usuarios.filter(u =>
    roleFilter === 'all' ? true : u.role === roleFilter
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditarUsuario', { usuario: item })}
    >
      <Text style={styles.name}>{item.nome}</Text>
      <Text><Text style={styles.bold}>Email:</Text> {item.email}</Text>
      <Text><Text style={styles.bold}>Matrícula:</Text> {item.matricula || '—'}</Text>
      <Text>
        <Text style={styles.bold}>Cadastrado em:</Text>{' '}
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('pt-BR')
          : '—'}
      </Text>
      <View style={styles.badgeContainer}>
        <Text style={[styles.badge, styles[`${item.role}Badge`]]}>
          {item.role === 'admin' ? 'Administrador'
            : item.role.charAt(0).toUpperCase() + item.role.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Gerenciamento de Usuários</Text>
        <TouchableOpacity
          style={styles.novoButton}
          onPress={() => navigation.navigate('CadastrarUsuario')}
        >
          <Text style={styles.novoButtonText}>+ Novo Usuário</Text>
        </TouchableOpacity>

        <View style={{ zIndex: 3000, marginBottom: 12 }}>
          <DropDownPicker
            open={openRole}
            value={roleFilter}
            items={roles}
            setOpen={setOpenRole}
            setValue={setRoleFilter}
            setItems={setRoles}
            placeholder="Filtrar por tipo"
          />
        </View>

        {loading
          ? <ActivityIndicator size="large" color="#6B0D0D" />
          : <FlatList
              data={usuariosFiltrados}
              keyExtractor={u => u._id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
        }
      </View>

      <BottomNavbar
        navigation={navigation}
        activeRoute="Usuarios"
        onAddPress={() => navigation.navigate('CadastrarCaso')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f5f5f5',
    paddingTop: 40, paddingHorizontal: 16
  },
  pageTitle: {
    fontSize: 22, fontWeight: 'bold',
    color: '#6B0D0D', marginBottom: 16
  },
  novoButton: {
    backgroundColor: '#6B0D0D',
    paddingVertical: 10, borderRadius: 8,
    alignItems: 'center', marginBottom: 16
  },
  novoButtonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 16
  },
  card: {
    backgroundColor: '#fff', borderRadius: 10,
    padding: 12, marginVertical: 6, elevation: 2
  },
  name: {
    fontWeight: 'bold', fontSize: 16, marginBottom: 4
  },
  bold: { fontWeight: 'bold' },
  badgeContainer: { marginTop: 8, alignSelf: 'flex-end' },
  badge: {
    borderWidth: 1, paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 6, fontSize: 12
  },
  adminBadge:     { borderColor: '#0d6efd', color: '#0d6efd' },
  peritoBadge:    { borderColor: '#198754', color: '#198754' },
  assistenteBadge:{ borderColor: '#ffc107', color: '#ffc107' },
});
