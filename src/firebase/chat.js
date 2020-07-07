import firebase from "react-native-firebase";
import ServerConfiguration from "../ServerConfiguration";

const usersRef = firebase.firestore().collection("users");

const channelPaticipationRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.CHANNEL_PARTICIPATION);

const channelsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.CHANNELS)
  .orderBy("lastMessageDate", "desc");

export const subscribeChannels = callback => {
  return channelsRef.onSnapshot(querySnapshot =>
    callback(querySnapshot, channelPaticipationRef, usersRef)
  );
};

export const subscribeChannelPaticipation = (userId, callback) => {
  return channelPaticipationRef
    .where("user", "==", userId)
    .onSnapshot(querySnapshot => callback(querySnapshot));
};
