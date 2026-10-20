
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function getDataFormatada(data) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return 'Data inválida';
  }

  return dataConvertida.toLocaleDateString('pt-BR');
}

function DespesaItem({ item }) {
  const navigation = useNavigation();

  function abrirEdicao() {
    navigation.navigate('GerenciarDespesa', {
      expenseId: item.id,
    });
  }

  return (
    <Pressable
      onPress={abrirEdicao}
      style={({ pressed }) => [
        styles.itemContainer,
        pressed && styles.itemPressed,
      ]}
    >
      <View style={styles.itemText}>
        <Text style={styles.data}>
          {getDataFormatada(item.data)}
        </Text>

        <Text style={styles.descricao}>
          {item.descricao}
        </Text>
      </View>

      <View style={styles.valorContainer}>
        <Text style={styles.valor}>
          R$ {Number(item.valor).toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  itemPressed: {
    opacity: 0.7,
  },

  itemText: {
    flex: 1,
    marginRight: 10,
  },

  data: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },

  descricao: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '500',
  },

  valorContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
});

export default DespesaItem;
