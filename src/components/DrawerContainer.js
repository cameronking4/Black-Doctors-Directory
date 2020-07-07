import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import MenuButton from '../components/MenuButton';
import { AppIcon } from '../AppStyles';


class DrawerContainer extends React.Component {
  render() {
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <MenuButton
            title="LOG OUT"
            source={AppIcon.images.logout}
            onPress={() => {
              navigation.dispatch({ type: 'Logout' });
            }}
          />
        </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#1A99F4",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: "#1A99F4"
  }
});

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(DrawerContainer);
