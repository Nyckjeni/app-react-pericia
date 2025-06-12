import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BottomNavbar from '../components/BottomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function CadastrarCaso({ navigation }) {
  const [casoId, setCasoId] = useState('');
  const [status, setStatus] = useState('em andamento');
  const [descricao, setDescricao] = useState('');
  const [token, setToken] = useState('');

  // Dados da vítima/paciente
  const [nomeVitima, setNomeVitima] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [genero, setGenero] = useState('');
  const [documentoId, setDocumentoId] = useState('');
  const [contato, setContato] = useState('');

  // Localização geográfica
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [estadoId, setEstadoId] = useState('');
  const [municipioSelecionado, setMunicipioSelecionado] = useState('');

  // Informações do incidente
  const [dataIncidente, setDataIncidente] = useState('');
  const [horaIncidente, setHoraIncidente] = useState('');
  const [localIncidente, setLocalIncidente] = useState('');
  const [descricaoIncidente, setDescricaoIncidente] = useState('');
  const [instrumento, setInstrumento] = useState('');

  // Classificação
  const [tipoCaso, setTipoCaso] = useState('');
  const [vitimaIdentificada, setVitimaIdentificada] = useState('');
  const [regioesLesionadas, setRegioesLesionadas] = useState({
    cabeça: false,
    mandíbula: false,
    dentes: false,
  });

  // Gera ID do caso, carrega token e estados
  useEffect(() => {
    (async () => {
      const idAleatorio = Math.floor(1000 + Math.random() * 9000);
      setCasoId(`CASO-${idAleatorio}`);

      try {
        const userToken = await AsyncStorage.getItem('accessToken'); // Corrigido para 'accessToken'
        console.log('Token recuperado:', userToken);
        if (userToken) {
          setToken(userToken);
        } else {
          Alert.alert('Erro', 'Token de acesso não encontrado. Faça login novamente.');
          navigation.navigate('Login');
        }
      } catch (err) {
        console.error('Erro ao buscar token:', err);
        Alert.alert('Erro', 'Erro ao verificar autenticação.');
      }

      await carregarEstados();
    })();
  }, [navigation]);

  const carregarEstados = async () => {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const estadosData = await response.json();
      const estadosOrdenados = estadosData.sort((a, b) => a.nome.localeCompare(b.nome));
      setEstados(estadosOrdenados);
    } catch (error) {
      console.error('Erro ao carregar estados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os estados');
    }
  };

  const carregarMunicipios = async (ufId) => {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`);
      const municipiosData = await response.json();
      const municipiosOrdenados = municipiosData.sort((a, b) => a.nome.localeCompare(b.nome));
      setMunicipios(municipiosOrdenados);
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os municípios');
    }
  };

  const handleEstadoChange = (estadoId) => {
    setEstadoId(estadoId);
    const estadoEncontrado = estados.find(e => e.id.toString() === estadoId);
    if (estadoEncontrado) {
      setEstadoSelecionado(estadoEncontrado.nome);
      setMunicipioSelecionado('');
      carregarMunicipios(estadoId);
    }
  };

  const formatarDataInput = (texto, setData) => {
    const nums = texto.replace(/\D/g, '');
    let out = nums;
    if (nums.length >= 3) out = `${nums.slice(0, 2)}/${nums.slice(2, 4)}`;
    if (nums.length >= 5) out += `/${nums.slice(4, 8)}`;
    setData(out);
  };

  const formatarHoraInput = (texto, setHora) => {
    const nums = texto.replace(/\D/g, '');
    let out = nums;
    if (nums.length >= 3) out = `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
    setHora(out);
  };

  const validarData = data => /^\d{2}\/\d{2}\/\d{4}$/.test(data);
  const validarHora = hora => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora);

  // Converter data DD/MM/AAAA para AAAA-MM-DD
  const formatarDataParaBackend = dataString => {
    if (!dataString) return '';
    const partes = dataString.split('/');
    if (partes.length !== 3) return '';
    const dia = partes[0].padStart(2, '0');
    const mes = partes[1].padStart(2, '0');
    const ano = partes[2];
    return `${ano}-${mes}-${dia}`;
  };

  // Converter data e hora para formato datetime-local do backend
  const formatarDataHoraParaBackend = (data, hora) => {
    if (!data) return '';
    const dataFormatada = formatarDataParaBackend(data);
    if (!dataFormatada) return '';

    if (hora) {
      return `${dataFormatada}T${hora}:00`;
    }
    return `${dataFormatada}T00:00:00`;
  };

  const obterLocalizacao = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão para acessar localização foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const endereco = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (endereco.length > 0) {
        const primeiroEndereco = endereco[0];
        const enderecoFormatado = [
          primeiroEndereco.street,
          primeiroEndereco.streetNumber,
          primeiroEndereco.district,
          primeiroEndereco.city,
          primeiroEndereco.region,
          primeiroEndereco.country
        ].filter(Boolean).join(', ');

        setLocalIncidente(enderecoFormatado);

        if (primeiroEndereco.region) {
          const estadoEncontrado = estados.find(e =>
            e.nome.toLowerCase().includes(primeiroEndereco.region.toLowerCase()) ||
            e.sigla.toLowerCase() === primeiroEndereco.region.toLowerCase()
          );
          if (estadoEncontrado) {
            setEstadoId(estadoEncontrado.id.toString());
            setEstadoSelecionado(estadoEncontrado.nome);
            await carregarMunicipios(estadoEncontrado.id);

            if (primeiroEndereco.city) {
              setMunicipioSelecionado(primeiroEndereco.city);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter a localização');
    }
  };

  const handleSubmit = async () => {
    // Validações obrigatórias
    if (!descricao.trim()) {
      return Alert.alert('Erro', 'Descrição do caso é obrigatória');
    }

    if (!nomeVitima.trim()) {
      return Alert.alert('Erro', 'Nome do paciente é obrigatório');
    }

    if (!dataNascimento.trim() || !validarData(dataNascimento)) {
      return Alert.alert('Erro', 'Data de nascimento deve estar no formato DD/MM/AAAA');
    }

    if (!genero) {
      return Alert.alert('Erro', 'Gênero é obrigatório');
    }

    if (!documentoId.trim()) {
      return Alert.alert('Erro', 'Documento de identidade é obrigatório');
    }

    if (!estadoId) {
      return Alert.alert('Erro', 'Estado é obrigatório');
    }

    if (!municipioSelecionado) {
      return Alert.alert('Erro', 'Município é obrigatório');
    }

    if (!dataIncidente.trim() || !validarData(dataIncidente)) {
      return Alert.alert('Erro', 'Data do incidente deve estar no formato DD/MM/AAAA');
    }

    if (horaIncidente && !validarHora(horaIncidente)) {
      return Alert.alert('Erro', 'Hora do incidente deve estar no formato HH:MM');
    }

    if (!localIncidente.trim()) {
      return Alert.alert('Erro', 'Local do incidente é obrigatório');
    }

    if (!descricaoIncidente.trim()) {
      return Alert.alert('Erro', 'Descrição do incidente é obrigatória');
    }

    if (!tipoCaso) {
      return Alert.alert('Erro', 'Tipo do caso é obrigatório');
    }

    if (!vitimaIdentificada) {
      return Alert.alert('Erro', 'Identificação da vítima é obrigatória');
    }

    const regioesArray = Object.entries(regioesLesionadas)
      .filter(([_, selecionado]) => selecionado)
      .map(([regiao]) => regiao);

    if (regioesArray.length === 0) {
      return Alert.alert('Erro', 'Selecione pelo menos uma região lesionada');
    }

    if (!token) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return navigation.navigate('Login');
    }

    // Preparar payload exatamente como no web (new-case.js)
    const caseData = {
      caseId: casoId,
      status: status,
      description: descricao,
      patientName: nomeVitima,
      patientDOB: formatarDataParaBackend(dataNascimento), // Formato: AAAA-MM-DD
      patientGender: genero,
      patientID: documentoId,
      patientContact: contato || '',
      estado: estadoId, // Enviando o ID do estado como no web
      bairro: municipioSelecionado, // Nome do município
      incidentDate: formatarDataHoraParaBackend(dataIncidente, horaIncidente), // Formato: AAAA-MM-DDTHH:MM:SS
      incidentLocation: localIncidente,
      incidentDescription: descricaoIncidente,
      incidentWeapon: instrumento || '',
      caseType: tipoCaso,
      identified: vitimaIdentificada,
      injuryRegions: regioesArray
    };

    console.log('Payload sendo enviado:', JSON.stringify(caseData, null, 2));

    try {
      const response = await fetch('https://dentcase-backend.onrender.com/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(caseData),
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro detalhado do servidor:', errorText);

        let errorMessage = 'Erro ao cadastrar o caso';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.msg || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }

        if (response.status === 401) {
          Alert.alert('Sessão expirada', 'Por favor, faça login novamente.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ]);
          return;
        }

        throw new Error(errorMessage);
      }

      const resultado = await response.json();
      console.log('Caso criado com sucesso:', resultado);

      Alert.alert('Sucesso', 'Caso cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Casos') }
      ]);


      resetarFormulario();

    } catch (err) {
      console.error('Erro completo no cadastro:', err);
      Alert.alert('Erro', err.message || 'Erro de conexão com o servidor.');
    }
  };

  const resetarFormulario = () => {
    const novoId = Math.floor(1000 + Math.random() * 9000);
    setCasoId(`CASO-${novoId}`);
    setStatus('em andamento');
    setDescricao('');
    setNomeVitima('');
    setDataNascimento('');
    setGenero('');
    setDocumentoId('');
    setContato('');
    setEstadoSelecionado('');
    setEstadoId('');
    setMunicipioSelecionado('');
    setDataIncidente('');
    setHoraIncidente('');
    setLocalIncidente('');
    setDescricaoIncidente('');
    setInstrumento('');
    setTipoCaso('');
    setVitimaIdentificada('');
    setRegioesLesionadas({ cabeça: false, mandíbula: false, dentes: false });
    setMunicipios([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.header}>Cadastrar Novo Caso</Text>

        {/* Informações do Caso */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Caso</Text>

          <Text style={styles.label}>ID do Caso</Text>
          <TextInput value={casoId} editable={false} style={styles.inputDisabled} />
          <Text style={styles.info}>Gerado automaticamente pelo sistema</Text>

          <Text style={styles.label}>Status*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={styles.picker}
            >
              <Picker.Item label="Em Andamento" value="em andamento" />
              <Picker.Item label="Finalizado" value="finalizado" />
              <Picker.Item label="Arquivado" value="arquivado" />
            </Picker>
          </View>

          <Text style={styles.label}>Descrição Detalhada do Caso*</Text>
          <TextInput
            multiline
            numberOfLines={5}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o caso com detalhes relevantes..."
            style={styles.textArea}
          />
        </View>

        {/* Informações do Paciente */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Paciente</Text>

          <Text style={styles.label}>Nome do Paciente*</Text>
          <TextInput
            style={styles.input}
            value={nomeVitima}
            onChangeText={setNomeVitima}
            placeholder="Nome completo"
          />

          <Text style={styles.label}>Data de Nascimento*</Text>
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={val => formatarDataInput(val, setDataNascimento)}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.label}>Gênero*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genero}
              onValueChange={setGenero}
              style={styles.picker}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Feminino" value="feminino" />
              <Picker.Item label="Outro" value="outro" />
            </Picker>
          </View>

          <Text style={styles.label}>Documento de Identidade*</Text>
          <TextInput
            style={styles.input}
            value={documentoId}
            onChangeText={setDocumentoId}
            placeholder="RG, CPF ou outro documento"
          />

          <Text style={styles.label}>Contato do Paciente</Text>
          <TextInput
            style={styles.input}
            value={contato}
            onChangeText={setContato}
            placeholder="Telefone ou email"
            keyboardType="phone-pad"
          />
        </View>

        {/* Localização Geográfica */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Localização Geográfica</Text>

          <Text style={styles.label}>Estado*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={estadoId}
              onValueChange={handleEstadoChange}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um estado" value="" />
              {estados.map(estado => (
                <Picker.Item
                  key={estado.id}
                  label={estado.nome}
                  value={estado.id.toString()}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Município*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={municipioSelecionado}
              onValueChange={setMunicipioSelecionado}
              style={styles.picker}
              enabled={municipios.length > 0}
            >
              <Picker.Item
                label={estadoId ? "Selecione o município" : "Selecione um estado primeiro"}
                value=""
              />
              {municipios.map(municipio => (
                <Picker.Item
                  key={municipio.id}
                  label={municipio.nome}
                  value={municipio.nome}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Informações do Incidente */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Incidente</Text>

          <Text style={styles.label}>Data do Incidente*</Text>
          <TextInput
            value={dataIncidente}
            onChangeText={val => formatarDataInput(val, setDataIncidente)}
            placeholder="DD/MM/AAAA"
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.label}>Hora do Incidente</Text>
          <TextInput
            value={horaIncidente}
            onChangeText={val => formatarHoraInput(val, setHoraIncidente)}
            placeholder="HH:MM"
            style={styles.input}
            keyboardType="numeric"
            maxLength={5}
          />

          <Text style={styles.label}>Local do Incidente*</Text>
          <TextInput
            value={localIncidente}
            onChangeText={setLocalIncidente}
            placeholder="Ex: Rua das Flores, nº 123"
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            onPress={obterLocalizacao}
            style={[styles.button, { backgroundColor: '#6B0D0D', marginBottom: 10 }]}
          >
            <Text style={styles.buttonText}>📍 Usar Minha Localização</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Descrição do Incidente*</Text>
          <TextInput
            multiline
            numberOfLines={5}
            value={descricaoIncidente}
            onChangeText={setDescricaoIncidente}
            placeholder="Descreva o incidente..."
            style={styles.textArea}
          />

          <Text style={styles.label}>Instrumento/Arma (opcional)</Text>
          <TextInput
            value={instrumento}
            onChangeText={setInstrumento}
            placeholder="Ex: faca, arma de fogo, etc."
            style={styles.input}
          />
        </View>

        {/* Classificação */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Classificação</Text>

          <Text style={styles.label}>Tipo do Caso*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoCaso}
              onValueChange={setTipoCaso}
              style={styles.picker}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Acidente" value="acidente" />
              <Picker.Item label="Morte" value="morte" />
            </Picker>
          </View>

          <Text style={styles.label}>Vítima Identificada?*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vitimaIdentificada}
              onValueChange={setVitimaIdentificada}
              style={styles.picker}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>

          <Text style={styles.label}>Regiões Lesionadas*</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {['cabeça', 'mandíbula', 'dentes'].map(key => (
              <TouchableOpacity
                key={key}
                style={[styles.checkbox, regioesLesionadas[key] && styles.checkboxSelected]}
                onPress={() => setRegioesLesionadas(prev => ({ ...prev, [key]: !prev[key] }))}
              >
                <Text style={[styles.checkboxLabel, regioesLesionadas[key] && { color: 'white' }]}>
                  {key === 'cabeça' ? 'Cabeça' : key === 'mandíbula' ? 'Mandíbula' : 'Dentes'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={resetarFormulario}
            style={[styles.button, { backgroundColor: '#666' }]}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Salvar Caso</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavbar navigation={navigation} />
    </View>
  );
}

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B0D0D',
    marginBottom: 16,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#6B0D0D',
    paddingBottom: 5
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    color: '#444'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginTop: 4,
    backgroundColor: 'white',
    fontSize: 16
  },
  inputDisabled: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginTop: 4,
    fontSize: 16,
    color: '#666'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginTop: 4,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    minHeight: 100,
    fontSize: 16
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#6B0D0D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3,
    flex: 1,
    marginHorizontal: 4
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  info: {
    fontSize: 12,
    color: '#777',
    marginTop: 4
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  checkboxSelected: {
    backgroundColor: '#6B0D0D',
    borderColor: '#6B0D0D'
  },
  checkboxLabel: {
    fontWeight: 'bold',
    color: '#333'
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  }
};