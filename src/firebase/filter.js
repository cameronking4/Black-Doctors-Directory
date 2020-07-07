import firebase from "react-native-firebase";
import ServerConfiguration from "../ServerConfiguration";

const filterRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.FILTERS);

export const subscribeFilters = callback => {
  return filterRef.onSnapshot(querySnapshot => callback(querySnapshot));
};
