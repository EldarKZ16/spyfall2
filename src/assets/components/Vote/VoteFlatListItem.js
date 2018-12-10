import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { SCREEN_DIMENSIONS } from "../common/dimensions";

export default class VoteFlatListItem extends React.Component {
  handleChangeVote = () => {
    this.props.isSelected(this.props.index);
  };

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.isVoted ? true : false}
        style={[
          styles.buttonContainer,
          this.props.index !== this.props.pressedIndex || this.props.isVoted
            ? styles.notPressedButtonContainer
            : styles.pressedButtonContainer
        ]}
        onPress={this.handleChangeVote}
      >
        <Text style={styles.textContainer}>{`${this.props.data["user"]}  ${
          this.props.data["votes"]
        }`}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: SCREEN_DIMENSIONS.width * 0.4,
    height: SCREEN_DIMENSIONS.width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125,
    marginRight: SCREEN_DIMENSIONS.width * 0.025,
    marginLeft: SCREEN_DIMENSIONS.width * 0.025,
    marginBottom: SCREEN_DIMENSIONS.width * 0.0375
  },
  textContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#ffffff"
  },
  notPressedButtonContainer: {
    backgroundColor: "#303030"
  },
  pressedButtonContainer: {
    backgroundColor: "#a8a8a8"
  }
});
