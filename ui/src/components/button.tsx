import * as React from "react";

export type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className={`bg-lc-primary-100 text-white px-4 py-2 rounded-md`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
