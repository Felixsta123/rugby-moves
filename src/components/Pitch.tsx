import React, { ReactNode } from "react";

interface PitchProps {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Pitch: React.FC<PitchProps> = ({ children, onClick }) => {
    return (
        <div
            className='relative w-full max-w-5xl mx-auto overflow-hidden bg-pitch-green rounded-lg'
            style={{ aspectRatio: "100/70" }}
            onClick={onClick}
        >
            {/* Pitch markings */}
            <div className='absolute inset-0'>
                {/* Halfway line */}
                <div className='absolute top-0 bottom-0 left-1/2 w-0.5 bg-white' />

                {/* 22-meter lines */}
                <div className='absolute top-0 bottom-0 left-[22%] w-0.5 bg-white' />
                <div className='absolute top-0 bottom-0 left-[78%] w-0.5 bg-white' />

                {/* Try lines */}
                <div className='absolute top-0 bottom-0 left-0 w-0.5 bg-white' />
                <div className='absolute top-0 bottom-0 right-0 w-0.5 bg-white' />

                {/* 5-meter lines */}
                <div className='absolute top-0 bottom-0 left-[5%] w-0.5 bg-white' />
                <div className='absolute top-0 bottom-0 right-[5%] w-0.5 bg-white' />

                {/* In-goal areas */}
                <div className='absolute top-0 bottom-0 left-0 w-[5%] bg-opacity-20 bg-white' />
                <div className='absolute top-0 bottom-0 right-0 w-[5%] bg-opacity-20 bg-white' />

                {/* Center circle */}
                <div className='absolute top-1/2 left-1/2 w-16 h-16 rounded-full border border-white -translate-x-1/2 -translate-y-1/2' />
            </div>

            {/* Children (players, ball, paths) */}
            {children}
        </div>
    );
};

export default Pitch;
