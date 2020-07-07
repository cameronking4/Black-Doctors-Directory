import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import SavedButton from "../components/SavedButton";
import StarRating from "react-native-star-rating";
import { firebaseReview, firebaseListing } from "../firebase";
import ProfileImageCard from "./ProfileImageCard";
import { firebaseUser } from "../Core/firebase";
import { AppStyles, AppIcon, TwoColumnListStyle } from "../AppStyles";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from '../DynamicAppStyles';

class ListingProfileModal extends Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
    return {
      title: IMLocalized("Profile"),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      listings: [],
      data: null,
      reviews: [],
      isListingDetailVisible: false,
      selectedItem: null,
      loading: true
    };

    this.didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );

    this.userID = props.navigation.getParam("userID");
    this.listingItemActionSheet = React.createRef();
    this.listingsUnsubscribe = null;
  }

  async componentDidMount() {
    const res = await firebaseUser.getUserData(this.userID);

    if (res.success) {
      this.setState({
        user: res.data,
        loading: false
      });
    } else {
      this.onGetUserError();
    }
    this.listingsUnsubscribe = firebaseListing.subscribeListings(
      { userId: this.userID },
      this.onListingsCollectionUpdate
    );

    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  onGetUserError = () => {
    this.setState({ loading: false }, () => {
      alert(
        "0ops! an error occured  while loading profile. This user profile may be incomplete."
      );
      this.props.navigation.goBack();
    });
  };

  componentWillUnmount() {
    if (this.listingsUnsubscribe) {
      this.listingsUnsubscribe();
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.reviewsUnsubscribe) {
      this.reviewsUnsubscribe();
    }

    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onListingsCollectionUpdate = querySnapshot => {
    const listings = [];
    querySnapshot.forEach(doc => {
      const listing = doc.data();

      listings.push({ ...listing, id: doc.id });
    });

    this.setState({
      listings
    });
  };

  onPressListingItem = item => {
    this.props.navigation.navigate("ListingProfileModalDetailsScreen", { item });

    return;
    this.unsubscribe = firebaseListing.subscribeListings(
      { docId: item.id },
      this.onDocUpdate
    );
    this.reviewsUnsubscribe = firebaseReview.subscribeReviews(
      item.id,
      this.onReviewsUpdate
    );
  };

  updateReviews = reviews => {
    this.setState({
      reviews: reviews
    });
  };

  onDocUpdate = doc => {
    const listing = doc.data();

    this.setState(
      {
        data: { ...listing, id: doc.id },
        loading: false
      },
      () => {

      }
    );

    console.log(listing);
  };

  onReviewsUpdate = (querySnapshot, usersRef) => {
    const data = [];
    const updateReviews = this.updateReviews;

    querySnapshot.forEach(doc => {
      const review = doc.data();

      usersRef
        .doc(review.authorID)
        .get()
        .then(function (userDoc) {
          data.push({ ...review, id: doc.id, name: userDoc.data().fullname });
          updateReviews(data);
        });
    });
  };

  // onListingDetailCancel = () => {
  //   this.setState({
  //     isListingDetailVisible: false,
  //   })
  // }

  onPressSavedIcon = item => {
    firebaseListing.saveUnsaveListing(item, this.props.user.id);
  };

  renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.onPressListingItem(item)}>
        <View style={TwoColumnListStyle.listingItemContainer}>
          <FastImage
            style={TwoColumnListStyle.listingPhoto}
            source={{ uri: item.photo }}
          />
          <SavedButton
            style={TwoColumnListStyle.savedIcon}
            onPress={() => this.onPressSavedIcon(item)}
            item={item}
          />
          <Text numberOfLines={1} style={TwoColumnListStyle.listingName}>
            {item.title}
          </Text>
          <Text style={TwoColumnListStyle.listingPlace}>{item.place}</Text>
          <StarRating
            containerStyle={styles.starRatingContainer}
            maxStars={5}
            starSize={15}
            disabled={true}
            starStyle={styles.starStyle}
            emptyStar={AppIcon.images.starNoFilled}
            fullStar={AppIcon.images.starFilled}
            halfStarColor={DynamicAppStyles.colorSet.mainThemeForegroundColor}
            rating={item.starCount}
          />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { user } = this.state;

    if (this.state.loading) {
      return <ActivityIndicator size="small" color={AppStyles.color.main} />;
    }

    console.log("this.user", this.state.user);

    if (!this.state.loading && !this.state.user) {
      return null;
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.profileCardContainer}>
            <ProfileImageCard disabled={true} user={user} />
          </View>
          <View style={styles.profileItemContainer}>
            <View style={styles.detailContainer}>
              <Text style={styles.profileInfo}>{"Profile Info"}</Text>
              <View style={styles.profileInfoContainer}>
                <View style={styles.profileInfoTitleContainer}>
                  <Text style={styles.profileInfoTitle}>
                    {"Phone Number :"}
                  </Text>
                </View>
                <View style={styles.profileInfoValueContainer}>
                  <Text style={styles.profileInfoValue}>
                    {user.phoneNumber ? user.phoneNumber : ""}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.gridContainer}>
              <Text style={styles.myListings}>{"Listings"}</Text>
              <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={this.state.listings}
                renderItem={(item) => this.renderListingItem(item)}
                keyExtractor={item => `${item.id}`}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

ListingProfileModal.propTypes = {
  user: PropTypes.object,
  onModal: PropTypes.func,
  isProfileModalVisible: PropTypes.bool,
  presentationStyle: PropTypes.string
};

const itemIconSize = 26;
const itemNavigationIconSize = 23;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1
  },
  cardImageContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  cardImage: {
    height: 130,
    width: 130,
    borderRadius: 65
  },
  gridContainer: {
    padding: Configuration.home.listing_item.offset,
    marginTop: 10
  },
  cardNameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cardName: {
    color: AppStyles.color.text,
    fontSize: 19
  },
  container: {
    flex: 1,
  },
  profileCardContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  profileItemContainer: {
    marginTop: 6
  },
  itemContainer: {
    flexDirection: "row",
    height: 54,
    width: "85%",
    alignSelf: "center",
    marginBottom: 10
  },
  itemIconContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  itemIcon: {
    height: itemIconSize,
    width: itemIconSize
  },
  itemTitleContainer: {
    flex: 6,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  itemTitle: {
    color: AppStyles.color.text,
    fontSize: 17,
    paddingLeft: 20
  },
  itemNavigationIconContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  rightButton: {
    marginRight: 10,
    color: AppStyles.color.main
  },
  itemNavigationIcon: {
    height: itemNavigationIconSize,
    width: itemNavigationIconSize,
    tintColor: AppStyles.color.grey
  },
  detailContainer: {
    backgroundColor: "#efeff4",
    padding: 20,
    marginTop: 25
  },
  profileInfo: {
    padding: 5,
    color: "#333333",
    fontSize: 14
  },
  myListings: {
    paddingTop: 5,
    paddingBottom: 20,
    fontWeight: "500",
    color: "#333333",
    fontSize: 17
  },
  profileInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    width: "100%"
  },
  profileInfoTitleContainer: {
    flex: 1,
    // alignItems: "center",
    // backgroundColor: "green",
    justifyContent: "center"
  },
  profileInfoTitle: {
    color: "#595959",
    fontSize: 12,
    padding: 5
  },
  profileInfoValueContainer: {
    flex: 2,
    // alignItems: "center",
    // backgroundColor: "yellow",
    justifyContent: "center"
  },
  profileInfoValue: {
    color: "#737373",
    fontSize: 12,
    padding: 5
  },
  footerButtonContainer: {
    flex: 2,
    justifyContent: "flex-start",
    marginTop: 8
  },
  footerContainerStyle: {
    // borderColor: AppStyles.color.grey
  },
  blank: {
    flex: 0.5
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(ListingProfileModal);
