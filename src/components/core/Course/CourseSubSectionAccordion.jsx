import React from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { HiOutlineVideoCamera } from 'react-icons/hi'

const CourseSubSectionAccordion = ({subSec, key}) => {
  return (
    <div key={key}>
        <div className='flex justify-between py-2'>
            <div className='flex items-center gap-2'>
                <span><HiOutlineVideoCamera/></span>
                <p>{subSec?.title}</p>
                <span><AiOutlineDown /></span>
            </div>
            <div>
                <p>{subSec?.timeDuration}</p>
            </div>
        </div>
    </div>
  )
}

export default CourseSubSectionAccordion