import React, { createContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, GestureResponderEvent } from "react-native";
import { getBackgroundColor, play, spawnNumber, calculateScore, isNextMove } from "./Game";
import { Modal, Pressable } from "react-native";

export default function Board() {
  const [board, setBoard] = useState(
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  );

  const ScoreContext = createContext(0);
  const [score, setScore] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    setBoard(_ => [...spawnNumber({ board })]);
    setBoard(_ => [...spawnNumber({ board }, 4)]);
  }, []);

  useEffect(() => {
    if (!isNextMove(board)) {
      setVisibility(!visibility);
    };
  }, [board]);

  useEffect(() => {
    setScore(calculateScore(board, score));
  }, [board]);

  const startPosition = (e: GestureResponderEvent) => {
    const startX = e.nativeEvent.pageX;
    const startY = e.nativeEvent.pageY;
    setPosX(startX);
    setPosY(startY);
  };

  //This function wants to map user's swipe
  const endPosition = (e: GestureResponderEvent) => {
    if (visibility) return;
    const endX = e.nativeEvent.pageX;
    const endY = e.nativeEvent.pageY;
    const xDiff = Math.abs(posX - endX);
    const yDiff = Math.abs(posY - endY);
    if (xDiff < 20 && yDiff < 20) return;
    (xDiff > yDiff)
      ? (posX > endX)
        ? setBoard(spawnNumber(play(board, "left")))
        : setBoard(spawnNumber(play(board, "right")))
      : (posY > endY)
        ? setBoard(spawnNumber(play(board, "up")))
        : setBoard(spawnNumber(play(board, "down")));
  };

  return (
    <View onTouchStart={startPosition} onTouchEnd={endPosition} style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibility}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hai perso!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                //TODO refactor this with resetBoard()
                setBoard([
                  [0, 0, 0, 0],
                  [0, 2, 0, 0],
                  [0, 0, 0, 0],
                  [0, 0, 4, 0]
                ]);
                setScore(-1);
                setVisibility(!visibility);
              }}

            >
              <Text style={styles.textStyle}>Ricomincia</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

      <Text style={styles.title}>2048</Text>

      <ScoreContext.Provider value={score}>
        <Text style={styles.scoreValue}>
          <View>
            <Text style={styles.score}>
              Score:
            </Text>
          </View>
          {score}
        </Text>
      </ScoreContext.Provider>
      <View>
        {board.map((row, index) => {
          return (
            <View style={styles.cellRow} key={index}>
              {row.map((value, index) => {
                return (
                  <View style={{ ...styles.cell, backgroundColor: getBackgroundColor(value) }} key={index}>
                    <Text style={[styles.value, value < 8 ? { color: '#776e63' } : { color: 'white' }]}>{value !== 0 ? value : ''}</Text>
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    padding: '15%',
    backgroundColor: '#fbf8ef',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#baac9f',
  },
  score: {
    color: 'white',
    fontSize: 18,
  },
  scoreValue: {
    backgroundColor: '#baac9f',
    position: 'absolute',
    top: '23%',
    right: '8%',
    fontSize: 20,
    color: 'white',
    width: 90,
    textAlign: 'center',
    display: 'flex',
    height: 65,

  },
  cell: {
    width: 85,
    height: 85,
    borderWidth: 5,
    borderColor: '#baac9f',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '400',
  },
  title: {
    color: 'white',
    backgroundColor: '#E7B723',
    fontSize: 50,
    position: 'absolute',
    top: '18%',
    left: '8%',
    width: 150,
    textAlign: 'center',
    borderRadius: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalView: {
    height: '25%',
    width: '80%',
    margin: 20,
    backgroundColor: "#fbf8ef",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    width: '70%',
    height: '40%',
  },
  buttonClose: {
    backgroundColor: "#E8C350",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontSize: 23,
  }
})