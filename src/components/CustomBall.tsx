import React, { useRef, useState, useEffect } from "react";
import { Position } from "../types";

interface BallProps {
    position: Position;
    onPositionChange: (position: Position) => void;
    disabled?: boolean;
}

const CustomBall: React.FC<BallProps> = ({
    position,
    onPositionChange,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const ballRef = useRef<HTMLDivElement>(null);

    // Set initial position
    useEffect(() => {
        if (!isDragging && ballRef.current) {
            ballRef.current.style.left = `${position.x}px`;
            ballRef.current.style.top = `${position.y}px`;
        }
    }, [position, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return;

        setIsDragging(true);

        // Calculate the offset between mouse position and element position
        if (ballRef.current) {
            const rect = ballRef.current.getBoundingClientRect();
            const parentRect =
                ballRef.current.parentElement?.getBoundingClientRect() || {
                    left: 0,
                    top: 0,
                };

            setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && ballRef.current) {
            const parentRect =
                ballRef.current.parentElement?.getBoundingClientRect() || {
                    left: 0,
                    top: 0,
                };

            const x = e.clientX - parentRect.left - offset.x;
            const y = e.clientY - parentRect.top - offset.y;

            ballRef.current.style.left = `${x}px`;
            ballRef.current.style.top = `${y}px`;
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isDragging && ballRef.current) {
            setIsDragging(false);

            const parentRect =
                ballRef.current.parentElement?.getBoundingClientRect() || {
                    left: 0,
                    top: 0,
                };
            const newPos = {
                x: parseInt(ballRef.current.style.left),
                y: parseInt(ballRef.current.style.top),
            };

            onPositionChange(newPos);
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, offset]);

    return (
        <div
            ref={ballRef}
            className='ball'
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: disabled ? "default" : "grab",
            }}
            onMouseDown={handleMouseDown}
        />
    );
};

export default CustomBall;
