import firebase from "react-native-firebase";
import ServerConfiguration from "../ServerConfiguration";

const usersRef = firebase.firestore().collection("users");

const reviewsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.REVIEWS);
const listingsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.LISTINGS);

export const subscribeReviews = (listingId, callback) => {
  return reviewsRef
    .where("listingID", "==", listingId)
    .onSnapshot(querySnapshot => callback(querySnapshot, usersRef));
};

export const postReview = (user, data, starCount, content, callback) => {
  reviewsRef
    .add({
      authorID: user.id,
      listingID: data.id,
      starCount,
      content: content,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureURL: user.profilePictureURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(docRef => {
      reviewsRef
        .where("listingID", "==", data.id)
        .get()
        .then(reviewQuerySnapshot => {
          let totalStarCount = 0,
            count = 0;
          reviewQuerySnapshot.forEach(reviewDoc => {
            const review = reviewDoc.data();

            totalStarCount += review.starCount;
            count++;
          });

          if (count > 0) {
            data.starCount = totalStarCount / count;
          } else {
            data.starCount = 0;
          }

          listingsRef.doc(data.id).set(data);
          callback({ success: true });
        });
    })
    .catch(error => {
      console.log(error);
      callback({ success: false });
    });
};
