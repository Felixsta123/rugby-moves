import React, { useState, useRef } from "react";
import Pitch from "./components/Pitch";
import CustomPlayer from "./components/CustomPlayer";
import CustomBall from "./components/CustomBall";
import { useMovementPaths } from "./hooks/useMovementPaths";
import { useAnimation } from "./hooks/useAnimation";
import { captureFrame, createGif, downloadBlob } from "./utils/exportHelpers";

const App: React.FC = () => {
    const pitchRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"setup" | "animate" | "play">("setup");
    const [animationDuration, setAnimationDuration] = useState(3000); // 3 seconds
    const [isExporting, setIsExporting] = useState(false);

    // Initialize movement paths with empty data
    const {
        players,
        ball,
        selectedPlayerId,
        addPlayer,
        removePlayer,
        updatePlayerPosition,
        updateBallPosition,
        selectPlayer,
        assignBallToPlayer,
        createPlayerMovement,
        createBallMovement,
        clearMovementPaths,
    } = useMovementPaths([], {
        position: { x: 200, y: 150 },
        movements: [],
    });

    // Initialize animation controller
    const { animation, play, pause, reset, currentFrame } = useAnimation(
        players,
        ball,
        animationDuration
    );

    // Handle clicks on the pitch to create movement paths
    const handlePitchClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mode !== "animate" || !pitchRef.current || !selectedPlayerId)
            return;

        const rect = pitchRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        createPlayerMovement(selectedPlayerId, { x, y }, animationDuration);
    };

    // Handle assigning the ball to a player
    const handleAssignBall = (playerId: string) => {
        assignBallToPlayer(playerId);
    };

    // Handle mode switching
    const handleModeChange = (newMode: "setup" | "animate" | "play") => {
        if (newMode === "play") {
            reset();
        }

        setMode(newMode);
    };

    // Handle exporting the animation as a GIF
    const handleExportGif = async () => {
        if (!pitchRef.current) return;

        setIsExporting(true);

        try {
            // Switch to play mode and reset the animation
            handleModeChange("play");
            reset();

            // Capture frames
            const frames: string[] = [];
            const frameCount = 30; // Number of frames to capture

            for (let i = 0; i < frameCount; i++) {
                // Calculate the progress and set the animation frame
                const progress = i / (frameCount - 1);
                const frameIndex = Math.floor(
                    progress * (animation.frames.length - 1)
                );

                // Manually update the current frame (we're doing this outside the animation loop)
                play();

                // Wait for the UI to update
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Capture the frame
                const frameUrl = await captureFrame("rugby-pitch");
                frames.push(frameUrl);
            }

            // Create and download the GIF
            const gifBlob = await createGif(
                frames,
                animationDuration / frameCount
            );

            downloadBlob(gifBlob, "rugby-move.gif");
        } catch (error) {
            console.error("Error exporting GIF:", error);
        } finally {
            setIsExporting(false);
            reset();
        }
    };

    // Filter players by team
    const teamA = players.filter((p) => p.team === "A");
    const teamB = players.filter((p) => p.team === "B");

    return (
        <div className='container'>
            <h1>Rugby Moves Visualiser</h1>

            <div className='flex-col space-y-4'>
                {/* Mode Selector */}
                <div className='mode-selector'>
                    <button
                        onClick={() => handleModeChange("setup")}
                        className={`mode-button ${
                            mode === "setup" ? "active" : ""
                        }`}
                    >
                        Setup
                    </button>
                    <button
                        onClick={() => handleModeChange("animate")}
                        className={`mode-button ${
                            mode === "animate" ? "active" : ""
                        }`}
                    >
                        Create Movements
                    </button>
                    <button
                        onClick={() => handleModeChange("play")}
                        className={`mode-button ${
                            mode === "play" ? "active" : ""
                        }`}
                    >
                        Play Animation
                    </button>
                </div>

                {/* Rugby Pitch */}
                <div ref={pitchRef} id='rugby-pitch' className='relative'>
                    <Pitch onClick={handlePitchClick}>
                        {mode === "play" ? (
                            // Show animated players and ball
                            <>
                                {players.map((player) => (
                                    <CustomPlayer
                                        key={player.id}
                                        player={{
                                            ...player,
                                            position:
                                                currentFrame.players[
                                                    player.id
                                                ] || player.position,
                                        }}
                                        onPositionChange={() => {}}
                                        onSelect={() => {}}
                                        disabled={true}
                                    />
                                ))}

                                <CustomBall
                                    position={currentFrame.ball}
                                    onPositionChange={() => {}}
                                    disabled={true}
                                />
                            </>
                        ) : (
                            // Show actual players and ball for setup/animation
                            <>
                                {players.map((player) => (
                                    <CustomPlayer
                                        key={player.id}
                                        player={player}
                                        onPositionChange={updatePlayerPosition}
                                        onSelect={(id) => {
                                            if (mode === "setup") {
                                                handleAssignBall(id);
                                            }
                                            selectPlayer(id);
                                        }}
                                        disabled={
                                            mode === "animate" &&
                                            player.id !== selectedPlayerId
                                        }
                                    />
                                ))}

                                <CustomBall
                                    position={ball.position}
                                    onPositionChange={updateBallPosition}
                                    disabled={!!ball.holder}
                                />
                            </>
                        )}

                        {/* Display player movement paths during animation mode */}
                        {mode === "animate" && (
                            <svg className='absolute inset-0 pointer-events-none'>
                                {players.map((player) =>
                                    player.movements.map((movement) => (
                                        <g key={movement.id}>
                                            <line
                                                x1={movement.startPosition.x}
                                                y1={movement.startPosition.y}
                                                x2={movement.endPosition.x}
                                                y2={movement.endPosition.y}
                                                className={`movement-path ${
                                                    player.team === "A"
                                                        ? "team-a-path"
                                                        : "team-b-path"
                                                }`}
                                            />
                                            <circle
                                                cx={movement.endPosition.x}
                                                cy={movement.endPosition.y}
                                                className={`endpoint ${
                                                    player.team === "A"
                                                        ? "team-a-endpoint"
                                                        : "team-b-endpoint"
                                                }`}
                                            />
                                        </g>
                                    ))
                                )}

                                {ball.movements.map((movement) => (
                                    <g key={movement.id}>
                                        <line
                                            x1={movement.startPosition.x}
                                            y1={movement.startPosition.y}
                                            x2={movement.endPosition.x}
                                            y2={movement.endPosition.y}
                                            className='movement-path ball-path'
                                        />
                                        <circle
                                            cx={movement.endPosition.x}
                                            cy={movement.endPosition.y}
                                            className='endpoint ball-endpoint'
                                        />
                                    </g>
                                ))}
                            </svg>
                        )}
                    </Pitch>
                </div>

                {/* Controls based on current mode */}
                {mode === "setup" && (
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='team-container team-a-container'>
                            <div className='team-header'>
                                <h3 className='team-a-header'>Team A</h3>
                                <button
                                    onClick={() => addPlayer("A")}
                                    disabled={teamA.length >= 15}
                                    className='btn btn-blue'
                                >
                                    + Add Player
                                </button>
                            </div>

                            <ul className='player-list'>
                                {teamA.map((player) => (
                                    <li
                                        key={player.id}
                                        className='player-list-item'
                                    >
                                        <span>Player #{player.number}</span>
                                        <button
                                            onClick={() =>
                                                removePlayer(player.id)
                                            }
                                            className='remove-btn'
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='team-container team-b-container'>
                            <div className='team-header'>
                                <h3 className='team-b-header'>Team B</h3>
                                <button
                                    onClick={() => addPlayer("B")}
                                    disabled={teamB.length >= 15}
                                    className='btn btn-red'
                                >
                                    + Add Player
                                </button>
                            </div>

                            <ul className='player-list'>
                                {teamB.map((player) => (
                                    <li
                                        key={player.id}
                                        className='player-list-item'
                                    >
                                        <span>Player #{player.number}</span>
                                        <button
                                            onClick={() =>
                                                removePlayer(player.id)
                                            }
                                            className='remove-btn'
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {mode === "animate" && (
                    <div className='controls-container'>
                        <div className='instructions'>
                            <h3 className='font-bold mb-2'>
                                Animation Instructions:
                            </h3>
                            <ol className='instructions-list'>
                                <li className='instructions-item'>
                                    Select a player by clicking on it
                                </li>
                                <li className='instructions-item'>
                                    Click on the pitch to create a movement
                                    endpoint
                                </li>
                                <li className='instructions-item'>
                                    Create multiple movements to build a
                                    sequence
                                </li>
                            </ol>
                        </div>

                        <div className='flex space-x-4'>
                            <button
                                onClick={() => {
                                    if (selectedPlayerId) {
                                        const selectedPlayer = players.find(
                                            (p) => p.id === selectedPlayerId
                                        );
                                        if (selectedPlayer) {
                                            createBallMovement(
                                                selectedPlayer.position,
                                                animationDuration
                                            );
                                        }
                                    }
                                }}
                                disabled={!selectedPlayerId}
                                className='btn btn-yellow'
                            >
                                Pass Ball to Selected Player
                            </button>

                            <button
                                onClick={clearMovementPaths}
                                className='btn btn-red'
                            >
                                Clear All Movements
                            </button>
                        </div>
                    </div>
                )}

                {mode === "play" && (
                    <div className='flex-col space-y-4'>
                        <div className='controls-container'>
                            <div className='animation-controls'>
                                <button
                                    onClick={animation.isPlaying ? pause : play}
                                    className='btn btn-blue'
                                >
                                    {animation.isPlaying ? "Pause" : "Play"}
                                </button>

                                <button
                                    onClick={reset}
                                    className='btn btn-gray'
                                >
                                    Reset
                                </button>

                                <div className='duration-control'>
                                    <label
                                        htmlFor='duration'
                                        className='text-sm font-medium'
                                    >
                                        Duration (seconds):
                                    </label>
                                    <input
                                        id='duration'
                                        type='number'
                                        min='1'
                                        max='10'
                                        value={animationDuration / 1000}
                                        onChange={(e) =>
                                            setAnimationDuration(
                                                Number(e.target.value) * 1000
                                            )
                                        }
                                        className='duration-input'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='export-controls'>
                            <button
                                onClick={handleExportGif}
                                disabled={isExporting}
                                className='btn btn-green'
                            >
                                {isExporting ? "Exporting..." : "Export as GIF"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
