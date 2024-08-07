import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData:null,
    loading:false,
    token:localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
}

export const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setToken(state, action) {
            state.token = action.payload
        },
        setSignupData(state, action) {
            state.signupData = action.payload
        },
        setLoading(state, action) {
            state.loading = action.payload
        }
    }
})

export const {setToken, setSignupData, setLoading} = authSlice.actions

export default authSlice.reducer
