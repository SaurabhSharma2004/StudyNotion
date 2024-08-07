import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";

const RequirementsField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  const handleAddRequirement = () => {
    if (
      requirement.trim() !== "" &&
      !requirementsList.includes(requirement.trim())
    ) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };

  useEffect(() => {
    setValue(name, requirementsList);
  }, [requirementsList]);

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions);
    }
    register(name,{required:true, validate:(value) => value.length > 0})
  },[]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-col items-start">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Enter requirements of course"
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((item, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{item}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() =>
                  setRequirementsList(
                    requirementsList.filter((_, i) => i !== index)
                  )
                }
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default RequirementsField;
