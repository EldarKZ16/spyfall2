import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  AsyncStorage
} from "react-native";
import {
  APP_NAME,
  BUTTON_CREATE_GAME,
  BUTTON_JOIN_GAME,
  BUTTON_HOW_TO_PLAY
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";

export default class MainScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: null,
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: "#303030"
      },
      headerRight: (
        <TouchableOpacity
          style={styles.renameButtonStyle}
          onPress={() => {
            navigation.push("changeNameScreen");
          }}
        >
          <Image
            source={require("../../assets/images/rename.png")}
            style={styles.renameImageStyle}
          />
        </TouchableOpacity>
      )
    };
  };

  state = {
    name: ""
  };

  getUsernameFromAsync = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      this.setState({ name: username });
    } catch (error) {
      console.log(error);
    }
  };

  getUsernameFromParams = () => {
    try {
      const name = this.props.navigation.getParam("name");
      if (name !== undefined) {
        this.setState({ name });
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleNextScreen = screenName => {
    this.props.navigation.navigate(screenName, {
      username: this.state.name
    });
  };

  handleGuideGame = () => {
    this.props.navigation.navigate("guideScreen");
  };

  componentDidMount() {
    this.getUsernameFromAsync();
    this.getUsernameFromParams();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Image
            source={require("../../assets/images/app-logo-white.png")}
            style={styles.appLogoContainer}
          />
          <Text style={styles.logoTextContainer}>{APP_NAME}</Text>
        </View>
        <View style={styles.firstButtonContainer}>
          <TouchableOpacity
            style={styles.buttonStyleContainer}
            onPress={() => this.handleNextScreen("createGameScreen")}
          >
            <Text style={styles.buttonTextContainer}>{BUTTON_CREATE_GAME}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.secondButtonContainer}>
          <TouchableOpacity
            style={styles.buttonStyleContainer}
            onPress={() => this.handleNextScreen("joinGameScreen")}
          >
            <Text style={styles.buttonTextContainer}>{BUTTON_JOIN_GAME} </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.handleGuideGame}
          >
            <Text style={styles.howToPlayTextContainer}>
              {BUTTON_HOW_TO_PLAY}
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
  appLogoContainer: {
    width: SCREEN_DIMENSIONS.height * 0.21,
    height: SCREEN_DIMENSIONS.height * 0.21
  },
  logoTextContainer: {
    fontWeight: "bold",
    letterSpacing: SCREEN_DIMENSIONS.width * 0.0375,
    color: "white",
    fontSize: SCREEN_DIMENSIONS.width * 0.0875
  },
  mainContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  firstButtonContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  secondButtonContainer: {
    flex: 5,
    alignItems: "center"
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  buttonStyleContainer: {
    backgroundColor: "#ffffff",
    width: SCREEN_DIMENSIONS.width * 0.5,
    height: SCREEN_DIMENSIONS.width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  buttonTextContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.05,
    color: "#303030"
  },
  howToPlayTextContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.05,
    textDecorationLine: "underline",
    color: "#ffffff"
  },
  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  renameImageStyle: {
    height: SCREEN_DIMENSIONS.width * 0.075,
    width: SCREEN_DIMENSIONS.width * 0.075
  },
  renameButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: SCREEN_DIMENSIONS.width * 0.02
  }
});
