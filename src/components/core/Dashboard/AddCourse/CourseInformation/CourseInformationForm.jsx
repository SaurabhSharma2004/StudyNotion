import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementsField";
import BtnIcon from "../../../../common/BtnIcon";
import { MdNavigateNext } from "react-icons/md";
import Upload from "../Upload";
import { setStep, setCourse } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import {COURSE_STATUS} from "../../../../../utils/constants"

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  const dispatch = useDispatch();

  const { course, editCourse } = useSelector((state) => state.course);

  const [courseCategories, setCourseCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const {token} = useSelector((state) => state.auth)

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      setCourseCategories(categories);
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course?.courseName ||
      currentValues.courseShortDesc !== course?.courseDescription ||
      currentValues.coursePrice !== course?.price ||
      currentValues.courseTags.toString() !== course?.tag.toString() ||
      currentValues.courseBenefits !== course?.whatYouWillLearn ||
      currentValues.courseCategory._id !== course?.category._id ||
      currentValues.courseRequirements.toString() !==
        course?.instructions.toString() ||
      currentValues.courseImage !== course?.thumbnail
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course?.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course?.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course?.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course?.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course?.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course?.category._id) {
          formData.append("category", data.courseCategory);
        }

        if (
          currentValues.courseRequirements.toString() !==
          course?.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course?.thumbnail) {
          formData.append("thumbnail", data.courseImage);
        }

        setLoading(true);
        const res = await editCourseDetails(formData, token);
        setLoading(false);
        if (res) {
          dispatch(setCourse(res));
          dispatch(setStep(2));
        }
      } else {
        toast.error("No changes made");
        
      }
      return
    }

    const currentValues = getValues();
    const formData = new FormData();
    formData.append("courseName", currentValues.courseTitle);
    formData.append("courseDescription", currentValues.courseShortDesc);
    formData.append("price", currentValues.coursePrice);
    formData.append("tag", JSON.stringify(currentValues.courseTags));
    formData.append("whatYouWillLearn", currentValues.courseBenefits);
    formData.append("category", currentValues.courseCategory);
    formData.append("thumbnail", currentValues.courseImage);
    formData.append(
      "instructions",
      JSON.stringify(currentValues.courseRequirements)
    );
    formData.append("status", COURSE_STATUS.DRAFT)

    console.log("priniting form data ", formData.values());
    setLoading(true)
    const res = await addCourseDetails(formData,token)
    setLoading(false)
    if(res)
      {
        dispatch(setCourse(res))
        dispatch(setStep(2))
      }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-richblack-700 border-[1px] p-6 bg-richblack-800"
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor="courseTitle" className="text-sm text-richblack-5">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          type="text"
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="coursePrice" className="text-sm text-richblack-5">
          Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course price is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="courseCategory" className="text-sm text-richblack-5">
          Category <sup className="text-pink-200">*</sup>
        </label>

        <select
          id="courseCategory"
          defaultValue={""}
          {...register("courseCategory", { required: true })}
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, index) => (
              <option value={category._id} key={index}>
                {category?.name}
              </option>
            ))}
        </select>

        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course category is required
          </span>
        )}
      </div>

      <ChipInput
        label={"Tags"}
        name={"courseTags"}
        placeholder={"Choose a Tag"}
        register={register}
        setValue={setValue}
        errors={errors}
      />

      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      <div className="flex flex-col space-y-2">
        <label htmlFor="courseBenefits" className="text-sm text-richblack-5">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style w-full resize-x-none min-h-[130px]"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Benefits is required
          </span>
        )}
      </div>

      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Without Saving
          </button>
        )}

        <BtnIcon
          type={'submit'}
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </BtnIcon>
      </div>
    </form>
  );
};

export default CourseInformationForm;
