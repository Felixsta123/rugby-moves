import React from "react";
import { Player as PlayerType } from "../types";

interface TeamControlsProps {
    teamA: PlayerType[];
    teamB: PlayerType[];
    onAddPlayer: (team: "A" | "B") => void;
    onRemovePlayer: (id: string) => void;
}

const TeamControls: React.FC<TeamControlsProps> = ({
    teamA,
    teamB,
    onAddPlayer,
    onRemovePlayer,
}) => {
    return (
        <div className='grid grid-cols-2 gap-4'>
            <div className='p-4 bg-blue-100 rounded-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-bold text-blue-800'>Team A</h3>
                    <button
                        onClick={() => onAddPlayer("A")}
                        disabled={teamA.length >= 15}
                        className='px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50'
                    >
                        + Add Player
                    </button>
                </div>

                <ul className='space-y-2'>
                    {teamA.map((player) => (
                        <li
                            key={player.id}
                            className='flex justify-between items-center'
                        >
                            <span>Player #{player.number}</span>
                            <button
                                onClick={() => onRemovePlayer(player.id)}
                                className='text-red-500 hover:text-red-700'
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='p-4 bg-red-100 rounded-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-bold text-red-800'>Team B</h3>
                    <button
                        onClick={() => onAddPlayer("B")}
                        disabled={teamB.length >= 15}
                        className='px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50'
                    >
                        + Add Player
                    </button>
                </div>

                <ul className='space-y-2'>
                    {teamB.map((player) => (
                        <li
                            key={player.id}
                            className='flex justify-between items-center'
                        >
                            <span>Player #{player.number}</span>
                            <button
                                onClick={() => onRemovePlayer(player.id)}
                                className='text-red-500 hover:text-red-700'
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeamControls;
