import React from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createReduxContainer } from 'react-navigation-redux-helpers';
import { createDrawerNavigator } from "react-navigation-drawer";
import { createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import HomeScreen from "../screens/HomeScreen";
import PostModal from "../components/PostModal";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DetailScreen from "../screens/DetailScreen";
import ListingScreen from "../screens/ListingScreen";
import MapScreen from "../screens/MapScreen";
import SavedListingScreen from "../screens/SavedListingScreen";
import ConversationsScreen from "../screens/ConversationsScreen";
import SearchScreen from "../screens/SearchScreen";
import DynamicAppStyles from "../DynamicAppStyles";
import {
  LoadScreen,
  WalkthroughScreen,
  LoginScreen,
  WelcomeScreen,
  SignupScreen,
  SmsAuthenticationScreen
} from "../Core/onboarding";
import DrawerContainer from "../components/DrawerContainer";
import MyProfileScreen from "../components/MyProfileScreen";
import MyListingModal from "../components/MyListingModal";
import ListingProfileModal from "../components/ListingProfileModal";
import ListingAppConfig from "../ListingAppConfig";
import { tabBarBuilder } from "../Core/ui";
import { IMChatScreen } from "../Core/chat";
import { IMEditProfileScreen, IMUserSettingsScreen, IMContactUsScreen } from '../Core/profile';

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0.2,
    timing: Animated.timing,
    easing: Easing.step0
  }
});

// login stack
const LoginStack = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: { header: null }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: () => ({
        headerStyle: authScreensStyles.headerStyle
      })
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: () => ({
        headerStyle: authScreensStyles.headerStyle
      })
    },
    Sms: {
      screen: SmsAuthenticationScreen,
      navigationOptions: () => ({
        headerStyle: authScreensStyles.headerStyle
      })
    }

    // Sms: {
    //   screen: SmsAuthenticationScreen,
    //   navigationOptions: () => ({
    //     headerStyle: authScreensStyles.headerStyle
    //   })
    // }
  },
  {
    initialRouteName: "Welcome",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    },
    headerMode: "none",
    cardShadowEnabled: true
  }
);



const DetailStack = createStackNavigator(
  {
    Detail: { screen: DetailScreen },
    DetailModal: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen }
  },
  {
    mode: "modal",
    headerMode: "screen"
  }
);

const MainHomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Search: { screen: SearchScreen },
    SearchDetail: { screen: DetailScreen },
    Listing: { screen: ListingScreen },
    Detail: { screen: DetailScreen },
    Map: { screen: MapScreen },
    ListingProfileModal: { screen: ListingProfileModal },
    ListingProfileModalDetailsScreen: { screen: DetailScreen }
  },
  {
    initialRouteName: "Home",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    },
    headerMode: "screen",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "#222222",
      headerTitleStyle: styles.headerTitleStyle,
      headerBackTitle: null,
      headerTransparent: true
    }),
  }
);

const MyProfileStack = createStackNavigator(
  {
    MyProfile: { screen: MyProfileScreen },
    MyListingModal: { screen: MyListingModal },
    SavedListingModal: { screen: SavedListingScreen },
    MyListingDetailModal: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
    PostModal: { screen: PostModal },
    Contact: { screen: IMContactUsScreen },
    Settings: { screen: IMUserSettingsScreen },
    AdminDashboard: { screen: AdminDashboardScreen },
    AccountDetail: { screen: IMEditProfileScreen }
  },
  {
    initialRouteName: "MyProfile",
    headerMode: "screen",
    navigationOptions: ({ navigation }) => ({
      headerStyle: authScreensStyles.headerStyle,
      headerTintColor: "#222222",
      headerTitleStyle: styles.headerTitleStyle,
      headerBackTitle: null,
      headerTransparent: true
    }),
  }
);

const CollectionStack = createStackNavigator(
  {
    Category: { screen: CategoryScreen },
    Listing: { screen: ListingScreen },
    Detail: { screen: DetailScreen },
    ListingProfileModalDetailsScreen: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
    ListingProfileModal: { screen: ListingProfileModal },
    Map: { screen: MapScreen }
  },
  {
    initialRouteName: "Category",
    headerMode: "screen",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    }
  }
);


const MapsStack = createStackNavigator(
  {
    Maps: { screen: MapScreen },
    Listing: { screen: ListingScreen },
    Detail: { screen: DetailScreen },
    ListingProfileModalDetailsScreen: { screen: DetailScreen }
  },
  {
    initialRouteName: "Maps",
    headerMode: "float",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    },
    headerLayoutPreset: "center",
    headerTitleAllowFontScaling: true,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "#222222",
      headerTitleStyle: "#222222",
      headerStyle: { backgroundColor: "#222222" },
    })
  }
);

const SearchStack = createStackNavigator(
  {
    Search: { screen: SearchScreen },
    SearchDetail: { screen: DetailScreen },
    ListingProfileModalDetailsScreen: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
    ListingProfileModal: { screen: ListingProfileModal },
    Map: { screen: MapScreen }
  },
  {
    initialRouteName: "Search",
    headerMode: "screen",
    initialRouteParams: {
      appStyles: DynamicAppStyles
    },
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: MainHomeStack },
    Categories: { screen: CollectionStack },
    Maps: { screen: MapsStack },
    MyProfile: { screen: MyProfileStack },
  },
  {
    initialRouteName: "Home",
    tabBarComponent: tabBarBuilder(ListingAppConfig.tabIcons, DynamicAppStyles),
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    },
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
        header: null
      };
    }
  }
);

// drawer stack
const DrawerStack = createDrawerNavigator(
  {
    Tab: TabNavigator
  },
  {
    drawerPosition: "left",
    initialRouteName: "Tab",
    drawerWidth: 200,
    contentComponent: DrawerContainer,
    headerMode: "screen",
    initialRouteParams: {
      appStyles: DynamicAppStyles
    },
    navigationOptions: ({ navigation }) => {
      const routeIndex = navigation.state.index;
      return {
        title: navigation.state.routes[routeIndex].key,
        header: null,
        headerBackTitle: null
      };
    }
  }
);

// // Manifest of possible screens
// const RootNavigator = createStackNavigator(
//   {
//     LoginStack: {
//       screen: LoginStack,
//       navigationOptions: { header: null }
//     },
//     DrawerStack: {
//       screen: DrawerStack,
//       navigationOptions: { header: null }
//     },
//     PersonalMessage: { screen: PersonalMessageScreen }
//   },
//   {
//     // Default config for all screens
//     headerMode: "float",
//     initialRouteName: "DrawerStack",
//     transitionConfig: noTransitionConfig,
//     navigationOptions: ({ navigation }) => ({
//       headerTintColor: "#21c064",
//       headerTitleStyle: styles.headerTitleStyle
//     })
//   }
// );

const MainNavigator = createStackNavigator(
  {
    DrawerStack: {
      screen: DrawerStack,
      navigationOptions: { header: null }
    }
  },
  {
    // Default config for all screens
    headerMode: "screen",
    initialRouteName: "DrawerStack",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    },
    transitionConfig: noTransitionConfig,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: "#222222" },
      headerTintColor: "#222222",
      headerTitleStyle: styles.headerTitleStyle
    })
  }
);



const RootNavigator = createSwitchNavigator(
  {
    LoadScreen: LoadScreen,
    Walkthrough: WalkthroughScreen,
    LoginStack: LoginStack,
    MainStack: MainNavigator
  },
  {
    initialRouteName: "LoadScreen",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig
    },
    cardStyle: {
      backgroundColor: DynamicAppStyles.colorSet.mainThemeBackgroundColor,
    }
  }
);

const styles = StyleSheet.create({
  headerTitleStyle: {
    textAlign: "center",
    alignSelf: "center",
    color: "black",
    flex: 1
  },

  container: {
    backgroundColor: "black"
  }


});

const authScreensStyles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0 // remove shadow on Android
  }
});

const AppContainer = createReduxContainer(RootNavigator);
const mapStateToProps = state => ({
  state: state.nav,
});
const AppNavigator = connect(mapStateToProps)(AppContainer);

export { RootNavigator, AppNavigator };
