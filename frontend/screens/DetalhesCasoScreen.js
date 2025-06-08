import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Alert } from 'react-native';

import GerarRelatorioPdf from '../components/GerarRelatorioPdf';
import GerarLaudoPdf from '../components/GerarLaudoPdf';



export default function DetalhesCasoScreen({ route, navigation }) {
  const { caso = {} } = route.params || {};

  const [status, setStatus] = useState(caso.status || 'Em Andamento');
  const [modalVisible, setModalVisible] = useState(false);

  const mostrarCampo = (campo) => {
    if (campo === null || campo === undefined || campo === '') {
      return 'Não informado';
    }
    return campo;
  };

  const excluirCaso = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este caso e todas as evidências relacionadas?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Aqui você faria a exclusão do banco de dados:
            // await api.delete(`/casos/${caso.id}`);
            // await api.delete(`/evidencias?casoId=${caso.id}`);

            // Simula exclusão local:
            console.log('Caso excluído:', caso.id);
            setEvidencias([]);
            navigation.goBack(); // Volta para a tela anterior
          },
        },
      ]
    );
  };

  const alterarStatus = (novoStatus) => {
    setStatus(novoStatus);
    setModalVisible(false);
  };
  //Se já estiver pegando as evidências do banco, use useEffect() para carregar e setar no estado.
  const [evidencias, setEvidencias] = useState([
    {
      id: 'EV-001',
      titulo: 'Dente Canino inferior no local do Acidente',
      descricao: 'Fragmento dental encontrado na cena do acidente com possíveis marcas.',
      data: '16/05/2024',
      tipo: 'Foto',
    },
    // novas evidências virão aqui
  ]);

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <Text style={styles.sectionTitle}></Text>

      {/* Cartão do Caso no mesmo formato do card da lista */}
      <View style={styles.card}>
        <Text style={styles.caseTitle}>{mostrarCampo(caso.titulo)}</Text>

        <View style={styles.badges}>
          <Text style={styles.caseId}>{caso.id ? `#${caso.id}` : '#caso-001'}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>

        <Text style={styles.description}>
          <Text style={styles.label}>Descrição: </Text>
          {mostrarCampo(caso.descricao)}
        </Text>

        <Text style={styles.description}>
          <Text style={styles.label}>Perito: </Text>
          {mostrarCampo(caso.perito)}
        </Text>

        <Text style={styles.description}>
          <Text style={styles.label}>Data Abertura: </Text>
          {mostrarCampo(caso.data)}
        </Text>

        {/* Botões */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="create-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={excluirCaso}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Ionicons name="swap-horizontal-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Alterar Status</Text>
          </TouchableOpacity>

          <GerarRelatorioPdf caso={caso} status={status} />
        </View>
      </View>

      {/* Modal para escolher status */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha o novo status</Text>

            {['Em Andamento', 'Finalizado', 'Arquivado'].map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.statusOption,
                  status === option && styles.selectedOption,
                ]}
                onPress={() => alterarStatus(option)}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

            <TouchableOpacity
              style={[styles.button, { alignSelf: 'flex-end', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Seção Evidências */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Evidências</Text>

        {/* Botão Adicionar */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroEvidencia')}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>

        {/* Lista de Evidências */}
        {evidencias.map((evidencia) => (
          <View key={evidencia.id} style={styles.evidenceCard}>
            <Text style={styles.evidenceTitle}>
              <Text style={styles.evidenceId}>#{evidencia.id}</Text> {evidencia.titulo}
            </Text>

            <View style={styles.evidenceInfoRow}>
              <MaterialIcons name="date-range" size={16} color="#555" />
              <Text style={styles.evidenceInfoText}>{evidencia.data}</Text>
              <FontAwesome5 name="image" size={14} color="#555" style={{ marginLeft: 12 }} />
              <Text style={styles.evidenceInfoText}>{evidencia.tipo}</Text>
            </View>

            {/* Botão Gerar Laudo com componente GerarLaudoPdf */}
            <View style={styles.buttonRowEvidence}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#6B0D0D', flex: 1 }]}
                onPress={() => {
                  navigation.navigate('CadastroEvidencia', { evidencia, editar: true });
                }}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#B00020', flex: 1 }]}
                onPress={() => {
                  Alert.alert(
                    'Excluir Evidência',
                    'Tem certeza que deseja excluir esta evidência?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Excluir',
                        style: 'destructive',
                        onPress: () => {
                          setEvidencias((prev) => prev.filter((e) => e.id !== evidencia.id));
                        },
                      },
                    ]
                  );
                }}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <GerarLaudoPdf evidencia={evidencia} />
              </View>
            </View>


          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  caseId: {
    backgroundColor: '#F3E8E8',
    color: '#6B0D0D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  status: {
    backgroundColor: '#E7D6B3',
    color: '#6B0D0D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },
  description: {
    color: '#444',
    marginBottom: 4,
    lineHeight: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#6B0D0D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#6B0D0D',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  evidenceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },
  evidenceTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  evidenceId: {
    backgroundColor: '#F3E8E8',
    color: '#6B0D0D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    marginRight: 6,
  },
  evidenceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  evidenceInfoText: {
    marginLeft: 4,
    marginRight: 10,
    color: '#555',
    fontSize: 14,
  },
  reportButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#B77A7A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6B0D0D',
  },
  statusOption: {
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6B0D0D',
    marginBottom: 10,
    alignItems: 'center',
  },
  statusOptionText: {
    color: '#6B0D0D',
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#6B0D0D',
  },
  selectedOptionText: {
    color: '#fff',
  },
  buttonRowEvidence: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10, // Se não funcionar, use marginRight/marginLeft nos botões
  },

});
