import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SCREEN_DIMENSIONS } from "../common/dimensions";
import PlayersFlatListItem from "./PlayersFlatListItem";

export default class PlayersFlatList extends React.PureComponent {
  render() {
    return (
      <FlatList
        data={this.props.players}
        extraData={this.props}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={styles.wrapperContainer}
        renderItem={({ item }) => (
          <PlayersFlatListItem username={item.val().user} />
        )}
        keyExtractor={item => item.key}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    marginBottom: SCREEN_DIMENSIONS.width * 0.05,
    justifyContent: "space-around"
  }
});
