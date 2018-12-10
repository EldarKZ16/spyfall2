import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { Snackbar, Provider } from "react-native-paper";
import { HeaderBackButton } from "react-navigation";
import { firebaseDB } from "../../firebase";
import {
  BUTTON_JOIN,
  ERROR_GAME_NOT_FOUND,
  WAITING_FOR_START,
  SUCCESS_GAME_FOUND,
  ENTER_GAME_CODE
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";

export default class JoinGameScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          tintColor="#ffffff"
          onPress={() => {
            const gameID = navigation.getParam("gameID");
            if (gameID !== undefined) {
              const keyID = navigation.getParam("keyID");
              firebaseDB
                .ref(gameID)
                .child(keyID)
                .remove();
            }
            navigation.goBack();
          }}
        />
      ),
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: "#303030"
      }
    };
  };

  state = {
    name: this.props.navigation.getParam("username"),
    gameID: "",
    joinText: BUTTON_JOIN,
    visible: false,
    roomFind: false
  };
  isScreen = true;

  checkChangesAndNavigate = () => {
    let DB = firebaseDB.ref();
    DB.on("child_removed", data => {
      if (data.key === this.state.gameID && this.isScreen) {
        this.props.navigation.goBack();
      }
    });

    firebaseDB
      .ref(`${this.state.gameID}/${this.props.navigation.getParam("keyID")}`)
      .on("child_added", data => {
        if (data.key === "role") {
          DB = null;
          this.isScreen = false;
          this.props.navigation.navigate("cardScreen", {
            gameID: this.props.navigation.getParam("gameID"),
            keyID: this.props.navigation.getParam("keyID"),
            admin: false
          });
        }
      });
  };

  searchForRoom = () => {
    firebaseDB
      .ref()
      .once("value")
      .then(data => {
        if (
          !data.hasChild(this.state.gameID) ||
          !connectionSt ||
          data.child(this.state.gameID).hasChild("time") ||
          data.child(this.state.gameID).numChildren() > 7
        ) {
          this.setState({
            visible: true,
            text: ERROR_GAME_NOT_FOUND,
            backColor: "#ff9c00"
          });
        } else if (data.hasChild(this.state.gameID) && connectionSt) {
          const keyID = new Date().getTime();
          this.props.navigation.setParams({ gameID: this.state.gameID, keyID });
          firebaseDB
            .ref(`${this.state.gameID}/${keyID}`)
            .set({
              user: this.state.name
            })
            .catch(err => {
              console.log(err);
            });
          this.setState({
            roomFind: true,
            visible: true,
            joinText: WAITING_FOR_START,
            text: SUCCESS_GAME_FOUND,
            backColor: "#006400"
          });
          this.checkChangesAndNavigate();
        }
      });
  };

  renderJoinGame = () => {
    Keyboard.dismiss();
    this.searchForRoom();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/app-logo-white.png")}
            style={styles.appLogoContainer}
          />
        </View>
        <View style={styles.centerContainer}>
          <TextInput
            style={styles.textInputContainer}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            selectionColor="#000000"
            placeholder={ENTER_GAME_CODE}
            placeholderTextColor="#ffffff"
            value={this.state.gameID}
            onChangeText={gameID => this.setState({ gameID })}
          />
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            disabled={
              this.state.gameID === "" || this.state.roomFind ? true : false
            }
            style={[
              this.state.gameID === "" || this.state.roomFind
                ? styles.onBlurContainer
                : styles.onFocusContainer,
              styles.joinButtonContainer
            ]}
            onPress={this.renderJoinGame}
          >
            {this.state.roomFind ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.joinTextContainer}>
                  {this.state.joinText}
                </Text>
                <ActivityIndicator size="small" color="#303030" />
              </View>
            ) : (
              <Text style={styles.joinTextContainer}>
                {this.state.joinText}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Provider>
          <Snackbar
            visible={this.state.visible}
            onDismiss={() => this.setState({ visible: false })}
            style={{ backgroundColor: this.state.backColor }}
            duration={800}
          >
            <Text style={{ fontSize: SCREEN_DIMENSIONS.width * 0.045 }}>
              {this.state.text}
            </Text>
          </Snackbar>
        </Provider>
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
    flex: 4,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  centerContainer: {
    flex: 1,
    alignItems: "center"
  },
  footerContainer: {
    flex: 5,
    alignItems: "center"
  },
  appLogoContainer: {
    width: SCREEN_DIMENSIONS.height * 0.25,
    height: SCREEN_DIMENSIONS.height * 0.25
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
  joinButtonContainer: {
    width: SCREEN_DIMENSIONS.width * 0.5,
    height: SCREEN_DIMENSIONS.width * 0.0875,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125
  },
  joinTextContainer: {
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
