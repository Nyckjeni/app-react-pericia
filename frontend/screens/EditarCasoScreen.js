import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Pressable,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function EditarCasoScreen({ route, navigation }) {
  const { caso, onCaseUpdated } = route.params;
  const [token, setToken] = useState('');

  const [formData, setFormData] = useState({
    caseId: '', status: 'em andamento', description: '',
    patientName: '', patientDOB: new Date(), patientAge: '', patientGender: 'masculino',
    patientID: '', patientContact: '', incidentDate: new Date(), incidentLocation: '',
    incidentDescription: '', incidentWeapon: '', estado: '', bairro: '', caseType: '',
    identified: true, injuryRegions: []
  });
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [showIncidentDatePicker, setShowIncidentDatePicker] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(tok => {
      if (tok) {
        setToken(tok);
        api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
      }
    });
    if (caso) {
      setFormData({
        caseId: caso.caseId || '', status: caso.status, description: caso.description,
        patientName: caso.patientName, patientDOB: new Date(caso.patientDOB),
        patientAge: caso.patientAge?.toString(), patientGender: caso.patientGender,
        patientID: caso.patientID, patientContact: caso.patientContact,
        incidentDate: new Date(caso.incidentDate), incidentLocation: caso.incidentLocation,
        incidentDescription: caso.incidentDescription, incidentWeapon: caso.incidentWeapon,
        estado: caso.estado, bairro: caso.bairro, caseType: caso.caseType,
        identified: caso.identified, injuryRegions: caso.injuryRegions || []
      });
    }
  }, [caso]);

  const statusOptions = [
    { value: 'em andamento', label: 'Em Andamento' },
    { value: 'finalizado', label: 'Finalizado' },
    { value: 'arquivado', label: 'Arquivado' }
  ];
  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' }
  ];
  const injuryRegionOptions = ['Cabeça', 'Mandíbula', 'Dentes'];

  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const calculateAge = bd => { const t = new Date(), b = new Date(bd); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };

  const onDOBChange = (_, d) => { setShowDOBPicker(false); if (d) { updateFormData('patientDOB', d); updateFormData('patientAge', calculateAge(d).toString()); } };
  const onIncidentDateChange = (_, d) => { setShowIncidentDatePicker(false); if (d) updateFormData('incidentDate', d); };
  const toggleInjuryRegion = rg => updateFormData('injuryRegions', formData.injuryRegions.includes(rg) ? formData.injuryRegions.filter(r => r !== rg) : [...formData.injuryRegions, rg]);

  const validateForm = () => {
    const req = ['description', 'patientName', 'patientGender', 'patientID', 'incidentLocation', 'incidentDescription'];
    for (let f of req) if (!formData[f] || !formData[f].toString().trim()) { Alert.alert('Erro', `Campo obrigatório.`); return false; }
    return true;
  };

  const salvarCaso = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const p = {
        ...formData,
        patientDOB: formData.patientDOB.toISOString().slice(0, 10),
        incidentDate: formData.incidentDate.toISOString(),
      };
      await api.put(`/cases/${caso._id}`, p);
      Alert.alert('Sucesso', 'Atualizado!', [{ text: 'OK', onPress: () => { onCaseUpdated?.({ ...caso, ...p }); navigation.goBack(); } }]);
    } catch (e) { console.error(e); Alert.alert('Erro', e.response?.data?.message || 'Falha'); }
    finally { setLoading(false); }
  };

  const fmt = d => d ? d.toLocaleDateString('pt-BR') : 'Selecionar';
  if (!caso) return <View style={[s.container, s.center]}><Text>Dados não encontrados</Text></View>;
  return <ScrollView style={s.container}>
    <View style={s.card}>
      <Text style={s.title}>Editar Caso</Text>
      <Text style={s.subtitle}>{formData.caseId}</Text>
      <TouchableOpacity style={s.statusButton} onPress={() => setStatusModalVisible(true)}>
        <Text>{statusOptions.find(o => o.value === formData.status)?.label}</Text><Ionicons name="chevron-down" size={16} />
      </TouchableOpacity>
      <TextInput style={[s.input, s.textArea]} multiline value={formData.description} onChangeText={t => updateFormData('description', t)} />
      <Text style={s.section}>Paciente</Text>
      <TextInput style={s.input} value={formData.patientName} onChangeText={t => updateFormData('patientName', t)} placeholder="Nome" />
      <TouchableOpacity style={s.dateButton} onPress={() => setShowDOBPicker(true)}><Text>{fmt(formData.patientDOB)}</Text></TouchableOpacity>
      <TextInput style={s.input} value={formData.patientAge} editable={false} />
      <Picker selectedValue={formData.patientGender} onValueChange={v => updateFormData('patientGender', v)}>
        {genderOptions.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
      </Picker>
      <TextInput style={s.input} value={formData.patientID} onChangeText={t => updateFormData('patientID', t)} placeholder="Documento" />
      <Text style={s.section}>Incidente</Text>
      <TouchableOpacity style={s.dateButton} onPress={() => setShowIncidentDatePicker(true)}><Text>{fmt(formData.incidentDate)}</Text></TouchableOpacity>
      <TextInput style={s.input} value={formData.incidentLocation} onChangeText={t => updateFormData('incidentLocation', t)} placeholder="Local" />
      <TextInput style={[s.input, s.textArea]} multiline value={formData.incidentDescription} onChangeText={t => updateFormData('incidentDescription', t)} />
      <TextInput style={s.input} value={formData.incidentWeapon} onChangeText={t => updateFormData('incidentWeapon', t)} placeholder="Arma" />
      <Text style={s.section}>Classificação</Text>
      <TextInput style={s.input} value={formData.caseType} onChangeText={t => updateFormData('caseType', t)} placeholder="Tipo" />
      <View style={s.row}><Text>Identificado</Text><Switch value={formData.identified} onValueChange={v => updateFormData('identified', v)} /></View>
      <View style={s.row}>{injuryRegionOptions.map(r => <TouchableOpacity key={r} style={[s.chip, formData.injuryRegions.includes(r) && s.chipSel]} onPress={() => toggleInjuryRegion(r)}><Text>{r}</Text></TouchableOpacity>)}</View>
      <View style={s.row}><TouchableOpacity style={s.btn} onPress={() => navigation.goBack()}><Text>Cancelar</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={salvarCaso}>{loading ? <ActivityIndicator /> : <Text>Salvar</Text>}</TouchableOpacity></View>
      {statusModalVisible && <Modal transparent><View style={s.modalBg}><View style={s.modal}><Text>Status</Text>{statusOptions.map(o => <Pressable key={o.value} onPress={() => { updateFormData('status', o.value); setStatusModalVisible(false); }}><Text>{o.label}</Text></Pressable>)}</View></View></Modal>}
      {showDOBPicker && <DateTimePicker mode="date" value={formData.patientDOB} maximumDate={new Date()} onChange={onDOBChange} />}
      {showIncidentDatePicker && <DateTimePicker mode="date" value={formData.incidentDate} maximumDate={new Date()} onChange={onIncidentDateChange} />}
    </View>
  </ScrollView>;
}

const s = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f3f3f3' }, center: { justifyContent: 'center', alignItems: 'center' }, card: { margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8 }, title: { fontSize: 20, fontWeight: 'bold' }, subtitle: { fontSize: 16, marginBottom: 8 }, statusButton: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#eee', borderRadius: 4 }, input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginVertical: 4 }, textArea: { height: 80 }, dateButton: { padding: 8, backgroundColor: '#eee', borderRadius: 4, marginVertical: 4 }, section: { marginTop: 12, fontWeight: 'bold' }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }, chip: { padding: 8, borderWidth: 1, borderColor: '#333', borderRadius: 16, marginRight: 4 }, chipSel: { backgroundColor: '#333', color: '#fff' }, btn: { flex: 1, padding: 12, backgroundColor: '#ddd', alignItems: 'center', borderRadius: 4, margin: 4 }, modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }, modal: { backgroundColor: '#fff', padding: 16, borderRadius: 8 } });
