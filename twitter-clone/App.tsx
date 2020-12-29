import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'
import config from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { getUser } from './graphql/queries';
import { createUser } from './graphql/mutations';
import { CreateUserInput } from './API';

Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => {
    return 'https://pbs.twimg.com/profile_images/486663026305536000/Ij7av0ze_400x400.jpeg'
  }

  const saveUserToDB = async (user: CreateUserInput) => {
    console.log(user);
    await API.graphql(graphqlOperation(createUser, { input: user }))
  }

  useEffect(() => {
    const updateUser = async () => {
      // Get current authenticated user
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
      
      if(userInfo) {
         // Check if user already exists in database
        const userData = await API.graphql(graphqlOperation(getUser, { id: userInfo.attributes.sub }));
        if(!userData.data.getUser) {
          const user = {
            id: userInfo.attributes.sub,
            username: userInfo.username,
            name: userInfo.username,
            email: userInfo.attributes.email,
            image: getRandomImage()
          }
          await saveUserToDB(user);
        } else {
          console.log('Usuário já existe')
        }
      }
    
      
      // If it doesn't, create the user in the database
    }
    updateUser();
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
