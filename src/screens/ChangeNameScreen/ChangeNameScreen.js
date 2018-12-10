import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  AsyncStorage
} from "react-native";
import {
  ENTER_YOUR_NAME,
  APP_NAME,
  BUTTON_SAVE
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";

export default class ChangeNameScreen extends React.Component {
  static navigationOptions = {
    headerTintColor: "#ffffff",
    headerStyle: {
      shadowOpacity: 0,
      elevation: 0,
      backgroundColor: "#303030"
    }
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

  handleNextButton = async () => {
    try {
      await AsyncStorage.setItem("username", this.state.name);
    } catch (error) {
      console.log(error);
    }
    this.props.navigation.push("mainScreen", {
      name: this.state.name
    });
  };

  async componentWillMount() {
    await this.getUsernameFromAsync();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/app-logo-white.png")}
            style={styles.appLogoContainer}
          />
          <Text style={styles.logoTextContainer}>{APP_NAME}</Text>
        </View>
        <View style={styles.centerContainer}>
          <TextInput
            style={styles.textInputContainer}
            maxLength={7}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            selectionColor="#000000"
            placeholder={ENTER_YOUR_NAME}
            value={this.state.name}
            onChangeText={name => {
              this.setState({ name });
            }}
          />
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            disabled={this.state.name !== "" ? false : true}
            style={[
              this.state.name !== ""
                ? styles.onFocusContainer
                : styles.onBlurContainer,
              styles.nextButtonContainer
            ]}
            onPress={this.handleNextButton}
          >
            <Text style={styles.nextTextContainer}>{BUTTON_SAVE}</Text>
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
    alignItems: "center",
    justifyContent: "flex-end"
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  footerContainer: {
    flex: 3,
    alignItems: "center"
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

  textInputContainer: {
    borderWidth: SCREEN_DIMENSIONS.width * 0.005,
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125,
    height: SCREEN_DIMENSIONS.width * 0.1,
    width: SCREEN_DIMENSIONS.width * 0.625,
    textAlign: "center",
    borderColor: "#ffffff",
    color: "#ffffff",
    fontSize: SCREEN_DIMENSIONS.width * 0.045
  },
  nextButtonContainer: {
    width: SCREEN_DIMENSIONS.width * 0.35,
    height: SCREEN_DIMENSIONS.width * 0.0875,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125
  },
  nextTextContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#303030"
  },
  onBlurContainer: {
    backgroundColor: "#a8a8a8"
  },
  onFocusContainer: {
    backgroundColor: "#ffffff"
  }
});
