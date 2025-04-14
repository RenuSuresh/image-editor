import React from "react";
import styled from "styled-components";
const StyledPath = styled.path<{ iconColor?: string }>`
  stroke: ${({ iconColor }) => iconColor || 'currentColor'};
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

function RotateIcon(props: any) {
  const { width, height, color } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5603_18900)">
<StyledPath d="M10.5 5.30812C12.8052 4.37986 15.3847 4.40535 17.6711 5.37897C19.9574 6.3526 21.7634 8.19461 22.6917 10.4998C23.6199 12.805 23.5944 15.3845 22.6208 17.6708C21.6472 19.9572 19.8052 21.7632 17.5 22.6915M17.5 17.4998V23.3331H23.3333" iconColor={color}/>
<StyledPath d="M6.56836 8.35352V8.36129"iconColor={color}/>
<StyledPath d="M4.73669 12.8335V12.8413" iconColor={color}/>
<StyledPath d="M5.40167 17.6167V17.6245" iconColor={color}/>
<StyledPath d="M8.35333 21.4316V21.4394" iconColor={color}/>
<StyledPath d="M12.8333 23.2632V23.271" iconColor={color}/>
</g>

</svg>


    
  );
}

export default RotateIcon;

