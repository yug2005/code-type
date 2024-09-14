import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { TbArrowBarToLeft, TbArrowBarToRight } from "react-icons/tb";
import { SettingContext } from "../../context/setting-context";
import "../../css/header/header.css";

interface HeaderInterface {
  language: string;
  onClickLanguages(): void;
}

const Header = (props: HeaderInterface) => {
  const { settings } = useContext(SettingContext);
  const [showLinks, setShowLinks] = useState<boolean>(true);

  useEffect(() => {
    if (settings.focus_mode) {
      setShowLinks(false);
    } else {
      setShowLinks(true);
    }
  }, [settings]);

  return (
    <header className="header">
      <div className="title">
        <Link className="title-text" to="/code-type">
          <h2>code type</h2>
        </Link>
      </div>
      {settings.focus_mode && (
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
          <Link className="button navbar-link" to="/code-type/settings">
            <h3 className="button-text">settings</h3>
          </Link>
          {/* <Link className="button sign-up-link" to="/signin">
            <h3 className="button-text">sign in</h3>
          </Link> */}
        </>
      )}
    </header>
  );
};

export default Header;
