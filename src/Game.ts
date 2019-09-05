import { Player } from "Player";
import { LightCycle } from "Lightcycle";

let counter = 1;

export class Game {

    private players: Player[] = [];
    private cycles: LightCycle[] = [];
    private id: number;

    constructor(private io: SocketIO.Server) {
        this.id = counter++;
    }

    public addPlayer(player: Player) {
        this.players.push(player);
        player.socket.join(`game-${this.id}`);
    }

    public start() {
        const index = 1;
        for (const player of this.players) {
            if (player.status == 1) {
                this.cycles.push({
                    playerId: player.id,
                    x: 100 + index * 30,
                    y: 0,
                    dx: 0,
                    dy: 1,
                    s: 1
                });
            }
        }
        setInterval(this.tick, 40);
    }

    private tick = () => {
        // tick frame
        for (const cycle of this.cycles) {
            cycle.x += cycle.s * cycle.dx;
            cycle.y += cycle.s * cycle.dy;
        }
        this.io.to(`game-${this.id}`).emit("cycles", this.cycles);
    }
}
