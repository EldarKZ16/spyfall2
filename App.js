import React from "react";
import { AsyncStorage, Text, StyleSheet } from "react-native";
import { Asset, AppLoading } from "expo";
import { createStackNavigator } from "react-navigation";
import { Snackbar, Provider } from "react-native-paper";
import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import {
  MainScreen,
  CreateGameScreen,
  JoinGameScreen,
  WelcomeScreen,
  GuideScreen,
  CardScreen,
  VoteScreen,
  ResultsScreen,
  ChangeNameScreen
} from "./src/screens";
import { firebaseDB } from "./src/firebase";
import {
  SUCCESS_NETWORK_ON,
  WARNING_NETWORK_OFF
} from "./src/assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "./src/assets/components/common/dimensions";

global.connectionSt = null;

const StackNavigator = createStackNavigator(
  {
    mainScreen: MainScreen,
    changeNameScreen: ChangeNameScreen,
    createGameScreen: CreateGameScreen,
    joinGameScreen: JoinGameScreen,
    guideScreen: GuideScreen,
    cardScreen: CardScreen,
    voteScreen: VoteScreen,
    resultsScreen: ResultsScreen
  },
  {
    initialRouteName: "mainScreen",
    transitionConfig: getSlideFromRightTransition
  }
);

export default class App extends React.Component {
  state = {
    isReady: false,
    visible: false,
    text: "",
    wasShown: null
  };

  wasShownStatus = async () => {
    const wasShown = await AsyncStorage.getItem("key");

    if (wasShown === null) {
      await AsyncStorage.setItem("key", "true");
    }
    await this.setState({ wasShown });
  };

  connectionCheck = () => {
    const connectedRef = firebaseDB.ref(".info/connected");
    connectedRef.on("value", snap => {
      if (connectionSt && !snap.val()) {
        this.setState({
          visible: true,
          text: WARNING_NETWORK_OFF
        });
      }

      if (!connectionSt && snap.val()) {
        this.setState({
          visible: true,
          text: SUCCESS_NETWORK_ON
        });
      }
      connectionSt = snap.val();
    });
  };

  componentWillMount() {
    this.wasShownStatus();
  }

  componentDidUpdate() {
    this.connectionCheck();
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    if (this.state.wasShown === "true") {
      return (
        <React.Fragment>
          <StackNavigator />
          <Provider>
            <Snackbar
              visible={this.state.visible}
              onDismiss={() => this.setState({ visible: false })}
              style={
                this.state.text === SUCCESS_NETWORK_ON
                  ? styles.successTextColor
                  : styles.errorTextColor
              }
              duration={500}
            >
              <Text style={styles.snackbarTextContainer}>
                {this.state.text}
              </Text>
            </Snackbar>
          </Provider>
        </React.Fragment>
      );
    } else {
      return (
        <WelcomeScreen
          nextScreen={wasShown => {
            this.setState({ wasShown });
          }}
        />
      );
    }
  }

  async _cacheResourcesAsync() {
    const images = [
      require("./src/assets/images/app-logo-dark.png"),
      require("./src/assets/images/app-logo-white.png"),
      require("./src/assets/images/rename.png")
    ];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }
}

const styles = StyleSheet.create({
  snackbarTextContainer: {
    fontSize: SCREEN_DIMENSIONS.width * 0.045
  },
  errorTextColor: {
    backgroundColor: "#ff3232"
  },
  successTextColor: {
    backgroundColor: "#006400"
  }
});
