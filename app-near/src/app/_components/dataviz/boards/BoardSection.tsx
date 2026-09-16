import React, { useId } from "react";

type BoardSectionProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  containerStyle?: React.CSSProperties;
  children: React.ReactNode;
};

export const BoardSection: React.FC<BoardSectionProps> = ({
  title,
  description,
  containerStyle,
  children,
}) => {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="other-board flex h-full flex-col overflow-y-auto p-4"
    >
      <header className="mb-4">
        <h2
          id={titleId}
          className="flex items-center gap-2 text-xl font-semibold text-black"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray">{description}</p>
      </header>
      <div
        className="dv-container rounded-lg border border-grayLight bg-white p-3"
        style={containerStyle}
      >
        {children}
      </div>
    </section>
  );
};

export default BoardSection;
