import React from "react";
import { StyleSheet, FlatList, Dimensions, Animated, ScrollView, Image, BackHandler, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { firebaseListing } from "../firebase";
import { AppStyles } from "../AppStyles";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from '../DynamicAppStyles';
import Geolocation from "@react-native-community/geolocation";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

class MapScreen extends React.Component {
  static navigationOptions = ({ navigate }) => ({
    title: IMLocalized("Map View"),
    headerStyle: {
      display: 'none'
    }
  });


  constructor(props) {
    super(props);

    const { navigation } = props;
    this.item = navigation.getParam("item");

    this.unsubscribe = null;

    this.state = {
      category: this.item,
      data: [],
      latitude: Configuration.map.origin.latitude,
      longitude: Configuration.map.origin.longitude,
      latitudeDelta: Configuration.map.delta.latitude,
      longitudeDelta: Configuration.map.delta.longitude,
      refreshing: false,
      shouldUseOwnLocation: true // Set this to false if you don't want the current user's location to be considered
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

  onChangeLocation = (location) => {
    this.setState({
      latitude: location.latitude,
      longitude: location.longitude
    });
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.item) {
      this.unsubscribe = firebaseListing.subscribeListings(
        { categoryId: this.item.id },
        this.onCollectionUpdate
      );
    } else {
      this.unsubscribe = firebaseListing.subscribeListings(
        {},
        this.onCollectionUpdate
      );
    }

    if (this.state.shouldUseOwnLocation) {
      Geolocation.getCurrentPosition(
        position => {
          this.onChangeLocation(position.coords);
        },
        error => alert(error.message),
        { enableHighAccuracy: true, timeout: 1000 }
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

    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.data.length) {
        index = this.state.data.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.data[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.data.latitudeDelta,
              longitudeDelta: this.state.data.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400;
    querySnapshot.forEach(doc => {
      const listing = doc.data();
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

    this.setState({
      data
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
        )
      });
    }
  };

  onPress = item => {
    this.props.navigation.navigate("Detail", {
      item: item,
      customLeft: true,
      headerLeft: null,
      routeName: "Map"
    });
  };

  render() {
    const markerArr = this.state.data.map(listing => (
      < Marker
        title={listing.title}
        description={listing.description}
        site={listing.site}
        onCalloutPress={() => {
          this.onPress(listing);
        }
        }
        coordinate={{
          latitude: listing.latitude,
          longitude: listing.longitude
        }}
      />)
    );
    return (
      <View style={styles.container} >
        <MapView
          ref={map => this.map = map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
          style={styles.container}
        >
          {markerArr}

        </MapView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
    maxWidth: 20
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});


//     return (
//       <View style={styles.container}>
//         <MapView
//           style={styles.mapView}
//           showsUserLocation={true}
//           region={{
//             latitude: this.state.latitude,
//             longitude: this.state.longitude,
//             latitudeDelta: this.state.latitudeDelta,
//             longitudeDelta: this.state.longitudeDelta
//           }}
//         >
//           {markerArr}
//           {console.log(markerArr)}
//         </MapView >
//         <ScrollView
//           horizontal={true}
//           scrollEventThrottle={1}
//           pagingEnabled={true}
//           showsHorizontalScrollIndicator={false}
//           onScroll={Animated.event(
//             [
//               {
//                 nativeEvent: {
//                   contentOffset: {
//                     x: this.animation,
//                   },
//                 },
//               },
//             ],
//             { useNativeDriver: true }
//           )}
//           style={styles.scrollView}
//           contentContainerStyle={styles.endPadding}
//         >
//           {this.state.data.map((marker, index) => {
//             <View style={{ backgroundColor: "black" }} key={index}>
//               <Image
//                 source={marker.image}
//                 style={styles.cardImage}
//                 resizeMode="cover"
//               />
//               <View style={styles.textContent}>
//                 <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
//                 <Text numberOfLines={1} style={styles.cardDescription}>
//                   {marker.description}
//                 </Text>
//               </View>
//             </View>
//             console.log(marker.title, index)
//           })}
//         </ScrollView>
//       </View >
//     );
//   }
// }


// onCarouselItemChange = (index) => {
//   let location = this.state.coordinates[index];

//   this._map.animateToRegion({
//     latitude: location.latitude,
//     longitude: location.longitude,
//     latitudeDelta: 0.09,
//     longitudeDelta: 0.035
//   })

//   this.state.markers[index].showCallout()
// }

// onMarkerPressed = (location, index) => {
//   this._map.animateToRegion({
//     latitude: location.latitude,
//     longitude: location.longitude,
//     latitudeDelta: 0.09,
//     longitudeDelta: 0.035
//   });

//   this._carousel.snapToItem(index);
// }

// renderCarouselItem = ({ item }) =>
//   <View style={styles.cardContainer}>
//     <Text style={styles.cardTitle}>{item.name}</Text>
//     <Image style={styles.cardImage} source={item.image} />
//   </View>


// // const styles = StyleSheet.create({
// //   container: {
// //     ...StyleSheet.absoluteFillObject
// //   },
// //   map: {
// //     ...StyleSheet.absoluteFillObject
// //   },

// // });


// const styles = StyleSheet.create({
//   mapView: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: AppStyles.color.grey,
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//   },
//   carousel: {
//     position: 'absolute',
//     bottom: 0,
//     marginBottom: 48
//   },
//   cardContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     height: 200,
//     width: 300,
//     padding: 24,
//     borderRadius: 24
//   },
//   cardImage: {
//     height: 120,
//     width: 300,
//     bottom: 0,
//     position: 'absolute',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24
//   },
//   cardTitle: {
//     color: 'white',
//     fontSize: 22,
//     alignSelf: 'center'
//   }
// });

export default MapScreen;
