import {Text, FlatList, View} from 'react-native';

function renderDespesaItem(itemData){
    return (
        <View>
            <Text>{itemData.item.descricao}</Text>
            <Text>{itemData.item.valor}</Text>
        </View>
    )
}

function DespesaLista({despesas}){

    return (
        <FlatList data={despesas}
        renderItem={renderDespesaItem}
        keyExtractor={(item) => item.id} />
    )
}

export default DespesaLista;