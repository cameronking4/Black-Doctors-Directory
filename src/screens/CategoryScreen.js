import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Dimensions
} from "react-native";
import FastImage from "react-native-fast-image";
import { AppStyles } from "../AppStyles";
import { firebaseListing } from "../firebase";
import { IMLocalized } from "../Core/localization/IMLocalization";

const PRODUCT_ITEM_HEIGHT = 120;
const PRODUCT_ITEM_OFFSET = 5;
const { height, width } = Dimensions.get('window');
console.log(width);
const PRODUCT_ITEM_WIDTH = width / 2.2

class CategoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: IMLocalized("Specialties"),
    headerStyle: {
      backgroundColor: styles.header.backgroundColor,
    },
    headerTitleStyle: {
      color: "white"
    },
  });

  constructor(props) {
    super(props);

    this.unsubscribe = null;

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
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
    this.unsubscribe = firebaseListing.subscribeListingCategories(
      this.onCollectionUpdate
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
    this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const { name, photo } = doc.data();
      data.push({
        id: doc.id,
        doc,
        name, // DocumentSnapshot
        photo
      });
    });

    this.setState({
      data,
      loading: false
    });
  };

  onPress = item => {
    this.props.navigation.navigate("Listing", { item: item });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPress(item)}>
      <View style={styles.container}>
        <FastImage style={styles.photo} source={{ uri: item.photo }} />
        <View style={styles.overlay} />
        <Text numberOfLines={2} style={styles.title}>
          {item.name || item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <FlatList
        style={styles.flatContainer}
        vertical
        showsVerticalScrollIndicator={false}
        data={this.state.data.sort((a, b) => a.name.localeCompare(b.name))}
        renderItem={this.renderItem}
        keyExtractor={item => `${item.id}`}
        numColumns={2}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "black",
  },
  body: {
    backgroundColor: "white"
  },
  flatContainer: {
    padding: 10,
    alignSelf: "center",
    backgroundColor: "white"

  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: PRODUCT_ITEM_OFFSET,
    height: PRODUCT_ITEM_HEIGHT,
    width: PRODUCT_ITEM_WIDTH,
    shadowOpacity: .25,
    borderRadius: 10,
    shadowColor: AppStyles.color.white,
  },
  title: {
    color: "white",
    fontSize: 17,
    fontFamily: AppStyles.fontName.bold,
    textAlign: "center",
    padding: 10
  },
  photo: {
    height: PRODUCT_ITEM_HEIGHT,
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  }
});

export default CategoryScreen;
