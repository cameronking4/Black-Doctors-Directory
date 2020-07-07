import React, { useState } from 'react';
import { Text, TextInput, View, Alert, Image, TouchableOpacity } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDynamicStyleSheet } from 'react-native-dark-mode';
import dynamicStyles from './styles';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { IMLocalized } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';

const SignupScreen = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBarber, setIsBarber] = useState(false);
  const [completedReg, setCompletedReg] = useState(false);

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const appConfig = (props.navigation.state.params.appConfig || props.navigation.getParam('appConfig'));
  const appStyles = (props.navigation.state.params.appStyles || props.navigation.getParam('appStyles'));
  const styles = useDynamicStyleSheet(dynamicStyles(appStyles));

  const showActionSheet = () => {
    this.ActionSheet.show()
  }

  const isDoctor = () => {
    setIsBarber(previousState => !previousState);
    setCompletedReg(previousState => !previousState);

  }
  const onActionDone = index => {

    if (index == 0) {
      Alert.alert(
        IMLocalized("You are signing up as a healthcare provider!"),
        IMLocalized("Please visit www.blackmdcares.com to finish registration"),
        [

          {
            text: IMLocalized("Cancel"),
            style: "destructive"
          },
          {
            text: IMLocalized("Continue"),
            onPress: isDoctor
          },
        ],
        { cancelable: false }
      );
    }
  };

  const onRegister = () => {
    setLoading(true);

    const userDetails = {
      firstName,
      lastName,
      email,
      password,
      isBarber,
      completedReg,
      photoURI: profilePictureURL,
      appIdentifier: appConfig.appIdentifier
    };
    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig.appIdentifier)
      .then(response => {
        const user = response.user;
        if (user) {
          props.setUserData({ user: user });
          props.navigation.navigate('MainStack', { user: user });
        } else {
          Alert.alert('', localizedErrorMessage(response.error), [{ text: IMLocalized('OK') }], {
            cancelable: true,
          });
        }
        setLoading(false);
      })
  };

  const renderSignupWithEmail = () => {
    return (
      <View>
        <View>
          <Button
            style={styles.sendContainer, { backgroundColor: "#ffffff" }}
            onPress={showActionSheet}>
            Are you a healthcare provider?
          </Button>
          <ActionSheet
            ref={o => this.ActionSheet = o}
            title={'Are you a black healthcare provider?'}
            options={['Yes', 'No']}
            cancelButtonIndex={1}
            destructiveButtonIndex={1}
            onPress={(index) => { onActionDone(index) }}
          />
        </View>
        <View>
          <TextInput
            style={styles.InputContainer}
            placeholder={IMLocalized('First Name')}
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setFirstName(text)}
            value={firstName}
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.InputContainer}
            placeholder={IMLocalized('Last Name')}
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setLastName(text)}
            value={lastName}
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.InputContainer}
            placeholder={IMLocalized('E-mail Address')}
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize='none'
          />
          <TextInput
            style={styles.InputContainer}
            placeholder={IMLocalized('Password')}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize='none'
          />
        </View>
        <Text></Text><Text></Text>

        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}
        >
          {IMLocalized('Sign Up')}
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps='always'>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image style={appStyles.styleSet.backArrowStyle} source={appStyles.iconSet.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />
        {renderSignupWithEmail()}
        {appConfig.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                })
              }
            >
              {IMLocalized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData
})(SignupScreen);
