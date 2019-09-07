import { EventEmitter } from "EventEmitter";
import { GameEvent } from "GameEvent";
import { IGame } from "common/models/IGame";

export const GAME_STATE_NONE = 0;
export const GAME_STATE_INGAME = 1;

export enum GameState {
    GAME_STATE_NONE = 0,
    GAME_STATE_INGAME = 1

}

export class GameClientController extends EventEmitter {
    private _state: GameState = GameState.GAME_STATE_NONE;
    private _currentGame: number;

    constructor(private io: SocketIOClient.Socket) {
        super();
        io.on("games", this.gamesReceiveHandler);
        io.on("players", this.playersHandler);
        io.on("start", this.startHandler);
        io.on("game-joined", this.gameJoinedHandler);
        io.on("game-left", this.gameLeftHandler);
        io.on("message", this.messageHandler);

    }

    public get state() {
        return this._state;
    }

    public ready() {
        if (this._currentGame) {
            this.io.emit("ready");
        }
    }

    public queryGames() {
        this.io.emit("games");
    }

    public newGame() {
        this.io.emit("create");
    }

    public turnLeft() {
        this.io.emit("left");
    }

    public turnRight() {
        this.io.emit("right");
    }

    public join(game: number) {
        this.io.emit("join", game);
    }

    public leave() {
        this.io.emit("leave", this._currentGame);
    }

    private gamesReceiveHandler = (games: IGame[]) => {
        const gamesDom = $("#games").empty();
        for (const game of games) {
            gamesDom.append(`<div class="menu-item" data-menu="lobby" data-game="${game.id}">${game.name}</div>`);
        }
        this.emit(GameEvent.RECEIVED_GAMES, games);

    }

    private gameJoinedHandler = (game: number) => {
        this._currentGame = game;
        this.emit(GameEvent.JOINED, game);
    }

    private gameLeftHandler = () => {
        this.emit(GameEvent.LEFT);
    }

    private playersHandler = (data) => {
        this.emit(GameEvent.RECEIVED_PLAYERS, data);
    }

    private startHandler = (game) => {
        if (this._currentGame == game) {
            this.emit(GameEvent.START);
        }
    }

    private messageHandler = (message) => {
        const messagesPanel = $("#messages");
        messagesPanel.append(`${message}<br/>`);
        messagesPanel.scrollTop(messagesPanel[0].scrollHeight);
    }

}
