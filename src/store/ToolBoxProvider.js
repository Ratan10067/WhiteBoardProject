import React, { useReducer } from 'react'
import toolboxcontext from './Toolbox-context'
import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from '../constants';
function tooBoxReducer(state, action) {
    switch (action.type) {
        case TOOLBOX_ACTIONS.CHANGE_STROKE: {
            const newState = { ...state };
            newState[action.payload.tool].stroke = action.payload.stroke;
            return newState;
        }
        case TOOLBOX_ACTIONS.CHANGE_FILL: {
            const newState = { ...state };
            newState[action.payload.tool].fill = action.payload.fill;
            return newState;
        }
        case TOOLBOX_ACTIONS.CHANGE_SIZE: {
            const newState = { ...state };
            newState[action.payload.tool].size = action.payload.size;
            return newState;
        }
        default:
            return state;
    }
}
const initialToolBoxState = {
    [TOOL_ITEMS.LINE]: {
        stroke: COLORS.BLACK,
        size: 1,
    },
    [TOOL_ITEMS.RECTANGLE]: {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
    },
    [TOOL_ITEMS.CIRCLE]: {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
    },
    [TOOL_ITEMS.Arrow]: {
        stroke: COLORS.BLACK,
        size: 1,
    }
}
const ToolBoxProvider = ({ children }) => {
    const [toolboxState, dispatchToolBoxAction] = useReducer(tooBoxReducer, initialToolBoxState);
    const changeStrokeHandler = (tool, stroke) => {
        dispatchToolBoxAction({
            type: TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload: {
                tool,
                stroke,
            }
        })
    }
    const changeFillHandler = (tool, fill) => {
        dispatchToolBoxAction({
            type: TOOLBOX_ACTIONS.CHANGE_FILL,
            payload: {
                tool,
                fill,
            },
        });
    };
    const changeSizeHandler = (tool,size) => {
        dispatchToolBoxAction({
            type: TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload: {
                tool, size,
            },
        });
    };
    const toolBoxContextValue = {
        toolboxState,
        changeStroke: changeStrokeHandler,
        changeFill: changeFillHandler,
        changeSize: changeSizeHandler,
    };

    return (
        <toolboxcontext.Provider value={toolBoxContextValue}>
            {children}
        </toolboxcontext.Provider>
    )
}

export default ToolBoxProvider
