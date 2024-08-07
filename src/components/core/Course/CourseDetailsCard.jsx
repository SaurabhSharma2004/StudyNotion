import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {ACCOUNT_TYPE} from "../../../utils/constants"
import toast from "react-hot-toast";
import { addToCart } from "../../../slices/cartSlice";
import copy from "copy-to-clipboard";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)  {
        toast.error("Instructor can not buy course")
        return
    }
    if(!token) {
        setConfirmationModal({
          text1: "You are not logged In",
          text2: "Please login to add this course",
          btn1Text: "Login",
          btn2Text: "Cancel",
          btn1Handler: () => navigate("/login"),
          btn2Handler: () => setConfirmationModal(null),
        });
    }
    dispatch(addToCart(course))
  }

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link Copied to Clipboard")
  }

  return (
    <div>
      <img src={course?.thumbnail} alt="course Thumbnail" className="" />
      <div>
        <p>{course?.price}</p>
      </div>

      <div>
        <button
          onClick={
            user && course?.studentsEnrolled.includes(user._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
        >
          {user && course?.studentsEnrolled.includes(user._id)
            ? "Go To Course"
            : "Buy Course"}
        </button>

        {!course?.studentsEnrolled.includes(user._id) && (
          <button onClick={handleAddToCart}>Add To cart</button>
        )}
      </div>

      <div>
        <p>30-day Money Back Gurantee</p>
        <p>This Course Includes:</p>
        <div>
          {
            course?.instructions.map((item,index) => (
              <p key={index}>{item}</p>
            ))
          }
        </div>
      </div>

      <div>
        <button onClick={handleShare}>
          Share
        </button>
      </div>

    </div>
  );
};

export default CourseDetailsCard;
