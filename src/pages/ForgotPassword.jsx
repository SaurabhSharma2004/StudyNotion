import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {!emailSent ? (
            <div>
              <h1>Reset your password</h1>
              <p>
                Have no fear. We’ll email you instructions to reset your
                password. If you dont have access to your email we can try
                account recovery
              </p>
            </div>
          ) : (
            <div>
              <h1>Check email</h1>
              <p>We have sent the reset email to {email}</p>
            </div>
          )}
          {!emailSent ? (
            <form onSubmit={handleOnSubmit}>
              <label>
                <p>
                  Email Address <sup>*</sup>
                </p>
                <input
                  required={true}
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button type="submit">Reset password</button>
            </form>
          ) : (
            <button onClick={() => dispatch(getPasswordResetToken(email, setEmailSent))}>Resend email</button>
          )}
          <div>
            <Link to="/login">
              <p>Back to Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
