import React, { useState } from 'react'
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import BtnIcon from "../../../common/BtnIcon";
import {changePassword} from "../../../../services/operations/SettingsAPI";

const EditPassword = () => {
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const {register,
        handleSubmit,
        formState:{errors}
    } = useForm()

    const submitPasswordForm = async (data) => {
        try {
            await changePassword(token,data)
        } catch (error) {
            console.log("Error in updating password", error)
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit(submitPasswordForm)}>
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label className="lable-style" htmlFor={'oldPassword'}>Current Password</label>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                id={'oldPassword'}
                                name={'oldPassword'}
                                placeholder={'Current Password'}
                                className="form-style"
                                {...register("oldPassword", {required:true})}
                            />
                            <span className="absolute right-3 top-[38px] z-[10] cursor-pointer" onClick={() => setShowOldPassword(!showOldPassword)}>
                                {
                                    !showOldPassword ? (<AiOutlineEyeInvisible fontSize={24} fill={"#AFB2BF"} />) : (<AiOutlineEye fontSize={24} fill={"#AFB2BF"} />)
                                }
                            </span>
                            {
                                errors.oldPassword && <span  className="-mt-1 text-[12px] text-yellow-100">{errors.oldPassword.message}</span>
                            }
                        </div>

                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor={'newPassword'} className='lable-style'>New Password</label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id={'newPassword'}
                                name={'newPassword'}
                                placeholder={'New Password'}
                                className='form-style'
                                {...register("newPassword", {required:true})}
                            />
                            <span className="absolute right-3 top-[38px] z-[10] cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {
                                    !showNewPassword ? (<AiOutlineEyeInvisible fontSize={24} fill={"#AFB2BF"} />) : (<AiOutlineEye fontSize={24} fill={"#AFB2BF"} />)
                                }
                            </span>
                            {
                                errors.newPassword && <span  className="-mt-1 text-[12px] text-yellow-100">{errors.oldPassword.message}</span>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50" onClick={() => navigate('/dashboard/my-profile')}>
                        Cancel
                    </button>
                    <BtnIcon type={'submit'} text={'Update'}/>
                </div>
            </form>
        </>
    )
}

export default EditPassword