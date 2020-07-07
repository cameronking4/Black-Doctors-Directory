import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  BackHandler
} from "react-native";

import Button from "react-native-button";
import FastImage from "react-native-fast-image";
import { firebaseListing } from "../firebase";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import {
  AppStyles,
  TwoColumnListStyle
} from "../AppStyles";
import SavedButton from "../components/SavedButton";
import { Configuration } from "../Configuration";
import DynamicAppStyles from '../DynamicAppStyles';
import { IMLocalized } from "../Core/localization/IMLocalization";

class AdminDashboardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: IMLocalized("Admin Dashboard"),
    headerStyle: {
      backgroundColor: '#fafafa'
    }
  });

  constructor(props) {
    super(props);

    this.listingsUnsubscribe = null;
    this.listingItemActionSheet = React.createRef();

    this.state = {
      activeSlide: 0,
      categories: [],
      listings: [],
      allListings: [],
      selectedCategoryName: "",
      savedListings: [],
      selectedItem: null,
      showedAll: false,
      postModalVisible: false,
      isSavedModalVisible: false,
      isAccountDetailModalVisible: false,
      isSettingsModalVisible: false,
      isContactModalVisible: false,
      isMyListingVisible: false,
      isAddListingVisible: false,
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
  }

  componentDidMount() {
    this.listingsUnsubscribe = firebaseListing.subscribeListings(
      { isApproved: false },
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

  componentWillUnmount() {
    this.listingsUnsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
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
      listings: data.slice(0, Configuration.home.initial_show_count),
      allListings: data,
      loading: false,
      showedAll: data.length <= Configuration.home.initial_show_count
    });
  };

  onPressListingItem = item => {
    this.props.navigation.navigate("MyListingDetailModal", {
      item: item
    });
  };

  onLongPressListingItem = item => {
    this.setState({ selectedItem: item }, () => {
      this.listingItemActionSheet.current.show();
    });
  };

  onShowAll = () => {
    this.setState({
      showedAll: true,
      listings: this.state.allListings
    });
  };

  onLisingItemActionDone = index => {
    if (index === 0) {
      this.approveListing();
    }

    if (index == 1) {
      Alert.alert(
        "Delete Listing",
        "Are you sure you want to remove this listing?",
        [
          {
            text: "Yes",
            onPress: this.removeListing,
            style: "destructive"
          },
          { text: "No" }
        ],
        { cancelable: false }
      );
    }
  };

  removeListing = () => {
    firebaseListing.removeListing(this.state.selectedItem.id, ({ success }) => {
      if (success) {
        return;
      }
      alert(IMLocalized("There was an error deleting listing!"));
    });
  };

  approveListing = () => {
    firebaseListing.approveListing(
      this.state.selectedItem.id,
      ({ success }) => {
        if (success) {
          alert("Listing successfully approved!");
          return;
        }
        alert("Error approving listing!");
      }
    );
  };

  onPressSavedIcon = item => {
    firebaseListing.saveUnsaveListing(item, this.props.user.id);
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
          <Text style={TwoColumnListStyle.listingPlace}>{item.place}</Text>
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
    if (this.state.loading) {
      return <ActivityIndicator size="small" color={AppStyles.color.main} />;
    }

    return (
      <View style={{ flex: 1 }}>
        <Text style={{ paddingTop: 10, alignSelf: "center", color: "#a0a0a0" }}>
          Long Press to approve or remove listing
         </Text>
        {this.state.listings.length > 0 ? (
          <ScrollView style={styles.container}>
            <Text style={[styles.title, styles.listingTitle]}>
              {"Awaiting Approval"}
            </Text>
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                this.state.showedAll ? "" : this.renderListingFooter
              }
              numColumns={2}
              data={this.state.listings}
              renderItem={this.renderListingItem}
              keyExtractor={item => `${item.id}`}
            />
          </ScrollView>
        ) : (
            <View style={styles.container}>
              <Text style={styles.noMessage}>
                {IMLocalized("There are no listings awaiting approval.")}
              </Text>
            </View>
          )}
        <ActionSheet
          ref={this.listingItemActionSheet}
          title={"Confirm"}
          options={["Approve", "Delete", "Cancel"]}
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
  title: {
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold",
    color: AppStyles.color.title,
    fontSize: 22
  },
  listingTitle: {
    marginTop: 10,
    marginBottom: 15
  },
  noMessage: {
    textAlign: "center",
    color: AppStyles.color.subtitle,
    fontSize: 18,
    padding: 15
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(AdminDashboardScreen);
