import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { IMConversationListView } from "../Core/chat";
import DynamicAppStyles from "../DynamicAppStyles";
import { IMLocalized } from "../Core/localization/IMLocalization";

class ConversationsScreen extends Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
    return {
      headerTitle: IMLocalized("Messages"),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor
      },
      headerTintColor: currentTheme.fontColor
    };
  };

  componentDidMount() {
    const self = this;
    self.props.navigation.setParams({
      openDrawer: self.openDrawer
    });
  }

  onEmptyStatePress() {
    this.props.navigation.navigate('Categories');
  }

  render() {
    const emptyStateConfig = {
      title: IMLocalized('No Messages'),
      description: IMLocalized(
        'You can contact vendors by messaging them on the listings page. Your conversations with them will show up here.',
      ),
      buttonName: IMLocalized('Browse Listings'),
      onPress: () => { this.onEmptyStatePress() },
    };

    return (
      <View style={{ flex: 1, marginLeft: 15, marginRight: 15, paddingTop: 10 }}>
        <IMConversationListView
          navigation={this.props.navigation}
          appStyles={DynamicAppStyles}
          emptyStateConfig={emptyStateConfig}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user
  };
};

export default connect(mapStateToProps)(ConversationsScreen);
