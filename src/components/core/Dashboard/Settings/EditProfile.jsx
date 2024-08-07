import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";
import BtnIcon from "../../../common/BtnIcon";
import {updateProfile} from "../../../../services/operations/SettingsAPI";


const EditProfile = () => {
    const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {register,handleSubmit, formState:{errors}} = useForm()

    const submitProfileForm = async (data) => {
        try {
            dispatch(updateProfile(token,data))
        } catch (error) {
            console.log("Error in update Profile", error)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(submitProfileForm)}>
                <div
                    className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

                    <div className="flex flex-col gap-5 lg:flex-row">

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label className='lable-style' htmlFor={'firstName'}>First Name</label>
                            <input
                                id='firstName'
                                type='text'
                                placeholder='First Name'
                                name={'firstName'}
                                className={'form-style'}
                                {...register('firstName', {required: true})}
                                defaultValue={user?.firstName}
                            />
                            {errors.firstName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                  Please enter your first name.
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label className='lable-style' htmlFor={'lastName'}>Last Name</label>
                            <input
                                id='lastName'
                                type='text'
                                placeholder='First Name'
                                name={'lastName'}
                                className={'form-style'}
                                {...register('lastName', {required: true})}
                                defaultValue={user?.lastName}
                            />
                            {errors.lastName && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                  Please enter your last name.
                                </span>
                            )}
                        </div>


                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label className='lable-style' htmlFor={'dateOfBirth'}>Date of Birth</label>
                            <input
                                id='dateOfBirth'
                                type='date'
                                placeholder='Date of Birth'
                                name={'dateOfBirth'}
                                className={'form-style'}
                                {...register("dateOfBirth", {
                                    required: {
                                        value: true,
                                        message: "Please enter your Date of Birth.",
                                    },
                                    max: {
                                        value: new Date().toISOString().split("T")[0],
                                        message: "Date of Birth cannot be in the future.",
                                    },
                                })}
                                defaultValue={user?.additionalDetails?.dateOfBirth}
                            />
                            {errors.dateOfBirth && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                  {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label className={'lable-style'} htmlFor={'gender'}>Gender</label>
                            <select
                                id={'gender'}
                                name={'gender'}
                                className={'form-style'}
                                {...register('gender', {required: true})}
                                defaultValue={user?.additionalDetails?.gender}
                            >
                                {genders.map((gender, index) => (
                                    <option key={index} value={gender}>
                                        {gender}
                                    </option>
                                ))}
                                >

                            </select>
                            {errors.gender && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                  Please enter your gender.
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label className={'lable-style'} htmlFor={'contactNumber'}>Contact Number</label>
                            <input
                                id={'contactNumber'}
                                type={'tel'}
                                name={'contactNumber'}
                                className={'form-style'}
                                {...register('contactNumber', {
                                    required: {
                                        value: true,
                                        message: "Please enter your contact number.",
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Contact number cannot be more than 10 digits.",
                                    },
                                })}
                                defaultValue={user?.additionalDetails?.contactNumber}
                            />
                            {errors.contactNumber && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                  {errors.contactNumber.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label className={'lable-style'} htmlFor={'about'}>About</label>
                            <input
                                id={'about'}
                                type={'text'}
                                name={'about'}
                                placeholder={'Enter Bio Details'}
                                className={'form-style'}
                                {...register('about', {required: true})}
                                defaultValue={user?.additionalDetails?.about}
                            />
                            {errors.about && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                  Please enter your About.
                                </span>
                            )}
                        </div>
                    </div>

                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            navigate("/dashboard/my-profile")
                        }}
                        className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                    >
                        Cancel
                    </button>
                    <BtnIcon type="submit" text="Save"/>
                </div>
            </form>
        </>
    )
}

export default EditProfile