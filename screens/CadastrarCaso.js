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
import Odontograma from '../components/Odontograma';

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

    // Cada vítima agora tem um odontograma próprio
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
            odontograma: {}, // objeto para armazenar os dentes marcados e observações
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
                odontograma: {},
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

    // Atualiza o odontograma de uma vítima específica
    const atualizarOdontograma = (id, novoOdontograma) => {
        setVitimas((prev) =>
            prev.map((v) => (v.id === id ? { ...v, odontograma: novoOdontograma } : v))
        );
    };

    const handleSubmit = () => {
        // Validação simples
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
        // Resetar campos após salvar
        setDescricao('');
        setVitimas([]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#6B0D0D',
                        marginBottom: 16,
                    }}
                >
                    Cadastrar Novo Caso
                </Text>

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


                {/* Renderiza vítimas com odontograma individual */}
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

                        {/* Odontograma individual */}
                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                            Odontograma
                        </Text>
                        <Odontograma
                            odontograma={vitima.odontograma}
                            onChange={(novoOdontograma) =>
                                atualizarOdontograma(vitima.id, novoOdontograma)
                            }
                        />

                        {vitimas.length > 1 && (
                            <TouchableOpacity
                                onPress={() => removerVitima(vitima.id)}
                                style={{
                                    marginTop: 12,
                                    backgroundColor: '#ffe6e6',
                                    padding: 10,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: 'red',
                                }}
                            >
                                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                                    Remover Vítima
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity
                    onPress={adicionarVitima}
                    style={{
                        marginBottom: 20,
                        backgroundColor: '#6B0D0D',
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
                    >
                        Adicionar Nova Vítima
                    </Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Local do Incidente</Text>
                    <Text style={styles.label}>Estado*</Text>
                    <TextInput
                        style={styles.input}
                        value={estado}
                        onChangeText={setEstado}
                    />

                    <Text style={styles.label}>Município*</Text>
                    <TextInput
                        style={styles.input}
                        value={municipio}
                        onChangeText={setMunicipio}
                    />

                    <Text style={styles.label}>Data do Incidente*</Text>
                    <TextInput
                        style={styles.input}
                        value={dataIncidente}
                        onChangeText={setDataIncidente}
                        placeholder="DD/MM/AAAA"
                    />

                    <Text style={styles.label}>Local Exato</Text>
                    <TextInput
                        style={styles.input}
                        value={localIncidente}
                        onChangeText={setLocalIncidente}
                    />

                    <Text style={styles.label}>Descrição do Incidente</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                        value={descricaoIncidente}
                        onChangeText={setDescricaoIncidente}
                    />

                    <Text style={styles.label}>Instrumento Utilizado</Text>
                    <TextInput
                        style={styles.input}
                        value={instrumento}
                        onChangeText={setInstrumento}
                    />

                    <Text style={styles.label}>Tipo do Caso</Text>
                    <TextInput
                        style={styles.input}
                        value={tipoCaso}
                        onChangeText={setTipoCaso}
                    />

                    <Text style={styles.label}>Vítima Identificada?</Text>
                    <TextInput
                        style={styles.input}
                        value={vitimaIdentificada}
                        onChangeText={setVitimaIdentificada}
                        placeholder="Sim/Não"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: '#6B0D0D',
                        padding: 14,
                        borderRadius: 10,
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 18,
                        }}
                    >
                        Salvar Caso
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavbar navigation={navigation} />
        </View>
    );
}

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#6B0D0D',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    inputDisabled: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#eee',
        color: '#999',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 12,
        backgroundColor: '#fff',
        height: 50, // Altura aumentada para evitar corte
        justifyContent: 'center', // Centraliza verticalmente
        overflow: 'hidden',
    },
    picker: {
        height: 50, // Altura para o Picker igual ao container
        width: '100%',
    },
    info: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
};
