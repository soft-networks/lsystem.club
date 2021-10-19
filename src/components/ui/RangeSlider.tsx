
import React from "react";
import { Range } from "react-range";

interface RangeSliderProps {
  min: number,
  max: number,
  currentValue: number,
  onChange: (n: number) => void
}
const RangeSlider = ({min, max, currentValue, onChange}: RangeSliderProps): JSX.Element => {
  
  return ( <Range
    min={min}
    max={max}
    values={[currentValue]}
    onChange={(values) => onChange(values[0])}
    allowOverlap
    renderTrack={({ props, children }) => (
      <div {...props} className="input-track">
        {children}
      </div>
    )}
    renderThumb={({ props }) => <div {...props} className="input-thumb" />}
    /> ); 
}


export default RangeSlider