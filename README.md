# Passos

1. Instalar o Expo
_yarn global add expo-cli_

2. Criar o projeto com o Expo
_expo init mobile_

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
_yarn add @react-navigation/native_

Como estamos num projeto do Expo, precisamos executar também a linha abaixo:
_expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view_

6. Hello React Navigation
Vamos clicar no botão `Next` para continuar com o guia de instalação

A navegação mais utilizada é a navegação por pilhas, que ocorre quando o usuário
`clica` em algum elemento da tela e é redirecionado ao recurso

_yarn add @react-navigation/stack_


7. Conteúdo do routes.js
```js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main,
        Profile
    });
);

export default Routes;
```

8. Importar as rotas no App.js
```js
import Routes from './src/routes';
```

Excluir o conteúdo do return e substituir por `<Routes />`
