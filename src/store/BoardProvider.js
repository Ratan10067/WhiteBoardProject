import React, { useReducer } from 'react';
import boardcontext from './board-context';
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants';
import rough from 'roughjs/bin/rough';

const gen = rough.generator();

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: [],
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case 'change_tool':
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    case 'DRAW_DOWN':
      const { clientX, clientY } = action.payload;
      const newElement = {
        id: state.elements.length,
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
        roughElement: gen.line(clientX, clientY, clientX, clientY),
      };
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        elements: [...state.elements, newElement],
      };
    case 'DRAW_MOVE':
      const { clientX: x, clientY: y } = action.payload;
      const elements = [...state.elements];
      const index = elements.length - 1;
      elements[index] = {
        ...elements[index],
        x2: x,
        y2: y,
        roughElement: gen.line(elements[index].x1, elements[index].y1, x, y),
      };
      return {
        ...state,
        elements,
      };
    case 'DRAW_UP':
      {
        return {
          ...state,
          toolActionType: TOOL_ACTION_TYPES.NONE,
        }
      }
    default:
      return state;
  }
};

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: 'change_tool',
      payload: { tool },
    });
  };

  const boardMouseDownHandler = (event) => {
    const { clientX, clientY } = event;
    dispatchBoardAction({
      type: 'DRAW_DOWN',
      payload: { clientX, clientY },
    });
  };

  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    dispatchBoardAction({
      type: 'DRAW_MOVE',
      payload: { clientX, clientY },
    });
  };
  const boardMouseUpHandler = (event) => {
    dispatchBoardAction({
      type: 'DRAW_UP',
    });
  };
  const boardcontextValue = {
    activeToolItem: boardState.activeToolItem,
    changeToolHandler,
    toolActionType: boardState.toolActionType,
    elements: boardState.elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler
  };

  return (
    <boardcontext.Provider value={boardcontextValue}>
      {children}
    </boardcontext.Provider>
  );
};

export default BoardProvider;
