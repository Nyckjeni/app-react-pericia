import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';

const dentes = [
  '11', '12', '13', '14', '15', '16', '17', '18',
  '21', '22', '23', '24', '25', '26', '27', '28',
  '31', '32', '33', '34', '35', '36', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48'
];

export default function Odontograma({ odontograma = {}, onChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [denteSelecionado, setDenteSelecionado] = useState('');
  const [observacao, setObservacao] = useState('');

  // Abre modal e carrega observação do dente selecionado
  const abrirModal = (numero) => {
    setDenteSelecionado(numero);
    setObservacao(odontograma[numero] || '');
    setModalVisible(true);
  };

  // Salva a observação e notifica o pai via onChange
  const salvarObservacao = () => {
    const novoOdontograma = { ...odontograma };
    if (observacao.trim() === '') {
      // Remove o dente se a observação for apagada
      delete novoOdontograma[denteSelecionado];
    } else {
      novoOdontograma[denteSelecionado] = observacao.trim();
    }
    onChange && onChange(novoOdontograma);
    setModalVisible(false);
  };

  const renderLinha = (nums) => (
    <View style={styles.row}>
      {nums.map((numero) => (
        <TouchableOpacity
          key={numero}
          style={[styles.dente, odontograma[numero] ? styles.marcado : null]}
          onPress={() => abrirModal(numero)}
        >
          <Text style={[styles.denteText, odontograma[numero] ? styles.denteTextMarcado : null]}>{numero}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View>
      <Text style={styles.label}>Odontograma Interativo</Text>
      {renderLinha(dentes.slice(0, 8))}
      {renderLinha(dentes.slice(8, 16))}
      {renderLinha(dentes.slice(16, 24))}
      {renderLinha(dentes.slice(24, 32))}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Dente {denteSelecionado}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite uma observação..."
              value={observacao}
              onChangeText={setObservacao}
              multiline
            />
            <TouchableOpacity onPress={salvarObservacao} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>

            {/* Botão Cancelar */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: '#ccc', marginTop: 8 }]}
            >
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, marginTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dente: {
    width: 40, height: 40, borderRadius: 6,
    borderWidth: 1, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#fff'
  },
  denteText: { fontSize: 14, color: '#000' },
  denteTextMarcado: { color: '#fff' },
  marcado: { backgroundColor: '#6B0D0D' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' },
  modal: { width: '80%', backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: { backgroundColor: '#f0f0f0', borderRadius: 4, padding: 10, height: 100, textAlignVertical: 'top' },
  modalButton: { backgroundColor: '#6B0D0D', marginTop: 12, padding: 10, borderRadius: 6, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold' }
});
