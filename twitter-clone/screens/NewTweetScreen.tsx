import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, NativeSyntheticEvent, TextInputChangeEventData, Platform, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ProfilePicture from '../components/ProfilePicture';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';

import {  API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import { createTweet } from '../graphql/mutations'
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';


export default function NewTweetScreen() {

  const [tweet, setTweet] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Nós precisamos de permissão para fazer isto funcionar!')
        }
      }
    })();
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.cancelled) {
      setImageUrl(result.uri);
    }
  };

  const randomString = () => {
    return Math.random().toString(36).substr(2, 5);
  }

  const uploadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const urlParts = imageUrl.split('.')
      const extension = urlParts[urlParts.length - 1];
      const key = `${randomString()}.${extension}`;
      const res = await Storage.put(key, blob);

      console.log(res);
    } catch(e) {
      console.log(e);
    }
  }


  const onPostTweet = async () => {

    try {
      const currentUser = await Auth.currentAuthenticatedUser({bypassCache: true})

      const newTweet = {
        content: tweet,
        userID: currentUser.attributes.sub
      }

      await API.graphql(graphqlOperation(createTweet, { input: newTweet}))
      console.warn("sucesso na gravação");
      navigation.goBack();
    }catch(e) {
      console.log("erro", e);
    }
  }

  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={30} color={Colors.light.tint} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPostTweet}>
          <Text style={styles.buttonText}>Tweet</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newTweetContainer}>
        <ProfilePicture image={'https://pbs.twimg.com/profile_images/486663026305536000/Ij7av0ze_400x400.jpeg'}/>
        <View style={styles.inputsContainer}>
          <TextInput 
            value={tweet}
            onChangeText={(value: string) => setTweet(value)}
            multiline={true}
            numberOfLines={3}
            style={styles.tweetInput}
            placeholder="O que está acontecendo?" />
            <Image source={{ uri: imageUrl }} style={styles.image}/>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    borderRadius: 30
  },
  buttonText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  newTweetContainer: {
    flexDirection: 'row',
    padding: 15
  },
  inputsContainer: {
    marginLeft: 10,
  },
  tweetInput: {
    height: 100,
    maxHeight: 300,
    fontSize: 18
  },
  pickImage: {
    fontSize: 18,
    color: Colors.light.tint,
    marginVertical: 10
  },
  image: {
    width: 150,
    height: 150
  }
});
