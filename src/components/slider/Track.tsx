import {Result} from "constants/values";
import styled from "styled-components";

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  padding-top: 2px;
  padding-left: 8px;
  background: ${(props: any) => {
    const result = props.rangeStates?.[props.index];
    if (result === Result.REJECT) return "#f00";
    if (result === Result.MANUAL) return "rgb(217, 119, 6)";
    if (result === Result.SKIP) return "rgb(5, 150, 105)";
  }};
  border-radius: 999px;
`;

export const Track = (props: any) => {
  return (
    <StyledTrack {...props} index={props.index}>
      {props.rangeStates[props.index] === Result.REJECT && (
        <div className={`text-white ${props.index > 0 ? "ml-14" : ""}`}>
          Rechazo
        </div>
      )}
      {props.rangeStates[props.index] === Result.MANUAL && (
        <div className={`text-black ${props.index > 0 ? "ml-14" : ""}`}>
          Manual
        </div>
      )}
      {props.rangeStates[props.index] === Result.SKIP && (
        <div className={`text-white ${props.index > 0 ? "ml-14" : ""}`}>
          Aprobar
        </div>
      )}
    </StyledTrack>
  );
};
