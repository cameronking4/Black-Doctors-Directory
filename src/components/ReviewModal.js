import React from "react";
import { Modal, StyleSheet, Text, TextInput, View, Image } from "react-native";
import TextButton from "react-native-button";
import StarRating from "react-native-star-rating";
import { connect } from "react-redux";
import { firebaseReview } from "../firebase";
import { AppStyles, ModalHeaderStyle, AppIcon } from "../AppStyles";
import Button from "react-native-button";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from '../DynamicAppStyles';

class ReviewModal extends React.Component {
  constructor(props) {
    super(props);

    const listing = this.props.listing;
    this.state = {
      data: listing,
      content: "",
      starCount: 5
    };
  }

  onPostReview = () => {
    if (!this.state.content) {
      alert(IMLocalized("Please enter a review before submitting."));
      return;
    }

    const { user, onDone } = this.props;
    const { data, starCount, content } = this.state;

    firebaseReview.postReview(user, data, starCount, content, ({ success }) => {
      if (success) {
        onDone();
        return;
      }
      alert(error);
    });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={this.onCancel}
      >
        <View style={styles.body}>
          <View style={ModalHeaderStyle.bar}>
            <Text style={ModalHeaderStyle.title}>{IMLocalized("Add Review")}</Text>
            <TextButton
              style={{ ...ModalHeaderStyle.rightButton, paddingRight: 10 }}
              onPress={this.onCancel}
            >
              {IMLocalized("Cancel")}
            </TextButton>
          </View>
          <View style={styles.bodyContainer}>
            <StarRating
              containerStyle={styles.starRatingContainer}
              disabled={false}
              maxStars={5}
              starSize={25}
              starStyle={styles.starStyle}
              selectedStar={rating => this.setState({ starCount: rating })}
              emptyStar={AppIcon.images.starNoFilled}
              halfStarColor={DynamicAppStyles.colorSet.mainThemeForegroundColor}
              fullStar={AppIcon.images.starFilled}
              rating={this.state.starCount}
            />
            <TextInput
              multiline={true}
              style={styles.input}
              onChangeText={text => this.setState({ content: text })}
              value={this.state.content}
              placeholder={IMLocalized("Start typing")}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
            <Button
              containerStyle={styles.btnContainer}
              style={styles.btnText}
              onPress={() => this.onPostReview()}
            >
              {IMLocalized("Add review")}
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  bodyContainer: {
    alignSelf: "center",
    width: "95%",
    height: "86%"
  },
  input: {
    flex: 1,
    width: "100%",
    fontSize: 19,
    textAlignVertical: "top",
    lineHeight: 26,
    fontFamily: AppStyles.fontName.main,
    color: AppStyles.color.text
  },
  starRatingContainer: {
    width: 90,
    marginVertical: 12
  },
  starStyle: {
    tintColor: DynamicAppStyles.colorSet.mainThemeForegroundColor
  },
  btnContainer: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    backgroundColor: DynamicAppStyles.colorSet.mainThemeForegroundColor
  },
  btnText: {
    color: AppStyles.color.white
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(ReviewModal);
