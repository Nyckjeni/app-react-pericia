import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function GerarLaudoPdf({ evidencia }) {
  const gerarLaudo = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #6B0D0D; }
              p { margin: 10px 0; }
              .info { background: #f3f3f3; padding: 10px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1>Laudo de Evidência</h1>
            <div class="info">
              <p><strong>ID:</strong> ${evidencia.id}</p>
              <p><strong>Título:</strong> ${evidencia.titulo}</p>
              <p><strong>Descrição:</strong> ${evidencia.descricao}</p>
              <p><strong>Data:</strong> ${evidencia.data}</p>
              <p><strong>Tipo:</strong> ${evidencia.tipo}</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o laudo.');
      console.error(error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={gerarLaudo}>
      <Text style={styles.buttonText}>Gerar Laudo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B77A7A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
