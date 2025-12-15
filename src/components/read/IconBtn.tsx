import { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconBtnProps = {
  Icon: LucideIcon;
  isActive?: boolean;
  color?: "danger" | "primary" | "success";
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function IconBtn({
  Icon,
  isActive = false,
  color,
  children,
  className,
  ...props
}: IconBtnProps) {
  return (
    <button
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${
        color ?? ""
      } ${className ?? ""}`}
      {...props}
    >
      <span className={children != null ? "mr-1" : ""}>
        <Icon />
      </span>
      {children}
    </button>
  );
}
