import { Player } from "Player";
import { PlayerController } from "./PlayerController";
import { IPlayer } from "common/models/IPlayer";
import { IGame } from "common/models/IGame";
import { IBike } from "common/models/IBike";
import { IWall } from "common/models/IWall";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

export class GameController {
    public players: IPlayer[] = [];
    public playerControllers: PlayerController[] = [];

    private state: number = 0;
    private startTimeout: NodeJS.Timeout;

    private bikes: IBike[] = [];

    private lines: IWall[] = [];

    private exit = false;

    constructor(public readonly game: IGame, private io: SocketIO.Server) {

    }

    public addPlayer(playerController: PlayerController) {
        this.players.push(playerController.player);
        this.playerControllers.push(playerController);
        this.updateReadiness();
    }

    public removePlayer(playerController: PlayerController) {
        this.players = this.players.filter((item) => item !== playerController.player);
        this.playerControllers = this.playerControllers.filter((item) => item !== playerController);
        this.updateReadiness();
    }

    public updateReadiness() {
        clearTimeout(this.startTimeout);
        let readiness = 0;
        for (const player of this.players) {
            if (player.ready) {
                readiness++;
            }
        }

        if (readiness > 1) {
            this.io.to(`game-${this.game.id}`).emit("message", "Game is ready to begin");
            this.startTimeout = setInterval(this.startIteration, 1000);
        } else {
            this.io.to(`game-${this.game.id}`).emit("message", "Game will wait for at least two players");
        }

    }

    private startIteration = () => {
        if (this.state == 3) {
            clearTimeout(this.startTimeout);
            this.io.to(`game-${this.game.id}`).emit("message", `Game is starting ...`);
            this.startGame();
        } else {
            this.io.to(`game-${this.game.id}`).emit("message", `Game will start in ${3 - this.state} seconds ...`);
            this.state++;
        }

    }

    private startGame() {
        this.io.to(`game-${this.game.id}`).emit("start", this.game.id);

        let side = 0;

        for (const playerController of this.playerControllers) {
            if (playerController.player.ready) {
                const bike = {
                    id: playerController.player.id,
                    x: MAP_WIDTH / 2,
                    y: MAP_HEIGHT * side,
                    x0: MAP_WIDTH / 2,
                    y0: MAP_HEIGHT * side,
                    s: 5,
                    d: side ? 3 : 1
                };
                playerController.bike = bike;
                this.bikes.push(bike);
            }

            side = 1;
        }

        this.tick();
    }

    private tick = () => {

        for (const bike of this.bikes) {
            bike.x += ((1 - bike.d) % 2) * bike.s;
            bike.y += ((2 - bike.d) % 2) * bike.s;
            console.log(`Bike ${bike.id} ${bike.x} ${bike.y} ---- ${bike.d} : ${bike.s}`);

            this.checkHitPoint(bike);
        }

        this.io.to(`game-${this.game.id}`).emit("bikes", this.bikes);

        if (!this.exit) {
            setTimeout(this.tick, 1000 / 25);
        }
    }

    private checkHitPoint(bike: IBike) {
        if (bike.x < 0 || bike.y < 0) {
            return this.exit = true;
        }
        if (bike.x > MAP_WIDTH || bike.y > MAP_HEIGHT) {
            return this.exit = true;
        }

        // check against line
        for (const line of this.lines) {
            // if (line[0])
        }

        // check against other bikes
    }

    public addWall(id: number, line: number[]) {
        const wall = {
            i: id,
            l: line
        };
        this.lines.push(wall);
        this.io.to(`game-${this.game.id}`).emit("wall", wall);
    }

}

