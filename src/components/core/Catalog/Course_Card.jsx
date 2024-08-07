import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import GetAvgRating from '../../../utils/avgRating'
import RatingStars from "../../common/RatingStars"

const Course_Card = ({course, Height}) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  
  useEffect(() => {
    const rating = GetAvgRating(course?.ratingAndReviews)
    setAvgReviewCount(rating)
  }, [course])

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              className={`${Height} w-full rounded-xl object-cover `}
              alt="course"
            />
          </div>

          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Course_Card