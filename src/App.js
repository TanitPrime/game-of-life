import React, { useState, useCallback,useRef } from 'react';
import styles from './App.css';

const numRows = 20;
const numCols = 20;

function gridInit(numRows,numCols){
  const Rows = [];
  for(let i = 0; i<numRows;i++){
    Rows.push(Array.from(Array(numCols),()=>0));
  }
  return Rows;
}

//returns number of living neighbours to given cell
function liveNeighbours(g,i,j){
  let x= 0;
  g[i-1][j-1] ? x+=1 : x=x;
  g[i-1][j] ? x+=1 : x=x;
  g[i-1][j+1] ? x+=1: x=x;
  g[i][j+1] ? x+=1 : x=x;
  g[i+1][j] ? x+=1 : x=x;
  g[i+1][j+1] ? x+=1 : x=x;
  g[i+1][j-1] ? x+=1 : x=x;
  g[i][j-1] ? x+=1 : x=x;
  return x;
}

function App() {
  //grid state
  const [grid, setGrid] = useState(()=>{
    return gridInit(numRows,numCols);
  });

  //simulation state
  const [running,setRunning] =useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;
 
  //simulation recursive function
  const runSimulation = useCallback(()=>{
    //kill condition
    if(!runningRef.current){
      return ;
    }
    setGrid((g)=>{
      let gridCopy = gridInit(numRows,numCols);
      Object.assign(gridCopy, g);

      for(let i = 1; i<= numRows-2 ; i++){
        for(let j = 1; j<=numCols-2 ; j++){
          //cell life logic
          if(grid[i][j]){
            if(liveNeighbours(grid,i,j) <2 || liveNeighbours(grid,i,j) >3){
              gridCopy[i][j] = 0;
            }
          }
          else{
            if(liveNeighbours(grid,i,j) ===3){
              gridCopy[i][j] = 1;
            }
          }
          
        }
      }
      g = gridCopy;
      return g;
    })

    setTimeout(runSimulation,750);
  },[]);

  return (
    <>
    <button onClick={()=>{
      running? runSimulation() : setRunning(!running);
    }}>{running ? "stop": "start"}</button>

     <button onClick={()=>{

    }}>Randomise</button>

    <button onClick={()=>{
      let gridCopy = gridInit(numRows,numCols);
      setGrid(gridCopy);
    }}>Clear</button>

    <div className="grid-wrap">
      {grid.map((Rows,i)=>
        Rows.map((Cols,j)=>
          <div 
          Key={`${i}-${j}`} 
          className='Cell' 
          style={{backgroundColor: grid[i][j]? "blue" : undefined}}
          onMouseDown={()=>{
            //copy the grid because it's immutable 
            let gridCopy = gridInit(numRows,numCols);
            Object.assign(gridCopy, grid);

            grid[i][j] ? gridCopy[i][j] = 0 : gridCopy[i][j] = 1;
            //if you enable this dont click the edge of the grid
            // console.log(`cell ${i}|${j} clicked has ${liveNeighbours(grid,i,j)} live neighbours`)
            setGrid(gridCopy);

          }}
          />
        )
      )}
    </div>
    </>
  );
}

export default App;
