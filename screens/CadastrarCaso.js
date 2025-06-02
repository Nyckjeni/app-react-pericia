import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BottomNavbar from '../components/BottomNavbar';
import Odontograma from '../components/Odontograma';


export default function CadastrarCaso({ navigation }) {
  const [casoId, setCasoId] = useState('');
  const [status, setStatus] = useState('Em Andamento');
  const [descricao, setDescricao] = useState('');
  const [nic, setNic] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [idade, setIdade] = useState('');
  const [genero, setGenero] = useState('');
  const [documento, setDocumento] = useState('');
  const [contato, setContato] = useState('');
  const [endereco, setEndereco] = useState('');
  const [corEtnia, setCorEtnia] = useState('');

  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [dataIncidente, setDataIncidente] = useState('');
  const [localIncidente, setLocalIncidente] = useState('');
  const [descricaoIncidente, setDescricaoIncidente] = useState('');
  const [instrumento, setInstrumento] = useState('');
  const [tipoCaso, setTipoCaso] = useState('');
  const [vitimaIdentificada, setVitimaIdentificada] = useState('');
  const [regioesLesionadas, setRegioesLesionadas] = useState({ cabeca: false, mandibula: false, dentes: false });
  const [dentesMarcados, setDentesMarcados] = useState({});


  useEffect(() => {
    const gerarIdAleatorio = () => {
      const idAleatorio = Math.floor(1000 + Math.random() * 9000);
      setCasoId(`CASO-${idAleatorio}`);
    };
    gerarIdAleatorio();
  }, []);

  const handleSubmit = () => {
    if (!descricao.trim() || !nome || !dataNascimento || !idade || !genero || !documento || !nic || !endereco || !corEtnia) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const dadosCaso = {
      casoId,
      status,
      descricao,
      nic,
      nome,
      dataNascimento,
      idade,
      genero,
      documento,
      contato,
      endereco,
      corEtnia,
      estado,
      municipio,
      dataIncidente,
      localIncidente,
      descricaoIncidente,
      instrumento,
      tipoCaso,
      vitimaIdentificada,
      regioesLesionadas,
    };

    console.log('Caso cadastrado:', dadosCaso);
    Alert.alert('Sucesso', 'Caso cadastrado com sucesso!');
    setDescricao('');
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Novo Caso</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Caso</Text>
          <Text style={styles.label}>ID do Caso</Text>
          <TextInput value={casoId} editable={false} style={styles.inputDisabled} />
          <Text style={styles.info}>Gerado automaticamente pelo sistema</Text>

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
            placeholder="Descreva o caso com detalhes relevantes..."
            style={styles.textArea}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Paciente</Text>
          <Text style={styles.label}>NIC*</Text>
          <TextInput style={styles.input} value={nic} onChangeText={setNic} placeholder="Número de Identificação do Caso" />

          <Text style={styles.label}>Nome do Paciente*</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite o nome completo" />

          <Text style={styles.label}>Data de Nascimento*</Text>
          <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="dd/mm/aaaa" />

          <Text style={styles.label}>Idade*</Text>
          <TextInput style={styles.input} value={idade} onChangeText={setIdade} placeholder="Digite a idade" keyboardType="numeric" />

          <Text style={styles.label}>Gênero*</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={genero} onValueChange={setGenero} style={styles.picker}>
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Feminino" value="Feminino" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
          </View>

          <Text style={styles.label}>Documento de Identidade*</Text>
          <TextInput style={styles.input} value={documento} onChangeText={setDocumento} placeholder="Número do documento" />

          <Text style={styles.label}>Contato do Paciente</Text>
          <TextInput style={styles.input} value={contato} onChangeText={setContato} placeholder="Telefone ou outro meio de contato" />

          <Text style={styles.label}>Endereço*</Text>
          <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número, bairro, cidade" />

          <Text style={styles.label}>Cor/Etnia*</Text>
          <TextInput style={styles.input} value={corEtnia} onChangeText={setCorEtnia} placeholder="Informe a cor ou etnia" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Localização Geográfica</Text>
          <Text style={styles.label}>Estado*</Text>
          <TextInput style={styles.input} value={estado} onChangeText={setEstado} placeholder="Estado" />

          <Text style={styles.label}>Município*</Text>
          <TextInput style={styles.input} value={municipio} onChangeText={setMunicipio} placeholder="Município" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações do Incidente</Text>
          <Text style={styles.label}>Data do Incidente*</Text>
          <TextInput style={styles.input} value={dataIncidente} onChangeText={setDataIncidente} placeholder="dd/mm/aaaa --:--" />

          <Text style={styles.label}>Local do Incidente*</Text>
          <TextInput style={styles.input} value={localIncidente} onChangeText={setLocalIncidente} placeholder="Local do Incidente" />

          <Text style={styles.label}>Descrição do Incidente*</Text>
          <TextInput style={styles.textArea} multiline numberOfLines={4} value={descricaoIncidente} onChangeText={setDescricaoIncidente} placeholder="Descreva o que aconteceu..." />

          <Text style={styles.label}>Instrumento/Arma (opcional)</Text>
          <TextInput style={styles.input} value={instrumento} onChangeText={setInstrumento} placeholder="Descreva se houver algum instrumento" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Classificação</Text>

          <Text style={styles.label}>Tipo do Caso*</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={tipoCaso} onValueChange={setTipoCaso} style={styles.picker}>
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Físico" value="Fisico" />
              <Picker.Item label="Psicológico" value="Psicologico" />
              <Picker.Item label="Outro" value="Outro" />
             

            </Picker>
          </View>

           <Odontograma />

          <Text style={styles.label}>Vítima Identificada?*</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={vitimaIdentificada} onValueChange={setVitimaIdentificada} style={styles.picker}>
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Sim" value="Sim" />
              <Picker.Item label="Não" value="Não" />
            </Picker>
          </View>

          <Text style={styles.label}>Regiões Lesionadas*</Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            {['cabeca', 'mandibula', 'dentes'].map((regiao) => (
              <TouchableOpacity
                key={regiao}
                onPress={() => setRegioesLesionadas({ ...regioesLesionadas, [regiao]: !regioesLesionadas[regiao] })}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, borderWidth: 1, marginRight: 6, backgroundColor: regioesLesionadas[regiao] ? '#6B0D0D' : '#fff' }} />
                <Text>{regiao.charAt(0).toUpperCase() + regiao.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar Caso</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavbar navigation={navigation} activeRoute="Casos" onAddPress={() => navigation.navigate('CadastrarCaso')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6B0D0D', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#6B0D0D', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 20, elevation: 3 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4, fontSize: 16 },
  input: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 4, fontSize: 16 },
  inputDisabled: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 4, fontSize: 16 },
  info: { fontSize: 12, color: '#888', marginTop: 4 },
  pickerContainer: { borderRadius: 4, backgroundColor: '#f0f0f0' },
  picker: { height: 50, width: '100%' },
  textArea: { backgroundColor: '#f0f0f0', textAlignVertical: 'top', padding: 10, borderRadius: 4, fontSize: 16 },
  button: { backgroundColor: '#6B0D0D', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});