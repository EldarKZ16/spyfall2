import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {
  GAME_DESCRIPTION,
  BUTTON_UNDERSTOOD
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";

export default class GuideScreen extends React.Component {
  static navigationOptions = {
    headerTitle: "SPYFIND",
    headerTitleStyle: {
      textAlign: "center",
      flex: 1,
      fontWeight: "bold",
      fontSize: 30,
      letterSpacing: 15,
      color: "#ffffff"
    },
    headerStyle: {
      backgroundColor: "#303030"
    },
    headerLeft: null
  };

  handleOnPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <ScrollView>
            <Text style={styles.textContainer}>{GAME_DESCRIPTION}</Text>
          </ScrollView>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            color="#000000"
            style={styles.createGameContainer}
            onPress={this.handleOnPress}
          >
            <Text style={styles.createGameTextContainer}>
              {BUTTON_UNDERSTOOD}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030"
  },
  createGameContainer: {
    backgroundColor: "#ffffff",
    width: SCREEN_DIMENSIONS.width * 0.5,
    height: SCREEN_DIMENSIONS.width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125
  },
  createGameTextContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.05,
    color: "#303030"
  },
  mainContainer: {
    flex: 9,
    marginLeft: SCREEN_DIMENSIONS.width * 0.04,
    marginRight: SCREEN_DIMENSIONS.width * 0.04
  },
  textContainer: {
    color: "#ffffff",
    fontSize: SCREEN_DIMENSIONS.width * 0.06
  },
  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
