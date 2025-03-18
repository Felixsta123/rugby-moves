import React from "react";
import Draggable from "react-draggable";
import { Position } from "../types";

interface BallProps {
    position: Position;
    onPositionChange: (position: Position) => void;
    disabled?: boolean;
}

const Ball: React.FC<BallProps> = ({
    position,
    onPositionChange,
    disabled = false,
}) => {
    const handleDrag = (_e: any, data: { x: number; y: number }) => {
        onPositionChange({ x: data.x, y: data.y });
    };

    return (
        <Draggable position={position} onStop={handleDrag} disabled={disabled}>
            <div
                className='absolute flex items-center justify-center w-6 h-4 bg-amber-700 rounded-full cursor-pointer'
                style={{ zIndex: 30, transform: "translate(-50%, -50%)" }}
            >
                {/* Rugby ball shape */}
            </div>
        </Draggable>
    );
};

export default Ball;
