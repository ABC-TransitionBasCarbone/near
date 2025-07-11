import Link from "next/link";
import { type ReactNode } from "react";
import { type colors } from "tailwind.config";
import { ButtonStyle } from "~/types/enums/button";
import { renderIcon } from "./utils/renderIcon";

interface LinkAsButtonProps {
  icon?: string | ReactNode;
  children?: ReactNode | string;
  color?: keyof typeof colors | "gradient";
  textColor?: keyof typeof colors;
  href?: string;
  style?: ButtonStyle;
  ariaLabel?: string;
  iconRight?: boolean;
  openNewTab?: boolean;
  customStyle?: string;
  underline?: boolean;
  border?: boolean;
  rounded?: boolean;
}
const LinkAsButton = ({
  icon = undefined,
  children,
  color = "green",
  textColor = undefined,
  href = "",
  style = ButtonStyle.LIGHT,
  ariaLabel = "",
  iconRight = false,
  openNewTab = false,
  customStyle = "",
  underline = false,
  border = true,
  rounded,
}: LinkAsButtonProps): JSX.Element => {
  const colorVariants: Record<
    ButtonStyle,
    Partial<Record<keyof typeof colors | "gradient", string>>
  > = {
    [ButtonStyle.LIGHT]: {
      blue: "border-blue text-blue",
      black: "border-black text-black",
      grayLight: "border-grayLight text-grayLight",
      green: "border-green text-blue",
      white: "border-white text-blue",
    },
    [ButtonStyle.FILLED]: {
      blue: "border-blue bg-blue text-white",
      black: "border-black bg-black text-white",
      grayLight: "border-grayLight bg-grayLight text-white",
      green: "border-green bg-green text-blue",
      white: "border-black bg-black text-white",
    },
  };

  const textColorVariant: Partial<Record<keyof typeof colors, string>> = {
    blue: "text-blue",
    black: "text-black",
    grayLight: "text-grayLight",
    white: "text-white",
  };

  return (
    <Link
      className={`flex ${border ? "border" : ""} justify-center gap-3 ${iconRight ? "flex-row-reverse" : ""} ${colorVariants[style][color]} items-center px-5 py-2 font-sans font-bold ${underline ? "underline hover:no-underline" : "no-underline hover:underline"} ${textColor ? textColorVariant[textColor] : ""} ${rounded ? "rounded-md" : ""} ${customStyle}`}
      href={href}
      aria-label={ariaLabel}
      target={openNewTab ? "_blank" : "_self"}
    >
      {renderIcon(icon)}
      {children}
    </Link>
  );
};

export default LinkAsButton;
