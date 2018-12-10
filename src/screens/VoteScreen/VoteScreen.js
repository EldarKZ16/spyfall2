import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import {
  BUTTON_VOTE,
  BUTTON_PUBLISH,
  WHO_IS_SPY,
  WAITING_FOR_ADMIN
} from "../../assets/components/common/strings";
import { SCREEN_DIMENSIONS } from "../../assets/components/common/dimensions";
import { firebaseDB } from "../../firebase";
import VoteFlatList from "../../assets/components/Vote/VoteFlatList";

export default class VoteScreen extends React.Component {
  static navigationOptions = {
    headerLeft: null,
    headerStyle: {
      shadowOpacity: 0,
      elevation: 0,
      backgroundColor: "#303030"
    }
  };

  state = {
    realtimeDB: "",
    IDs: "",
    currentPressedPlayerIndex: -1,
    buttonText: BUTTON_VOTE,
    maxVote: -1,
    maxVotePlayerId: -1,
    spyPlayerID: this.props.navigation.getParam("spyPlayerID"),
    isVoted: false
  };

  getData = () => {
    firebaseDB
      .ref(this.props.navigation.getParam("gameID"))
      .once("value", data => {
        const newData = data.toJSON();
        let keys = Object.keys(newData);
        let realtimedb = Object.values(newData);
        realtimedb = realtimedb.filter(
          (data, index) => index < realtimedb.length - 2
        );
        keys = keys.filter((data, index) => index < keys.length - 2);
        this.setState({ realtimeDB: realtimedb, IDs: keys });
      });
  };

  getIndex = id => {
    let idx = -1;
    const ids = [...this.state.IDs];
    ids.map((key, index) => {
      if (key === id) {
        idx = index;
      }
    });
    return idx;
  };

  checkChanges = () => {
    firebaseDB
      .ref(this.props.navigation.getParam("gameID"))
      .on("child_changed", data => {
        let newData = [...this.state.realtimeDB];
        const index = this.getIndex(data.key);
        newData[index] = data.val();
        let vote = data.val().votes;
        const voteNumber = this.state.maxVote;
        if (voteNumber < vote) {
          this.setState({ maxVote: vote, maxVotePlayerId: data.key });
        }
        this.setState({ realtimeDB: newData });
      });

    firebaseDB
      .ref(
        `${this.props.navigation.getParam(
          "gameID"
        )}/${this.props.navigation.getParam("keyID")}`
      )
      .on("child_added", data => {
        this.props.navigation.navigate("resultsScreen", {
          gameID: this.props.navigation.getParam("gameID"),
          keyID: this.props.navigation.getParam("keyID"),
          admin: this.props.navigation.getParam("admin")
        });
      });
  };

  updateVotes = () => {
    let vote = 0;
    firebaseDB
      .ref(
        `${this.props.navigation.getParam("gameID")}/${
          this.state.IDs[this.state.currentPressedPlayerIndex]
        }`
      )
      .once("value", data => {
        vote = data.val().votes;
      });
    firebaseDB
      .ref(
        `${this.props.navigation.getParam("gameID")}/${
          this.state.IDs[this.state.currentPressedPlayerIndex]
        }`
      )
      .update({
        votes: vote + 1
      })
      .catch(err => {
        console.log(err);
      });
  };

  shareResults = () => {
    let win = false;
    let winSpy = false;
    if (this.state.spyPlayerID === this.state.maxVotePlayerId) {
      win = true;
    }

    if (win) {
      winSpy = false;
    } else {
      winSpy = true;
    }

    firebaseDB
      .ref(
        `${this.props.navigation.getParam("gameID")}/${this.state.spyPlayerID}`
      )
      .update({
        isWin: winSpy
      });

    let ids = this.state.IDs;
    ids = ids.filter(id => id !== this.state.spyPlayerID);
    ids.map(id => {
      firebaseDB
        .ref(`${this.props.navigation.getParam("gameID")}/${id}`)
        .update({
          isWin: win
        });
    });
  };

  renderPlayerVote = () => {
    if (this.state.buttonText === BUTTON_VOTE) {
      this.updateVotes();
    } else if (this.state.buttonText === BUTTON_PUBLISH) {
      this.shareResults();
    }

    if (this.props.navigation.getParam("admin")) {
      this.setState({ buttonText: BUTTON_PUBLISH });
    }

    this.setState({ isVoted: true });
  };

  async componentDidMount() {
    await this.getData();
    this.checkChanges();
  }

  componentWillUnmount() {
    firebaseDB
      .ref(
        `${this.props.navigation.getParam(
          "gameID"
        )}/${this.props.navigation.getParam("keyID")}`
      )
      .off("child_added");
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/app-logo-white.png")}
            style={styles.appLogoContainer}
          />
          <Text style={styles.questionTextContainer}>{WHO_IS_SPY}</Text>
        </View>
        <View style={styles.centerContainer}>
          <VoteFlatList
            players={this.state.realtimeDB}
            idx={currentPressedPlayerIndex =>
              this.setState({ currentPressedPlayerIndex })
            }
            pressedIndex={this.state.currentPressedPlayerIndex}
            isVoted={this.state.isVoted}
          />
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            disabled={
              this.state.currentPressedPlayerIndex === -1 ||
              (this.state.isVoted && !this.props.navigation.getParam("admin"))
                ? true
                : false
            }
            color="#000000"
            style={[
              styles.createGameContainer,
              this.state.currentPressedPlayerIndex === -1 ||
              (this.state.isVoted && !this.props.navigation.getParam("admin"))
                ? styles.pressedButtonContainer
                : styles.notPressedButtonContainer
            ]}
            onPress={this.renderPlayerVote}
          >
            {this.state.isVoted && !this.props.navigation.getParam("admin") ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.createGameTextContainer}>
                  {WAITING_FOR_ADMIN}
                </Text>
                <ActivityIndicator />
              </View>
            ) : (
              <Text style={styles.createGameTextContainer}>
                {this.state.buttonText}
              </Text>
            )}
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
    flex: 3,
    alignItems: "center"
  },
  appLogoContainer: {
    width: SCREEN_DIMENSIONS.height * 0.21,
    height: SCREEN_DIMENSIONS.height * 0.21
  },
  questionTextContainer: {
    fontWeight: "400",
    color: "white",
    fontSize: SCREEN_DIMENSIONS.width * 0.06
  },
  centerContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  footerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  createGameContainer: {
    width: SCREEN_DIMENSIONS.width * 0.5,
    height: SCREEN_DIMENSIONS.width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SCREEN_DIMENSIONS.width * 0.0125,
    marginBottom: SCREEN_DIMENSIONS.width * 0.05
  },
  createGameTextContainer: {
    fontWeight: "bold",
    fontSize: SCREEN_DIMENSIONS.width * 0.045,
    color: "#303030"
  },
  pressedButtonContainer: {
    backgroundColor: "#a8a8a8"
  },
  notPressedButtonContainer: {
    backgroundColor: "#ffffff"
  }
});
