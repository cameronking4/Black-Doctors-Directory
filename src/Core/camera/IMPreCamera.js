import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Animated, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

function IMPreCamera(props) {
  const {
    onCameraClose,
    onCameraSwitch,
    takePicture,
    record,
    stopRecording,
    onOpenPhotos,
  } = props;

  const [minutesCounter, setMinutesCounter] = useState('00');
  const [secondsCounter, setSecondsCounter] = useState('00');
  const minutesCounterRef = useRef('00');
  const secondsCounterRef = useRef('00');
  const recordAnimatedValue = useRef(new Animated.Value(1));
  const caputureAnimatedValue = useRef(new Animated.Value(0));
  const longPressActive = useRef(false);
  const shouldAnimate = useRef(true);
  const timer = useRef(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const onTimerStart = () => {
    timer.current = setInterval(() => {
      let num = (Number(secondsCounterRef.current) + 1).toString(),
        count = minutesCounterRef.current;

      if (Number(secondsCounterRef.current) === 59) {
        count = (Number(minutesCounterRef.current) + 1).toString();
        num = '00';
      }

      minutesCounterRef.current = count.length === 1 ? '0' + count : count;
      secondsCounterRef.current = num.length === 1 ? '0' + num : num;

      setSecondsCounter(secondsCounterRef.current);
      setMinutesCounter(minutesCounterRef.current);
    }, 1000);
  };

  const onTimerStop = () => {
    clearInterval(timer.current);
  };

  const onTimerClear = () => {
    timer.current = null;
    minutesCounterRef.current = '00';
    secondsCounterRef.current = '00';
    setMinutesCounter('00');
    setSecondsCounter('00');
  };

  const onRecordAnimate = () => {
    Animated.sequence([
      Animated.timing(recordAnimatedValue.current, {
        duration: 1000,
        toValue: 2,
      }),
      Animated.timing(recordAnimatedValue.current, {
        duration: 1000,
        toValue: 1,
      }),
    ]).start(() => {
      if (shouldAnimate.current) {
        onRecordAnimate();
      }
    });
  };

  const onButtonAnimate = end => {
    Animated.timing(caputureAnimatedValue.current, {
      duration: 1200,
      toValue: end,
    }).start();
  };

  const onCaptureButtonPressOut = () => {
    if (longPressActive.current) {
      longPressActive.current = false;
      onButtonAnimate(0);
      shouldAnimate.current = false;
      onTimerStop();
      onTimerClear();
      stopRecording();
    }
  };

  const startAnimation = () => {
    longPressActive.current = true;
    shouldAnimate.current = true;
    onButtonAnimate(1);
    onRecordAnimate();
    onTimerStart();
    record();
  };

  const backgroundColor = recordAnimatedValue.current.interpolate({
    inputRange: [1, 2],
    outputRange: ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.6)'],
  });

  const captureBackgroundColor = caputureAnimatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f5f6f5', '#ff0000'],
  });

  const opacity = recordAnimatedValue.current.interpolate({
    inputRange: [1, 2],
    outputRange: [0, 0.5],
  });

  const scale = recordAnimatedValue.current.interpolate({
    inputRange: [1, 2],
    outputRange: [1, 2.5],
  });

  const transformScaleStyle = {
    transform: [
      {
        scale,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCameraClose} style={styles.closeButton}>
        <View style={[styles.closeCross, { transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.closeCross, { transform: [{ rotate: '-45deg' }] }]} />
      </TouchableOpacity>
      {longPressActive.current && (
        <View style={styles.timerContainer}>
          <View style={styles.recordDot} />
          <Text style={styles.timer}>
            {minutesCounter} : {secondsCounter}
          </Text>
        </View>
      )}

      <View style={styles.control}>
        <TouchableOpacity onPress={onCameraSwitch}>
          <Image
            source={require('../../CoreAssets/camera-rotate.png')}
            style={styles.imageIcon}
          />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 11 }}>
          <Animated.View
            style={[
              styles.capture,
              { backgroundColor },
              transformScaleStyle,
              { opacity },
            ]}></Animated.View>
          <AnimatedButton
            activeOpacity={0.7}
            onLongPress={startAnimation}
            onPressOut={onCaptureButtonPressOut}
            onPress={takePicture}
            style={[
              styles.capture,
              {
                position: 'absolute',
                top: 0,
                backgroundColor: captureBackgroundColor,
              },
            ]}
          />
        </View>

        <TouchableOpacity onPress={onOpenPhotos}>
          <Image
            source={require('../../CoreAssets/library-landscape.png')}
            style={styles.imageIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

IMPreCamera.propTypes = {
  onCameraClose: PropTypes.func,
  onCameraSwitch: PropTypes.func,
  takePicture: PropTypes.func,
  onOpenPhotos: PropTypes.func,
};

export default IMPreCamera;
