import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import GerarRelatorioPdf from '../components/GerarRelatorioPdf';

export default function DetalhesCasoScreen({ route, navigation }) {
  const { caso } = route.params;
  const [detalhe, setDetalhe] = useState(null);
  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTudo = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw { response: { status: 401 } };

        // 1. Buscar dados do caso usando _id
        const caseRes = await api.get(`/cases/${caso._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 2. Corrigir estrutura de dados
        const casoFormatado = {
          ...caseRes.data,
          patientDOB: caseRes.data.patientDOB || null,
          incidentDate: caseRes.data.incidentDate || null,
          injuryRegions: caseRes.data.injuryRegions || [],
          estado: caseRes.data.estado || '',
          bairro: caseRes.data.bairro || '',
          caseType: caseRes.data.caseType || '',
          identified: caseRes.data.identified || false,
        };
        
        setDetalhe(casoFormatado);

        // 3. Buscar evidências usando _id do caso (não caseId)
        const evRes = await api.get(`/evidences/case/${casoFormatado._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 4. Formatar dados das evidências
        const evidenciasFormatadas = evRes.data.map(ev => ({
          ...ev,
          collectionDate: ev.collectionDate || new Date().toISOString(),
          collectionTime: ev.collectionTime || '00:00',
        }));
        
        setEvidencias(evidenciasFormatadas);
      } catch (err) {
        console.error('Erro ao carregar detalhes:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          Alert.alert(
            'Sessão expirada',
            'Faça login novamente.',
            [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }]
          );
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do caso.');
        }
      } finally {
        setLoading(false);
      }
    };

    carregarTudo();
  }, [caso._id]);

  // Função auxiliar para mostrar valores
  const mostrar = (v) => {
    if (v == null || v === '') return 'Não informado';
    if (Array.isArray(v)) return v.length ? v.join(', ') : 'Não informado';
    if (typeof v === 'boolean') return v ? 'Sim' : 'Não';
    return String(v);
  };

  // Mapeamento de estados (código para nome)
  const estadosMap = {
    /* ... */
  };

  const excluirCaso = () => {
    Alert.alert(
      'Excluir caso',
      'Deseja mesmo excluir este caso e todas as evidências?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              await api.delete(`/cases/${caso._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              navigation.goBack();
            } catch (e) {
              console.error(e);
              Alert.alert('Erro', 'Não foi possível excluir o caso.');
            }
          },
        },
      ]
    );
  };

  const excluirEvidencia = (id) => {
    Alert.alert(
      'Excluir evidência',
      'Deseja excluir esta evidência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              await api.delete(`/evidences/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setEvidencias((prev) => prev.filter((e) => e._id !== id));
            } catch (e) {
              console.error(e);
              Alert.alert('Erro', 'Não foi possível excluir a evidência.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B0D0D" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!detalhe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Caso não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* === DETALHES DO CASO === */}
      <View style={styles.card}>
        <Text style={styles.caseTitle}>{mostrar(detalhe.patientName)}</Text>
        <View style={styles.badges}>
          <Text style={styles.caseId}>#{detalhe.caseId || detalhe._id}</Text>
          <Text style={[styles.statusBadge, 
            detalhe.status === 'em andamento' ? styles.statusAndamento :
            detalhe.status === 'finalizado' ? styles.statusFinalizado :
            styles.statusArquivado
          ]}>
            {detalhe.status === 'em andamento'
              ? 'Em Andamento'
              : detalhe.status === 'finalizado'
              ? 'Finalizado'
              : 'Arquivado'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          <Text style={styles.label}>Descrição: </Text>{mostrar(detalhe.description)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Data Criação: </Text>
          {detalhe.createdAt ? new Date(detalhe.createdAt).toLocaleDateString('pt-BR') : 'Não informado'}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Responsável: </Text>
          {detalhe.createdBy?.name || 'Não informado'}
        </Text>

        <Text style={styles.description}>
          <Text style={styles.label}>Paciente: </Text>{mostrar(detalhe.patientName)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Data Nasc.: </Text>
          {detalhe.patientDOB ? new Date(detalhe.patientDOB).toLocaleDateString('pt-BR') : 'Não informado'}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Gênero: </Text>{mostrar(detalhe.patientGender)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Documento: </Text>{mostrar(detalhe.patientID)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Contato: </Text>{mostrar(detalhe.patientContact)}
        </Text>

        <Text style={styles.description}>
          <Text style={styles.label}>Incidente: </Text>{mostrar(detalhe.incidentDescription)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Data: </Text>
          {detalhe.incidentDate ? new Date(detalhe.incidentDate).toLocaleString('pt-BR') : 'Não informado'}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Local: </Text>{mostrar(detalhe.incidentLocation)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Instrumento/Arma: </Text>{mostrar(detalhe.incidentWeapon)}
        </Text>
        
        <Text style={styles.description}>
          <Text style={styles.label}>Estado: </Text>
          {estadosMap[detalhe.estado] || 'Não informado'}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Bairro: </Text>{mostrar(detalhe.bairro)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Tipo de Caso: </Text>{mostrar(detalhe.caseType)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Identificado: </Text>{mostrar(detalhe.identified)}
        </Text>
        <Text style={styles.description}>
          <Text style={styles.label}>Regiões de Lesão: </Text>{mostrar(detalhe.injuryRegions)}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('EditarCaso', { caso: detalhe })}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={excluirCaso}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>

          <GerarRelatorioPdf caso={detalhe} status={detalhe.status} />
        </View>
      </View>

      {/* === EVIDÊNCIAS === */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Evidências</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CadastroEvidencia', { caseId: detalhe._id })}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {evidencias.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma evidência cadastrada</Text>
        ) : (
          evidencias.map((e) => (
            <View key={e._id} style={styles.evidenceCard}>
              <Text style={styles.evidenceTitle}>
                {e.description || 'Evidência sem descrição'}
              </Text>
              
              <View style={styles.evidenceInfoRow}>
                <MaterialIcons name="date-range" size={16} color="#555" />
                <Text style={styles.evidenceInfoText}>
                  {e.collectionDate ? new Date(e.collectionDate).toLocaleDateString('pt-BR') : 'Data não informada'}
                  {e.collectionTime ? ` - ${e.collectionTime}` : ''}
                </Text>
              </View>
              
              {e.latitude && e.longitude && (
                <View style={styles.evidenceInfoRow}>
                  <MaterialIcons name="place" size={16} color="#555" />
                  <Text style={styles.evidenceInfoText}>
                    {parseFloat(e.latitude).toFixed(6)}, {parseFloat(e.longitude).toFixed(6)}
                  </Text>
                </View>
              )}
              
              <Text style={styles.evidenceAddedBy}>
                Adicionada por: {e.addedBy?.name || 'Não informado'}
              </Text>
              
              <View style={styles.buttonRowEvidence}>                
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => excluirEvidencia(e._id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#f3f3f3', 
    flex: 1, 
    padding: 16 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    color: '#666', 
    fontSize: 16, 
    textAlign: 'center', 
    marginVertical: 8 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 16, 
    marginBottom: 24, 
    elevation: 3 
  },
  caseTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#6B0D0D', 
    marginBottom: 8 
  },
  badges: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 12 
  },
  caseId: { 
    backgroundColor: '#F3E8E8', 
    color: '#6B0D0D', 
    padding: 4, 
    borderRadius: 5, 
    fontSize: 12 
  },
  statusBadge: {
    padding: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusAndamento: {
    backgroundColor: '#E7D6B3',
    color: '#856404',
  },
  statusFinalizado: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  statusArquivado: {
    backgroundColor: '#E2E3E5',
    color: '#6C757D',
  },
  description: { 
    color: '#444', 
    marginBottom: 8, 
    lineHeight: 20 
  },
  label: { 
    fontWeight: 'bold' 
  },
  buttonRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 16 
  },
  buttonRowEvidence: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10
  },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#6B0D0D', // Adicionado para garantir visibilidade dos botões
  },
  editButton: {
    backgroundColor: '#6B0D0D',
  },
  deleteButton: {
    backgroundColor: '#B00020',
  },
  buttonText: { 
    color: '#fff', 
    marginLeft: 6 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#6B0D0D', 
    padding: 10, 
    borderRadius: 6 
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8
  },
  evidenceCard: {
    backgroundColor: '#fefefe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6
  },
  evidenceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  evidenceInfoText: {
    color: '#555',
    fontSize: 14
  },
  evidenceAddedBy: {
    color: '#777',
    fontStyle: 'italic',
    marginTop: 4
  },
});
