import * as React from "react";

type TailwindProps = React.SVGProps<SVGSVGElement>;

const Tailwind: React.FC<TailwindProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 48 48"
  >
    <path
      fill="#00acc1"
      d="M24 9.604q-9.6 0-12 9.597 3.6-4.798 8.4-3.599c1.826.456 3.131 1.781 4.576 3.247C27.328 21.236 30.051 24 36 24q9.6 0 12-9.598-3.6 4.798-8.4 3.6c-1.825-.456-3.13-1.781-4.575-3.247C32.672 12.367 29.948 9.604 24 9.604M12 24q-9.6 0-12 9.598 3.6-4.799 8.4-3.599c1.825.457 3.13 1.781 4.575 3.246 2.353 2.388 5.077 5.152 11.025 5.152q9.6 0 12-9.598-3.6 4.799-8.4 3.599c-1.826-.456-3.131-1.781-4.576-3.246C20.672 26.764 17.949 24 12 24"
    ></path>
  </svg>
);

export default Tailwind;
        
