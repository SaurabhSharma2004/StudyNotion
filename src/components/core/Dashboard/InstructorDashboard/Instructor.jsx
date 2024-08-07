import React, {useEffect, useState} from 'react'
import {fetchInstructorCourses} from "../../../../services/operations/courseDetailsAPI";
import {useSelector} from "react-redux";
import {fetchInstructorData} from "../../../../services/operations/profileAPI";
import {Link} from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState([])
    const [courses, setCourses] = useState([])

    useEffect(() => {

        const getDataWithStats = async () => {
            setLoading(true)
            const instructorApiData = await fetchInstructorData(token)
            const res = await fetchInstructorCourses(token)

            console.log("instructorApiData ", instructorApiData)

            if(res)setCourses(res)
            if(instructorApiData.length) {
                // console.log("hdjwbjd")
                setInstructorData(instructorApiData)
            }

            setLoading(false)
            console.log("instructorData ", instructorData)
            // console.log("courses ", courses)
        }
        getDataWithStats()
    }, []);

    const totalAmount = instructorData.reduce((acc,curr) => acc + curr.totalAmountGenerated,0)
    const totalStudents = instructorData.reduce((acc,curr) => acc + curr.totalStudentsEnrolled,0)

    return (
        <div className='text-white'>
            <div>
                <h1>Hi {user?.firstName}</h1>
                <p>Let's start something new</p>
            </div>

            {
                loading ? (<div className='spinner'>Loading...</div>) : courses.length > 0 ?
                    (
                        <div>
                            <div>
                                <div>
                                    <InstructorChart courses={instructorData} />
                                    <div>
                                        <p>Statics</p>
                                        <div>
                                            <p>Total courses</p>
                                            <p>{courses.length}</p>
                                        </div>

                                        <div>
                                            <p>Total students</p>
                                            <p>{totalStudents}</p>
                                        </div>

                                        <div>
                                            <p>Total income</p>
                                            <p>{totalAmount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <p>Your courses</p>
                                    <Link to={'/dashboard/my-courses'}>
                                        View All
                                    </Link>
                                </div>
                                <div>
                                    {
                                        courses.slice(0,3).map((course,index) => (
                                            <div>
                                                <img
                                                    src={course.thumbnail}
                                                    alt={'courseImage'}
                                                />
                                                <div>
                                                    <p>{course.courseName}</p>
                                                    <div>
                                                        <p>{course.studentsEnrolled.length}</p>
                                                        <p>|</p>
                                                        <p>Rs {course.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ) :
                    (<div>
                        <p>You have not created any courses yet</p>
                        <Link to={'/dashboard/add-course'}>
                            Create Course
                        </Link>
                    </div>)
            }
        </div>
    )
}

export default Instructor