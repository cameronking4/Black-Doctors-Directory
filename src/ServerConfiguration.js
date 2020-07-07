/**
 * If isApprovalProcessEnabled is set to true,
 * you are advised to visit your firebase console,
 * under your users collection and a particular document id,
 * add the field "isAdmin" of type boolean
 * with a value of true, to give a user an admin power of
 * approving listings.
 */

const ServerConfiguration = {
  isApprovalProcessEnabled: true,
  database: {
    collection: {
      LISTINGS: "universal_listings",
      SAVED_LISTINGS: "universal_saved_listings",
      CATEGORIES: "universal_categories",
      FILTERS: "universal_filters",
      REVIEWS: "universal_reviews",
      USERS: "users",
      CHANNELS: "channels",
      CHANNEL_PARTICIPATION: "channel_participation"
    }
  }
};

export default ServerConfiguration;
