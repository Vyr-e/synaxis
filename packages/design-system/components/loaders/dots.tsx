interface LoadingDotsProps {
  size?: number;
  className?: string;
  color?: string;
}

export function Dots({
  size = 24,
  className = 'text-black',
  color,
}: LoadingDotsProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={color ? { color } : undefined}
    >
      <title>Loading Dots</title>
      <rect x="5" y="16" width="2" height="2" rx="2" fill="currentColor">
        <animate
          attributeName="x"
          dur="1360ms"
          values="6;10;10;16;16"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="y"
          dur="1360ms"
          values="16;5;5;16;16"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="height"
          dur="680ms"
          values="2;4;4;2;2"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="width"
          dur="680ms"
          values="2;4;4;2;2"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
      </rect>

      {/* Second animated rectangle */}
      <rect x="11" y="6" width="2" height="2" rx="2" fill="currentColor">
        <animate
          attributeName="x"
          dur="1360ms"
          values="11;16;16;6;6"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="y"
          dur="1360ms"
          values="7;15;15;16;16"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="height"
          dur="680ms"
          values="2;4;4;2;2"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="width"
          dur="680ms"
          values="2;4;4;2;2"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
      </rect>

      {/* Third animated rectangle */}
      <rect x="17" y="16" width="2" height="2" rx="2" fill="currentColor">
        <animate
          attributeName="x"
          dur="1360ms"
          values="16;4;4;11;11"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1; 0 0.8 0.8 1; 0 0.8 0.8 1"
        />
        <animate
          attributeName="y"
          dur="1360ms"
          values="16;15;15;7;7"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1; 0 0.8 0.8 1; 0 0.8 0.8 1"
        />
        <animate
          attributeName="height"
          dur="680ms"
          values="2;4;4;2;2"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
        <animate
          attributeName="width"
          dur="680ms"
          values="2;4;4;2;2"
          keyTimes="0;0.25;0.5;0.75;1"
          repeatCount="indefinite"
          keySplines="0 0.8 0.8 1"
        />
      </rect>
    </svg>
  );
}
