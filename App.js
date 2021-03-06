import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import WinOverlay from "./win_overlay";
import { getGameStatus } from "./game";
import ScaleIn from "./scalein";
import BlackPawn from "./BlackPawn";
import WhitePawn from "./WhitePawn";

const squares = [...Array(25).keys()];

export default class App extends Component {
  state = {
    user: "X",
    moves: {},
  };

  async componentDidMount() {
    const values = await AsyncStorage.multiGet(["XWins", "OWins"]);
    this.setState({
      [values[0][0]]: parseInt(values[0][1], 10) || 0,
      [values[1][0]]: parseInt(values[1][1], 10) || 0,
    });
  }

  updateStorage = (XWins, OWins) => {
    AsyncStorage.multiSet([
      ["XWins", `${XWins}`],
      ["OWins", `${OWins}`],
    ]);
  };

  handleRestart = () => {
    this.setState({
      moves: {},
      user: "X",
      gameStatus: undefined,
    });
  };

  handleReset = () => {
    this.updateStorage(0, 0);
    this.setState({
      XWins: 0,
      OWins: 0,
    });
  };

  handlePlaceMove = (index) => {
    this.setState(
      (state) => {
        const moves = { ...state.moves, [index]: state.user };
        const gameStatus = getGameStatus(moves);

        return {
          moves,
          user: state.user === "X" ? "O" : "X",
          gameStatus,
          XWins: gameStatus === "X_WIN" ? (state.XWins += 1) : state.XWins,
          OWins: gameStatus == "O_WIN" ? (state.OWins += 1) : state.OWins,
        };
      },
      () => {
        if (this.state.gameStatus) {
          this.updateStorage(this.state.XWins, this.state.OWins);
        }
      }
    );
  };

  render() {
    const { moves, user, gameStatus } = this.state;
    const { width } = Dimensions.get("window");

    const squareSize = width / 5 - 4;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.turn}>{user} Turn</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.board}>
            {squares.map((i) => {
              return (
                <View
                  key={i}
                  style={[
                    styles.square,
                    { width: squareSize, height: squareSize },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.touchSquare}
                    onPress={
                      !moves[i] ? () => this.handlePlaceMove(i) : undefined
                    }
                  >
                    {!!moves[i] && (
                      <ScaleIn>
                        {moves[i] === "X" ? <BlackPawn /> : <WhitePawn />}
                      </ScaleIn>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.winValue}>{this.state.XWins} X Wins</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={this.handleReset}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <Text style={styles.winValue}>{this.state.OWins} O Wins</Text>
        </View>
        {!!gameStatus && (
          <WinOverlay value={gameStatus} onRestart={this.handleRestart} />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  turn: {
    fontSize: 24,
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  touchSquare: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  winValue: {
    fontSize: 18,
  },
  resetButton: {
    borderRadius: 8,
    backgroundColor: "tomato",
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 20,
  },
});
