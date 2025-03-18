import React, { useState, useRef } from "react";
import Pitch from "./components/Pitch";
import Player from "./components/Player";
import Ball from "./components/Ball";
import AnimationControls from "./components/AnimationControls";
import TeamControls from "./components/TeamControls";
import ExportControls from "./components/ExportControls";
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
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Rugby Moves Visualiser</h1>

            <div className='flex flex-col space-y-4'>
                {/* Mode Selector */}
                <div className='flex space-x-2 mb-4'>
                    <button
                        onClick={() => handleModeChange("setup")}
                        className={`px-4 py-2 rounded-md ${
                            mode === "setup"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Setup
                    </button>
                    <button
                        onClick={() => handleModeChange("animate")}
                        className={`px-4 py-2 rounded-md ${
                            mode === "animate"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Create Movements
                    </button>
                    <button
                        onClick={() => handleModeChange("play")}
                        className={`px-4 py-2 rounded-md ${
                            mode === "play"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Play Animation
                    </button>
                </div>

                {/* Rugby Pitch */}
                <div
                    ref={pitchRef}
                    id='rugby-pitch'
                    className='relative cursor-pointer'
                >
                    <Pitch onClick={handlePitchClick}>
                        {mode === "play" ? (
                            // Show animated players and ball
                            <>
                                {players.map((player) => (
                                    <Player
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

                                <Ball
                                    position={currentFrame.ball}
                                    onPositionChange={() => {}}
                                    disabled={true}
                                />
                            </>
                        ) : (
                            // Show actual players and ball for setup/animation
                            <>
                                {players.map((player) => (
                                    <Player
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

                                <Ball
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
                                                stroke={
                                                    player.team === "A"
                                                        ? "#1E88E5"
                                                        : "#D32F2F"
                                                }
                                                strokeWidth='2'
                                                strokeDasharray='5,5'
                                            />
                                            <circle
                                                cx={movement.endPosition.x}
                                                cy={movement.endPosition.y}
                                                r='3'
                                                fill={
                                                    player.team === "A"
                                                        ? "#1E88E5"
                                                        : "#D32F2F"
                                                }
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
                                            stroke='#FFB300'
                                            strokeWidth='2'
                                            strokeDasharray='5,5'
                                        />
                                        <circle
                                            cx={movement.endPosition.x}
                                            cy={movement.endPosition.y}
                                            r='3'
                                            fill='#FFB300'
                                        />
                                    </g>
                                ))}
                            </svg>
                        )}
                    </Pitch>
                </div>

                {/* Controls based on current mode */}
                {mode === "setup" && (
                    <TeamControls
                        teamA={teamA}
                        teamB={teamB}
                        onAddPlayer={addPlayer}
                        onRemovePlayer={removePlayer}
                    />
                )}

                {mode === "animate" && (
                    <div className='p-4 bg-gray-100 rounded-lg'>
                        <div className='mb-4'>
                            <h3 className='font-bold mb-2'>
                                Animation Instructions:
                            </h3>
                            <ol className='list-decimal list-inside space-y-1'>
                                <li>Select a player by clicking on it</li>
                                <li>
                                    Click on the pitch to create a movement
                                    endpoint
                                </li>
                                <li>
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
                                className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50'
                            >
                                Pass Ball to Selected Player
                            </button>

                            <button
                                onClick={clearMovementPaths}
                                className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'
                            >
                                Clear All Movements
                            </button>
                        </div>
                    </div>
                )}

                {mode === "play" && (
                    <div className='space-y-4'>
                        <AnimationControls
                            isPlaying={animation.isPlaying}
                            onPlay={play}
                            onPause={pause}
                            onReset={reset}
                            duration={animationDuration}
                            onDurationChange={setAnimationDuration}
                        />

                        <ExportControls
                            onExportGif={handleExportGif}
                            isExporting={isExporting}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
