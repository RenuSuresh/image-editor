import React from "react";
import styled from "styled-components";
import { IIconProps } from "../../components/interface";


const StyledPath = styled.path<{ iconColor?: string }>`
  fill: ${({ iconColor }) => iconColor || "currentColor"};
`;

function MaskIcon({ color = "#FFF", width = "22", height = "23", ...props }: IIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 23"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledPath
        d="M21.5 6.38906L16.6109 1.5C16.4492 1.33664 16.2567 1.20695 16.0446 1.11845C15.8324 1.02994 15.6049 0.984375 15.375 0.984375C15.1451 0.984375 14.9176 1.02994 14.7054 1.11845C14.4933 1.20695 14.3008 1.33664 14.1391 1.5L1.01406 14.625C0.850983 14.7868 0.721588 14.9794 0.633354 15.1915C0.54512 15.4037 0.499796 15.6312 0.500001 15.8609V20.75C0.500001 21.2141 0.684375 21.6592 1.01256 21.9874C1.34075 22.3156 1.78587 22.5 2.25 22.5H7.13906C7.36882 22.5002 7.59634 22.4549 7.80847 22.3666C8.02061 22.2784 8.21316 22.149 8.375 21.9859L21.5 8.86094C21.8246 8.53148 22.0066 8.08752 22.0066 7.625C22.0066 7.16248 21.8246 6.71852 21.5 6.38906ZM7.13906 20.75H2.25V15.8609L11.875 6.23594L16.7641 11.125L7.13906 20.75ZM18 9.88906L13.1109 5L15.375 2.73594L20.2641 7.625L18 9.88906Z"
        iconColor={color} // Dynamically change fill color
      />
    </svg>
  );
}

export default MaskIcon;
