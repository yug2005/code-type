import React, { useState, useContext } from "react";
import { UserContext } from "../../context/user-context";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignIn from "./google";
import { CgClose } from "react-icons/cg";
import "../../css/signin/sign-in.css";

const SignIn = () => {
  const navigate = useNavigate();
  onkeydown = (e: any) => {
    if (e.keyCode === 27) {
      navigate("/");
      return false;
    }
  };

  const [settings, setSettings] = useContext(UserContext);

  const createAccount = async (user: any) => {
    await fetch("http://localhost:5001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  const deleteAccount = async (id: number) => {
    await fetch(`http://localhost:5001/users/${id}`, {
      method: "DELETE",
    });
    const res = await fetch(`http://localhost:5001/users/0`);
    const user = await res.json();
    setSettings(user.settings);
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch(
      `http://localhost:5001/users?email=${email}'&password=${password}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error("Login Failed");
    }
    const user = await res.json();
    setSettings(user.settings);
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
          <input type="text" className="form-input" placeholder="name"></input>
          <label>email</label>
          <input
            type="email"
            className="form-input"
            placeholder="email"
          ></input>
          <label>password</label>
          <input
            type="password"
            className="form-input"
            placeholder="password"
          ></input>
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
          <input
            type="email"
            className="form-input"
            placeholder="email"
          ></input>
          <label>password</label>
          <input
            type="password"
            className="form-input"
            placeholder="password"
          ></input>
          <input value="sign in" type="submit" className="form-submit"></input>
          <h3 className="register-or">or</h3>
          <GoogleSignIn />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
