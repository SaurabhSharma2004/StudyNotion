import React from 'react'
import { Routes, Route } from "react-router-dom"
import { Home } from './pages/Home'
import "./App.css"
import Navbar from './components/common/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import MyProfile from './components/core/Dashboard/MyProfile'
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Settings from "./components/core/Dashboard/Settings";
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from './utils/constants'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import AddCourse from "./components/core/Dashboard/AddCourse"
import MyCourses from './components/core/Dashboard/MyCourses'
import Catalog from './pages/Catalog'
import CourseDetails from "./pages/CourseDetails"
import Cart from './components/core/Dashboard/Cart'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";


function App() {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/update-password/:id' element={<UpdatePassword />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/catalog/:catalogName' element={<Catalog />} />
        <Route path='/courses/:courseId' element={<CourseDetails />} />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path='dashboard/my-profile' element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                {/* <Route path="dashboard/cart" element={<Cart />} /> */}
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
                <Route path='/dashboard/cart' element={<Cart />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='/dashboard/add-course' element={<AddCourse />} />
                <Route path='/dashboard/my-courses' element={<MyCourses />} />
                <Route path='/dashboard/instructor' element={<Instructor />} />
                {/*<Route path='/dashboard/edit-course/:courseId' element={<EditCourse />} />*/}
              </>
            )
          }
        </Route>

        <Route 
          element={<PrivateRoute>
            <ViewCourse />
          </PrivateRoute>}
        >
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route 
                  path='view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
                  element={<VideoDetails/>}
                />
              </>
            )
          }
        </Route>

      </Routes>
    </div>
  )
}

export default App