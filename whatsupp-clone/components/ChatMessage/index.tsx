import React from 'react';
import { Text, View } from 'react-native';
import { Message } from '../../types';
import moment from 'moment'
import 'moment/locale/pt-br';
import styles from './styles';

export type ChatMessageProps = {
    message: Message;
    myId: String;
}

const ChatMessage = (props: ChatMessageProps) => {
    const { message, myId } = props;

    const isMyMessage = () => {
        return message.user.id === myId;
    }

    let brazil = moment(message.createdAt);
    let brazilUp = brazil.locale('pt-br');
    
    return (
        <View style={styles.container}>
            <View style={[
                    styles.messageBox, {
                        backgroundColor: isMyMessage() ? '#DCF8C5' : 'white',
                        marginLeft: isMyMessage() ? 50 : 0,
                        marginRight: isMyMessage() ? 0 : 50
                    }
                    ]}>
                {!isMyMessage() &&  <Text style={styles.name}>{message.user.name}</Text>}
                <Text style={styles.message}>{message.content}</Text>
                <Text style={styles.time}>{brazilUp.fromNow()}</Text>
           </View>
        </View>
    )
}

export default ChatMessage;