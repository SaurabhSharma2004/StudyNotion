import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture';
import EditPassword from "./EditPassword";
import EditProfile from "./EditProfile";
import DeleteAccount from "./DeleteAccount";


const index = () => {
  return (
      <>
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
              Edit Profile
          </h1>

          <ChangeProfilePicture/>

          <EditProfile />

          <EditPassword />

          <DeleteAccount />
      </>
  );
}

export default index