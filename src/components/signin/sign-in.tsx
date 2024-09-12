import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignIn from "./google";
import { CgClose } from "react-icons/cg";
import "../../css/signin/sign-in.css";

const SignIn = () => {
  const navigate = useNavigate();
  onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      navigate("/");
      return false;
    }
  };

  return (
    <div className="sign-in-container">
      <Link className="close-sign-in" to="/">
        <CgClose />
      </Link>
      <div className="register-container">
        <div className="sign-in-title">register</div>
        <form
          className="register-form"
          onSubmit={() => console.log("Creating Account")}
        >
          <label>name</label>
          <input type="text" className="form-input"></input>
          <label>email</label>
          <input type="email" className="form-input"></input>
          <label>password</label>
          <input type="password" className="form-input"></input>
          <input value="register" type="submit" className="form-submit"></input>
        </form>
      </div>
      <div className="log-in-container">
        <div className="sign-in-title">sign in</div>
        <form
          className="register-form"
          onSubmit={() => console.log("Signing In")}
        >
          <label>email</label>
          <input type="email" className="form-input"></input>
          <label>password</label>
          <input type="password" className="form-input"></input>
          <input value="sign in" type="submit" className="form-submit"></input>
          <h3 className="register-or">or</h3>
          <GoogleSignIn />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
