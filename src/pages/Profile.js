import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile({ navigation }) {
  const githubUserName = navigation.getParam('github_username');

  return (
    <WebView
      source={{ uri: `https://github.com/${githubUserName}` }}
      style={{ flex: 1 }}
    />
  );
}

export default Profile;
