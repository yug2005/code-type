import React from "react";
import { useGoogleLogin } from "react-google-login";
import { CgGoogle } from "react-icons/cg";
import "./GoogleLogin.css";

const GoogleLogin = () => {
  const clientId =
    "409567789187-nmg3icdotj9updd5npvtl4f2a5evqmnd.apps.googleusercontent.com";

  const onSignInSuccess = (res: any) => {
    console.log("Login Successful");
    console.log(res.profileObj);
  };

  const onSignInFailure = (res: any) => {
    console.log("Login Failed");
    console.log(res);
  };

  const { signIn } = useGoogleLogin({
    onSuccess: onSignInSuccess,
    onFailure: onSignInFailure,
    clientId,
    isSignedIn: true,
    accessType: "offline",
  });

  return (
    <button className="google-button" onClick={signIn}>
      <CgGoogle className="google-logo" />
      <p>sign in with google</p>
    </button>
  );
};

export default GoogleLogin;
