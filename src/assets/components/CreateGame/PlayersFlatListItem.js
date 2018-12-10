import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { SCREEN_DIMENSIONS } from "../common/dimensions";

export default class PlayersFlatListItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        disabled={true}
        color="#000000"
        style={styles.buttonContainer}
      >
        <Text style={styles.textContainer}>{this.props.username}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#ffffff",
    width: SCREEN_DIMENSIONS.width * 0.4,
    height: SCREEN_DIMENSIONS.width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125
  },
  textContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#303030"
  }
});
