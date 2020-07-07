import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  BackHandler
} from "react-native";
import Button from "react-native-button";
import StarRating from "react-native-star-rating";
import FastImage from "react-native-fast-image";
import { firebaseListing } from "../firebase";
import firebase from 'react-native-firebase';
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import {
  AppIcon,
  AppStyles,
  HeaderButtonStyle,
  TwoColumnListStyle
} from "../AppStyles";
import HeaderButton from "../components/HeaderButton";
import PostModal from "../components/PostModal";
import SavedButton from "../components/SavedButton";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from "../DynamicAppStyles";
import ListingAppConfig from '../ListingAppConfig';
import { MapScreen } from '../screens/MapScreen'
import GetLocation from 'react-native-get-location';
import Geolocation from '@react-native-community/geolocation';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: IMLocalized("BlackMD Cares"),
    headerStyle: {
      backgroundColor: styles.header.backgroundColor,
    },
    headerTitleStyle: {
      color: "white"
    },
    headerRight:
      <View style={HeaderButtonStyle.multi} >
        <HeaderButton
          customStyle={styles.mapButton}
          icon={DynamicAppStyles.iconSet.search}
          onPress={() => {
            navigation.navigate("Search");
          }}
        />
      </View >
  });

  constructor(props) {
    super(props);

    this.listingItemActionSheet = React.createRef();

    this.state = {
      activeSlide: 0,
      categories: [],
      listings: [],
      allListings: [],
      savedListings: [],
      selectedItem: null,
      showedAll: false,
      postModalVisible: true,
      myLoc: "",
      myLat: "",
      isEmpty: true,
      isBarber: true,
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
  componentWillMount() {
    this.onListingsCollectionUpdate
    Geolocation.getCurrentPosition(
      position => {
        const myLat = JSON.stringify(position.coords.latitude);
        const myLong = JSON.stringify(position.coords.longitude);
        this.setState({
          myLat: myLat,
          myLong: myLong,
        });
        console.log(myLat, myLong);
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.listingsUnsubscribe = firebaseListing.subscribeListings(
      //if we want to show featured category on homepage
      // { categoryId: ListingAppConfig.homeConfig.mainCategoryID },
      {},
      this.onListingsCollectionUpdate
    );
  }

  componentDidMount() {

    this.categoriesUnsubscribe = firebaseListing.subscribeListingCategories(
      this.onCategoriesCollectionUpdate
    );

    this.savedListingsUnsubscribe = firebaseListing.subscribeSavedListings(
      this.props.user.id,
      this.onSavedListingsCollectionUpdate
    );



    this.props.navigation.setParams({
      onPressPost: this.onPressPost,
      menuIcon: this.props.user.profilePictureURL,
      onModal: this.onModal,
      isBarber: this.props.user.isBarber
    });

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
    this.categoriesUnsubscribe();
    this.listingsUnsubscribe();
    this.savedListingsUnsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }



  onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  onCategoriesCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const category = doc.data();
      data.push({ ...category, id: doc.id });
    });
    this.setState({
      categories: data,
      loading: false,
    });
  };


  onListingsCollectionUpdate = querySnapshot => {

    const distance = (lat1, lon1, lat2, lon2, unit = "M") => {
      if (lat1 == lat2 && lon1 == lon2) {
        return 0;
      }
      else {
        const radlat1 = (Math.PI * lat1) / 180;
        const radlat2 = (Math.PI * lat2) / 180;
        const theta = lon1 - lon2;
        const radtheta = (Math.PI * theta) / 180;
        let dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        if (dist > 1) {
          dist = 1;
        }

        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;

        if (unit == "K") {
          dist = dist * 1.609344;
        }

        if (unit == "N") {
          dist = dist * 0.8684;
        }

        return dist;
      }
    }

    const data = [];

    const myLat = this.state.myLat;
    const myLong = this.state.myLong;

    querySnapshot.forEach(doc => {

      const listing = doc.data();
      const listingLat = doc.data().latitude;
      const listingLong = doc.data().longitude;
      console.log(listingLat, listingLong);

      if (this.state.savedListings.findIndex(k => k == doc.id) >= 0) {
        listing.saved = true;
      }
      else {
        listing.saved = false;
      }
      if (distance(myLat, myLong, listingLat, listingLong, unit = "M") <= 38) {
        this.state.isEmpty = false
        data.push({ ...listing, id: doc.id });
      }
    });

    this.setState({
      listings: data.slice(0, Configuration.home.initial_show_count),
      allListings: data,
      loading: false,
      showedAll: data.length <= Configuration.home.initial_show_count
    });
  };

  onSavedListingsCollectionUpdate = querySnapshot => {
    const savedListingdata = [];
    querySnapshot.forEach(doc => {
      const savedListing = doc.data();
      savedListingdata.push(savedListing.listingID);
    });
    const listingsData = [];
    this.state.listings.forEach(listing => {
      const temp = listing;
      if (savedListingdata.findIndex(k => k == temp.id) >= 0) {
        temp.saved = true;
      } else {
        temp.saved = false;
      }
      listingsData.push(temp);
    });

    this.setState({
      savedListings: savedListingdata,
      listings: listingsData,
      loading: false
    });
  };

  onPressPost = () => {
    this.setState({
      selectedItem: null,

    });
  };



  onPostCancel = () => {
    this.setState({ postModalVisible: true });
  };

  onPressCategoryItem = item => {
    this.props.navigation.navigate("Listing", { item: item });
  };

  onPressListingItem = item => {
    this.props.navigation.navigate("Detail", {
      item: item,
      customLeft: true,
      routeName: "Home",
    });
  };

  onLongPressListingItem = item => {
    if (item.authorID === this.props.user.id) {
      this.setState({ selectedItem: item }, () => {
        this.listingItemActionSheet.current.show();
      });
    }
  };

  onShowAll = () => {
    //uncomment to show a category rather than all listings nearby
    //this.props.navigation.navigate("Listing", { item: { id: ListingAppConfig.homeConfig.mainCategoryID, name: ListingAppConfig.homeConfig.mainCategoryName } });
    this.props.navigation.navigate("Listing", { item: this.state.allListings });
    this.setState({
      showedAll: true,
      listings: this.state.allListings
    });
  };

  onPressSavedIcon = item => {
    firebaseListing.saveUnsaveListing(item, this.props.user.id);
  };

  onModal = (modalVisible, callback) => {
    this.setState({ [modalVisible]: !this.state[modalVisible] }, () => {
      callback;
    });
  };

  onAddListing = () => {
    this.onModal("isMyListingVisible", this.onModal("isAddListingVisible"));
  };

  onLisingItemActionDone = index => {
    if (index == 0) {
      this.setState({
        postModalVisible: true
      });
      console.log(index);
    }

    if (index == 1) {
      Alert.alert(
        IMLocalized("Delete Listing"),
        IMLocalized("Are you sure you want to remove this listing?"),
        [
          {
            text: IMLocalized("Yes"),
            onPress: this.removeListing,
            style: "destructive"
          },
          { text: IMLocalized("No") }
        ],
        { cancelable: false }
      );
    }
  };

  removeListing = () => {
    firebaseListing.removeListing(this.state.selectedItem.id, ({ success }) => {
      if (!success) {
        alert(IMLocalized("There was an error deleting the listing. Please try again"));
      }
    });
  };

  renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressCategoryItem(item)}>
      <View style={styles.categoryItemContainer}>
        <FastImage
          style={styles.categoryItemPhoto}
          source={{ uri: item.photo }}
        />
        <Text style={styles.categoryItemTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  renderCategorySeparator = () => {
    return (
      <View
        style={{
          width: 20,
          height: "100%"
        }}
      />
    );
  };

  renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onPressListingItem(item)}
        onLongPress={() => this.onLongPressListingItem(item)}
      >
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
          <Text style={{ ...TwoColumnListStyle.listingName, maxHeight: 40 }}>
            {item.title}
          </Text>
          <Text style={TwoColumnListStyle.listingPlace}>{item.categoryTitle}</Text>
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

  renderListingFooter = () => {
    return (
      <Button
        containerStyle={TwoColumnListStyle.showAllButtonContainer}
        style={TwoColumnListStyle.showAllButtonText}
        onPress={() => this.onShowAll()}
      >
        {IMLocalized("Show all")} ({this.state.allListings.length})
      </Button>
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{IMLocalized("Browse Specialities")}</Text>
        <View style={styles.categories}>
          <FlatList
            horizontal={true}
            initialNumToRender={5}
            ItemSeparatorComponent={() => this.renderCategorySeparator()}
            data={this.state.categories}
            showsHorizontalScrollIndicator={false}
            renderItem={(item) => this.renderCategoryItem(item)}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        <Text style={[styles.title, styles.listingTitle]}>
          {ListingAppConfig.homeConfig.mainCategoryName}
        </Text>

        <View style={styles.listings}>
          {this.state.isEmpty &&
            (<Text>We're sorry, There are no health care professionals in our database found in your immediate area.
            Find the closest doctors by browsing categories or exploring the map.
            </Text>)}
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              !this.state.showedAll ? this.renderListingFooter : ""
            }
            numColumns={2}
            data={this.state.listings}
            renderItem={this.renderListingItem}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        {this.state.isBarber && (
          <PostModal
            selectedItem={this.state.selectedItem}
            categories={this.state.categories}
            onCancel={this.onPostCancel}
          />
        )}
        <ActionSheet
          ref={this.listingItemActionSheet}
          title={IMLocalized("Confirm")}
          options={[IMLocalized("Edit Listing"), IMLocalized("Remove Listing"), IMLocalized("Cancel")]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={index => {
            this.onLisingItemActionDone(index);
          }}
        />
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({

  header: {
    backgroundColor: "#0d0d0d",
  },
  container: {
    flex: 1,
    padding: Configuration.home.listing_item.offset,
    backgroundColor: "#fafafa"
  },
  title: {
    fontWeight: "500",
    color: AppStyles.color.title,
    fontSize: 20,
    marginBottom: 15
  },
  listings: {
    shadowColor: AppStyles.color.background,
    shadowOpacity: .10
  },
  listingTitle: {
    marginTop: 10,
    marginBottom: 10
  },
  categories: {
    marginBottom: 7,
    shadowColor: AppStyles.color.background,
    shadowOpacity: .15
  },
  categoryItemContainer: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // paddingBottom: 10
  },
  categoryItemPhoto: {
    height: 80,
    borderRadius: 0,
    width: "100%",
    minWidth: 100
  },
  categoryItemTitle: {
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold",
    color: AppStyles.color.categoryTitle,
    margin: 10,
    alignContent: "center"
  },
  userPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10
  },
  mapButton: {
    marginRight: 13,
    marginLeft: 7
  },
  composeButton: {
  },
  starStyle: {
    tintColor: "black"
  },
  starRatingContainer: {
    width: 90,
    marginTop: 10
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
});




export default connect(mapStateToProps)(HomeScreen);
