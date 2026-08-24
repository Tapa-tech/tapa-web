import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}

export default function SectionHeading({ children, rightElement }: SectionHeadingProps) {
  return (
    <div className="sec-head select-none flex flex-row items-center justify-between w-full gap-2">
      <h2 className="sec-title flex items-center">
        <span className="sec-plus">+</span>
        <span className="text-xs md:text-sm">{children}</span>
      </h2>
      {rightElement && <div className="text-xs font-semibold">{rightElement}</div>}
    </div>
  );
}
