import { Entypo, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles';
import {
    API,
    Auth,
    graphqlOperation
} from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";


const InputBox = (props) => {

    const { chatRoomID } = props;

    const [message, setMessage] = useState('');
    const [myUserId, setMyUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyUserId(userInfo.attributes.sub);
        }
        fetchUser();
    }, [])


    const onMicrophonePress = () => {
        console.warn('microfone')
    }

    const updateChatRoomLastMessage = async (messageId: string) => {
        try {
            await API.graphql(
                graphqlOperation(
                    updateChatRoom, {
                        input: {
                            id: chatRoomID,
                            lastMessageID: messageId
                        }
                    }
                )
            )
        } catch(e) {
            console.log(e);
        }
    }

    const onSendPress = async () => {

        try {
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage, {
                        input: {
                            content: message,
                            userID: myUserId,
                            chatRoomID 
                        }
                    }
                )
            )

            await updateChatRoomLastMessage(newMessageData.data.createMessage.id);
        } catch(e) {
            console.log(e);
        }
        setMessage('');
    }

    const onPress = () => {
        if (!message) {
            onMicrophonePress();
        } else {
            onSendPress();
        }
    }

    
    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={20}
        >
            <View style={styles.mainContainer}>
                <FontAwesome5 name="laugh-beam" size={24} color="grey" />
                <TextInput 
                    placeholder="Digite uma mensagem"
                    style={styles.textInput} 
                    multiline
                    value={message}
                    onChangeText={setMessage}
                    />
                <Entypo name="attachment" size={24} color="grey" style={styles.icon}/>
                {!message && <Fontisto name="camera" size={24} color="grey" style={styles.icon}/>}
            </View>
            <TouchableOpacity onPress={onPress}>
            <View style={styles.buttonContainer}>
                {!message ?
                    <MaterialCommunityIcons name="microphone" size={28} color="white" />
                    : <MaterialCommunityIcons name="send" size={28} color="white" />
                }
               
            </View>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default InputBox;
