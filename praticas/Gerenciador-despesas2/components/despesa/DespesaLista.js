
import { FlatList, StyleSheet, Text, View } from 'react-native';

import DespesaItem from './DespesaItem';

function DespesaLista({ despesas }) {
  function renderDespesaItem(itemData) {
    return <DespesaItem item={itemData.item} />;
  }

  function renderListaVazia() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          Nenhuma despesa encontrada
        </Text>

        <Text style={styles.emptyMessage}>
          Adicione uma despesa para começar a acompanhar seus gastos.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={despesas}
      renderItem={renderDespesaItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderListaVazia}
      contentContainerStyle={
        despesas.length === 0 ? styles.emptyList : styles.list
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 5,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default DespesaLista;
