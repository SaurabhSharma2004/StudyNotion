import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import BtnIcon from '../../../../common/BtnIcon'
import {  resetCourseState, setStep } from '../../../../../slices/courseSlice'
import { COURSE_STATUS } from '../../../../../utils/constants'
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import { Navigate } from 'react-router-dom'

const PublishCourse = () => {
    const {register, handleSubmit, formState:{errors}, setValue, getValues} = useForm()

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)

    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue('public', true)
        }
    },[])


    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToCourse = () => {
        dispatch(resetCourseState())
        // Navigate('/dashboard/my-courses')
    }

    const onSubmit = async () => {
        if ((course?.status === COURSE_STATUS.PUBLISHED && getValues('public')) || 
        (course?.status === COURSE_STATUS.DRAFT && !getValues('public'))) {
            goToCourse()
            return;
        }

        const formData = new FormData();
        formData.append('courseId', course._id)
        formData.append('status', getValues('public') ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT)

        setLoading(true)

        const res = await editCourseDetails(formData, token)

        if(res) {
            goToCourse()
        }
        setLoading(false)
    }


  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">PublishCourse</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this Course public
            </span>
          </label>
        </div>

        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>

          <BtnIcon
            text={loading ? "Loading..." : "Save Changes"}
            disabled={loading}
            type={"submit"}
          />
        </div>
      </form>
    </div>
  );
}

export default PublishCourse