import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {FiUpload} from "react-icons/fi";
import BtnIcon from "../../../common/BtnIcon";
import {updateDisplayPicture} from "../../../../services/operations/SettingsAPI";

const ChangeProfilePicture = () => {
    const  {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [imageFile, setImageFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(null)
    const [loading, setLoading] = useState(false)

    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(file) {
            setImageFile(file)
            previewFile(file)
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    const handleClick = () => {
        fileInputRef.current.click()
    }

    const handleFileUpload = async () => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('displayPicture', imageFile)
            await  dispatch(updateDisplayPicture(token,formData))
            setLoading(false)
        } catch (error) {
            console.log("Error in uploading image", error)
        }
    }

    useEffect(() => {
        if(imageFile) {
            previewFile(imageFile)
        }
    }, [imageFile])

    return (
        <>
            <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
                <div className="flex items-center gap-x-4">
                    <img
                        src={previewSource || user?.image}
                        alt={`user-${user?.firstName}`}
                        className="aspect-square w-[78px] rounded-full object-cover"
                    />
                    <div className="space-y-2">
                        <p>Change Profile Picture</p>
                        <div className="flex flex-row gap-3">
                            <input
                                type={'file'}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/gif, image/jpeg"
                            />
                            <button
                                onClick={handleClick}
                                disabled={loading}
                                className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                            >
                                Select
                            </button>
                            <BtnIcon
                                text={loading ? "Uploading..." : "Upload"}
                                onclick={handleFileUpload}
                            >
                                {!loading && (
                                    <FiUpload className="text-lg text-richblack-900"/>
                                )}
                            </BtnIcon>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangeProfilePicture