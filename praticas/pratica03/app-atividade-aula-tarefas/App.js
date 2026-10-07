import { Image, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import MetaList from './components/MetaList';
import MetaInput from './components/MetaInput';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  const [metas, setMetas] = useState([]);

  function adicionarMetaHandler(inputMeta) {
    const novaMeta = { id: Math.random().toString(), texto: inputMeta }
    setMetas([...metas, novaMeta]);
  }

  function deletarMetaHandler(id) {
    const novaMetas = metas.filter(meta => meta.id !== id);
    setMetas(novaMetas);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Image source={require('./assets/favicon.png')} style={styles.image}/>
        <View style={styles.mainContainer}>
          <MetaInput onAddMeta={adicionarMetaHandler} />
          <View style={styles.metaContainer}>
            <MetaList onDeleteItem={deletarMetaHandler} array={metas} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    padding: 30,
    flex: 1,
    flexDirection: 'column'
  },

  metaContainer: {
    flex: 9
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },

  imageContainer: {
    alignItems: 'left',
    marginTop: 10,
    paddingLeft: 30
  },
  image: {
    width: 50,
    height: 50
  }

});
