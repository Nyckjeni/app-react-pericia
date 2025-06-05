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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function CadastrarCaso({ navigation }) {
  const [casoId, setCasoId] = useState('');
  const [status, setStatus] = useState('Em Andamento');
  const [descricao, setDescricao] = useState('');

  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [dataIncidente, setDataIncidente] = useState('');
  const [localIncidente, setLocalIncidente] = useState('');
  const [descricaoIncidente, setDescricaoIncidente] = useState('');
  const [instrumento, setInstrumento] = useState('');
  const [tipoCaso, setTipoCaso] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [vitimaIdentificada, setVitimaIdentificada] = useState('');
  const [regioesLesionadas, setRegioesLesionadas] = useState({
    cabeca: false,
    mandibula: false,
    dentes: false,
  });

  const [vitimas, setVitimas] = useState([
    {
      id: Date.now(),
      nic: '',
      nome: '',
      dataNascimento: '',
      idade: '',
      genero: '',
      documento: '',
      contato: '',
      endereco: '',
      corEtnia: '',
    },
  ]);

  useEffect(() => {
    const gerarIdAleatorio = () => {
      const idAleatorio = Math.floor(1000 + Math.random() * 9000);
      setCasoId(`CASO-${idAleatorio}`);
    };
    gerarIdAleatorio();
  }, []);

  const adicionarVitima = () => {
    setVitimas((prev) => [
      ...prev,
      {
        id: Date.now(),
        nic: '',
        nome: '',
        dataNascimento: '',
        idade: '',
        genero: '',
        documento: '',
        contato: '',
        endereco: '',
        corEtnia: '',
      },
    ]);
  };

  const removerVitima = (id) => {
    setVitimas((prev) => prev.filter((v) => v.id !== id));
  };

  const atualizarVitima = (id, campo, valor) => {
    setVitimas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [campo]: valor } : v))
    );
  };

  const handleSubmit = async () => {
    if (
      !descricao.trim() ||
      vitimas.some(
        (v) =>
          !v.nome ||
          !v.idade ||
          !v.documento ||
          !v.nic ||
          !v.endereco ||
          !v.corEtnia
      )
    ) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos obrigatórios das vítimas e descrição do caso.'
      );
      return;
    }

    const dadosCaso = {
      casoId,
      status,
      descricao,
      estado,
      municipio,
      dataIncidente,
      localIncidente,
      descricaoIncidente,
      instrumento,
      tipoCaso,
      vitimaIdentificada,
      regioesLesionadas,
      vitimas,
    };

    try {
      const response = await fetch('http://192.168.0.124:3000/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosCaso),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Caso cadastrado com sucesso!');
        setDescricao('');
        setVitimas([
          {
            id: Date.now(),
            nic: '',
            nome: '',
            dataNascimento: '',
            idade: '',
            genero: '',
            documento: '',
            contato: '',
            endereco: '',
            corEtnia: '',
          },
        ]);
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.message || 'Erro ao cadastrar o caso.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
      console.error('Erro ao enviar dados:', error);
    }
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
          <Text style={styles.info}>Gerado automaticamente</Text>

          <Text style={styles.label}>Status*</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
              <Picker.Item label="Em Andamento" value="Em Andamento" />
              <Picker.Item label="Finalizado" value="Finalizado" />
              <Picker.Item label="Arquivado" value="Arquivado" />
            </Picker>
          </View>

          <Text style={styles.label}>Descrição Detalhada do Caso*</Text>
          <TextInput
            multiline
            numberOfLines={5}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o caso..."
            style={styles.textArea}
          />
        </View>

        {vitimas.map((vitima, index) => (
          <View key={vitima.id} style={styles.card}>
            <Text style={styles.sectionTitle}>Informações da Vítima {index + 1}</Text>

            <Text style={styles.label}>NIC*</Text>
            <TextInput
              style={styles.input}
              value={vitima.nic}
              onChangeText={(val) => atualizarVitima(vitima.id, 'nic', val)}
            />

            <Text style={styles.label}>Nome*</Text>
            <TextInput
              style={styles.input}
              value={vitima.nome}
              onChangeText={(val) => atualizarVitima(vitima.id, 'nome', val)}
            />

            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput
              style={styles.input}
              value={vitima.dataNascimento}
              onChangeText={(val) =>
                atualizarVitima(vitima.id, 'dataNascimento', val)
              }
            />

            <Text style={styles.label}>Idade*</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={vitima.idade}
              onChangeText={(val) => atualizarVitima(vitima.id, 'idade', val)}
            />

            <Text style={styles.label}>Gênero</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={vitima.genero}
                onValueChange={(val) =>
                  atualizarVitima(vitima.id, 'genero', val)
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Feminino" value="Feminino" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>

            <Text style={styles.label}>Documento*</Text>
            <TextInput
              style={styles.input}
              value={vitima.documento}
              onChangeText={(val) => atualizarVitima(vitima.id, 'documento', val)}
            />

            <Text style={styles.label}>Contato</Text>
            <TextInput
              style={styles.input}
              value={vitima.contato}
              onChangeText={(val) => atualizarVitima(vitima.id, 'contato', val)}
            />

            <Text style={styles.label}>Endereço*</Text>
            <TextInput
              style={styles.input}
              value={vitima.endereco}
              onChangeText={(val) => atualizarVitima(vitima.id, 'endereco', val)}
            />

            <Text style={styles.label}>Cor/Etnia*</Text>
            <TextInput
              style={styles.input}
              value={vitima.corEtnia}
              onChangeText={(val) => atualizarVitima(vitima.id, 'corEtnia', val)}
            />

            {vitimas.length > 1 && (
              <TouchableOpacity
                onPress={() => removerVitima(vitima.id)}
                style={[styles.button, { backgroundColor: '#B00020' }]}
              >
                <Text style={styles.buttonText}>Remover Vítima</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={adicionarVitima} style={styles.button}>
          <Text style={styles.buttonText}>Adicionar Nova Vítima</Text>
        </TouchableOpacity>

        {/* Localização Geográfica */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Localização Geográfica</Text>
          <Text style={styles.label}>Estado*</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o estado"
            value={estado}
            onChangeText={setEstado}
          />
          <Text style={styles.label}>Município*</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o município"
            value={municipio}
            onChangeText={setMunicipio}
          />
        </View>

       


        {/* Nova seção: Classificação */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Classificação</Text>

          <Text style={styles.label}>Tipo de Caso</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={tipoCaso} onValueChange={setTipoCaso} style={styles.picker}>
              <Picker.Item label="Selecione o tipo" value="" />
              <Picker.Item label="Homicídio" value="Homicídio" />
              <Picker.Item label="Violência Doméstica" value="Violência Doméstica" />
              <Picker.Item label="Acidente" value="Acidente" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
          </View>

          <Text style={styles.label}>Identificação da Vítima</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vitimaIdentificada}
              onValueChange={setVitimaIdentificada}
              style={styles.picker}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Identificada" value="Identificada" />
              <Picker.Item label="Não Identificada" value="Não Identificada" />
            </Picker>
          </View>

          <Text style={styles.label}>Regiões Lesionadas</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.checkbox, regioesLesionadas.cabeca && styles.checkboxSelected]}
              onPress={() =>
                setRegioesLesionadas((prev) => ({ ...prev, cabeca: !prev.cabeca }))
              }
            >
              <Text style={styles.checkboxLabel}>Cabeça</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkbox, regioesLesionadas.mandibula && styles.checkboxSelected]}
              onPress={() =>
                setRegioesLesionadas((prev) => ({ ...prev, mandibula: !prev.mandibula }))
              }
            >
              <Text style={styles.checkboxLabel}>Mandíbula</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkbox, regioesLesionadas.dentes && styles.checkboxSelected]}
              onPress={() =>
                setRegioesLesionadas((prev) => ({ ...prev, dentes: !prev.dentes }))
              }
            >
              <Text style={styles.checkboxLabel}>Dentes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de envio */}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Salvar Caso</Text>
        </TouchableOpacity>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 4,
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 4,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#6B0D0D',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
    color: '#777',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#6B0D0D',
  },
  checkboxLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
};
