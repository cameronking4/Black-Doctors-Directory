import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler
} from "react-native";
import StarRating from "react-native-star-rating";
import { firebaseListing } from "../firebase";
import { AppStyles, AppIcon, TwoColumnListStyle } from "../AppStyles";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import SavedButton from "../components/SavedButton";
import { Configuration } from "../Configuration";
import DynamicAppStyles from '../DynamicAppStyles';
import { IMLocalized } from "../Core/localization/IMLocalization";

class SavedListingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: IMLocalized("Saved Listings"),
    headerStyle: {
      backgroundColor: '#fafafa'
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      savedListings: [],
      loading: false,
      error: null,
      refreshing: false
    };

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
    this.savedListingsUnsubscribe = firebaseListing.subscribeSavedListings(
      this.props.user.id,
      this.onSavedListingsCollectionUpdate
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

  componentWillUnmount() {
    if (this.listingsUnsubscribe) {
      this.listingsUnsubscribe();
    }

    if (this.savedListingsUnsubscribe) {
      this.savedListingsUnsubscribe();
    }

    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onSavedListingsCollectionUpdate = querySnapshot => {
    const savedListingdata = [];
    querySnapshot.forEach(doc => {
      const savedListing = doc.data();
      savedListingdata.push(savedListing.listingID);
    });

    if (this.listingsUnsubscribe) this.listingsUnsubscribe();
    this.listingsUnsubscribe = firebaseListing.subscribeListings(
      {},
      this.onListingsCollectionUpdate
    );

    this.setState({
      savedListings: savedListingdata,
      loading: false
    });
  };

  onListingsCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const listing = doc.data();
      if (this.state.savedListings.findIndex(k => k == doc.id) >= 0) {
        listing.saved = true;
        data.push({ ...listing, id: doc.id });
      }
    });

    this.setState({
      listings: data,
      loading: false
    });
  };

  onPressListingItem = item => {
    this.props.navigation.navigate("MyListingDetailModal", { item });
  };

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
    return (
      <View style={styles.container}>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={this.state.listings}
          renderItem={this.renderListingItem}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Configuration.home.listing_item.offset
  },
  rightButton: {
    marginRight: 10,
    color: AppStyles.color.main
  },
  starRatingContainer: {
    width: 90,
    marginTop: 10
  },
  starStyle: {
    tintColor: "black"
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(SavedListingScreen);
