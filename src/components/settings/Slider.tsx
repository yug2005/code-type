import React, { ChangeEvent, useEffect } from "react";

interface SliderInterface {
  id: string;
  range: number;
  setRange(value: number): void;
  min: number;
  max: number;
  step: number;
}

export const Slider = (props: SliderInterface) => {
  const updateSlider = () => {
    const slider = document.getElementById(`${props.id}-slider`);
    const width = slider && slider.getBoundingClientRect().width;
    const slider_value = document.getElementById(`${props.id}-slider-value`);
    if (slider_value && width) {
      slider_value.style.left = `${
        40 +
        ((width - 15) * (props.range - props.min)) / (props.max - props.min)
      }px`;
    }
  };

  useEffect(() => {
    updateSlider();
  }, []);

  useEffect(() => {
    updateSlider();
  }, [props.range]);

  return (
    <div className="slider">
      <div className="slider-field">
        <div className="slider-left-value">{props.min}</div>
        <input
          type="range"
          className="input-slider"
          id={`${props.id}-slider`}
          min={props.min}
          max={props.max}
          value={props.range}
          step={props.step}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            props.setRange(parseInt(e.target.value))
          }
        />
        <div className="slider-right-value">{props.max}</div>
      </div>
      <div id={`${props.id}-slider-value`} className="slider-value">
        {props.range}
      </div>
    </div>
  );
};
