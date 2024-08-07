import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import BtnIcon from "../../common/BtnIcon"
import { createRating } from '../../../services/operations/courseDetailsAPI'

const CourseReviewModal = ({setReviewModal}) => {
    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const {courseEntireData} = useSelector((state) => state.viewCourse)

    const {register, handleSubmit, setValue, formState:{errors}} = useForm()

    const onSubmit = async (data) => {
        await createRating(
            {
                courseId:courseEntireData?._id,
                review:data.courseExperience,
                rating:data.courseRating
            },
            token
        )
        setReviewModal(false)
    }

    useEffect(() => {
        setValue('courseExperience', "")
        setValue('courseRating', 0)
    }, [])

  return (
    <div>
      <div>
        <div>
          <p>Add Review</p>
          <button onClick={() => setReviewModal(false)}>Cancel</button>
        </div>

        <div>
          <div>
            <img
              src={user?.image}
              alt="userImage"
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p>{user?.firstName}</p>
              <p>{user?.lastName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ReactStars
              count={5}
              onChange={(newRating) => setValue('courseRating', newRating)}
              size={24}
              activeColor="#ffd700"
            />

            <div>
                <label htmlFor="courseExperience">
                    Add your course experience*
                </label>
                <textarea
                    id='courseExperience'
                    placeholder='Add your course experience'
                    {...register('courseExperience', {required: true})}
                    className='form-style w-full min-h-[130px]'
                />
                {
                    errors.courseExperience && (
                        <p className='text-red-500'>This field is required</p>
                    )
                }
            </div>

            <div>
                <button 
                    onClick={() => setReviewModal(false)}
                >
                    Cancel
                </button>
                <BtnIcon text='Save' />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseReviewModal