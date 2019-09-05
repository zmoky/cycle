import socketio from "socket.io-client";

export const GAME_STATE_NONE = 0;
export const GAME_STATE_INGAME = 1;

export enum GameState {
    GAME_STATE_NONE = 0,
    GAME_STATE_INGAME = 1

}

export class GameController {
    private _state: GameState = GameState.GAME_STATE_NONE;

    constructor(io: any) {

    }

    public get state() {
        return this._state;
    }
}
