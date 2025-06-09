import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import BottomNavbar from '../components/BottomNavbar';

const screenWidth = Dimensions.get('window').width;
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
  const [regressaoData, setRegressaoData] = useState(null);
  const [faixaEtariaData, setFaixaEtariaData] = useState(null);
  const [generoTipoData, setGeneroTipoData] = useState(null);
  const [bairroData, setBairroData] = useState(null);
  const [identificacaoData, setIdentificacaoData] = useState([]);

  const fetchDadosDashboard = async () => {
  try {
    const response = await fetch('https://dentcase-backend.onrender.com', {
      headers: {
        Accept: 'application/json',
      },
    });

    const text = await response.text();
    console.log('Resposta bruta:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('Erro ao tentar converter resposta em JSON:', jsonError);
      return;
    }

    setRegressaoData({
      labels: data.regressao.labels,
      datasets: data.regressao.datasets.map(ds => ({
        data: ds.data,
        color: () => ds.color
      })),
      legend: data.regressao.legend,
    });

    setFaixaEtariaData(data.faixaEtaria);

    setGeneroTipoData({
      labels: data.generoTipo.labels,
      datasets: data.generoTipo.datasets.map(ds => ({
        data: ds.data,
        color: () => ds.color
      })),
      legend: data.generoTipo.legend,
    });

    setBairroData(data.bairros);

    setIdentificacaoData(
      data.identificacao.map(item => ({
        ...item,
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
        <View style={styles.card}>
          <Text style={styles.title}>Distribuição Temporal dos Casos</Text>
          {/* Você pode incluir o gráfico no futuro aqui */}
        </View>

        {/* Previsão de Casos (Regressão) */}
        {regressaoData && (
          <View style={styles.card}>
            <Text style={styles.title}>Previsão de Casos (Regressão)</Text>
            <LineChart
              data={regressaoData}
              width={screenWidth - 40}
              height={200}
              chartConfig={chartConfig}
              bezier
            />
          </View>
        )}

        {/* Vítimas por Faixa Etária */}
        {faixaEtariaData && (
          <View style={styles.card}>
            <Text style={styles.title}>Vítimas por Faixa Etária</Text>
            <BarChart
              data={faixaEtariaData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
            />
          </View>
        )}

        {/* Gênero por Tipo de Ocorrência */}
        {generoTipoData && (
          <View style={styles.card}>
            <Text style={styles.title}>Gênero por Tipo de Ocorrência</Text>
            <BarChart
              data={generoTipoData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
            />
          </View>
        )}

        {/* Casos por Bairro */}
        {bairroData && (
          <View style={styles.card}>
            <Text style={styles.title}>Casos por Bairro</Text>
            <BarChart
              data={bairroData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
            />
          </View>
        )}

        {/* Vítimas Identificadas vs Não Identificadas */}
        {identificacaoData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.title}>Vítimas Identificadas vs Não Identificadas</Text>
            <PieChart
              data={identificacaoData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'15'}
              absolute
            />
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
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
});
