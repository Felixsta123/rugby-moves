export interface Position {
    x: number;
    y: number;
}

export interface Movement {
    id: string;
    startPosition: Position;
    endPosition: Position;
    duration: number;
}

export interface Player {
    id: string;
    number: number;
    team: "A" | "B";
    position: Position;
    movements: Movement[];
    selected: boolean;
}

export interface Ball {
    position: Position;
    movements: Movement[];
    holder?: string; // player ID of ball holder
}

export interface AnimationFrame {
    players: Record<string, Position>;
    ball: Position;
    ballHolder?: string;
}

export interface Animation {
    frames: AnimationFrame[];
    duration: number;
    currentFrame: number;
    isPlaying: boolean;
}
