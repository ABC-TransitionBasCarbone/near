import { type ReactNode } from "react";
import { type colors } from "tailwind.config";
import { renderIcon } from "./utils/renderIcon";
import { ButtonStyle } from "~/types/enums/button";

export type ButtonType = JSX.IntrinsicElements["button"]["type"];

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType?: ButtonType;
  icon?: string | ReactNode;
  children?: ReactNode | string;
  color?: keyof typeof colors | "gradient";
  textColor?: keyof typeof colors;
  onClick?: () => void;
  style?: ButtonStyle;
  rounded?: boolean;
  border?: boolean;
  tabIndex?: number;
  customStyle?: string;
  responsive?: boolean;
  iconRight?: boolean;
};
const Button = ({
  buttonType = "button",
  icon = undefined,
  children,
  color = "blue",
  textColor = undefined,
  onClick = undefined,
  style = ButtonStyle.LIGHT,
  rounded = false,
  border = true,
  tabIndex = 0,
  customStyle = "",
  iconRight = false,
  ...props
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

  const textColorVariant: Partial<Record<keyof typeof colors, string>> = {
    blue: "text-blue",
    blueLight: "text-blueLight",
    black: "text-black",
    grayLight: "text-grayLight",
    white: "text-white",
  };

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={buttonType}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // @ts-expect-error: fixme
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      className={`flex ${border ? "border" : ""} justify-center gap-3 ${iconRight ? "flex-row-reverse" : ""} ${colorVariants[style][color]} items-center px-5 py-2 font-sans font-bold ${customStyle} ${textColor ? textColorVariant[textColor] : ""} ${rounded ? "rounded-md" : ""} disabled:opacity-40`}
      onClick={onClick}
      tabIndex={tabIndex}
      {...props}
    >
      {renderIcon(icon)}
      {children}
    </button>
  );
};

export default Button;
