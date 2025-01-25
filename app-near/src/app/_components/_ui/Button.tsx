import { type ReactNode } from "react";
import { type colors } from "tailwind.config";
import { renderIcon } from "./utils/renderIcon";
import { ButtonIconPosition, ButtonStyle } from "~/types/enums/button";

export type ButtonType = JSX.IntrinsicElements["button"]["type"];

interface ButtonProps {
  buttonType?: ButtonType;
  icon?: string | ReactNode;
  iconPosition?: ButtonIconPosition;
  children?: ReactNode | string;
  color?: keyof typeof colors | "gradient";
  onClick?: () => void;
  style?: ButtonStyle;
  disabled?: boolean;
  rounded?: boolean;
  ariaLabel?: string;
  extend?: boolean;
  border?: boolean;
  tabIndex?: number;
  customStyle?: string;
  responsive?: boolean;
  iconRight?: boolean;
}
const Button = ({
  buttonType = "button",
  icon = undefined,
  iconPosition = ButtonIconPosition.START,
  children,
  color = "blue",
  onClick = undefined,
  style = ButtonStyle.LIGHT,
  disabled = false,
  rounded = false,
  ariaLabel = "",
  extend = false,
  border = true,
  tabIndex = 0,
  responsive = false,
  customStyle = "",
  iconRight = false,
}: ButtonProps): JSX.Element => {
  const colorVariants: Record<
    ButtonStyle,
    Partial<Record<keyof typeof colors | "gradient", string>>
  > = {
    [ButtonStyle.LIGHT]: {
      blue: "border-blue text-blue disabled:bg-violetMedium",
      blueLight: "border-blueLight text-blueLight disabled:bg-violetMedium",
      black: "border-black text-black disabled:bg-violetMedium",
      gradient: `
        button-gradient-border bg-clip-text text-transparent bg-gradient-to-br from-[#E01D48] via-[#9B18C9] to-[#313192] 
        border-2 border-transparent border-image-gradient-to-br from-[#E01D48] via-[#9B18C9] to-[#313192]
      `,
      white: "border-white text-white disabled:bg-violetMedium",
    },
    [ButtonStyle.FILLED]: {
      blue: "border-blue bg-blue text-white disabled:bg-violetMedium disabled:bg-violetMedium",
      blueLight:
        "border-blueLight bg-blueLight text-white disabled:bg-violetMedium",
      black: "border-black bg-black text-white disabled:bg-violetMedium",
      gradient: `
      button-gradient-border
      bg-gradient-to-br from-[#E01D48] via-[#9B18C9] to-[#313192] 
      text-white
    `,
    },
  };

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={buttonType}
      className={`flex gap-3 ${border ? "border" : ""} ${colorVariants[style][color]} ${rounded && "rounded-md"} items-center justify-center rounded-md px-5 py-2 font-sans font-bold disabled:opacity-40 ${customStyle} ${iconPosition === ButtonIconPosition.END && "flex-row-reverse"} ${extend && "w-full"} ${responsive ? "gap-1 p-2 text-xs sm:gap-2 sm:p-2 sm:text-xs md:gap-2 md:p-2 md:text-base lg:gap-3 lg:p-3 lg:text-base" : "gap-3 p-3"} ${iconRight ? "flex-row-reverse justify-between" : ""} `}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {renderIcon(icon)}
      {children}
    </button>
  );
};

export default Button;
