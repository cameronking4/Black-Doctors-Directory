import firebase from "react-native-firebase";
import ServerConfiguration from "../ServerConfiguration";

const savedListingsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.SAVED_LISTINGS);
const listingsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.LISTINGS);
const ListingCategoriesRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.CATEGORIES)
  .orderBy("order");

export const subscribeListingCategories = callback => {
  return ListingCategoriesRef.onSnapshot(querySnapshot =>
    callback(querySnapshot)
  );
};

export const subscribeListings = (
  { docId, userId, categoryId, isApproved = true },
  callback
) => {
  if (docId) {
    return listingsRef.doc(docId).onSnapshot(callback);
  }

  if (userId) {
    return listingsRef
      .where("authorID", "==", userId)
      .where("isApproved", "==", isApproved)
      .onSnapshot(callback);
  }

  if (categoryId) {
    return listingsRef
      .where("categoryID", "==", categoryId)
      .where("isApproved", "==", isApproved)
      .onSnapshot(callback);
  }

  return listingsRef
    .where("isApproved", "==", isApproved)
    .onSnapshot(callback);
};

export const subscribeSavedListings = (userId, callback, listingId) => {
  if (listingId) {
    return savedListingsRef
      .where("userID", "==", userId)
      .where("listingID", "==", listingId)
      .onSnapshot(querySnapshot => callback(querySnapshot));
  }
  if (userId) {
    return savedListingsRef
      .where("userID", "==", userId)
      .onSnapshot(querySnapshot => callback(querySnapshot));
  }

  return savedListingsRef.onSnapshot(querySnapshot => callback(querySnapshot));
};

export const saveUnsaveListing = (item, userId) => {
  if (item.saved) {
    savedListingsRef
      .where("listingID", "==", item.id)
      .where("userID", "==", userId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  } else {
    savedListingsRef
      .add({
        userID: userId,
        listingID: item.id
      })
      .then(docRef => { })
      .catch(error => {
        alert(error);
      });
  }
};

export const removeListing = async (listingId, callback) => {
  listingsRef
    .doc(listingId)
    .delete()
    .then(() => {
      savedListingsRef
        .where("listingID", "==", listingId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
      callback({ success: true });
    })
    .catch(error => {
      callback({ success: false });
      console.log("Error deleting listing: ", error);
    });
};

export const approveListing = (listingId, callback) => {
  listingsRef
    .doc(listingId)
    .update({ isApproved: true, completedReg: true })
    .then(() => {
      callback({ success: true });
    })
    .catch(error => {
      callback({ success: false });
      console.log("Error approving listing: ", error);
    });
};

export const postListing = (
  selectedItem,
  uploadObject,
  photoUrls,
  location,
  callback
) => {
  const updatedUploadObjects = {
    ...uploadObject,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    coordinate: new firebase.firestore.GeoPoint(
      location.latitude,
      location.longitude
    )
  };

  const coverPhoto = (photoUrls.length > 0) ? photoUrls[0] : null;

  if (selectedItem) {
    listingsRef
      .doc(selectedItem.id)
      .update({ ...updatedUploadObjects, photo: coverPhoto })
      .then(docRef => {
        callback({ success: true });
      })
      .catch(error => {
        console.log(error);
        callback({ success: false });
      });
  } else {
    listingsRef
      .add(updatedUploadObjects)
      .then(docRef => {
        if (docRef.id) {
          listingsRef
            .doc(docRef.id)
            .update({ id: docRef.id, photo: coverPhoto });
        }
        callback({ success: true });
      })
      .catch(error => {
        console.log(error);
        callback({ success: false });
      });
  }
};
