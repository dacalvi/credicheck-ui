import {Result} from "constants/values";
import React from "react";
import ReactSlider from "react-slider";
import styled from "styled-components";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 25px;
`;

const StyledTrack = styled.div<{rangeStates: Result[]}>`
  top: 0;
  bottom: 0;
  padding-top: 2px;
  padding-left: 8px;
  background: ${(props: any) => {
    const result = props.rangeStates?.[props.index];
    if (result === Result.REJECT) return "#f00";
    if (result === Result.MANUAL) return "#fbff43";
    if (result === Result.SKIP) return "#0f0";
  }};
  border-radius: 999px;
`;

interface SliderProps {
  index: number;
  rangeStates: Result[];
}

export const Slider: React.FC<SliderProps> = ({
  index,
  rangeStates,
  ...props
}) => (
  <StyledSlider
    {...props}
    renderTrack={(props) => (
      <StyledTrack {...props} rangeStates={rangeStates} />
    )}
  />
);
