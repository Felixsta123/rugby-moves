import React, { useRef, useState, useEffect } from "react";
import { Player as PlayerType } from "../types";

interface PlayerProps {
    player: PlayerType;
    onPositionChange: (id: string, position: { x: number; y: number }) => void;
    onSelect: (id: string) => void;
    disabled?: boolean;
}

const CustomPlayer: React.FC<PlayerProps> = ({
    player,
    onPositionChange,
    onSelect,
    disabled = false,
}) => {
    const { id, number, team, position, selected } = player;
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const playerRef = useRef<HTMLDivElement>(null);

    // Set initial position
    useEffect(() => {
        if (!isDragging && playerRef.current) {
            playerRef.current.style.left = `${position.x}px`;
            playerRef.current.style.top = `${position.y}px`;
        }
    }, [position, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return;

        e.stopPropagation();
        setIsDragging(true);

        // Calculate the offset between mouse position and element position
        if (playerRef.current) {
            const rect = playerRef.current.getBoundingClientRect();
            const parentRect =
                playerRef.current.parentElement?.getBoundingClientRect() || {
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
        if (isDragging && playerRef.current) {
            const parentRect =
                playerRef.current.parentElement?.getBoundingClientRect() || {
                    left: 0,
                    top: 0,
                };

            const x = e.clientX - parentRect.left - offset.x;
            const y = e.clientY - parentRect.top - offset.y;

            playerRef.current.style.left = `${x}px`;
            playerRef.current.style.top = `${y}px`;
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isDragging && playerRef.current) {
            setIsDragging(false);

            const newPos = {
                x: parseInt(playerRef.current.style.left),
                y: parseInt(playerRef.current.style.top),
            };

            onPositionChange(id, newPos);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDragging) {
            onSelect(id);
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

    const teamClass = team === "A" ? "team-a" : "team-b";
    const selectedClass = selected ? "selected" : "";

    return (
        <div
            ref={playerRef}
            className={`player ${teamClass} ${selectedClass}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: disabled ? "default" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            {number}
        </div>
    );
};

export default CustomPlayer;
