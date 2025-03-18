import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Player, Ball, Position, Movement } from "../types";

export const useMovementPaths = (
    initialPlayers: Player[],
    initialBall: Ball
) => {
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [ball, setBall] = useState<Ball>(initialBall);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
        null
    );

    // Add a new player to a team
    const addPlayer = (team: "A" | "B") => {
        const teamPlayers = players.filter((p) => p.team === team);

        if (teamPlayers.length >= 15) return; // Max 15 players per team

        const newPlayer: Player = {
            id: uuidv4(),
            number: teamPlayers.length + 1,
            team,
            position: {
                x: team === "A" ? 100 : 300,
                y: 150 + teamPlayers.length * 20,
            },
            movements: [],
            selected: false,
        };

        setPlayers([...players, newPlayer]);
    };

    // Remove a player
    const removePlayer = (id: string) => {
        setPlayers(players.filter((p) => p.id !== id));

        // If the removed player was holding the ball, reset the ball holder
        if (ball.holder === id) {
            setBall({
                ...ball,
                holder: undefined,
            });
        }
    };

    // Update player position
    const updatePlayerPosition = (id: string, position: Position) => {
        setPlayers(players.map((p) => (p.id === id ? { ...p, position } : p)));

        // If this player is holding the ball, update the ball position too
        if (ball.holder === id) {
            setBall({
                ...ball,
                position,
            });
        }
    };

    // Update ball position
    const updateBallPosition = (position: Position) => {
        setBall({
            ...ball,
            position,
        });
    };

    // Select a player
    const selectPlayer = (id: string | null) => {
        setSelectedPlayerId(id);

        setPlayers(
            players.map((p) => ({
                ...p,
                selected: p.id === id,
            }))
        );
    };

    // Assign ball to a player
    const assignBallToPlayer = (playerId: string | undefined) => {
        if (playerId) {
            const player = players.find((p) => p.id === playerId);

            if (player) {
                setBall({
                    ...ball,
                    position: player.position,
                    holder: playerId,
                });
            }
        } else {
            setBall({
                ...ball,
                holder: undefined,
            });
        }
    };

    // Create a movement path for a player
    const createPlayerMovement = (
        playerId: string,
        endPosition: Position,
        duration: number = 1000
    ) => {
        const player = players.find((p) => p.id === playerId);

        if (!player) return;

        const movement: Movement = {
            id: uuidv4(),
            startPosition: { ...player.position },
            endPosition,
            duration,
        };

        setPlayers(
            players.map((p) =>
                p.id === playerId
                    ? { ...p, movements: [...p.movements, movement] }
                    : p
            )
        );
    };

    // Create a movement path for the ball
    const createBallMovement = (
        endPosition: Position,
        duration: number = 1000
    ) => {
        const movement: Movement = {
            id: uuidv4(),
            startPosition: { ...ball.position },
            endPosition,
            duration,
        };

        setBall({
            ...ball,
            movements: [...ball.movements, movement],
            holder: undefined, // Ball is no longer held by a player when it moves independently
        });
    };

    // Clear all movement paths
    const clearMovementPaths = () => {
        setPlayers(
            players.map((p) => ({
                ...p,
                movements: [],
            }))
        );

        setBall({
            ...ball,
            movements: [],
        });
    };

    return {
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
    };
};
