import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import BottomNavbar from '../components/BottomNavbar';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'https://dentcase-backend.onrender.com/api/dashboard';

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(107, 13, 13, ${opacity})`,
  labelColor: () => '#000',
  propsForLabels: {
    fontSize: 10,
  },
};

export default function DashboardScreen({ navigation }) {
  // Declaração correta de todos os estados
  const [temporalData, setTemporalData] = useState(null);
  const [regressaoData, setRegressaoData] = useState(null);
  const [faixaEtariaData, setFaixaEtariaData] = useState(null);
  const [generoTipoData, setGeneroTipoData] = useState(null);
  const [bairroData, setBairroData] = useState(null);
  const [identificacaoData, setIdentificacaoData] = useState([]);
  const [totalCasosBairro, setTotalCasosBairro] = useState(0);

  const fetchDadosDashboard = async () => {
    try {
      // 1. Distribuição Temporal
      const temporalRes = await fetch(`${API_BASE_URL}/temporal`);
      const temporalData = await temporalRes.json();
      setTemporalData({
        labels: temporalData.labels,
        datasets: [{ data: temporalData.data }],
      });

      // 2. Previsão de Casos (Regressão)
      const regressaoRes = await fetch(`${API_BASE_URL}/identificacao-regressao`);
      const regressaoData = await regressaoRes.json();
      setRegressaoData({
        labels: regressaoData.labels,
        datasets: [{ data: regressaoData.regressao }],
      });

      // 3. Vítimas por Faixa Etária
      const faixaEtariaRes = await fetch(`${API_BASE_URL}/faixa-etaria`);
      const faixaEtariaData = await faixaEtariaRes.json();
      setFaixaEtariaData({
        labels: faixaEtariaData.labels,
        datasets: [{ data: faixaEtariaData.data }],
      });

      // 4. Gênero por Tipo de Ocorrência
      const generoTipoRes = await fetch(`${API_BASE_URL}/genero-tipo`);
      const generoTipoData = await generoTipoRes.json();
      setGeneroTipoData({
        labels: generoTipoData.labels,
        datasets: generoTipoData.datasets,
      });

      // 5. Casos por Bairro
      const bairroRes = await fetch(`${API_BASE_URL}/bairro`);
      const bairroData = await bairroRes.json();
      setBairroData({
        labels: bairroData.labels,
        datasets: [{ data: bairroData.data }],
      });
      setTotalCasosBairro(bairroData.data.reduce((a, b) => a + b, 0));

      // 6. Identificadas vs Não Identificadas
      const identificacaoRes = await fetch(`${API_BASE_URL}/identificacao`);
      const identificacaoData = await identificacaoRes.json();
      const cores = ['#4e1b1b', '#ad3c3c'];
      setIdentificacaoData(
        identificacaoData.labels.map((label, i) => ({
          name: `${label} (${identificacaoData.data[i]})`,
          population: identificacaoData.data[i],
          color: cores[i],
          legendFontColor: '#000',
          legendFontSize: 12
        }))
      );
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    }
  };

  useEffect(() => {
    fetchDadosDashboard();
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Distribuição Temporal dos Casos */}
        {temporalData && (
          <View style={styles.card}>
            <Text style={styles.title}>Distribuição Temporal dos Casos</Text>
            <View style={styles.chartWrapper}>
              <LineChart
                data={temporalData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                bezier
                withDots={true}
                withShadow={false}
              />
            </View>
          </View>
        )}

        {/* Previsão de Casos (Regressão) */}
        {regressaoData && (
          <View style={styles.card}>
            <Text style={styles.title}>Previsão de Casos (Regressão)</Text>
            <View style={styles.chartWrapper}>
              <LineChart
                data={regressaoData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                bezier
              />
            </View>
          </View>
        )}

        {/* Vítimas por Faixa Etária */}
        {faixaEtariaData && (
          <View style={styles.card}>
            <Text style={styles.title}>Vítimas por Faixa Etária</Text>
            <View style={styles.chartWrapper}>
              <BarChart
                data={faixaEtariaData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero={true}
              />
            </View>
          </View>
        )}

        {/* Gênero por Tipo de Ocorrência */}
        {generoTipoData && (
          <View style={styles.card}>
            <Text style={styles.title}>Gênero por Tipo de Ocorrência</Text>
            <View style={styles.chartWrapper}>
              <BarChart
                data={generoTipoData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={10}
              />
            </View>
          </View>
        )}

        {/* Casos por Bairro */}
        {bairroData && (
          <View style={styles.card}>
            <Text style={styles.title}>Casos por Bairro</Text>
            <Text style={styles.totalText}>Total de casos: {totalCasosBairro}</Text>
            <View style={styles.chartWrapper}>
              <BarChart
                data={bairroData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={30}
              />
            </View>
          </View>
        )}

        {/* Vítimas Identificadas vs Não Identificadas */}
        {identificacaoData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.title}>Vítimas Identificadas vs Não Identificadas</Text>
            <View style={styles.chartWrapper}>
              <PieChart
                data={identificacaoData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'0'}
                center={[0, 0]}
                absolute
              />
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavbar
        navigation={navigation}
        activeRoute="Dashboard"
        onAddPress={() => navigation.navigate('CadastrarCaso')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  totalText: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
  },
});