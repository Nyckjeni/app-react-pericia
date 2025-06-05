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
// import Odontograma from '../components/Odontograma'; // ← COMENTADO

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
            // odontograma: {}, // ← COMENTADO
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
                // odontograma: {}, // ← COMENTADO
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

    const handleSubmit = () => {
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

        console.log('Caso cadastrado:', dadosCaso);
        Alert.alert('Sucesso', 'Caso cadastrado com sucesso!');
        setDescricao('');
        setVitimas([]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                <Text style={styles.header}>Cadastrar Novo Caso</Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Informações do Caso</Text>

                    <Text style={styles.label}>ID do Caso</Text>
                    <TextInput value={casoId} editable={false} style={styles.inputDisabled} />
                    <Text style={styles.info}>Gerado automaticamente</Text>

                    <Text style={styles.label}>Status*</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            onValueChange={setStatus}
                            style={styles.picker}
                        >
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
                        <Text style={styles.sectionTitle}>Vítima {index + 1}</Text>

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
                    <Text style={styles.buttonText}>Adicionar Vítima</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Cadastrar Caso</Text>
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        color: '#000',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginTop: 4,
        backgroundColor: 'white',
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#6B0D0D',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    info: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
};