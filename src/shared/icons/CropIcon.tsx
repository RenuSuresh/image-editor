import React from "react";
import styled from "styled-components";
import { IIconProps } from "../../components/interface";



const StyledPath = styled.path<{ iconColor?: string }>`
  stroke: ${({ iconColor }) => iconColor || 'currentColor'};
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
`;


function CropIcon({ color = '#FFF', width, height, ...props }: IIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledPath
        d="M7 3.5V19.4091C7 19.831 7.16761 20.2357 7.46597 20.534C7.76432 20.8324 8.16897 21 8.59091 21H24.5"
        iconColor={color}
       
      />
      <StyledPath
        d="M3.5 7H19.4091C19.831 7 20.2357 7.16761 20.534 7.46597C20.8324 7.76432 21 8.16897 21 8.59091V24.5"
        iconColor={color}
      />
    </svg>
  );
};

export default CropIcon;
