import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/authAPI";
import OtpInput from "react-otp-input";
import { signUp } from "../services/operations/authAPI";
import { IoArrowBack } from "react-icons/io5";
import { ImSpinner11 } from "react-icons/im";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, signupData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      password,
      confirmPassword,
      email,
    } = signupData;
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="text-white">
      <div>
        <h2>Verify email</h2>
        <p>A verification code has been sent to you.Enter the code below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
        />
        <button type="submit">
          <p>Verify and Register</p>
        </button>
      </form>

      <div>
        <Link to={"/login"}>
          <IoArrowBack />
          <div>Back to login</div>
        </Link>

        <button onClick={() => dispatch(sendOtp(signupData.email, navigate))}>
          <ImSpinner11 />
          <div>Resend it</div>
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
