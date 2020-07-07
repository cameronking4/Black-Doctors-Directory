import React, { Component } from "react";
import { BackHandler, View, Linking } from "react-native";
import { connect } from "react-redux";
import { AppIcon } from "../AppStyles";
import authManager from "../Core/onboarding/utils/authManager";
import DynamicAppStyles from "../DynamicAppStyles";
import ListingAppConfig from "../ListingAppConfig";
import { IMUserProfileComponent } from '../Core/profile';
import { logout, setUserData } from '../Core/onboarding/redux/auth';
import { IMLocalized } from "../Core/localization/IMLocalization";
import { ScrollView } from "react-native-gesture-handler";

class MyProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: IMLocalized("My Profile"),
    headerStyle: {
      backgroundColor: "black"
    },
    headerTitleStyle: {
      color: "white"
    },
  });

  constructor(props) {
    super(props);

    this.didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onLogout() {
    authManager.logout(this.props.user);
    this.props.logout();
    this.props.navigation.navigate("LoadScreen", {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    });
  }

  onUpdateUser = newUser => {
    this.props.setUserData({ user: newUser, isBarber: this.props.user.isBarber });
    console.log(this.props.isBarber)
  };

  render() {
    var menuItems = [
      {
        title: IMLocalized("My Favorites"),
        tintColor: "#df9292",
        icon: AppIcon.images.wishlistFilled,
        onPress: () => this.props.navigation.navigate("SavedListingModal"),
      },
      {
        title: IMLocalized('Account Details'),
        icon: AppIcon.images.accountDetail,
        tintColor: '#6b7be8',
        onPress: () => this.props.navigation.navigate("AccountDetail", {
          appStyles: DynamicAppStyles,
          form: ListingAppConfig.editProfileFields,
          screenTitle: IMLocalized('Edit Profile'),
        }),
      },
      {
        title: IMLocalized('Settings'),
        icon: AppIcon.images.settings,
        tintColor: '#a6a4b1',
        onPress: () => this.props.navigation.navigate("Settings", {
          appStyles: DynamicAppStyles,
          form: ListingAppConfig.userSettingsFields,
          screenTitle: IMLocalized('Settings'),
        }),
      },
      {
        title: IMLocalized('Contact Us'),
        icon: AppIcon.images.contactUs,
        tintColor: '#9ee19f',
        onPress: () => this.props.navigation.navigate("Contact", {
          appStyles: DynamicAppStyles,
          form: ListingAppConfig.contactUsFields,
          screenTitle: IMLocalized('Contact us'),
        }),
      },
    ];

    if (this.props.isBarber) {
      menuItems.push(
        {
          title: IMLocalized('My Listings'),
          icon: AppIcon.images.contactUs,
          tintColor: "#baa3f3",
          icon: AppIcon.images.list,
          onPress: () => this.props.navigation.navigate("MyListingModal"),
        }
      )
    }
    if (this.props.isAdmin) {
      menuItems.push(
        {
          title: IMLocalized("Admin Dashboard"),
          tintColor: "#8aced8",
          icon: AppIcon.images.checklist,
          onPress: () => this.props.navigation.navigate("AdminDashboard"),
        }
      )
    }
    menuItems.push(
      {
        title: IMLocalized('Privacy Policy'),
        // icon: AppIcon.images.contactUs,
        tintColor: '#9ee19f',
        onPress: () => {
          Linking.openURL("https://drive.google.com/file/d/1STh3CWstcA9EwgUNGFl9T-BYxg7YCIha/view?usp=sharing")
        },
      },
      {
        title: IMLocalized('Terms of Service'),
        // icon: AppIcon.images.contactUs,
        tintColor: '#9ee19f',
        onPress: () => {
          Linking.openURL("https://drive.google.com/file/d/1BL72fgAkF6-8qf80wFwwvmoqukpb_GvF/view?usp=sharing")
        },
      }
    );

    return (
      <ScrollView style={{ flex: 1, overflow: "scroll" }}>
        <IMUserProfileComponent
          user={this.props.user}
          onUpdateUser={(user) => this.onUpdateUser(user)
          }
          onLogout={() => this.onLogout()}
          menuItems={menuItems}
          appStyles={DynamicAppStyles}
        />
      </ScrollView>);
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    isAdmin: auth.user && auth.user.isAdmin,
    isBarber: auth.user && auth.user.isBarber,
  };
};


export default connect(mapStateToProps, {
  logout,
  setUserData
})(MyProfileScreen);
