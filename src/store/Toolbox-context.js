import { createContext } from "react";

const toolboxcontext = createContext({
    toolboxcontext: {},
    changeStroke: () => { },
    changeFill: () => { },
    changeSize: () => { },
})
export default toolboxcontext;