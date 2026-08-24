interface SymbolMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const SymbolMark = ({ size = 24, ...props }: SymbolMarkProps) => {
  return (
    <svg
      aria-hidden
      fill="currentColor"
      height={size}
      viewBox="0 0 512 512"
      width={size}
      {...props}
    >
      <g transform="translate(256, 256)">
        <rect
          height="88"
          width="176"
          x="-220"
          y="-176"
        />
        <circle
          cx="132"
          cy="-132"
          r="88"
        />
        <circle
          cx="-132"
          cy="132"
          r="88"
        />
        <rect
          height="88"
          width="176"
          x="44"
          y="88"
        />
      </g>
    </svg>
  );
};
