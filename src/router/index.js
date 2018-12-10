import { createStackNavigator } from "react-navigation";
import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import {
  MainScreen,
  CreateGameScreen,
  JoinGameScreen,
  GuideScreen,
  CardScreen,
  VoteScreen,
  ResultsScreen,
  ChangeNameScreen
} from "../screens";

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

export default StackNavigator;
