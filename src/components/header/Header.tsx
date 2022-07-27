import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { TbArrowBarToLeft, TbArrowBarToRight } from "react-icons/tb";
import { UserContext } from "../../context/UserContext";
import "./Header.css";

interface HeaderInterface {
  text: string;
  language: string;
  onClickLanguages: () => void;
}

const Header = (props: HeaderInterface) => {
  const [settings, setSettings]: any = useContext(UserContext);
  const [showLinks, setShowLinks] = useState(true);

  useEffect(() => {
    if (settings?.appearance.focus_mode) {
      setShowLinks(false);
    } else {
      setShowLinks(true);
    }
  }, [settings]);

  return (
    <header className="header">
      <div className="title">
        <Link className="title-text" to="/">
          <h2>{props.text}</h2>
        </Link>
      </div>
      {settings?.appearance.focus_mode && (
        <div
          className="open-header-link"
          style={!showLinks ? { margin: "0px 75px" } : {}}
          onClick={() => setShowLinks(!showLinks)}
        >
          {showLinks ? (
            <TbArrowBarToRight size="27px" />
          ) : (
            <TbArrowBarToLeft size="27px" />
          )}
        </div>
      )}
      {showLinks && (
        <>
          <button
            className="button navbar-button"
            onClick={props.onClickLanguages}
          >
            <h3 className="button-text">{props.language}</h3>
          </button>
          <Link className="button navbar-link" to="/settings">
            <h3 className="button-text">settings</h3>
          </Link>
          <Link className="button sign-up-link" to={"/signin"}>
            <h3 className="button-text">sign in</h3>
          </Link>
        </>
      )}
    </header>
  );
};

Header.defaultProps = {
  text: "code type",
};

export default Header;
