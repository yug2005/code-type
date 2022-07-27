import React from "react";

interface ButtonInterface {
  text: string;
  button_id: string;
  onClick(): void;
}

const Button = (props: ButtonInterface) => {
  return (
    <button className={`button ${props.button_id}`} onClick={props.onClick}>
      <h3 className="button-text">{props.text}</h3>
    </button>
  );
};

export default Button;
