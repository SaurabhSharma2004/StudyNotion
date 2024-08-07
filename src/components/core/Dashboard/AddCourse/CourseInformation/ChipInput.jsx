import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useSelector } from 'react-redux'


const ChipInput = ({label,name,placeholder,register,errors,setValue}) => {

    const {editCourse, course} = useSelector((state) => state.course)
    const [chips, setChips] = useState([])
    const handleDeleteChip = (index) => {
        const newChips = chips.filter((_,i) => i !== index)
        setChips(newChips)
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ','){
            e.preventDefault()
            const chip = e.target.value.trim()
            if(chip && !chips.includes(chip)) {
                setChips([...chips, chip])
                e.target.value = ''
            }
        }
    }

    useEffect(() => {
        setValue(name,chips)
    },[chips])

    useEffect(() => {
        if(editCourse) {
            setChips(course?.tag);
        }
        register(name, {required: true, validate:(value) => value.length > 0})
    },[])

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label}
        <sup>*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          id={name}
          placeholder={placeholder}
          name={name}
          type="text"
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}

export default ChipInput