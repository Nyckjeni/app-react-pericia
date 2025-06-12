import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroEvidenciaScreen({ navigation, route }) {
  const { caseId } = route.params;

  const [dataColeta, setDataColeta] = useState(new Date());
  const [hora, setHora] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagem, setImagem] = useState(null);
  const [arquivo, setArquivo] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const salvarEvidencia = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      alert('Você precisa estar logado para cadastrar uma evidência.');
      return;
    }

    const formData = new FormData();
    formData.append('case', caseId);
    formData.append('collectionDate', dataColeta.toISOString().split('T')[0]);
    formData.append('collectionTime', hora || '');
    formData.append('description', descricao);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    if (imagem?.assets?.[0]) {
      const img = imagem.assets[0];
      formData.append('imageFile', {
        uri: img.uri,
        name: img.fileName || 'imagem.jpg',
        type: img.type || 'image/jpeg',
      });
    }

    if (arquivo?.uri) {
      formData.append('arquivo', {
        uri: arquivo.uri,
        name: arquivo.name || 'arquivo',
        type: arquivo.mimeType || 'application/octet-stream',
      });
    }

    try {
      const response = await fetch('https://dentcase-backend.onrender.com/api/evidences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const resText = await response.text();

      let resData;
      try {
        resData = JSON.parse(resText);
      } catch {
        console.error('Resposta inválida do servidor:', resText);
        throw new Error('Resposta inesperada do servidor.');
      }

      if (response.ok) {
        alert('Evidência salva com sucesso!');
        navigation.goBack();
      } else {
        alert('Erro ao salvar evidência: ' + resData.message);
      }
    } catch (err) {
      console.error('Erro ao salvar evidência:', err);
      alert('Erro de conexão. Tente novamente.');
    }
  };

  const usarMinhaLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão negada para acessar localização');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
  };

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImagem(result);
    }
  };

  const escolherArquivo = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setArquivo(result);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Evidência</Text>

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text>Data da coleta:</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{dataColeta.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text>Hora:</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>{hora || '--:--'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dataColeta}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDataColeta(selectedDate);
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const h = selectedTime.getHours().toString().padStart(2, '0');
              const m = selectedTime.getMinutes().toString().padStart(2, '0');
              setHora(`${h}:${m}`);
            }
          }}
        />
      )}

      <Text>Descrição:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text>Localização:</Text>
      <TextInput placeholder="Latitude" value={latitude} onChangeText={setLatitude} style={styles.input} />
      <TextInput placeholder="Longitude" value={longitude} onChangeText={setLongitude} style={styles.input} />
      <TouchableOpacity style={styles.localButton} onPress={usarMinhaLocalizacao}>
        <Text style={{ color: '#fff' }}>📍 Usar Minha Localização</Text>
      </TouchableOpacity>

      <Text>Imagem:</Text>
      <TouchableOpacity style={styles.input} onPress={escolherImagem}>
        <Text>{imagem?.assets?.[0]?.fileName || 'Selecionar imagem'}</Text>
      </TouchableOpacity>

      <Text>Arquivo:</Text>
      <TouchableOpacity onPress={escolherArquivo} style={styles.input}>
        <Text>{arquivo ? arquivo.name : 'Nenhum arquivo escolhido'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={salvarEvidencia}>
        <Text style={styles.saveButtonText}>Salvar Evidência</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    color: '#6B0D0D',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  localButton: {
    backgroundColor: '#6B0D0D',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6B0D0D',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
