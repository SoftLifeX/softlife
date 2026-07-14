import * as React from "react";

type VercelProps = React.SVGProps<SVGSVGElement>;

const Vercel: React.FC<VercelProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    preserveAspectRatio="xMidYMid"
    viewBox="0 -17 256 256"
  >
    <path d="m128 0 128 221.705H0z"></path>
  </svg>
);

export default Vercel;