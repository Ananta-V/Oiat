import React from "react";

export default function OiAIFilterDefs() {
  return (
    <svg aria-hidden={"true"} className={"oiai-filter-defs"} xmlns={"http://www.w3.org/2000/svg"} width={"0"} height={"0"} style={{position: "absolute", width: "0", height: "0", overflow: "hidden"}}><defs> <filter id={"oiai-goo"} x={"-25%"} y={"-35%"} width={"150%"} height={"190%"} colorInterpolationFilters={"sRGB"}> <feGaussianBlur in={"SourceGraphic"} stdDeviation={"2.2"} result={"blur"}></feGaussianBlur> <feColorMatrix in={"blur"} mode={"matrix"} values={"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"} result={"goo"}></feColorMatrix> <feComposite in={"SourceGraphic"} in2={"goo"} operator={"atop"}></feComposite> </filter> <filter id={"oiai-chocolate-edge"} x={"-1%"} y={"-4%"} width={"102%"} height={"112%"} colorInterpolationFilters={"sRGB"}> <feTurbulence type={"fractalNoise"} baseFrequency={".012 .027"} numOctaves={"2"} seed={"17"} result={"cocoa-noise"}><animate attributeName={"baseFrequency"} values={".012 .027;.019 .017;.012 .027"} dur={"12s"} repeatCount={"indefinite"}></animate></feTurbulence> <feDisplacementMap in={"SourceGraphic"} in2={"cocoa-noise"} scale={"2.8"} xChannelSelector={"R"} yChannelSelector={"G"}></feDisplacementMap> </filter> </defs></svg>
  );
}
