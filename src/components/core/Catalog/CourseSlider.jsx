import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper/modules";
import { Pagination } from "swiper/modules";
import Course_Card from "./Course_Card";


const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length ? (
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
          <SwiperSlide>
            {Courses?.map((course, index) => (
              <SwiperSlide key={index}>
                <Course_Card course={course} Height={"h-[250px]"} />
              </SwiperSlide>
            ))}
          </SwiperSlide>
          ...
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;


