import React from 'react'
import { useForm } from 'react-hook-form'
import BtnIcon from '../../../../common/BtnIcon'
import { IoAddCircleOutline } from 'react-icons/io5'
import { useState } from 'react'
import { MdNavigateNext } from 'react-icons/md'
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView'

const CourseBuilderForm = () => {
    const {handleSubmit, register, formState:{errors}, setValue} = useForm()
    const [editSectionName, setEditSectionName] = useState(null)
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const goBack = () => {
        dispatch(setStep(1))
        dispatch(setEditCourse(true))

    }

    const goToNext = () => {
        if(course?.courseContent?.length === 0) {
            toast.error("Please add a section to build your course")
            return
        }
        if(course?.courseContent.some((section) => section?.subSection.length === 0)) {
            toast.error("Please add a subsection to build your course")
            return
        }
        dispatch(setStep(3))
    }


    const cancelEdit = () => {
        setEditSectionName(null)
        setValue("sectionName", "");
    }

    const onSubmit = async (data) => {
        setLoading(true);
        let res;

        if (editSectionName) {
            res = await updateSection(
                {
                    sectionName:data.sectionName,
                    sectionId: editSectionName,
                    courseId:course._id
                },
                token
            )
        }
        else {
            res = await createSection(
                {
                    sectionName:data.sectionName,
                    courseId:course._id
                },
                token
            )
        }
        if (res) {
            dispatch(setCourse(res))
            setEditSectionName(null)
            setValue("sectionName", "")
        }
        setLoading(false);
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if(editSectionName === sectionId) {
            cancelEdit()
            return
        }
        setEditSectionName(sectionId)
        setValue("sectionName", sectionName);
    }

    
  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="sectionName" className="text-sm text-richblack-5">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            disabled={loading}
            type="text"
            id="sectionName"
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <BtnIcon
            text={editSectionName ? "Edit section name" : "Create section"}
            type={"submit"}
            outline={true}
            disabled={loading}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </BtnIcon>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course?.courseContent?.length > 0 && <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />}

      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <BtnIcon disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </BtnIcon>
      </div>
    </div>
  );
}

export default CourseBuilderForm