import { AnimatePresence, motion } from 'framer-motion';

// Define SVG path data for check and X
const checkPath = 'M 4 10 L 8 14 L 16 6'; // Adjusted for a ~20x20 viewbox
const xPath = 'M 6 6 L 14 14 M 14 6 L 6 14'; // Adjusted for a ~20x20 viewbox

/**
 * Renders a status indicator SVG based on the provided username status.
 *
 * @param usernameStatus - The status of the username.
 * @param size - The size of the SVG.
 * @returns A React component that renders the status indicator.
 */

export const renderStatusIndicator = ({
  usernameStatus,
  size = 20,
}: { usernameStatus: string; size?: number }) => {
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Animation variants for the circle
  const circleVariants = {
    idle: {
      pathLength: 0,
      opacity: 0,
    },
    checking: {
      pathLength: 0.75, // Part of the circle for spinner
      opacity: 1,
      rotate: [0, 360], // Rotation for spinner effect
      transition: {
        pathLength: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
        rotate: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1,
          ease: 'linear',
        },
      },
      stroke: '#9ca3af', // gray-400
    },
    available: {
      pathLength: 1, // Full circle
      opacity: 1,
      rotate: 0,
      stroke: '#22c55e', // green-500
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    taken: {
      pathLength: 1,
      opacity: 1,
      rotate: 0,
      stroke: '#ef4444', // red-500
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    error: {
      pathLength: 1,
      opacity: 1,
      rotate: 0,
      stroke: '#f59e0b', // yellow-500 (amber-500)
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Animation variants for the inner icon
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.3, duration: 0.2 },
    }, // Delay slightly after circle completes
    exit: { scale: 0, opacity: 0, transition: { duration: 0.1 } },
  };

  return (
    <div className="relative">
      {/* Circle with animation */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-rotate-90 transform" // Rotate so pathLength starts at the top
      >
        <title>{usernameStatus}</title>
        {/* Optional background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth={strokeWidth}
        />
        {/* Animated foreground circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          variants={circleVariants}
          initial="idle"
          animate={usernameStatus} // Animate based on the status string
          style={{ pathLength: 0 }} // Initial pathLength for animation
        />
      </motion.svg>

      {/* Inner Icon - Separate SVG not affected by the circle rotation */}
      <AnimatePresence mode="wait">
        {(usernameStatus === 'available' ||
          usernameStatus === 'taken' ||
          usernameStatus === 'error') && (
          <motion.svg
            key={usernameStatus} // Key changes trigger AnimatePresence
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={iconVariants}
            className="absolute top-0 left-0"
          >
            <title>{usernameStatus}</title>
            {usernameStatus === 'available' && (
              <path
                d={checkPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              />
            )}
            {(usernameStatus === 'taken' || usernameStatus === 'error') && (
              <path
                d={xPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  usernameStatus === 'taken'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }
              />
            )}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};
