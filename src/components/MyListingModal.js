import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
import TextButton from 'react-native-button';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import ActionSheet from 'react-native-actionsheet';
import SavedButton from './SavedButton';
import PostModal from './PostModal';
import ServerConfiguration from '../ServerConfiguration';
import { AppStyles, AppIcon, TwoColumnListStyle } from '../AppStyles';
import { Configuration } from '../Configuration';
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from "../DynamicAppStyles";

class MyListingModal extends React.Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
    return {
      title: IMLocalized("My Listings"),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      savedListings: [],
      selectedItem: null,
      postModalVisible: false,
      categories: []
    };

    this.listingItemActionSheet = React.createRef();

    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        )
    );

    this.listingsRef = firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.LISTINGS);

    this.savedListingsRef = firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.SAVED_LISTINGS)
      .where('userID', '==', this.props.user.id);
    this.categoriesRef = firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.CATEGORIES);
  }

  componentDidMount() {
    this.savedListingsUnsubscribe = this.savedListingsRef.onSnapshot(
      this.onSavedListingsCollectionUpdate
    );

    this.listingsUnsubscribe = this.listingsRef
      .where('authorID', '==', this.props.user.id)
      .where('isApproved', '==', true)
      .onSnapshot(this.onListingsCollectionUpdate);

    this.categoriesUnsubscribe = this.categoriesRef.onSnapshot(
      this.onCategoriesCollectionUpdate
    );

    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
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

    this.setState({
      savedListings: savedListingdata
    });
  };

  onCategoriesCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const category = doc.data();
      data.push({ ...category, id: doc.id });
    });
    this.setState({
      categories: data
    });
  };

  onListingsCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const listing = doc.data();
      if (this.state.savedListings.findIndex(k => k == doc.id) >= 0) {
        listing.saved = true;
      } else {
        listing.saved = false;
      }
      data.push({ ...listing, id: doc.id });
    });

    this.setState({
      listings: data,
      loading: false
    });
  };

  onPressListingItem = item => {
    this.props.navigation.navigate('MyListingDetailModal', { item });
  };

  onLongPressListingItem = item => {
    console.log('am actually working');
    if (item.authorID === this.props.user.id) {
      this.setState({ selectedItem: item }, () => {
        this.listingItemActionSheet.current.show();
      });
    }
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
        IMLocalized('Delete listing?'),
        IMLocalized('Are you sure you want to remove this listing?'),
        [
          {
            text: IMLocalized('Yes'),
            onPress: this.removeListing,
            style: 'destructive'
          },
          { text: IMLocalized('No') }
        ],
        { cancelable: false }
      );
    }
  };

  removeListing = () => {
    const self = this;

    firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.LISTINGS)
      .doc(self.state.selectedItem.id)
      .delete()
      .then(function () {
        const realEstateSavedQuery = firebase
          .firestore()
          .collection(ServerConfiguration.database.collection.SAVED_LISTINGS)
          .where('listingID', '==', self.state.selectedItem.id);
        realEstateSavedQuery.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
      })
      .catch(function (error) {
        console.log('Error deleting listing: ', error);
        alert(IMLocalized('Oops! an error while deleting listing. Please try again later.'));
      });
  };

  onPostCancel = () => {
    this.setState({ postModalVisible: false });
  };

  onPressSavedIcon = item => {
    if (item.saved) {
      firebase
        .firestore()
        .collection(ServerConfiguration.database.collection.SAVED_LISTINGS)
        .where('listingID', '==', item.id)
        .where('userID', '==', this.props.user.id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
    } else {
      firebase
        .firestore()
        .collection(ServerConfiguration.database.collection.SAVED_LISTINGS)
        .add({
          userID: this.props.user.id,
          listingID: item.id,
        })
        .then(function (docRef) { })
        .catch(function (error) {
          alert(error);
        });
    }
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
        <View>
          <Text style={{ paddingBottom: 10, alignSelf: "center", color: "#a0a0a0" }}>
            Long Press to edit or remove listing
        </Text>
        </View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={this.state.listings}
          renderItem={this.renderListingItem}
          keyExtractor={item => `${item.id}`}
        />
        {this.state.postModalVisible && (
          <PostModal
            selectedItem={this.state.selectedItem}
            categories={this.state.categories}
            onCancel={this.onPostCancel}
          />
        )}
        <ActionSheet
          ref={this.listingItemActionSheet}
          title={'Confirm'}
          options={['Edit Listing', 'Remove Listing', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={index => {
            this.onLisingItemActionDone(index);
          }}
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

export default connect(mapStateToProps)(MyListingModal);
