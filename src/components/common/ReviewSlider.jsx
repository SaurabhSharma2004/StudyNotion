import React, { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector'
import { ratingsEndpoints } from '../../services/apis'
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper/modules";
import { Pagination } from "swiper/modules";
import ReactStars from 'react-stars';

const ReviewSlider = () => {
    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
      const fetchAllReviews = async () => {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        console.log("LOgging response in rating", data);

        if (data?.success) {
          setReviews(data?.data);
        }

        console.log("Printing Reviews", reviews);
      };
      fetchAllReviews();
    }, []);

  return (
    <div>
      <div>
        <Swiper
          spaceBetween={25}
          slidesPerView={1}
          modules={[FreeMode, Pagination]}
          className="max-h-[30rem]"
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div>
                <img
                  src={review?.user?.image}
                  alt="userImg"
                  className="h-9 w-9 object-cover rounded-full"
                />
                <div>
                  <p>
                    {review?.user?.firstName} {review?.user?.lastName}
                  </p>
                  <p>{review?.user?.email}</p>
                </div>
              </div>

              <div>{review?.course?.courseName}</div>
              <div>
                {review?.review.split(" ").slice(0, truncateWords).join(" ")}
              </div>
              <div>
                <p>{review?.rating}</p>
                <ReactStars
                  count={5}
                  value={review?.rating}
                  edit={false}
                  size={24}
                  color2={"#ffd700"}
                  isHalf={true}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider