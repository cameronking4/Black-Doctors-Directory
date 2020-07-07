import React from "react";
import { FlatList, Text, View, BackHandler } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { firebaseListing } from "../firebase";
import { ListStyle } from "../AppStyles";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import { timeFormat } from '../Core';

class SearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {
      headerStyle: {
        backgroundColor: "black"
      },
    } } = navigation.state;
    return {
      header: (
        <SearchBar
          containerStyle={{
            paddingTop: 40,
            paddingBottom: 5,
            backgroundColor: "black",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",

          }}
          inputStyle={{
            backgroundColor: "#f5f5f5",
            borderRadius: 10,
            color: "#151723",
            fontSize: 14,
          }}
          showLoading
          clearIcon={false}
          searchIcon={false}
          onChangeText={text => params.handleSearch(text)}
          // onClear={alert('onClear')}
          placeholder={IMLocalized("Search a location for Black providers")}
        />
      )
    }
  }

  constructor(props) {
    super(props);

    this.unsubscribe = null;

    this.state = {
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: true
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
  onSearch = text => {
    this.searchedText = text;

    this.unsubscribe = firebaseListing.subscribeListings(
      {},
      this.onCollectionUpdate
    );
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const listing = doc.data();
      var text = this.searchedText != null ? this.searchedText.toLowerCase() : "";
      if (listing.stateGeo) {
        var index = listing.stateGeo.toLowerCase().search(text);
        if (index != -1) {
          data.push({ ...listing, id: doc.id });
        }
      }

    });

    this.setState({ data });
  };

  componentDidMount() {
    this.unsubscribe = firebaseListing.subscribeListings(
      {},
      this.onCollectionUpdate
    );
    this.props.navigation.setParams({
      handleSearch: this.onSearch
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
    this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
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
    this.props.navigation.navigate("SearchDetail", {
      item: item,
      customLeft: true,
      headerLeft: null,
      routeName: "Search"
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
          {item.starCount ? (
            <Text numberOfLines={1} style={ListStyle.price}>
              {item.starCount} stars
            </Text>
          ) : null}
        </View>
      }
      onPress={() => this.onPress(item)}
      avatarStyle={ListStyle.avatarStyle}
      avatarContainerStyle={ListStyle.avatarStyle}
      avatar={{ uri: item.photo }}
      containerStyle={{ borderBottomWidth: 0 }}
      hideChevron={false}
    />
  );

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => `${item.id}`}
        initialNumToRender={5}
        refreshing={this.state.refreshing}
      />
    );
  }
}

export default SearchScreen;
