import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'
import { RxCross2 } from 'react-icons/rx'
import Upload from "../Upload"
import BtnIcon from '../../../../common/BtnIcon'

const SubSectionModal = ({modalData, setModalData, add=false,edit=false, view=false}) => {
  const {register,handleSubmit,setValue,formState:{errors},getValues} = useForm()

  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth)
  const [loading, setLoading ] = useState(false)
  const {course} = useSelector((state) => state.course)

  useEffect(() => {
    if(view || edit)
      {
        setValue("lectureTitle", modalData.title)
        setValue("lectureDesc", modalData.description)
        setValue("lectureVideo", modalData.videoUrl)
      }
  },[])

  const isFormUpdated = () => {
    const currentValues = getValues();

    if(modalData.title !== currentValues.lectureTitle || modalData.description !== currentValues.lectureDesc || modalData.videoUrl !== currentValues.lectureVideo)
      return true;
    else
      return false;
  }

  const onSubmit = async (data) => {
    if (view) {
      return
    }
    if (edit) {
      if (isFormUpdated()) {
        const formData = new FormData();
        const currentValues = getValues();
        formData.append("sectionId", modalData.sectionId)
        formData.append("subSectionId", modalData._id)
        
        if(currentValues.lectureTitle !== modalData.title)
          formData.append("title", currentValues.lectureTitle)
        if(currentValues.lectureDesc !== modalData.description)
          formData.append("description", currentValues.lectureDesc)
        if(currentValues.lectureVideo !== modalData.videoUrl)
          formData.append("video", currentValues.lectureVideo)

        setLoading(true)
        const res = await updateSubSection(formData,token);
        if (res) {
          const updatedSection = course?.courseContent?.map((section) => section._id === modalData.sectionId ? res : section)
          dispatch(setCourse({...course,courseContent:updatedSection}))
        }
        setModalData(null)
        setLoading(false)
      }
      else {
        toast.error("No changes made")
      }
      return;
    }

    const formData = new FormData();
    const currentValues = getValues();

    formData.append("sectionId", modalData)
    formData.append("title", currentValues.lectureTitle)
    formData.append("description", currentValues.lectureDesc)
    formData.append("video", currentValues.lectureVideo)

    setLoading(true)
    const res = await createSubSection(formData,token);
    if(res) {
      const updatedSection = course?.courseContent?.map((section) =>
        section._id === modalData ? res : section
      );
      dispatch(setCourse({ ...course, courseContent: updatedSection }));
    }
    setModalData(null);
    setLoading(false);

  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="mt-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view
              ? "Viewing Lecture"
              : edit
              ? "Editing Lecture"
              : "Adding Lecture"}
          </p>
          <button
            className="text-2xl text-richblack-5"
            onClick={() => (!loading ? setModalData(null) : {})}
          >
            <RxCross2 />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <Upload
            name={"lectureVideo"}
            label={"Lecture Video"}
            register={register}
            errors={errors}
            setValue={setValue}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          <div className="flex flex-col space-y-2">
            <label htmlFor="lectureTitle" className="text-sm text-richblack-5">
              Lecture Title {!view && <span className="text-pink-200">*</span>}
            </label>
            <input
              placeholder="Enter Lecture Title"
              id="lectureTitle"
              {...register("lectureTitle", { required: true })}
              disabled={view || loading}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                This field is required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="lectureDesc" className="text-sm text-richblack-5">
              Lecture Description{" "}
              {!view && <span className="text-pink-200">*</span>}
            </label>
            <textarea
              placeholder="Enter Lecture Description"
              id="lectureDesc"
              {...register("lectureDesc", { required: true })}
              disabled={view || loading}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                This field is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <BtnIcon
                text={loading ? "Loading..." : edit ? "Save changes" : "Save"}
                type={"submit"}
                disabled={loading}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SubSectionModal