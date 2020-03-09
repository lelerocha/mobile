# Passos

1. Instalar o Expo
_yarn global add expo-cli_

2. Criar o projeto com o Expo
_expo init mobile_

entrar na pasta criada `mobile` e executar o comando `yarn start`

3. Criar a estrutura
src
  pages
    main
    profile


**Conteúdo dos arquivos main.js e profile.js**
```js
import React from 'react';
import { View } from 'react-native';

function Main() {
    return <View />
}

export default Main;
```

4. Criar um arquivo de rotas _routes.js_ dentro da pasta `src`

5. Navegação
Precisamos prover uma forma do usuário navegar entre as paginas da aplicação.
Olhando a documentação em _docs.expo.io_ na sessão `Guides`, verificamos que a
ferramenta recomendada é o React Navigation. Vamos seguindo os links até a pagina
do React Navigation e encontramos a o guia de instalação.
Obs. Vamos instalar a versão 4
_yarn add react-navigation_

Como estamos num projeto do Expo, precisamos executar também a linha abaixo:

_expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view_

6. Hello React Navigation
Vamos clicar no botão `Next` para continuar com o guia de instalação

A navegação mais utilizada é a navegação por pilhas, que ocorre quando o usuário
`clica` em algum elemento da tela e é redirecionado ao recurso

_yarn add react-navigation-stack @react-native-community/masked-view_


7. Conteúdo do routes.js

```js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Proile';

const Routes = createAppContainer(
  createStackNavigator({
    Main,
    Profile
  })
);

export default Routes;
```

8. Importar as rotas no App.js

```js
import Routes from './src/routes';
```

Excluir o conteúdo do return e substituir por `<Routes />`

Pode excluir também as importações do react-native e os estilos que estão no fim
do arquivo App.js


9. Algumas alterações no arquivo de rotas
Podemos passar parâmetros nas rotas, como a pagina que será exibida, o título da
pagina, a cor do fundo e a cor da fonte.

```js
createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: "DevRadar"
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: "Perfil no GitHub"
      },
    },
  }, {
    defaultNavigationOptions: {
      headerTintColor: '#FFF',
      headerStyle: {
        backgroundColor: '#7D40E7'
      },
    },
  })
```

10. Configurando a StatusBar
Em alguns casos, a cor dos ícones da StatusBar é preto, por padrão. Podemos alterar
esse comportamento incluindo o componente `StatusBar` onde quisermos fazer a alteração
na aplicação. No nosso caso, faremos a alteração no App.js, pois queremos que o 
efeito seja na aplicação como um todo.

```js
import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Routes />
    </>
  );
}
``` 

Note para o uso do `fragment` representado por **<> e </>**. Como não podemos ter um
componente após o outro sem tem um container, utilizamos o `fragment`, que é um tipo
de container sem representação, ou um tipo de componente vazio.


11. Instalação e visualização do Mapa
Vamos verificar a documentação do Expo em _https://docs.expo.io/versions/v36.0.0/sdk/map-view/_.
Verificamos que o comando para instalação é `expo install react-native-maps`

Como queremos que o mapa aparece na pagina principal, vamos importar o `MapView` dentro
da pagina `Main.js`

```js
import MapView from 'react-native-maps';
```

E substituimos o componente `<View />`  por `<MapView />`


```js
import React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';

function Main() {
    return <MapView />;
};

export default Main;
```

O que falta fazer para o mapa aparecer, é estipular um tamanho e uma posição.

```js
function Main() {
    return <MapView style={{ flex: 1}} />;
};
```

Organizando tudo...
```js
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

function Main() {
    return <MapView style={ styles.map }/>;
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
})

export default Main;
```

11.1. Colocando um `ponto` no mapa

Precisamos colocar o mapa com localização e zoom mais próximo da nossa necessidade.
Então vamos começar carregando a localização do usuário. Quando queremos executar
algo assim que o componente é carregado, usamos a função `useEffect` da lib do React

O `useEffect` recebe uma função a qual você deseja executar, e um array de dependencias
que é o que você quer executar, assim:
```js
useEffect(() => {}, []);
```

11.2. Pegando a localização do usuário (você que está com o app na mão ;))

Vamos novamente consultar a documentação: _https://docs.expo.io/versions/v36.0.0/sdk/location/_.
Esse é o módulo de geolocalização do `Expo`.

Vamos instalá-lo com o comando `expo install expo-location`.

Após a instalação, vamos começar chamando o método `requestPermissionsAsync()`. Esse
método retorna se o usuário deu permisão ou não para a captura da sua localização.

```js
await requestPermissionsAsync();
```

Como vamos precisar pegar alguns retornos, vamos desestruturar numa váriavel. Notamos que 
ao executar CTRL+Espaço, temos acesso aos vários retornos dessa função. A que mais nos
interessa no momento é a `granted`, que nos informa se o usuário deu ou não permissão de
acesso a sua localização.

```js
const { granted } = await requestPermissionsAsync();
```

Por fim, fazemos uma verificação desse resultado, ou seja, se o usuário aceitou
compartilhar a sua localização, e chamamos o método `getCurrentPositionAsync()`,
que nos retorna, de fato, a localização do usuário. Podemos ainda passar um 
parâmetro `enableHighAccuracy` como `true`, que melhora a localização.

**Atenção**
Essa funcionalidade utiliza o GPS para melhorar a precisão, portando, o GPS do usuário
deverá estar ligado.

```js
import React, {useEffect} from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

function Main() {
    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if(granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;
            }
        }

        loadInitialPosition();
    }, []);

    return <MapView style={ styles.map }/>;
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
})

export default Main;
```

Por fim, precisamos armazenar essas coordenadas (latitude e longitude) num estado.
Importamos o `useState` na desestruturação do React e criamos nosso estado na aplicação
que, inicialmente, começa como nulo.

```js
const [currentRegion, setCurrentRegion] = useState(null);
```

Agora vamos atualizar o estado da aplicação, passando a latitude, a longitude e mais
dois parâmetros: latitudeDelta e longitudeDelta. Esse dois últimos parâmetros são
cálculos navais para que possamos obter o nível de zoom no mapa.

```js
const { latitude, longitude } = coords;

setCurrentRegion({
    latitude,
    longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
})
```

Agora atualizamos o componente `<MapView />` passando a `currentRegion` que foi
setada no estado da aplicação. Além disso, fazemos uma verificação para não redenrizar
o mapa caso ainda não exista uma região a ser exibida.

```js
if(!currentRegion) {
    return null;
}

return <MapView initialRegion={currentRegion} style={ styles.map }/>;
```

11.3. Marcações no mapa

Precisamos incluir as marcações no mapa que indiquem a localização dos usuários. 
Para isso, primeiramente vamos importar o `Marker` de dentro da lib do react-native-maps

```js
import MapView, { Marker } from 'react-native-maps';
```
Agora precisamos modificar um pouco o componente `<MapView>` para incluir o `Marker`

```js
import MapView, { Marker } from 'react-native-maps';return (
    <MapView initialRegion={currentRegion} style={ styles.map }>
        <Marker coordinate={} />
    </MapView>
);
```

Para fazer um teste rápido, abra o Google Maps e procure uma localização próxima de
onde você se encontra. Copie a latitude e a longitude. E agora passamos essas coordenadas
como um objeto na propriedade `coordinate` do componente `<Marker />`

```js
import MapView, { Marker } from 'react-native-maps';return (
    <MapView initialRegion={currentRegion} style={ styles.map }>
        <Marker coordinate={{ latitude: -16.7174425, longitude: -43.8543334 }} />
    </MapView>
);
```

12. Alterando o Pin padrão do mapa para exibir uma imagem

O que vamos fazer agora é trocar o marcador de posição (Pin) padrão para uma imagem.

12.1. Importe o componente `Image` da lib `react-native`
12.2. Alterar o componente `<Marker>` para incluir nele o componente `<Image>`

```js
<Marker coordinate={{ latitude: -16.7174425, longitude: -43.8543334 }}>
    <Image source={{ uri: 'https://avatars0.githubusercontent.com/u/5478007?s=460&v=4' }} />
</Marker>
```

Estamos utilizando uma imagem estática para testes enquanto não estamos trabalhando
diretamente na nossa `API`

Se você observou direito, a imagem não foi exibida na tela do seu celular. Vamos corrgir isso
adicionando um estilo ao componente `<Image />`

```js
<Image style={styles.avatar} source={{ uri: 'https://avatars0.githubusercontent.com/u/5478007?s=460&v=4' }} />

// estilo
avatar: {
    width: 54,
    height: 54,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
},
```

Agora tudo deve estar funcionando corretamente.


13. Exibir as informações do usuário

Importar o componente `Callout` da lib `react-native-maps`e os componentes `View` e
`Text` da lib `react-native` e implementar conforme abaixo após o componente `<Image />`.

```js
<Callout>
    <View style={styles.callout}>
        <Text style={styles.devName}>Julio Azevedo</Text>
        <Text style={styles.devBio}>CTO na Hit Sistemas. Engenheiro de Software. Apaixonado por JavaScript e desenvolvimento web e mobile.</Text>
        <Text style={styles.devTechs}>ReactJS, React Native, NodeJS</Text>
    </View>
</Callout>
```

Nesse ponto, se você der um reload na sua aplicação e clicar sobre o avatar, já
deve ser possível visualizar algumas informações.


Por fim, as estilizações

```js
callout: {
        width: 260,
},

devName: {
    fontWeight: 'bold',
    fontSize: 16,
},

devBio: {
    color: '#666',
    marginTop: 5,
},

devTechs: {
    marginTop: 5,
},
```


14. Navegação

Precisamos navegar o usuário para o perfil do Github quando ele clicar no callout.
Toda pagina da aplicação recebe uma propriedade chamada _navigation_. Nela estão
todos os parâmetros necessários para que possamos navegar na nossa aplicação.
Pegamos essa propriedade diretamente na `function Main({ navigation })`.

Agora podemos incluir uma propriedade `onPress()` no componente `<Callout>` que 
recebe sempre uma função. E essa função será responsável por chamar a pagina para
a qual queremos ir. Como vamos lidar com informações dinâmicas, é importante
passar um parâmetro, para que a aplicação saiba de qual usuário queremos mais informações

```js
<Callout onPress={() => {
    navigation.navigate('Profile', { github_username: 'julioaze' });
}}>
```

**Tip**
No iOS o botão de _voltar_ sempre acompanha um texto padrão, que pode ser o título
da página que você está. Para deixar somente o botão, passamos a propriedade
`headerBackTitleVisible: false,` em _defaultNavigationOptions_ do arquivo de rotas.


15. WebView

Agora que já temos a navegação para a pagina `Profile` precisamos instalar uma biblioteca
que nos permita visualizar conteúdo externo. Para tanto, utilizaremos a lib WebView do Expo
`expo install react-native-webview`

Em seguida importamos o WebView a partir da lib `react-native-webview` e no lugar da `<View />`
substituímos por `<WebView>`

Na documentação se observa que a `<WebView />` recebe um _source_ e um _style_

```js
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile() {
    return <WebView source={{ uri: 'https://github.com/julioaze' }} style={{ flex: 1 }} />;
};

export default Profile;
```

O usuário estamos enviando como parâmetro de dentro do `Main.js` e para 'pegar' esse usuário
nos recebemos a prop _navigation_ e dela que pegaremos o usuário que está sendo enviado
da pagina `Main.js`

```js
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile({ navigation }) {
    const githubUserName = navigation.getParam("github_username");

    return (
      <WebView
        source={{ uri: `https://github.com/${githubUserName}` }}
        style={{ flex: 1 }}
      />
    );
};

export default Profile;
```

Podemos salvar e testar.


16. Formulário de busca

Vamos incluir um campo de texto para que o usuário pesquise por tecnologias. Na pagina
`Main.js`

O primeiro conceito a aprender é que não existe um componente ou tag de formulario
no React Native. Usamos diretamente os text inputs e colocamos uma ação de submit num botão
para que o formulário seja enviado.

Vamos começar importando o `TextInput` da biblioteca _react-native_. Em seguida, criamos
uma `<View>` que irá servir como o _formulario_ propriamente dito. Para que esse elemento
aparece acima do mapa, vamos coloca-lo abaixo do `<MapView>` e também encapsular esses
dois componentes, `MapView` e `View` em um _fragment_, uma vez que não podemos ter
dois componentes encadeados sem estarem encapsulados.

```js
// </MapView>

  <View style={styles.searchForm}>
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar devs por tecnologias"
      placeholderTextColor="#999"
      autoCapitalize="words"
      autoCorrect={false}
    />
  </View>
// </>
```

Também precisamos de um botão que receberá a ação de enviar o formulário. O RN tem 
o componente `Button` mas ele se comporta de acordo com o S.O. Como queremos
fazer nossa própria estilização, vamos utilizar o componente `TouchableOpacity`, então
vamos importá-lo da biblioteca do RN e implementar logo após o TextInput

```js
<View style={styles.searchForm}>
  <TextInput
    style={styles.searchInput}
    placeholder="Buscar devs por tecnologias"
    placeholderTextColor="#999"
    autoCapitalize="words"
    autoCorrect={false}
  />
  <TouchableOpacity style={styles.loadButton}>

  </TouchableOpacity>
</View>
```

Se fóssemos inserir um texto no botão, por exemplo, _salvar_, teríamos que utilizar
a tag `<Text>`, pois não podemos inserir texto diretamente no componente, como no HTML.
Mas no nosso caso de uso, não teremos um texto, e sim uma imagem.

O RN já traz embutidas todas as principais libs de ícones do mercado.

Então vamos importar a lib `MaterialIcons` de dentro da lib _@expo/vector-icons_

```js
import { MaterialIcons } from '@expo/vector-icons';

// ...
<TouchableOpacity onPress={() => {}} style={styles.loadButton}>
    <MaterialIcons name="my-location" size={20} color="#FFF" />
</TouchableOpacity>
// ...
```

Agora que já temos tudo funcionando, podemos criar nossos estilos 😛 

```js
searchForm: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },

  searchInput: {
      flex: 1,
      height: 50,
      backgroundColor: '#FFF',
      color: '#333',
      borderRadius: 25,
      paddingHorizontal: 20,
      fontSize: 16,
      // sombra iOS
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: {
          width: 4,
          height: 4,
      },
      // sombra Android
      elevation: 2,
  },

  loadButton: {
      width: 50,
      height: 50,
      backgroundColor: '#8E4DFF',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 15,
  }

```

Agora, se vocẽ clicar no input para digitar, vai notar que o teclado fica por cima dele.
Podemos resolver isso , importando a API do teclado nativo para manipular
o mesmo. 

```js
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
```

Porém, isso vai ficar de _lição de casa_ 🤓 

Vamos resolver de uma forma mais simples, apenas alterando a propriedade _bottom_ do 
`searchForm` para _top_ 😎


Aqui terminamos toda a parte de visualização do nosso App 💪

