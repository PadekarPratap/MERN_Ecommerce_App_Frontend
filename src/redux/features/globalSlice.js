import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    searchKeyword: '',
    filter: '',
    pageNumber: 1
}


export const globals = createSlice({
    name: "globals",
    initialState,
    reducers:{
        search:(state, action) =>{
            state.searchKeyword = action.payload
        },
        next_page: (state) =>{
            state.pageNumber += 1
        },
        prev_page:(state) =>{
            state.pageNumber -= 1
        },
        reset_page:(state) =>{
            state.pageNumber = 1
        },
        filter_page: (state, action) => {
            state.filter = action.payload
        }
    }
})


export const { search, next_page, prev_page, reset_page, filter_page } = globals.actions
export default globals.reducer