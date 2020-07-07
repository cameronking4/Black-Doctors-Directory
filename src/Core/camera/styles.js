import { StyleSheet, Dimensions } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  preview: {
    ...StyleSheet.absoluteFill,
  },
  closeButton: {
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c5c4',
    opacity: 0.7,
    zIndex: 2,
  },
  image: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  closeCross: {
    width: '68%',
    height: 1,
    backgroundColor: 'black',
  },
  control: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 38,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    position: 'absolute',
    bottom: 45,
    right: 15,
    height: 32,
    width: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f5',
    opacity: 0.7,
    zIndex: 2,
  },
  capture: {
    backgroundColor: '#f5f6f5',
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  imageIcon: {
    height: 28,
    width: 28,
    tintColor: '#3875e8',
  },
  timerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  timer: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: '#ff0000',
    marginHorizontal: 5,
  },
});

export default styles;
