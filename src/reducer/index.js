import { combineReducers } from "@reduxjs/toolkit";



import authSlice from "../slices/authSlice";
import profileSlice from "../slices/profileSlice";
import cartSlice from "../slices/cartSlice";
import courseSlice from '../slices/courseSlice';
import viewCourseSlice from "../slices/viewCourseSlice"

const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    cart: cartSlice,
    course: courseSlice,
    viewCourse:viewCourseSlice
})

export default rootReducer