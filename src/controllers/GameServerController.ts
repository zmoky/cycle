import { IPlayer } from "common/models/IPlayer";
import { PlayerController } from "./PlayerController";
import { IGame, EGameStatus } from "../common/models/IGame";
import { GameController } from "./GameController";

let gameCounter = 1;

export class GameServerController {

    private connected: PlayerController[] = [];
    private playerMap: Map<number, PlayerController> = new Map();


    // game players
    // private gamePlayers: Map<number, GameSocketController[]> = new Map();

    private games: IGame[] = [];
    private gameControllerMap: Map<number, GameController> = new Map();

    constructor(private io: SocketIO.Server) {
        io.on("connect", this.connectedHandler);
    }

    private connectedHandler = (socket: SocketIO.Socket) => {
        console.log(`Client connected`);
        const playerController = new PlayerController(this, socket);
        this.playerMap.set(playerController.player.id, playerController);
        this.connected.push(playerController);
    }

    public newGame(playerController: PlayerController) {
        const id = gameCounter++;
        const game = {
            id,
            name: `Game ${id}`,
            status: EGameStatus.open
        };
        const gameController = new GameController(game, this.io);
        this.games.push(game);

        this.gameControllerMap.set(game.id, gameController);

        this.addGamePlayer(gameController, playerController);

        this.sendGames();

        return gameController;
    }

    public queryGames() {
        console.log(`Games list queried`);
        this.sendGames();
    }

    public queryPlayers(gameController: GameController) {
        console.log(`Players list queried for ${gameController.game.id}`);
        return this.io.to(`game-${gameController.game.id}`).emit("players", gameController.players);
    }

    public sendGames() {
        console.log(this.games);
        this.io.emit("games", this.games);
    }

    public addGamePlayer(gameController: GameController, playerController: PlayerController) {
        console.log(`Added player ${playerController.player.name} to ${gameController.game.id}`);

        gameController.addPlayer(playerController);

        this.joinGameRoom(gameController.game.id, playerController);

        this.queryPlayers(gameController);
    }

    public removeGamePlayer(gameController: GameController, playerController: PlayerController) {
        console.log(`Removed player ${playerController.player.name} from ${gameController.game.id}`);

        this.leaveGameRoom(gameController.game.id, playerController);
        gameController.removePlayer(playerController);

        if (gameController.players.length == 0) {
            console.log("Game remained empty and it will be closed");
            this.closeGame(gameController.game.id);
            return;
        }

        return this.queryPlayers(gameController);
    }

    public getGameController(game: number) {
        return this.gameControllerMap.get(game);
    }

    public joinGameRoom(game: number, playerController: PlayerController) {
        playerController.socket.join(`game-${game}`);
        playerController.socket.emit("game-joined", game);
    }

    public leaveGameRoom(game: number, playerController: PlayerController) {
        playerController.socket.leave(`game-${game}`);
        playerController.socket.emit("game-left", game);
    }


    private closeGame(game: number) {
        console.log(`Closing game ${game}`);
        this.games = this.games.filter((item) => item.id != game);
        this.queryGames();
    }
}
