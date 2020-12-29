import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react'
import { Text, Image, View } from 'react-native';
import styles from './styles';
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Sound } from 'expo-av/build/Audio';
import { AppContext } from "../../AppContext";
import { API, graphqlOperation } from 'aws-amplify';
import { getSong } from '../../graphql/queries';

const song = {
    id: '2',
    uri: 'https://not-just-trash.s3-eu-west-1.amazonaws.com/WhatsApp+Audio+2020-09-22+at+14.20.25.mp4',
    imageUri: 'https://i.ytimg.com/vi/eYzVt0UmYyw/mqdefault.jpg',
    title: 'notJust Dev Beats',
    artist: 'Vadim'
};

const PlayerWidget = () => {

    const [song, setSong] = useState(null);
    const [sound, setSound] = useState<Sound|null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(null);
    const [position, setPosition] = useState<number|null>(null);

    const { songId } = useContext(AppContext);

    useEffect(() => {
        // fetch data about song
        const fetchSong = async () => {
            try {
                const data = await API.graphql(graphqlOperation(getSong, { id: songId }));
                setSong(data.data.getSong);
            } catch(e) {
                console.log("ERRO!", e);
            }
        }
        fetchSong();
    }, [songId]);

    const onPlaybackStatusUpdate = (status) => {
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
    }

    const playCurrentSong = async () => {
        if (sound) {
            await sound.unloadAsync();
        };

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: song.uri },
            { shouldPlay: isPlaying },
            onPlaybackStatusUpdate
        )

        setSound(newSound);
    };

    useEffect(() => {
        // play the song
        if (song){
            playCurrentSong();
        }
    }, [song]);

    const onPlayPausePress = async () => {
        if (!sound) {
            return;
        }
        if (isPlaying) {
            await sound.stopAsync();
        } else {
            await sound.playAsync();
        }
    }

    const getProgress = () => {
        if (sound === null || duration === null || position === null) {
            return 0;
        }

        return (position / duration) * 100;
    }

    if (!song) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.progress, { width: `${getProgress()}%`}]} />
            <View  style={styles.row}>
            <Image source={{ uri: song.imageUri }} style={styles.image}/>
            <View style={styles.rightContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.title}>{song.title}</Text>
                        <Text style={styles.artist}>{song.artist}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <AntDesign name="hearto" size={30} color={"white"} />
                        <TouchableOpacity onPress={onPlayPausePress}>
                            <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PlayerWidget;
