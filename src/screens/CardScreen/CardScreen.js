import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { StackActions, NavigationActions } from "react-navigation";
import {
  SPY,
  BUTTON_DISCONNECT,
  LOCATION,
  ROLE
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";
import { firebaseDB } from "../../firebase";

export default class CardScreen extends React.Component {
  static navigationOptions = {
    headerLeft: null,
    headerStyle: {
      shadowOpacity: 0,
      elevation: 0
    }
  };

  state = {
    role: "",
    location: "",
    animation: "zoomInDown",
    seconds: 60,
    isPressed: false
  };
  isScreen = true;
  _isMounted = false;

  format() {
    let scd = this.state.seconds % 60;
    let minute = Math.floor(this.state.seconds / 60);

    minute = minute < 1 ? "00" : minute < 10 ? `0${minute}` : minute;
    scd = scd < 1 ? "00" : scd < 10 ? `0${scd}` : scd;
    return `${minute}:${scd}`;
  }

  resetRoute = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "mainScreen" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  checkIsRoomOnline = () => {
    firebaseDB.ref().on("child_removed", data => {
      if (
        data.key === this.props.navigation.getParam("gameID") &&
        this.isScreen &&
        this._isMounted
      ) {
        this.resetRoute();
      }
    });
  };

  getDataFromFirebase = () => {
    firebaseDB
      .ref(this.props.navigation.getParam("gameID"))
      .child(this.props.navigation.getParam("keyID"))
      .once("value")
      .then(data => {
        if (this._isMounted) {
          this.setState({
            role: data.val().role,
            location: data.val().location
          });
        }
      });

    firebaseDB
      .ref(this.props.navigation.getParam("gameID"))
      .once("value")
      .then(data => {
        if (this._isMounted) {
          this.setState({ seconds: data.val().time });
        }
      });
  };

  handleOnFinish = () => {
    this.isScreen = false;
    this.props.navigation.navigate("voteScreen", {
      gameID: this.props.navigation.getParam("gameID"),
      keyID: this.props.navigation.getParam("keyID"),
      admin: this.props.navigation.getParam("admin"),
      spyPlayerID: this.props.navigation.getParam("spyPlayerID")
    });
  };

  exitFromRoom = () => {
    if (this.props.navigation.getParam("admin")) {
      firebaseDB.ref(this.props.navigation.getParam("gameID")).remove();
    } else {
      firebaseDB
        .ref(this.props.navigation.getParam("gameID"))
        .child(this.props.navigation.getParam("keyID"))
        .remove();
    }
  };

  handleDisconnection = () => {
    this.exitFromRoom();
    this.resetRoute();
  };

  setSecondInterval = () => {
    this.interval = setInterval(() => {
      if (this.state.seconds <= 0) {
        clearInterval(this.interval);
        this.forceUpdate();
        return;
      }
      this.setState({ seconds: this.state.seconds - 1 });
    }, 1000);
  };
  async componentDidMount() {
    this._isMounted = true;
    await this.setSecondInterval();
    await this.getDataFromFirebase();

    if (!this.props.navigation.getParam("admin")) {
      this.checkIsRoomOnline();
    }
  }

  componentDidUpdate() {
    if (this.state.seconds === 0) {
      this.handleOnFinish();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    firebaseDB.ref().off("child_removed");
    clearInterval(this.interval);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerTextContainer}>
            {this.format(this.state.seconds)}
          </Text>
        </View>

        <View style={styles.mainContainer}>
          <TouchableOpacity
            disabled={this.state.isPressed}
            onPress={() =>
              this.setState({
                animation:
                  this.state.animation === "zoomInDown"
                    ? "zoomOutDown"
                    : "zoomInDown"
              })
            }
          >
            <Image
              source={require("../../assets/images/app-logo-dark.png")}
              style={styles.appLogoDarkContainer}
            />
          </TouchableOpacity>
        </View>

        <Animatable.View
          style={styles.dataContainer}
          animation={this.state.animation}
          duration={2000}
          onAnimationBegin={() => this.setState({ isPressed: true })}
          onAnimationEnd={() => this.setState({ isPressed: false })}
          useNativeDriver={true}
        >
          {this.state.role !== SPY ? (
            <React.Fragment>
              <Text style={styles.dataTextContainer}>
                {LOCATION}: {this.state.location}
              </Text>
              <Text style={styles.dataTextContainer}>
                {ROLE}: {this.state.role}
              </Text>
            </React.Fragment>
          ) : (
            <Text style={styles.dataTextContainer}>
              {ROLE}: {this.state.role}
            </Text>
          )}
        </Animatable.View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            color="#000000"
            style={styles.disconnectionButtonContainer}
            onPress={this.handleDisconnection}
          >
            <Text style={styles.disconnectionTextContainer}>
              {BUTTON_DISCONNECT}
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
    backgroundColor: "#ffffff"
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  timerTextContainer: {
    fontSize: SCREEN_DIMENSIONS.width * 0.053,
    fontWeight: "400"
  },
  mainContainer: {
    flex: 1
  },
  appLogoDarkContainer: {
    height: SCREEN_DIMENSIONS.width * 0.5,
    width: SCREEN_DIMENSIONS.width * 0.5,
    alignSelf: "center"
  },
  dataContainer: {
    flex: 4,
    justifyContent: "center",
    marginLeft: SCREEN_DIMENSIONS.width * 0.05
  },
  dataTextContainer: {
    fontSize: SCREEN_DIMENSIONS.width * 0.05,
    fontWeight: "400",
    marginTop: SCREEN_DIMENSIONS.width * 0.025
  },
  footerContainer: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center"
  },
  disconnectionButtonContainer: {
    backgroundColor: "#000000",
    width: SCREEN_DIMENSIONS.width * 0.5,
    height: SCREEN_DIMENSIONS.width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125
  },
  disconnectionTextContainer: {
    fontWeight: "400",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#ffffff"
  }
});
