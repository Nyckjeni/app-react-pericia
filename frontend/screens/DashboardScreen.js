import React from 'react'; 
import { ScrollView, Text, View, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import BottomNavbar from '../components/BottomNavbar'; // importe a BottomNavbar

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
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Distribuição Temporal dos Casos */}
        <View style={styles.card}>
          <Text style={styles.title}>Distribuição Temporal dos Casos</Text>
          {/* Gráfico pode ser adicionado futuramente */}
        </View>

        {/* Previsão de Casos (Regressão) */}
        <View style={styles.card}>
          <Text style={styles.title}>Previsão de Casos (Regressão)</Text>
          <LineChart
            data={{
              labels: ['0-10', '11-20', '21-30', '31-40', '41-50'],
              datasets: [
                { data: [0.2, 0.3, 0.1, 0.05, 0.02], color: () => '#FFD700' },
                { data: [0.1, 0.1, 0.1, 0.1, 0.1], color: () => '#6B0D0D' },
              ],
              legend: ['Proporção real', 'Curva de regressão logística'],
            }}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
          />
        </View>

        {/* Vítimas por Faixa Etária */}
        <View style={styles.card}>
          <Text style={styles.title}>Vítimas por Faixa Etária</Text>
          <BarChart
            data={{
              labels: ['0-17', '18-30', '31-45', '46-60'],
              datasets: [{ data: [3, 6, 7, 1] }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
          />
        </View>

        {/* Gênero por Tipo de Ocorrência */}
        <View style={styles.card}>
          <Text style={styles.title}>Gênero por Tipo de Ocorrência</Text>
          <BarChart
            data={{
              labels: ['morte', 'acidente', 'Não informado'],
              datasets: [
                { data: [1, 5, 0], color: () => '#6B0D0D' },
                { data: [1, 3, 0], color: () => '#A52A2A' },
                { data: [1, 3, 0], color: () => '#FFA07A' },
              ],
              legend: ['masculino', 'feminino', 'outro'],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
          />
        </View>

        {/* Casos por Bairro */}
        <View style={styles.card}>
          <Text style={styles.title}>Casos por Bairro</Text>
          <BarChart
            data={{
              labels: ['Paulista', 'Recife', 'Prado', 'Belém', 'São Francisco'],
              datasets: [{ data: [6, 4, 1, 1, 1] }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
          />
        </View>

        {/* Vítimas Identificadas vs Não Identificadas */}
        <View style={styles.card}>
          <Text style={styles.title}>Vítimas Identificadas vs Não Identificadas</Text>
          <PieChart
            data={[
              { name: 'Identificada', population: 16, color: '#6B0D0D', legendFontColor: '#000', legendFontSize: 12 },
              { name: 'Não identificada', population: 1, color: '#C05050', legendFontColor: '#000', legendFontSize: 12 },
            ]}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            absolute
          />
        </View>
      </ScrollView>

      {/* Navbar fixo na parte inferior */}
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
    paddingBottom: 100, // Espaço para o menu fixo
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
