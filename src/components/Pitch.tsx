import React, { ReactNode } from "react";

interface PitchProps {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Pitch: React.FC<PitchProps> = ({ children, onClick }) => {
    return (
        <div className='pitch' onClick={onClick}>
            {/* Pitch markings */}
            <div className='pitch-markings'>
                {/* Halfway line */}
                <div className='halfway-line'></div>

                {/* 22-meter lines */}
                <div className='meter-line meter-line-22-left'></div>
                <div className='meter-line meter-line-22-right'></div>

                {/* Try lines */}
                <div className='meter-line try-line-left'></div>
                <div className='meter-line try-line-right'></div>

                {/* 5-meter lines */}
                <div className='meter-line meter-line-5-left'></div>
                <div className='meter-line meter-line-5-right'></div>

                {/* In-goal areas */}
                <div className='in-goal-area in-goal-area-left'></div>
                <div className='in-goal-area in-goal-area-right'></div>

                {/* Center circle */}
                <div className='center-circle'></div>
            </div>

            {/* Children (players, ball, paths) */}
            {children}
        </div>
    );
};

export default Pitch;
