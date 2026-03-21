interface IconsProps {
  width: string;
  height: string;
  viewBox: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeLineCap: "butt" | "round" | "square" | "inherit" | undefined;
  strokeLineJoin: "round" | "inherit" | "miter" | "bevel" | undefined;
  children: React.ReactNode;
}

const Icons: React.FC<IconsProps> = ({
  width,
  height,
  viewBox,
  fill,
  stroke,
  strokeWidth,
  strokeLineCap,
  strokeLineJoin,
  children,
}: IconsProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLineCap}
      strokeLinejoin={strokeLineJoin}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
};

export default Icons;
