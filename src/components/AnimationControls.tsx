import React from "react";

interface AnimationControlsProps {
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    duration: number;
    onDurationChange: (duration: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
    isPlaying,
    onPlay,
    onPause,
    onReset,
    duration,
    onDurationChange,
}) => {
    return (
        <div className='flex items-center space-x-4 p-4 bg-gray-100 rounded-lg'>
            <button
                onClick={isPlaying ? onPause : onPlay}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
                {isPlaying ? "Pause" : "Play"}
            </button>

            <button
                onClick={onReset}
                className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
            >
                Reset
            </button>

            <div className='flex items-center space-x-2'>
                <label htmlFor='duration' className='text-sm font-medium'>
                    Duration (seconds):
                </label>
                <input
                    id='duration'
                    type='number'
                    min='1'
                    max='10'
                    value={duration / 1000}
                    onChange={(e) =>
                        onDurationChange(Number(e.target.value) * 1000)
                    }
                    className='w-16 px-2 py-1 border rounded-md'
                />
            </div>
        </div>
    );
};

export default AnimationControls;
