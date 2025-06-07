import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function GerarRelatorioPdf({ caso, status }) {
  const mostrarCampo = (campo) => {
    if (campo === null || campo === undefined || campo === '') {
      return 'Não informado';
    }
    return campo;
  };

  const gerarRelatorioPDF = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1 style="color:#6B0D0D;">Relatório do Caso</h1>
          <p><strong>Título:</strong> ${mostrarCampo(caso.titulo)}</p>
          <p><strong>ID:</strong> ${mostrarCampo(caso.id || 'caso-001')}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Descrição:</strong> ${mostrarCampo(caso.descricao)}</p>
          <p><strong>Perito:</strong> ${mostrarCampo(caso.perito)}</p>
          <p><strong>Data de Abertura:</strong> ${mostrarCampo(caso.data)}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.botaoPDF} onPress={gerarRelatorioPDF}>
      <AntDesign name="pdffile1" size={24} color="#fff" />
      <Text style={styles.textoBotaoPDF}>Gerar Relatório</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
   botaoPDF: {
    backgroundColor: '#6B0D0D',  // mesma cor do botão padrão
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,  // se estiver usando React Native 0.71+, senão substitua por marginLeft no ícone
    marginBottom: 8,
  },
  textoBotaoPDF: {
    color: '#fff',
    fontSize: 14,
  },
});

