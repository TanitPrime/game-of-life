import React, { useState, useCallback, useRef } from "react";
import "./App.css";

const numRows = 30;
const numCols = 30;

function gridInit(size) {
  console.log("initialized with size= "+size)
  const Rows = [];
  for (let i = 0; i < size; i++) {
    Rows.push(Array.from(Array(size), () => 0));
  }
  return Rows;
}

//returns number of living neighbours to given cell
//breaks if the cell is at the edge lmao
function liveNeighbours(g, i, j) {
  let x = 0;
  g[i - 1][j - 1] ? (x += 1) : (x = x);
  g[i - 1][j] ? (x += 1) : (x = x);
  g[i - 1][j + 1] ? (x += 1) : (x = x);
  g[i][j + 1] ? (x += 1) : (x = x);
  g[i + 1][j] ? (x += 1) : (x = x);
  g[i + 1][j + 1] ? (x += 1) : (x = x);
  g[i + 1][j - 1] ? (x += 1) : (x = x);
  g[i][j - 1] ? (x += 1) : (x = x);
  return x;
}

function App() {
  //grid state
  const [grid, setGrid] = useState(() => {
    return gridInit(numRows, numCols);
  });

  const [size, setSize] = useState(30);

  //simulation state
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  //simulation recursive function
  const runSimulation = useCallback(() => {
    //kill condition
    console.log(runningRef.current);
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      let gridCopy = gridInit(size);
      Object.assign(gridCopy, g);

      //cell life logic
      for (let i = 1; i <= size - 2; i++) {
        for (let j = 1; j <= size - 2; j++) {
          if (grid[i][j]) {
            if (
              liveNeighbours(grid, i, j) < 2 ||
              liveNeighbours(grid, i, j) > 3
            ) {
              gridCopy[i][j] = 0;
            }
          } else {
            if (liveNeighbours(grid, i, j) === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      }
      return gridCopy;
    });
    setTimeout(runSimulation, 750);
  }, []);

  return (
    <>
      <h3 align="center">Click the grid to pick seed cells!</h3>
      <div className="controls">
        <label>set grid size</label>
        <input
          type="range"
          min="5"
          max="55"
          value={size}
          step="5"
          onChange={(e) => {
            setSize(e.target.value);
            setGrid(gridInit(size));
            console.log(size)
          }}
        ></input>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>

        <button
          onClick={() => {
            setGrid(gridInit(size));
          }}
        >
          Clear
        </button>
      </div>

      <div
        className="grid-wrap"
        style={{gridTemplateColumns: `repeat(${size},20px)`}}
      >
        {grid.map((Rows, i) =>
          Rows.map((Cols, j) => (
            <div
              key={`${i}-${j}`}
              className="Cell"
              style={{ backgroundColor: grid[i][j] ? "blue" : "white" }}
              onMouseDown={() => {
                //copy the grid because it's immutable
                let gridCopy = gridInit(size);
                Object.assign(gridCopy, grid);
                grid[i][j] ? (gridCopy[i][j] = 0) : (gridCopy[i][j] = 1);
                //if you enable this dont click the edge of the grid
                console.log(
                  `cell ${i}|${j} clicked has ${liveNeighbours(
                    grid,
                    i,
                    j
                  )} live neighbours`
                );
                setGrid(gridCopy);
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
