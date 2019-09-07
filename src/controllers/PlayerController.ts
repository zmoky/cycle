import { GameServerController } from "./GameServerController";
import { IPlayer } from "common/models/IPlayer";
import { IGame } from "common/models/IGame";
import { GameController } from "./GameController";
import { IBike } from "common/models/IBike";

let counter = 1;
export class PlayerController {
    private _currentGame: GameController;
    private _player: IPlayer;
    private _socket: SocketIO.Socket;
    public bike: IBike;

    constructor(private game: GameServerController, socket: SocketIO.Socket) {
        const id = counter++;
        this._socket = socket;
        this._player = {
            id,
            name: `Player ${id}`,
            ready: false
        };
        socket.on("games", this.queryGamesHandler);
        socket.on("join", this.joinGameHandler);
        socket.on("left", this.leftHandler);
        socket.on("right", this.rightHandler);
        socket.on("leave", this.leaveGameHandler);
        socket.on("create", this.createGameHandler);
        socket.on("ready", this.toggleReadyHandler);
        socket.on("disconnect", this.disconnectHandler);

    }

    public get player(): IPlayer {
        return this._player;
    }

    public get socket(): SocketIO.Socket {
        return this._socket;
    }

    public get currentGame(): GameController {
        return this._currentGame;
    }

    private queryGamesHandler = () => {
        this.game.queryGames();
    }

    private createGameHandler = () => {
        console.log(`Game start ... `);
        this._currentGame = this.game.newGame(this);
    }

    private joinGameHandler = (game: number) => {
        if (this.currentGame) {
            this.game.removeGamePlayer(this.currentGame, this);
            this._currentGame = undefined;
        }
        this._currentGame = this.game.getGameController(game);

        this.game.addGamePlayer(this.currentGame, this);
        this.game.queryPlayers(this.currentGame);
    }

    private leaveGameHandler = () => {
        this.game.removeGamePlayer(this.currentGame, this);
        this.game.queryPlayers(this.currentGame);
        this._currentGame = undefined;
    }

    private toggleReadyHandler = () => {
        this.player.ready = !this.player.ready;
        this.currentGame.updateReadiness();
        this.game.queryPlayers(this.currentGame);
    }

    private leftHandler = () => {
        if (!this.bike) {
            return;
        }

        console.log(`Left on ${this.player.id}`);
        this.changeDirection();
        this.bike.d = Math.abs((this.bike.d + 4 - 1) % 4);
    }

    private changeDirection() {
        this.currentGame.addWall(this.bike.id, [this.bike.x0, this.bike.y0, this.bike.x, this.bike.y]);
        this.bike.x0 = this.bike.x;
        this.bike.y0 = this.bike.y;
    }


    private rightHandler = () => {
        if (!this.bike) {
            return;
        }

        console.log(`Right on ${this.player.id}`);
        this.changeDirection();
        this.bike.d = Math.abs((this.bike.d + 4 + 1) % 4);

    }


    private disconnectHandler = () => {
        if (this.currentGame) {
            this.game.removeGamePlayer(this.currentGame, this);
            this.game.queryPlayers(this.currentGame);
            this._currentGame = undefined;
        }

    }
}
