import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import {
  currenciesFormatted,
  getInputNumbersValue,
} from "../utils/formattedNumberInput";

const InputRange = ({ maxValue }) => {
  const minSumRef = useRef(null);
  const maxSumRef = useRef(null);
  const inputRangeRef = useRef(null);
  const [values, setValues] = useState([100, 900]);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const WIDTH = 24;
  const [backgroundColor, setBackgroundColor] = useState(``);
  const handleMouseMove = (event) => {
    const rect = inputRangeRef.current.getBoundingClientRect();
    const minSum = minSumRef.current.getBoundingClientRect();
    const maxSum = maxSumRef.current.getBoundingClientRect();
    const coordinateX = event.type === "mousemove" ? event.clientX : event.touches[0].clientX;
    if (isDraggingMin) {
      if (coordinateX >= rect.x && coordinateX <= maxSum.x - WIDTH) {
        let offsetX = coordinateX - rect.left;
        setValues((prev) => [offsetX * 9, prev[1]]);
      } else if (coordinateX < rect.x) {
        setValues((prev) => [0, prev[1]]);
      } else if (coordinateX > maxSum.x - WIDTH) {
        let offsetX = maxSum.x - rect.left - WIDTH;
        setValues((prev) => [offsetX * 9, prev[1]]);
      }
    } else if (isDraggingMax) {
      if (
        coordinateX >= minSum.x + WIDTH &&
        coordinateX <= rect.right - WIDTH
      ) {
        let offsetX = coordinateX - rect.left;
        setValues((prev) => [prev[0], offsetX * 9]);
      } else if (coordinateX < minSum.x + WIDTH) {
        let offsetX = minSum.x - rect.left + WIDTH;
        setValues((prev) => [prev[0], offsetX * 9]);
      } else if (coordinateX > rect.right - WIDTH) {
        let offsetX = rect.right - rect.left - WIDTH;
        setValues((prev) => [prev[0], offsetX * 9]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingMin(false);
    setIsDraggingMax(false);
  };

  useEffect(() => {
    setBackgroundColor(
      `linear-gradient(to right, #FFECBB ${values[0] / 9 + 12}px, #FDC840 ${
        values[0] / 9
      }px ${values[1] / 9 + 12}px, #FFECBB ${values[1] / 9}px)`
    );
  }, [values]);
  useEffect(() => {
    if (isDraggingMin || isDraggingMax) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingMin, isDraggingMax]);
  const handleBlurMin = () => {
    setValues((prev) => {
      if (prev[0] <= 0 && prev[0] !== null) {
        return [0, prev[1]];
      } else if (prev[0] >= prev[1]) {
        return [prev[1] - WIDTH * 9, prev[1]];
      } else {
        return [prev[0], prev[1]];
      }
    });
  };
  const handleBlurMax = () => {
    setValues((prev) => {
      if (prev[1] <= prev[0] && prev[1] !== null) {
        return [prev[0], prev[0] + WIDTH * 9];
      } else if (prev[1] > maxValue) {
        return [prev[0], maxValue];
      } else {
        return [prev[0], prev[1]];
      }
    });
  };
  const onChangeMin = (e) => {
    const value = getInputNumbersValue(e.target.value);
    const max = values[1];
    const thumbWidth = WIDTH * 9;
    if (value >= 0 && value <= max - thumbWidth) {
      setValues((prev) => [value, prev[1]]);
    } else if (value < 0) {
      setValues((prev) => [0, prev[1]]);
    } else if (value > max - thumbWidth) {
      setValues((prev) => [max - thumbWidth, prev[1]]);
    }
  };

  const onChangeMax = (e) => {
    const value = getInputNumbersValue(e.target.value);
    const min = values[0];
    const thumbWidth = WIDTH * 9;
    if (value >= min + thumbWidth && value <= maxValue) {
      setValues((prev) => [prev[0], value]);
    } else if (value < min + thumbWidth) {
      setValues((prev) => [prev[0], min + thumbWidth]);
    } else if (value > maxValue) {
      setValues((prev) => [prev[0], maxValue]);
    }
  };
  return (
    <div className="wrapper">
      <div className="inputInputWrapper">
        <input
          type="text"
          value={currenciesFormatted(values[0])}
          onInput={onChangeMin}
          onBlur={handleBlurMin}
        />
        <input
          type="text"
          value={currenciesFormatted(values[1])}
          onInput={onChangeMax}
          onBlur={handleBlurMax}
        />
      </div>
      <div className="inputRangeWrapper">
        <div
          style={{
            background: backgroundColor,
          }}
          ref={inputRangeRef}
          className="inputRange"
          onMouseDown={(e) => e.preventDefault()}
        />
        <div
          ref={minSumRef}
          style={{ left: `${values[0] / 9}px` }}
          onMouseDown={() => setIsDraggingMin(true)}
          onTouchStart={() => setIsDraggingMin(true)}
          className="inputRoundFirst"
        />
        <div
          ref={maxSumRef}
          style={{ left: `${values[1] / 9}px` }}
          onMouseDown={() => setIsDraggingMax(true)}
          onTouchStart={() => setIsDraggingMax(true)}
          className="inputRoundSecond"
        />
      </div>
    </div>
  );
};

export default InputRange;
