import {Alert, Image, StyleSheet, TouchableHighlight, View} from 'react-native';
import React, {useState} from 'react';

import {
  createImageMessage,
  createLocationMessage,
  createTextMessage,
} from './utils/MessageUtils';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';

const App = () => {
  const [messages, setMessages] = useState([
    createImageMessage('https://unsplash.it/300/300'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);
  const [fullscreenImageId, setFullscreenImageId] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const dismissFullscreenImage = () => {
    setFullscreenImageId(null);
  };

  const handleSubmit = text => {
    setMessages([createTextMessage(text), ...messages]);
  };

  const handleChangeFocus = isFocused => {
    setIsInputFocused(isFocused);
  };

  const handlePressMessage = ({id, type}) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setMessages(messages.filter(message => message.id !== id));
              },
            },
          ],
        );
        break;
      case 'image':
        setFullscreenImageId(id);
        setIsInputFocused(false);
        break;
      default:
        break;
    }
  };

  const renderMessageList = () => {
    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
    );
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
        />
      </View>
    );
  };

  const renderFullscreenImage = () => {
    if (!fullscreenImageId) {
      return null;
    }

    const image = messages.find(message => message.id === fullscreenImageId);

    if (!image) {
      return null;
    }

    const {uri} = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{uri}} />
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.container}>
      {renderMessageList()}
      {renderToolbar()}
      {renderFullscreenImage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default App;
