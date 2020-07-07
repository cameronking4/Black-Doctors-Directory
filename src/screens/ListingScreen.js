import React from "react";
import { FlatList, StyleSheet, Text, View, BackHandler } from "react-native";
import { ListItem } from "react-native-elements";
import Geolocation from "@react-native-community/geolocation";
import { firebaseListing } from "../firebase";
import { AppIcon, AppStyles, ListStyle, HeaderButtonStyle } from "../AppStyles";
import HeaderButton from "../components/HeaderButton";
import { Configuration } from "../Configuration";
import MapView, { Marker } from "react-native-maps";
import FilterViewModal from "../components/FilterViewModal";
import DynamicAppStyles from '../DynamicAppStyles';
import { IMLocalized } from "../Core/localization/IMLocalization";
import { timeFormat } from '../Core';


class ListingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:
        typeof navigation.state.params == "undefined" ||
          typeof navigation.state.params.item == "undefined"
          ? IMLocalized("Listing")
          : navigation.state.params.item.name || navigation.state.params.item.title,
      HeadeStyle: { backgroundColor: 'black' },
      headerRight: (
        <View style={HeaderButtonStyle.multi}>
          <HeaderButton
            customStyle={styles.toggleButton}
            style={{ tintColor: DynamicAppStyles.colorSet.mainThemeForegroundColor }}
            icon={
              navigation.state.params.mapMode
                ? AppIcon.images.list
                : AppIcon.images.map
            }
            onPress={() => {
              navigation.state.params.onChangeMode();
            }}
          />
          <HeaderButton
            customStyle={styles.filtersButton}
            style={{ tintColor: DynamicAppStyles.colorSet.mainThemeForegroundColor }}
            icon={AppIcon.images.filters}
            onPress={() => {
              navigation.state.params.onSelectFilter();
            }}
          />
        </View>
      )
    }
  };

  constructor(props) {
    super(props);

    const { navigation } = props;
    const item = navigation.getParam("item");

    this.state = {
      category: item,
      filter: {},
      data: [],
      mapMode: false,
      filterModalVisible: false,
      latitudeDelta: Configuration.map.delta.latitude,
      longitudeDelta: Configuration.map.delta.longitude,
      shouldUseOwnLocation: true, // Set this to false to hide the user's location
    };

    this.didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );

    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = firebaseListing.subscribeListings(
      { categoryId: this.state.category.id },
      this.onCollectionUpdate
    );

    this.props.navigation.setParams({
      mapMode: this.state.mapMode,
      onChangeMode: this.onChangeMode,
      onSelectFilter: this.onSelectFilter
    });

    if (this.state.shouldUseOwnLocation) {
      Geolocation.getCurrentPosition(
        position => {
          this.onChangeLocation(position.coords);
        },
        error => alert(error.message),
        { enableHighAccuracy: false, timeout: 1000 }
      );
    }

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
    this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onChangeLocation = (location) => {
    this.setState({
      latitude: location.latitude,
      longitude: location.longitude
    });
  }

  onSelectFilter = () => {
    this.setState({ filterModalVisible: true });
  };

  onSelectFilterCancel = () => {
    this.setState({ filterModalVisible: false });
  };

  onSelectFilterDone = filter => {
    this.setState({ filter: filter });
    this.setState({ filterModalVisible: false });
    this.unsubscribe = firebaseListing.subscribeListings(
      { categoryId: this.state.category.id },
      this.onCollectionUpdate
    );
  };

  onChangeMode = () => {
    const newMode = !this.state.mapMode;
    this.setState({ mapMode: newMode });
    this.props.navigation.setParams({
      mapMode: newMode
    });
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400;

    const filter = this.state.filter;
    querySnapshot.forEach(doc => {
      const listing = doc.data();
      console.log(listing.filters);
      let matched = true;
      Object.keys(filter).forEach(function (key) {
        if (
          filter[key] != "Any" &&
          filter[key] != "All" &&
          listing.filters[key] != filter[key]
        ) {
          matched = false;
        }
      });

      console.log("matched=" + matched);

      if (!matched) return;

      if (max_latitude < listing.latitude)
        max_latitude = listing.latitude;
      if (min_latitude > listing.latitude)
        min_latitude = listing.latitude;
      if (max_longitude < listing.longitude)
        max_longitude = listing.longitude;
      if (min_logitude > listing.longitude)
        min_logitude = listing.longitude;
      data.push({ ...listing, id: doc.id });
    });

    if (!this.state.shouldUseOwnLocation || !this.state.latitude) {
      this.setState({
        latitude: (max_latitude + min_latitude) / 2,
        longitude: (max_longitude + min_logitude) / 2,
        latitudeDelta: Math.abs(
          (max_latitude - (max_latitude + min_latitude) / 2) * 3
        ),
        longitudeDelta: Math.abs(
          (max_longitude - (max_longitude + min_logitude) / 2) * 3
        ),
        data
      });
    } else {
      this.setState({
        data
      });
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  onPress = item => {
    this.props.navigation.navigate("Detail", {
      item: item,
      customLeft: true,
      routeName: "Listing"
    });
  };

  renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.title}
      titleStyle={ListStyle.title}
      subtitle={
        <View style={ListStyle.subtitleView}>
          <View style={ListStyle.leftSubtitle}>
            <Text style={ListStyle.time}>
              {timeFormat(item.createdAt)}
            </Text>
            <Text style={ListStyle.place}>{item.place}</Text>
          </View>
          { item.starCount ? (
          <Text numberOfLines={1} style={ListStyle.price}>
            {item.starCount} stars
          </Text> ) : null}
        </View>
      }
      onPress={() => this.onPress(item)}
      avatarStyle={ListStyle.avatarStyle}
      avatarContainerStyle={ListStyle.avatarStyle}
      avatar={{ uri: item.photo }}
      containerStyle={{ borderBottomWidth: 0 }}
      hideChevron={true}
    />
  );

  onPress = item => {
    this.props.navigation.navigate("Detail", {
      item: item,
      customLeft: true,
      routeName: "Listing"
    });
  };
  

  render() {
    const markerArr = this.state.data.map(listing => (
      <Marker
        title={listing.title}
        description={listing.description}
        onCalloutPress={() => {
          this.onPress(listing);
        }}
        coordinate={{
          latitude: listing.latitude,
          longitude: listing.longitude
        }}
      />
    ));

    console.log((this.state.data).length);
    console.log(this.state.filter)
    return (
      <View>
        {this.state.mapMode && (
          <MapView
            style={styles.mapView}
            showsUserLocation={this.state.shouldUseOwnLocation}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta
            }}
          >
            {markerArr}
          </MapView>
        )}
        {!this.state.mapMode && (
          < FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={item => `${item.id}`}
            initialNumToRender={5}
            refreshing={this.state.refreshing}
          />
        )}
        {!this.state.data.length > 0 && (
          <Text style= {{padding: 15, fontSize: 16}}>We're sorry. There are no Black healthcare providers specializing in {this.props.navigation.state.params.item.name} nearby. </Text>
        )}
        {this.state.filterModalVisible && (
          <FilterViewModal
            value={this.state.filter}
            onCancel={this.onSelectFilterCancel}
            onDone={this.onSelectFilterDone}
            category={this.state.category}
          />
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mapView: {
    width: "100%",
    height: "100%",
    backgroundColor: AppStyles.color.grey
  },
  filtersButton: {
    marginRight: 10
  },
  toggleButton: {
    marginRight: 7
  },
});

export default ListingScreen;
