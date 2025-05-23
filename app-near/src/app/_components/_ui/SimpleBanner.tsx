import { type ReactNode } from "react";

interface SimpleBannerProps {
  children: ReactNode;
}
const SimpleBanner: React.FC<SimpleBannerProps> = ({ children }) => {
  return (
    <div className="bg-grayExtraLight py-8">
      <div className="mx-auto px-8">{children}</div>
    </div>
  );
};

export default SimpleBanner;
