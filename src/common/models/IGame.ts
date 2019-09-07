export enum EGameStatus {
    open = 0,
    running = 1,
    closed = 2
}

export interface IGame {
    id: number;
    name: string;
    status: EGameStatus;
}
