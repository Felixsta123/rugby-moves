import { useState, useEffect, useRef } from "react";
import { Player, Ball, Animation, AnimationFrame, Position } from "../types";

export const useAnimation = (
    players: Player[],
    ball: Ball,
    duration: number
) => {
    const [animation, setAnimation] = useState<Animation>({
        frames: [],
        duration,
        currentFrame: 0,
        isPlaying: false,
    });

    const animationRef = useRef<number>(0);

    // Generate frames based on player and ball movements
    const generateFrames = () => {
        const frameCount = 60; // 60 frames per animation
        const frames: AnimationFrame[] = Array(frameCount)
            .fill(null)
            .map((_, i) => {
                const progress = i / (frameCount - 1);

                // Calculate player positions for this frame
                const playerPositions: Record<string, Position> = {};

                players.forEach((player) => {
                    if (player.movements.length === 0) {
                        playerPositions[player.id] = { ...player.position };
                    } else {
                        // For simplicity, we'll just use the last movement
                        const movement =
                            player.movements[player.movements.length - 1];
                        playerPositions[player.id] = interpolatePosition(
                            movement.startPosition,
                            movement.endPosition,
                            progress
                        );
                    }
                });

                // Calculate ball position for this frame
                let ballPosition;
                let ballHolder;

                if (ball.movements.length === 0) {
                    ballPosition = { ...ball.position };
                    ballHolder = ball.holder;
                } else {
                    // For simplicity, we'll just use the last movement
                    const movement = ball.movements[ball.movements.length - 1];
                    ballPosition = interpolatePosition(
                        movement.startPosition,
                        movement.endPosition,
                        progress
                    );

                    // Determine ball holder (if any) for this frame
                    if (ball.holder) {
                        ballHolder = ball.holder;
                    }
                }

                return {
                    players: playerPositions,
                    ball: ballPosition,
                    ballHolder,
                };
            });

        setAnimation((prev) => ({
            ...prev,
            frames,
            currentFrame: 0,
        }));
    };

    // Helper function to interpolate between two positions
    const interpolatePosition = (
        start: Position,
        end: Position,
        progress: number
    ): Position => {
        return {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress,
        };
    };

    // Handle play, pause, reset functions
    const play = () => {
        setAnimation((prev) => ({ ...prev, isPlaying: true }));
    };

    const pause = () => {
        setAnimation((prev) => ({ ...prev, isPlaying: false }));
    };

    const reset = () => {
        setAnimation((prev) => ({
            ...prev,
            currentFrame: 0,
            isPlaying: false,
        }));
    };

    // Handle animation loop
    useEffect(() => {
        if (animation.isPlaying) {
            const frameInterval = animation.duration / animation.frames.length;

            animationRef.current = window.setTimeout(() => {
                if (animation.currentFrame < animation.frames.length - 1) {
                    setAnimation((prev) => ({
                        ...prev,
                        currentFrame: prev.currentFrame + 1,
                    }));
                } else {
                    setAnimation((prev) => ({
                        ...prev,
                        isPlaying: false,
                    }));
                }
            }, frameInterval);
        }

        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, [
        animation.isPlaying,
        animation.currentFrame,
        animation.frames.length,
        animation.duration,
    ]);

    // Update frames when players, ball, or duration changes
    useEffect(() => {
        generateFrames();
    }, [players, ball, duration]);

    return {
        animation,
        play,
        pause,
        reset,
        currentFrame: animation.frames[animation.currentFrame] || {
            players: {},
            ball: { x: 0, y: 0 },
        },
    };
};
