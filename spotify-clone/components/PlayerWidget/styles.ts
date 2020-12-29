import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 47,
        width: '100%',
        backgroundColor: '#131313',
        borderWidth: 2,
        borderColor: 'black',
    },
    progress: {
        height: 3,
        backgroundColor: '#bcbcbc'
    },
    row: {
        flexDirection: 'row'
    },
    image: {
        width: 75,
        height: 75,
        marginRight: 10
    },
    rightContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between' 
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        justifyContent: 'space-around'
    },
    title: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        margin: 10
    },
    artist: {
        color: 'lightgray',
        fontSize: 13
    }
});

export default styles;