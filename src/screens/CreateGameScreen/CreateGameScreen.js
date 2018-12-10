import React from "react";
import {
  View,
  StyleSheet,
  YellowBox,
  Text,
  TouchableOpacity
} from "react-native";
import _ from "lodash";
import { HeaderBackButton } from "react-navigation";
import { Snackbar, Provider } from "react-native-paper";
import { firebaseDB } from "../../firebase";
import {
  GAME_CODE,
  BUTTON_START,
  WARNING_MINIMAL_NUMBER_OF_PLAYERS,
  SPY
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";
import { GAME_CARDS } from "../../assets/components/common/cards";
import PlayersFlatList from "../../assets/components/CreateGame/PlayersFlatList";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

export default class CreateGameScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          tintColor="#ffffff"
          onPress={() => {
            const gameID = navigation.getParam("gameID");
            firebaseDB.ref(gameID).remove();
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
    realtimeDB: "",
    name: this.props.navigation.getParam("username"),
    gameID: "",
    keyID: "",
    spyPlayerID: "",
    visible: false
  };

  generateIDofRoom = () => {
    const uuidv4 = require("uuid/v4");
    const newGameID = uuidv4()
      .slice(1, 6)
      .toUpperCase();
    const newKeyID = new Date().getTime();
    this.setState({
      gameID: newGameID,
      keyID: newKeyID
    });
  };

  connectAdminToRoom = () => {
    firebaseDB
      .ref(`${this.state.gameID}/${this.state.keyID}`)
      .set({
        user: this.state.name
      })
      .catch(err => {
        console.log(err);
      });
  };

  checkChangesInRoom = () => {
    firebaseDB.ref(this.state.gameID).on("child_added", data => {
      if (data.key !== "time" && data.key !== "spyName") {
        const newarray = [...this.state.realtimeDB, data];
        this.setState({
          realtimeDB: newarray
        });
      }
    });

    firebaseDB.ref(this.state.gameID).on("child_removed", data => {
      let newarray = [...this.state.realtimeDB];
      newarray = newarray.filter(item => item.key !== data.key);
      this.setState({
        realtimeDB: newarray
      });
    });
  };

  async componentWillMount() {
    await this.generateIDofRoom();
    this.connectAdminToRoom();
  }

  componentDidMount() {
    this.checkChangesInRoom();
    this.props.navigation.setParams({ gameID: this.state.gameID });
  }

  updateFirebaseDataWithCards = () => {
    const DB = [...this.state.realtimeDB];
    const locations = Object.keys(GAME_CARDS);
    const locationIndex = Math.floor(Math.random() * locations.length);
    const locationOfPlayers = locations[locationIndex];
    let roles = Object.values(GAME_CARDS)[locationIndex];
    roles = roles.filter((role, index) => index < this.state.realtimeDB.length);
    DB.map(data => {
      let indexOfRole = Math.floor(Math.random() * roles.length);
      let roleOfPlayer = roles[indexOfRole];
      roles = roles.filter(role => role !== roleOfPlayer);
      firebaseDB
        .ref(`${this.state.gameID}/${data.key}`)
        .update({
          role: roleOfPlayer,
          location: locationOfPlayers,
          votes: 0
        })
        .catch(err => {
          console.log(err);
        });
      firebaseDB
        .ref(`${this.state.gameID}`)
        .update({
          time: this.state.realtimeDB.length * 60
        })
        .catch(err => {
          console.log(err);
        });
      if (roleOfPlayer === SPY) {
        firebaseDB.ref(`${this.state.gameID}`).update({
          spyName: data.val().user
        });
        this.setState({ spyPlayerID: data.key });
      }
    });
  };

  renderCreateGame = async () => {
    if (this.state.realtimeDB.length > 2) {
      await this.updateFirebaseDataWithCards();

      this.props.navigation.navigate("cardScreen", {
        gameID: this.state.gameID,
        keyID: this.state.keyID,
        admin: true,
        spyPlayerID: this.state.spyPlayerID
      });
    } else {
      this.setState({ visible: true });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.gameCodeContainer}>{GAME_CODE}</Text>
          <Text style={styles.gameIDContainer}>{this.state.gameID}</Text>
        </View>
        <View style={styles.centerContainer}>
          <PlayersFlatList players={this.state.realtimeDB} />
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            color="#000000"
            style={styles.createGameContainer}
            onPress={this.renderCreateGame}
          >
            <Text style={styles.createGameTextContainer}>{BUTTON_START}</Text>
          </TouchableOpacity>
        </View>
        <Provider>
          <Snackbar
            visible={this.state.visible}
            onDismiss={() => this.setState({ visible: false })}
            style={styles.snackbarContainer}
            duration={700}
          >
            <Text style={styles.snackbarTextContainer}>
              {WARNING_MINIMAL_NUMBER_OF_PLAYERS}
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
    flex: 2,
    alignItems: "center"
  },
  gameCodeContainer: {
    color: "#ffffff",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    fontWeight: "bold",
    marginBottom: SCREEN_DIMENSIONS.width * 0.025
  },
  gameIDContainer: {
    borderWidth: SCREEN_DIMENSIONS.width * 0.005,
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125,
    height: SCREEN_DIMENSIONS.width * 0.1,
    width: SCREEN_DIMENSIONS.width * 0.625,
    borderColor: "#ffffff",
    color: "#ffffff",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    textAlignVertical: "center",
    textAlign: "center"
  },
  centerContainer: {
    flex: 8
  },
  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
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
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#303030"
  },
  snackbarContainer: {
    backgroundColor: "#ff9c00"
  },
  snackbarTextContainer: {
    fontSize: SCREEN_DIMENSIONS.width * 0.045
  },
  displayOn: {
    display: "flex"
  },
  displayOff: {
    display: "none"
  }
});
