import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BtnIcon from "../../common/BtnIcon"
import { AiOutlineDown } from 'react-icons/ai'


const VideoDetailsSidebar = ({setReviewModal}) => {
    const {sectionId, subSectionId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {courseSectionData, courseEntireData, totalNoOfLectures, completedLectures} = useSelector((state) => state.viewCourse)

    const [activeStatus, setActiveStatus] = useState("")
    const [videoBarActive, setVideoBarActive] = useState("")

    useEffect(() => {
        ;(() => {
            if(!courseSectionData.length)return
            const currentSectionIndex = courseSectionData.findIndex((item) => item._id === sectionId)
            const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex((item) => item._id === subSectionId)
            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex]?._id
            setActiveStatus(courseSectionData[currentSectionIndex]?._id)
            setVideoBarActive(activeSubSectionId)
        })()
    },[courseSectionData, courseEntireData, location.pathname])

  return (
    <>
        <div className='text-white'>
            <div>
                <div>
                    <div onClick={() => navigate('/dashboard/enrolled-courses')}>
                        Back
                    </div>
                    <div>
                        <BtnIcon 
                            text="Add Review"
                            onclick={() => setReviewModal(true)}
                        />
                    </div>
                </div>

                <div>
                    <p>{courseEntireData?.courseName}</p>
                    <p>{completedLectures.length}/{totalNoOfLectures}</p>
                </div>
            </div>

            {/* section && subsections */}

            <div>
                {
                    courseSectionData?.map((section,index) => (
                        <div onClick={() => setActiveStatus(section?._id)} key={index}>

                            {/* section */}

                            <div>
                                <div>{section?.sectionName}</div>
                                <AiOutlineDown className={activeStatus ? "rotate-180" : "rotate-0"} />
                            </div>

                            {/* subsections */}

                            <div>
                                {
                                    activeStatus === section?._id && (
                                        <div>
                                            {
                                                section?.subSection?.map((subSection, i) => (
                                                    <div 
                                                        className={`flex p-5 gap-5 ${videoBarActive === subSection?._id ? "bg-yellow-200 text-richblack-900" : "bg-richblack-900 text-white"}`} 
                                                        key={i}
                                                        onClick={() => {
                                                            setVideoBarActive(
                                                              subSection?._id
                                                            );
                                                            navigate(
                                                              `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subSection?._id}`
                                                            );
                                                        }}
                                                    >
                                                        <input 
                                                            type='checkbox'
                                                            checked={completedLectures.includes(subSection?._id) }
                                                            onChange={() => {}}
                                                        />
                                                        <span>{subSection?.title}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    ))
                }
            </div>

        </div>
    </>
  )
}

export default VideoDetailsSidebar