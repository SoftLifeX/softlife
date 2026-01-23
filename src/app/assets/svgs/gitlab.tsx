import * as React from "react";

type GitlabProps = React.SVGProps<SVGSVGElement>;

const Gitlab: React.FC<GitlabProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 48 48"
  >
    <path fill="#e53935" d="m24 43-8-23h16z"></path>
    <path fill="#ff7043" d="m24 43 18-23H32z"></path>
    <path fill="#e53935" d="m37 5 5 15H32z"></path>
    <path fill="#ffa726" d="m24 43 18-23 3 8z"></path>
    <path fill="#ff7043" d="M24 43 6 20h10z"></path>
    <path fill="#e53935" d="M11 5 6 20h10z"></path>
    <path fill="#ffa726" d="M24 43 6 20l-3 8z"></path>
  </svg>
);

export default Gitlab;
      
