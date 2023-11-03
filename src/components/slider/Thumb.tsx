import React from "react";
import styled from "styled-components";

const StyledThumb = styled.div`
  height: 25px;
  line-height: 25px;

  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 7px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: grab;
`;

const formatCompactNumber = (number: any) => {
  if (number < 1000) {
    return number;
  } else if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + " K";
  } else if (number >= 1000000 && number < 1000000000) {
    return (number / 1000000).toFixed(1) + " M";
  } else if (number >= 1000000000 && number < 1000000000000) {
    return (number / 1000000000).toFixed(1) + " B";
  } else if (number >= 1000000000000 && number < 1000000000000000) {
    return (number / 1000000000000).toFixed(1) + "T";
  }
};

export const Thumb = (props: any, state: any) => {
  const v = formatCompactNumber(state.valueNow);
  return <StyledThumb {...props}>{v}</StyledThumb>;
};
