// screens/CadastroEvidenciaScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CadastroEvidenciaScreen({ navigation }) {
    const [dataColeta, setDataColeta] = useState(new Date());
    const [hora, setHora] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [imagem, setImagem] = useState('');
    const [arquivo, setArquivo] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    

    const salvarEvidencia = () => {
        const novaEvidencia = {
            id: Date.now().toString(),
            descricao,
            dataColeta: dataColeta.toLocaleDateString(),
            hora,
            latitude,
            longitude,
            imagem,
            arquivo,
        };

        navigation.navigate('DetalhesCaso', { novaEvidencia });
    };

    const usarMinhaLocalizacao = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return alert('Permissão negada para acessar localização');

        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude.toString());
        setLongitude(location.coords.longitude.toString());
    };

    const escolherArquivo = async () => {
        const result = await DocumentPicker.getDocumentAsync({});
        if (result.type === 'success') setArquivo(result);
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
                        if (selectedTime)
                            setHora(selectedTime.getHours().toString().padStart(2, '0') + ':' + selectedTime.getMinutes().toString().padStart(2, '0'));
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

            <Text>Imagem (URL):</Text>
            <TextInput placeholder="Opcional" value={imagem} onChangeText={setImagem} style={styles.input} />

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
