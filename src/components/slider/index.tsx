import {useEffect, useState} from "react";
import ReactSlider from "react-slider";
import styled from "styled-components";
import {Thumb} from "./Thumb";
import {Track} from "./Track";
import {Result} from "constants/values";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 25px;
`;

const StyledContainer = styled.div`
  resize: horizontal;
  overflow: auto;
  width: 100%;
  max-width: 100%;
  padding-right: 8px;
`;

interface ResizableSliderProps {
  min: number;
  max: number;
  rangesValues: number[];
  rangeStates: Result[];

  onChange: (segments: number[]) => void;
}

export const IndicatorMultiRangeParameters: React.FC<ResizableSliderProps> = ({
  min,
  max,
  rangesValues,
  rangeStates,
  onChange,
}) => {
  const [value, setValue] = useState(rangesValues);

  useEffect(() => {
    console.log("rangeStates", rangeStates);
  }, [rangeStates]);

  useEffect(() => {
    setValue(rangesValues);
  }, [rangesValues]);

  return (
    <StyledContainer>
      <StyledSlider
        defaultValue={rangesValues}
        renderTrack={(props: any, state: any) => {
          return (
            <Track {...props} index={state.index} rangeStates={rangeStates} />
          );
        }}
        renderThumb={Thumb}
        onChange={(value) => {
          setValue(value);
          onChange(value);
        }}
        value={value}
        min={min}
        max={max}
      />
    </StyledContainer>
  );
};
