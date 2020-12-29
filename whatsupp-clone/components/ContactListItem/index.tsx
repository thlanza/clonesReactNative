import React from 'react';
import { Text, View, Image, TouchableWithoutFeedback } from "react-native";
import { User } from '../../types';
import styles from './style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import {  createChatRoom, createChatRoomUser } from "../../graphql/mutations";

export type ContactListItemProps = {
    user: User;
}

const ContactListItem = (props: ContactListItemProps) => {
    const { user } = props;

    const navigation = useNavigation();

 

    const onClick = async () => {
        // navigate to chat room with this user
        try {
            // 1.Create a new Chat Room
            const newChatRoomData = await API.graphql(
                graphqlOperation(
                    createChatRoom, {
                        input: {
                            lastMessageID: "zz7534fcahjhjfhkjfefihwuiwuifhwfiwf"
                         }
                    }
                )
            )

            if (!newChatRoomData.data) {
                console.log("Falha ao criar uma sala de chat.")
            }

            const newChatRoom = newChatRoomData.data.createChatRoom;
            
            // 2.Add `user` to the Chat Room
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser, {
                        input: {
                            userID: user.id,
                            chatRoomID: newChatRoom.id
                        }
                    }
                )
            )

            const userInfo = await Auth.currentAuthenticatedUser();
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser, {
                        input: {
                            userID: userInfo.attributes.sub,
                            chatRoomID: newChatRoom.id
                        }
                    }
                )
            )

            navigation.navigate('ChatRoom', { 
                id: newChatRoom.id,
                name: "Hardcoded name"
            });

           


            // 3.Add authenticated user to the Chat Room
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image source={{ uri: user.imageUri }} style={styles.avatar} />
                    <View style={styles.midContainer}>
                        <Text style={styles.username}>{user.name}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

    )
};

export default ContactListItem;