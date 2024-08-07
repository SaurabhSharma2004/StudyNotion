import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {fetchInstructorCourses} from "../../../services/operations/courseDetailsAPI"
import BtnIcon from "../../common/BtnIcon"
import { PiPlusCircle } from 'react-icons/pi'
import CourseTable from './InstructorCourses/CourseTable'

const MyCourses = () => {
    const [courses, setCourses] = useState([])
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await fetchInstructorCourses(token)
            if(res)setCourses(res)
        }
        fetchCourses()
    },[])

  return (
    <div className='text-white flex flex-col w-11/12 '>
        <div className='flex justify-between'>
            <h1>My Courses</h1>
            <BtnIcon text={'Add Courses'} onclick={() => navigate('/dashboard/add-course')}>
                <PiPlusCircle />
            </BtnIcon>
        </div>
        {courses && <CourseTable courses={courses} setCourses={setCourses} /> }
    </div>
  )
}

export default MyCourses