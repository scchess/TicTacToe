const X_WIN = "XXXXX";
const O_WIN = "OOOOO";

const steps = [0, 1, 2, 3, 4];

const checkValue = (value) => {
  if (value === X_WIN) {
    return "X_WIN";
  } else if (value === O_WIN) {
    return "O_WIN";
  }
};

export const getGameStatus = (moves) => {
  let gameStatus;
  // Check horizontal
  steps.find((step, i) => {
    gameStatus = checkValue(
      `${moves[step * 5]}${moves[step * 5 + 1]}${moves[step * 5 + 2]}${
        moves[step * 5 + 3]
      }${moves[step * 5 + 4]}`
    );

    return gameStatus !== undefined;
  });

  if (gameStatus) return gameStatus;

  // Check vertical
  steps.find((row) => {
    gameStatus = checkValue(
      `${moves[row]}${moves[row + 5]}${moves[row + 10]}${moves[row + 15]}${
        moves[row + 20]
      }`
    );
    return gameStatus !== undefined;
  });

  if (gameStatus) return gameStatus;

  // Check diagonal
  gameStatus = checkValue(
    `${moves[0]}${moves[6]}${moves[12]}${moves[18]}${moves[24]}`
  );
  if (gameStatus) return gameStatus;

  gameStatus = checkValue(
    `${moves[4]}${moves[8]}${moves[12]}${moves[16]}${moves[20]}`
  );
  if (gameStatus) return gameStatus;

  if (Object.values(moves).length === 25 && !gameStatus) return "DRAW";

  return gameStatus;
};
