import { IMLocalized } from "./Core/localization/IMLocalization";
import AppStyles from "./DynamicAppStyles";
import { setI18nConfig } from './Core/localization/IMLocalization';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const ListingAppConfig = {
  isSMSAuthEnabled: true,
  appIdentifier: "BlackMD",
  onboardingConfig: {
    welcomeTitle: IMLocalized("BlackMD Cares"),
    welcomeCaption: IMLocalized("The Black Healthcare Discovery App"),
    walkthroughScreens: [
      {
        icon: require("../assets/icons/doctor.png"),
        title: IMLocalized("BlackMD Cares"),
        description: IMLocalized("Our mission is to eliminate racial disparities in healthcare.")
      },
      {
        icon: require("../assets/icons/doctor.png"),
        title: IMLocalized("Discover Providers"),
        description: IMLocalized(
          "Find Black healthcare providers across various specialities nearby."
        )
      },
      {
        icon: require("../assets/icons/map.png"),
        title: IMLocalized("Map View"),
        description: IMLocalized(
          "Discover providers on the map to make your search easier."
        )
      },
      {
        icon: require("../assets/icons/heart.png"),
        title: IMLocalized("Save Listings"),
        description: IMLocalized(
          "Save your favorite listings to come back to them later."
        )
      },
      {
        icon: require("../assets/icons/filters.png"),
        title: IMLocalized("Advanced Custom Filters"),
        description: IMLocalized(
          "Use dynamic filters to accommodate all insurances and patient needs."
        )
      },
      {
        icon: require("../assets/icons/notification.png"),
        title: IMLocalized("Get Notified"),
        description: IMLocalized(
          "Stay updated with real-time push notifications."
        )
      }
    ]
  },

  tabIcons: {
    Home: {
      focus: AppStyles.iconSet.homefilled,
      unFocus: AppStyles.iconSet.homeUnfilled
    },
    Categories: {
      focus: AppStyles.iconSet.collections,
      unFocus: AppStyles.iconSet.collections
    },
    MyProfile: {
      focus: AppStyles.iconSet.accountDetail,
      unFocus: AppStyles.iconSet.accountDetail
    },
    Maps: {
      focus: AppStyles.iconSet.map,
      unFocus: AppStyles.iconSet.map
    },
  },
  reverseGeoCodingAPIKey: "AIzaSyBt4x-qpi6R5-NWOOz66Vc2f2Dx97N0JhU",
  tosLink: "http://cameronking.nyc",
  editProfileFields: {
    sections: [
      {
        title: IMLocalized("PUBLIC PROFILE"),
        fields: [
          {
            displayName: IMLocalized("First Name"),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name'
          },
          {
            displayName: IMLocalized("Last Name"),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Your last name'
          },
          {
            displayName: IMLocalized("Are you a health care provider?"),
            type: 'switch',
            editable: true,
            key: 'isBarber',
          }
        ]
      },
      {
        title: IMLocalized("PRIVATE DETAILS"),
        fields: [
          {
            displayName: IMLocalized("E-mail Address"),
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address'
          },
          {
            displayName: IMLocalized("Phone Number"),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number'
          }
        ]
      }
    ]
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized("GENERAL"),
        fields: [
          {
            displayName: IMLocalized("Allow Push Notifications"),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: false,
          },
          // {
          //   displayName: IMLocalized("Enable Face ID / Touch ID"),
          //   type: 'switch',
          //   editable: true,
          //   key: 'face_id_enabled',
          //   value: false
          // },
          // {
          //   displayName: IMLocalized("Enable Barber Settings"),
          //   type: 'switch',
          //   editable: true,
          //   key: 'isBarber',
          //   value: false
          // },
          // {
          //   displayName: IMLocalized("Enable Admin Settings"),
          //   type: 'switch',
          //   editable: false,
          //   key: 'isAdmin',
          //   value: false
          // }
        ]
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized("Save"),
            type: 'button',
            key: 'savebutton',
          }
        ]
      }
    ]
  },
  contactUsFields: {
    sections: [
      {
        // title: IMLocalized("Support"),
        fields: [
          {
            displayName: IMLocalized("Privacy Policy"),
            type: 'button',
            editable: false,
            key: 'contacus',
            value: "142 Steiner Street, San Francisco, CA, 94115",
          },
          {
            displayName: IMLocalized("Terms of Service"),
            type: 'button',
            editable: false,
            key: 'contacus',
            value: "142 Steiner Street, San Francisco, CA, 94115",
          },
          {
            displayName: IMLocalized("Disclaimer"),
            type: 'button',
            editable: false,
            key: 'contacus',
            value: "142 Steiner Street, San Francisco, CA, 94115",
          },
          {
            displayName: IMLocalized("E-mail us"),
            value: 'support@blackmdcares.com',
            type: 'button',
            editable: false,
            key: 'email',
            placeholder: 'Your email address'
          }
        ]
      },
      // {
      //   title: '',
      //   fields: [
      //     {
      //       displayName: IMLocalized("Call Us"),
      //       type: 'button',
      //       key: 'savebutton',
      //     }
      //   ]
      // }
    ]
  },
  contactUsPhoneNumber: "+9198865028",
  privacypolicy: "http://google.com",
  termsofservice: "http://google.com",
  homeConfig: {
    mainCategoryID: "wxHH0kJnCExOI6sHaXvX",
    mainCategoryName: "Providers Near Me"
  }
};

export default ListingAppConfig;
