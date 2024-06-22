import React, { useReducer } from 'react';
import boardcontext from './board-context';
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants';
import rough from 'roughjs/bin/rough';
import { createRoughElement } from '../Utils/element';

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
      const newElement = createRoughElement(
        state.elements.length,
        clientX, clientY, clientX, clientY, { type: state.activeToolItem }
      );
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        elements: [...state.elements, newElement],
      };
    case 'DRAW_MOVE':
      {
        const { clientX, clientY } = action.payload;
        const newElements = [...state.elements];
        const index = state.elements.length - 1;
        const { x1, y1 } = newElements[index];
        const newElement = createRoughElement(index, x1, y1, clientX, clientY, { type: state.activeToolItem, })
        newElements[index] = newElement;
        return {
          ...state,
          elements: newElements,
        };
      }
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
