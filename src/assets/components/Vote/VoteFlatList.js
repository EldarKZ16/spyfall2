import React from "react";
import { FlatList } from "react-native";
import VoteFlatListItem from "./VoteFlatListItem";

export default class VoteFlatList extends React.Component {
  render() {
    return (
      <FlatList
        data={this.props.players}
        extraData={this.props}
        numColumns={2}
        renderItem={({ item, index }) => (
          <VoteFlatListItem
            data={item}
            index={index}
            pressedIndex={this.props.pressedIndex}
            isSelected={this.props.idx}
            isVoted={this.props.isVoted}
          />
        )}
        keyExtractor={(item, index) => index}
      />
    );
  }
}
