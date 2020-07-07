import { Platform, StyleSheet, Dimensions } from "react-native";
import { DynamicValue } from "react-native-dark-mode";
import { Configuration } from "./Configuration";
import TNColor from "./Core/truly-native/TNColor";

const { width, height } = Dimensions.get("window");
const SCREEN_WIDTH = width < height ? width : height;
const numColumns = 2;

export const AppStyles = {
  color: {
    main: "#222225",
    text: "#4b4f52",
    title: "#464646",
    subtitle: "#545454",
    categoryTitle: "#161616",
    tint: "#1A99F4",
    description: "#bbbbbb",
    filterTitle: "#8a8a8a",
    starRating: "#d4af37",
    location: "#a9a9a9",
    white: "white",
    facebook: "#4267b2",
    grey: "#a0a0a0",
    greenBlue: "#d4af37",
    placeholder: "#a0a0a0",
    background: "#1A99F4",
    blue: "black",
  },
  colorSet: {
    mainThemeForegroundColor: new DynamicValue("#222225", "#222225"),
    mainTextColor: new DynamicValue("#151723", "#151723"),
    mainSubtextColor: new DynamicValue("#7e7e7e", "#f5f5f5"),
    hairlineColor: new DynamicValue("#e0e0e0", "#222222"),
    grey0: TNColor("#eaeaea"),
    grey3: TNColor("#e6e6f2"),
    grey6: TNColor("#d6d6d6"),
    grey9: TNColor("#939393"),
    subHairlineColor: new DynamicValue("#f2f2f3", "#f2f2f3"),
    tint: new DynamicValue("#22225", "#222225"),
    facebook: new DynamicValue("#4267b2", "#4267b2"),
    grey: new DynamicValue("grey", "grey"),
    whiteSmoke: new DynamicValue("#f5f5f5", "#f5f5f5"),
    headerStyleColor: new DynamicValue("#222222", "#222222"),
    headerBackgroundColor: new DynamicValue("#222222", "#222222"),
    headerTintColor: new DynamicValue("#222222", "#222222"),
    bottomStyleColor: new DynamicValue("#ffffff", "#222222"),
    bottomTintColor: new DynamicValue("white", "white"),
    mainButtonColor: new DynamicValue("#22222", "#222222"),
    subButtonColor: new DynamicValue("#222222", "#222222"),
    tabColor: new DynamicValue("#0d0d0d", "#0d0d0d")
  },
  navThemeConstants: {
    light: {
      backgroundColor: "black",
      fontColor: "#000",
      secondaryFontColor: "#7e7e7e",
      activeTintColor: "#222222",
      inactiveTintColor: "#ccc",
      hairlineColor: "#e0e0e0"
    },
    dark: {
      backgroundColor: "#121212",
      fontColor: "#fff",
      secondaryFontColor: "#fff",
      activeTintColor: "#3875e8",
      inactiveTintColor: "#888",
      hairlineColor: "#222222"
    },
    main: "#222222"
  },
  fontSize: {
    title: 30,
    content: 20,
    normal: 16
  },
  buttonWidth: {
    main: "70%"
  },
  textInputWidth: {
    main: "80%"
  },
  fontName: {
    main: "FontAwesome",
    bold: "FontAwesome"
  },
  borderRadius: {
    main: 25,
    small: 5
  },
};

export const AppIcon = {
  style: {
    tintColor: AppStyles.color.tint,
    width: 28,
    height: 28
  },
  images: {
    home: require("../assets/icons/home.png"),
    categories: require("../assets/icons/categories.png"),
    collections: require("../assets/icons/collections.png"),
    compose: require("../assets/icons/compose.png"),
    filter: require("../assets/icons/filter.png"),
    filters: require("../assets/icons/filters.png"),
    heart: require("../assets/icons/heart.png"),
    heartFilled: require("../assets/icons/heart-filled.png"),
    map: require("../assets/icons/map.png"),
    search: require("../assets/icons/search.png"),
    review: require("../assets/icons/review.png"),
    list: require("../assets/icons/list.png"),
    starFilled: require("../assets/icons/star_filled.png"),
    inscription: require("../assets/icons/inscription.png"),
    starNoFilled: require("../assets/icons/star_nofilled.png"),
    defaultUser: require("../assets/icons/default_user.jpg"),
    logout: require("../assets/icons/shutdown.png"),
    rightArrow: require("../assets/icons/right-arrow.png"),
    accountDetail: require("../assets/icons/account-detail.png"),
    wishlistFilled: require("../assets/icons/wishlist-filled.png"),
    orderDrawer: require("../assets/icons/order-drawer.png"),
    settings: require("../assets/icons/settings.png"),
    contactUs: require("../assets/icons/contact-us.png"),
    delete: require("../assets/icons/delete.png"),
    communication: require("../assets/icons/communication.png"),
    comment: require("../assets/icons/comment.png"),
    cameraFilled: require("../assets/icons/camera-filled.png"),
    send: require("../assets/icons/send.png"),
    boederImgSend: require("../assets/icons/borderImg1.png"),
    boederImgReceive: require("../assets/icons/borderImg2.png"),
    textBoederImgSend: require("../assets/icons/textBorderImg1.png"),
    textBoederImgReceive: require("../assets/icons/textBorderImg2.png"),
    emptyAvatar: require("../assets/icons/empty-avatar.jpg"),
    checklist: require("../assets/icons/checklist.png")
  }
};

export const HeaderButtonStyle = StyleSheet.create({
  multi: {
    flexDirection: "row"
  },
  container: {
    padding: 10
  },
  image: {
    justifyContent: "center",
    width: 35,
    height: 35,
    margin: 6
  },
  rightButton: {
    color: AppStyles.color.tint,
    marginRight: 10,
    fontWeight: "normal",
    fontFamily: AppStyles.fontName.main,
  },
  leftButton: {
    color: AppStyles.color.tint,
    marginLeft: 10,
    fontWeight: "normal",
    fontFamily: AppStyles.fontName.main
  }
});

export const ListStyle = StyleSheet.create({

  title: {
    fontSize: 16,
    color: AppStyles.color.subtitle,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold"
  },
  subtitleView: {
    minHeight: 55,
    flexDirection: "row",
    paddingTop: 5,
    marginLeft: 10
  },
  leftSubtitle: {
    flex: 2
  },
  time: {
    color: AppStyles.color.description,
    fontFamily: AppStyles.fontName.main,
    flex: 1,
    textAlignVertical: "bottom"
  },
  place: {
    fontWeight: "bold",
    color: AppStyles.color.location
  },
  price: {
    flex: 1,
    fontSize: 14,
    color: AppStyles.color.subtitle,
    fontFamily: AppStyles.fontName.bold,
    textAlignVertical: "bottom",
    alignSelf: "flex-end",
    textAlign: "right"
  },
  avatarStyle: {
    height: 80,
    width: 80
  }
});

export const TwoColumnListStyle = {
  listings: {
    marginTop: 15,
    width: "100%",
    flex: 1
  },
  showAllButtonContainer: {
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: '#63BEFF',
    color: "#fffff",
    height: 50,
    width: "100%",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: 'center',
  },
  showAllButtonText: {
    textAlign: "center",
    color: "#fffff",
    fontFamily: AppStyles.fontName.bold,
    justifyContent: "center",
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 'bold'
  },
  listingItemContainer: {
    justifyContent: "center",
    marginBottom: 30,
    marginRight: Configuration.home.listing_item.offset,
    width:
      (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns
  },
  photo: {
    // position: "absolute",
  },
  listingPhoto: {
    width:
      (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns,
    height: Configuration.home.listing_item.height
  },
  savedIcon: {
    position: "absolute",
    top: Configuration.home.listing_item.saved.position_top,
    left:
      (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns -
      Configuration.home.listing_item.offset -
      Configuration.home.listing_item.saved.size,
    width: Configuration.home.listing_item.saved.size,
    height: Configuration.home.listing_item.saved.size
  },
  listingName: {
    fontSize: 15,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold",
    color: AppStyles.color.categoryTitle,
    marginTop: 5
  },
  listingPlace: {
    fontFamily: AppStyles.fontName.bold,
    color: AppStyles.color.subtitle,
    marginTop: 5
  }
};

export const ModalSelectorStyle = {
  optionTextStyle: {
    color: AppStyles.color.subtitle,
    fontSize: 16,
    fontFamily: AppStyles.fontName.main
  },
  selectedItemTextStyle: {
    fontSize: 18,
    color: AppStyles.color.blue,
    fontFamily: AppStyles.fontName.main,
    fontWeight: "bold"
  },
  optionContainerStyle: {
    backgroundColor: AppStyles.color.white,
  },
  cancelContainerStyle: {
    backgroundColor: AppStyles.color.white,
    borderRadius: 10
  },
  sectionTextStyle: {
    fontSize: 21,
    color: AppStyles.color.title,
    fontFamily: AppStyles.fontName.main,
    fontWeight: "bold"
  },

  cancelTextStyle: {
    fontSize: 21,
    color: AppStyles.color.blue,
    fontFamily: AppStyles.fontName.main
  }
};

export const ModalHeaderStyle = {
  bar: {
    height: 80,
    marginTop: 0,
    paddingTop: 10,
    justifyContent: "center",
    backgroundColor: "black"
  },
  title: {
    position: "absolute",
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
    fontSize: 18,
    paddingTop: 60,
    paddingBottom: 20,
    color: "white",
    fontFamily: AppStyles.fontName.main
  },
  rightButton: {
    top: 0,
    right: 0,
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    color: AppStyles.color.tint,
    fontWeight: "normal",
    fontFamily: AppStyles.fontName.main
  }
};

export default AppStyles;
