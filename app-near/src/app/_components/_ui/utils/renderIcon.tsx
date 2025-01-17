import { type ReactNode } from "react";

export const renderIcon = (
  icon: string | ReactNode,
  iconSize = 16,
  alt = "icon",
): ReactNode => {
  if (!icon) {
    return null;
  }
  if (typeof icon === "string") {
    return <img src={icon} alt={alt} width={iconSize} height={iconSize} />;
  }
  return icon;
};
