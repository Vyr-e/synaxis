'use client';

const DonutChart = () => {
  const data = [
    { value: 30, color: 'bg-blue-500' },
    { value: 20, color: 'bg-green-500' },
    { value: 50, color: 'bg-yellow-500' },
  ];

  return (
    <div className="relative h-32 w-32">
      {/* Base circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full rounded-full border-2 border-gray-200"></div>
      </div>

      {/* Segments */}
      {data.map((segment, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${index === 0 ? 'overflow-hidden' : ''}`}
          style={{ clip: `rect(0, 16px, 32px, 0)` }} // Adjust based on segment
        >
          <div
            className={`absolute inset-0 ${segment.color}`}
            style={{
              transform: `rotate(${
                index === 0 ? 0 : `${data[index - 1].value * 3.6}deg`
              })`,
            }}
          >
            <div
              className="clip-auto absolute inset-0 h-full w-full rounded-full"
              style={{ clip: `rect(auto, auto, auto, auto)` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonutChart;
