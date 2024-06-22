import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import rough from 'roughjs';
import boardContext from '../../store/board-context';
import { TOOL_ACTION_TYPES } from '../../constants';
import toolboxcontext from '../../store/Toolbox-context';

function Board() {
  const canvasRef = useRef();
  const { elements, boardMouseDownHandler, boardMouseMoveHandler, toolActionType, boardMouseUpHandler } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxcontext);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach(element => {
      roughCanvas.draw(element.roughElement);
    });
  }, [elements]);

  function handleMouseDown(event) {
    boardMouseDownHandler(event, toolboxState);
  }

  function handleMouseMove(event) {
    if (toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      boardMouseMoveHandler(event);
    }
  }
  function handleMouseUp() {
    boardMouseUpHandler();
  }
  return (
    <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} />
  );
}

export default Board;
