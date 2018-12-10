import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { firebaseDB } from "../../firebase";
import {
  WON,
  LOST,
  BUTTON_TO_MAIN,
  SPY
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";

export default class ResultsScreen extends React.Component {
  static navigationOptions = {
    headerLeft: null,
    headerStyle: {
      shadowOpacity: 0,
      elevation: 0,
      backgroundColor: "#303030"
    }
  };

  state = {
    resultText: "",
    spyName: "",
    isSpy: false
  };

  getSpyName = () => {
    firebaseDB
      .ref(this.props.navigation.getParam("gameID"))
      .once("value", data => {
        this.setState({ spyName: data.val().spyName });
      });
  };

  setResultText = () => {
    firebaseDB
      .ref(
        `${this.props.navigation.getParam(
          "gameID"
        )}/${this.props.navigation.getParam("keyID")}`
      )
      .once("value", data => {
        if (data.val().isWin) {
          this.setState({ resultText: WON });
        } else {
          this.setState({ resultText: LOST });
        }
      });
  };

  checkIsSpy = () => {
    firebaseDB
      .ref(
        `${this.props.navigation.getParam(
          "gameID"
        )}/${this.props.navigation.getParam("keyID")}`
      )
      .once("value", data => {
        if (data.val().role === SPY) {
          if (data.val().isWin) {
            this.setState({ spyName: "не" });
          } else {
            this.setState({ spyName: "" });
          }
          this.setState({ isSpy: true });
        }
      });
  };

  resetRoute = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "mainScreen" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  exitFromRoom = () => {
    if (this.props.navigation.getParam("admin")) {
      firebaseDB.ref(this.props.navigation.getParam("gameID")).remove();
    }
  };

  handleGoToMenu = () => {
    this.exitFromRoom();
    this.resetRoute();
  };

  componentDidMount() {
    this.getSpyName();
    this.setResultText();
    this.checkIsSpy();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.resultTextContainer}>
            {this.state.resultText}
          </Text>
        </View>
        <View style={styles.centerContainer}>
          {this.state.resultText === WON ? (
            <Image
              source={require("../../assets/images/happiness.png")}
              style={styles.resultLogoContainer}
            />
          ) : (
            <Image
              source={require("../../assets/images/angry.png")}
              style={styles.resultLogoContainer}
            />
          )}
          {this.state.isSpy ? (
            <Text style={styles.spyNameTextContainer}>
              Вас {this.state.spyName} нашли
            </Text>
          ) : (
            <Text style={styles.spyNameTextContainer}>
              Шпионом был: {this.state.spyName}
            </Text>
          )}
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            color="#000000"
            style={styles.goToMenuContainer}
            onPress={this.handleGoToMenu}
          >
            <Text style={styles.goToMenuTextContainer}>{BUTTON_TO_MAIN}</Text>
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
  headerContainer: {
    flex: 2,
    alignItems: "center"
  },
  centerContainer: {
    flex: 18,
    alignItems: "center"
  },
  footerContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  resultTextContainer: {
    color: "#ffffff",
    fontWeight: "300",
    fontSize: SCREEN_DIMENSIONS.width * 0.075
  },
  spyNameTextContainer: {
    color: "#ffffff",
    fontWeight: "100",
    fontSize: SCREEN_DIMENSIONS.width * 0.07
  },

  goToMenuContainer: {
    backgroundColor: "#ffffff",
    width: SCREEN_DIMENSIONS.width * 0.5,
    height: SCREEN_DIMENSIONS.width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125,
    marginBottom: SCREEN_DIMENSIONS.width * 0.05
  },
  goToMenuTextContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#303030"
  },
  resultLogoContainer: {
    height: SCREEN_DIMENSIONS.height * 0.387,
    width: SCREEN_DIMENSIONS.height * 0.387,
    marginBottom: SCREEN_DIMENSIONS.width * 0.075
  }
});
