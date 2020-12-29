import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native';
import { TweetType } from '../../../../types';
import styles from './styles';
import { AntDesign, EvilIcons, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createLike, deleteLike } from '../../../../graphql/mutations';

export type FooterContainerProps = {
    tweet: TweetType
}

const Footer = ({ tweet }: FooterContainerProps) => {

    const [user, setUser] = useState(null);
    const [myLike, setMyLike] = useState(null);
    const [likesCount, setLikesCount] = useState(tweet.likes.items.length);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await Auth.currentAuthenticatedUser();
            setUser(currentUser);

            const searchedLike = tweet.likes.items.find(
                (like) => like.userID === currentUser.attributes.sub
                );
            setMyLike(searchedLike);
        }
        fetchUser();
    }, [])

    const submitLike = async () => {

            const like = {
                userID: user.attributes.sub,
                tweetID: tweet.id
            }

        try {
            const res = await API.graphql(graphqlOperation(createLike, { input: like }));
            setMyLike(res.data.createLike);
            setLikesCount(likesCount + 1);
        } catch(e) {
            console.log(e);
        }
    }

    const removeLike = async () => {
        try {
            await API.graphql(graphqlOperation(deleteLike, { input: { id: myLike.id } }))
            setLikesCount(likesCount - 1);
            setMyLike(null);
        } catch(e) {
            console.log(e);
        }
    }

    const onLike = async () => {
        if (!user){
            return;
        }
        
        if (!myLike) {
            await submitLike();
        } else {
            await removeLike();
        }
    }

    return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            <Feather name="message-circle" size={20} color="grey" />
            <Text style={styles.number}>{tweet.numberOfComments}</Text>
        </View>
        <View style={styles.iconContainer}>
            <EvilIcons name="retweet" size={30} color="grey" />
            <Text style={styles.number}>{tweet.numberOfRetweets}</Text>
        </View>
        <View style={styles.iconContainer}>
            <TouchableOpacity onPress={onLike}>
                <AntDesign name={!myLike ? "hearto" :"heart" } size={18} color={!myLike ? "grey" : "red"} />
                <Text style={styles.number}>{likesCount}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.iconContainer}>
            <EvilIcons name="share-google" size={28} color="grey" />
        </View>
    </View>
    )
}

export default Footer