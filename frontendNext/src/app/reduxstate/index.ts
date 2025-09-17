import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isDataView } from "util/types";

export interface initialStateTypes {
    isSiderbarCollapsed : boolean;
    isDarkMode : boolean;
}

const initialState : initialStateTypes = {
    isSiderbarCollapsed : false,
    isDarkMode : false,
};

export const globalState = createSlice({
    name : "global",
    initialState,
    reducers : {
        setIsSiderbarCollapsed : (state, action : PayloadAction<boolean>) => {
            state.isSiderbarCollapsed = action.payload;
        },
        setIsDarkMode : (state, action : PayloadAction <boolean>) => {
            state.isDarkMode = action.payload;
        }
    },
})

export const { setIsSiderbarCollapsed, setIsDarkMode} = globalState.actions;

export default globalState.reducer;
