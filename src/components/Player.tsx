import React from "react";
import Draggable from "react-draggable";
import { Player as PlayerType } from "../types";

interface PlayerProps {
    player: PlayerType;
    onPositionChange: (id: string, position: { x: number; y: number }) => void;
    onSelect: (id: string) => void;
    disabled?: boolean;
}

const Player: React.FC<PlayerProps> = ({
    player,
    onPositionChange,
    onSelect,
    disabled = false,
}) => {
    const { id, number, team, position, selected } = player;

    const handleDrag = (_e: any, data: { x: number; y: number }) => {
        onPositionChange(id, { x: data.x, y: data.y });
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    const teamColor = team === "A" ? "bg-team-a" : "bg-team-b";

    return (
        <Draggable position={position} onStop={handleDrag} disabled={disabled}>
            <div
                className={`absolute flex items-center justify-center w-10 h-10 rounded-full cursor-pointer select-none
                   ${teamColor} ${selected ? "ring-2 ring-yellow-400" : ""}`}
                onClick={handleClick}
                style={{ zIndex: selected ? 20 : 10 }}
            >
                <span className='text-white font-bold'>{number}</span>
            </div>
        </Draggable>
    );
};

export default Player;
