import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { AiFillPlayCircle } from "react-icons/ai";
import BtnIcon from "../../common/BtnIcon";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);

  const currentSectionIndex = courseSectionData?.findIndex(
    (section) => section._id === sectionId
  );

  const currentSubSectionIndex = courseSectionData?.[
    currentSectionIndex
  ]?.subSection?.findIndex((subSection) => subSection._id === subSectionId);

  const totatNoOfSection = courseSectionData?.length;
  const totatNoOfSubSection =
    courseSectionData?.[currentSectionIndex]?.subSection?.length;

  useEffect(() => {
    const videoSpecificDetails = async () => {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses");
        return;
      }
      setVideoData(
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex
        ]
      );
      setVideoEnded(false);
    };
    videoSpecificDetails();
  }, [courseEntireData, courseSectionData, location.pathname]);

  const isFirstVideo = () => {
    return currentSectionIndex === 0 && currentSubSectionIndex === 0;
  };

  const isLastVideo = () => {
    return (
      currentSectionIndex === totatNoOfSection - 1 &&
      currentSubSectionIndex === totatNoOfSubSection - 1
    );
  };

  const goToNextVideo = () => {
    if (currentSubSectionIndex !== totatNoOfSubSection - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex + 1
        ]?._id;
      navigate(
        `view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1]?.subSection[0]?._id;
      navigate(
        `view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const goToPrevVideo = () => {
    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex - 1
        ]?._id;
      navigate(
        `view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]?._id;
      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1]?.subSection[
          courseSectionData[currentSectionIndex - 1]?.subSection.length - 1
        ]?._id;
      navigate(
        `view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true)

    const res = await markLectureAsComplete(
      {
        courseId:courseId,
        subSectionId:subSectionId
      },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div>
      {!videoData ? (
        <div>No Data found</div>
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          src={videoData?.videoUrl}
          onEnded={() => setVideoEnded(true)}
        >
          <AiFillPlayCircle />

          {videoEnded && (
            <div>
              {!completedLectures.includes(subSectionId) && (
                <BtnIcon
                  text={loading ? "Loading..." : "Mark As Completed"}
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                />
              )}

              <BtnIcon
                text={loading ? "Loading..." : "Rewatch"}
                disabled={loading}
                onclick={() => {
                  playerRef.current.seek(0);
                  setVideoEnded(false);
                }}
              />

              <div>
                {!isFirstVideo() && (
                  <button
                    onClick={goToPrevVideo}
                    disabled={loading}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    onClick={goToNextVideo}
                    disabled={loading}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}
      <h1>{videoData?.title}</h1>
      <p>{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
