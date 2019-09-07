import { GameClientController } from "GameClientController";
import { GameEvent } from "GameEvent";
import { IBike } from "common/models/IBike";
import SVG from "svg.js";
import { IWall } from "common/models/IWall";

export class GameViewportController {

    private bikeMap: Map<number, JQuery<HTMLElement>>;
    private bikeLine: Map<number, SVG.Line>;
    private readonly colors = ["#df740c", "#6fc3df"];


    private viewport;

    constructor(private game: GameClientController, private io: SocketIOClient.Socket, private g: SVG.Doc) {
        game.on(GameEvent.START, this.startHandler);
        game.on(GameEvent.END, this.endHandler);

        io.on("bikes", this.bikesHandler);
        io.on("wall", this.wallHandler);

        this.viewport = $("#viewport");
    }

    private bikesHandler = (bikes: IBike[]) => {

        if (!this.bikeMap) {

            this.bikeMap = new Map();
            this.bikeLine = new Map();

            let index = 0;

            for (const bike of bikes) {
                const bikeElement = $(`<div class="bike"></div>`);
                this.viewport.append(bikeElement);
                this.bikeMap.set(bike.id, bikeElement);

                const line = this.g.line(bike.x0, bike.y0, bike.x, bike.y)
                    .fill("none").stroke({ color: this.colors[index], width: 3 });
                this.bikeLine.set(bike.id, line);
                index++;
            }


        }

        for (const bike of bikes) {
            this.bikeMap.get(bike.id).css("left", `${bike.x}px`);
            this.bikeMap.get(bike.id).css("top", `${bike.y}px`);

            this.bikeLine.get(bike.id).plot(bike.x0, bike.y0, bike.x, bike.y);
        }

    }

    private wallHandler = (wall: IWall) => {
        const line = this.g.line(wall.l[0], wall.l[1], wall.l[2], wall.l[3])
            .fill("none").stroke({ color: "#ffffff", width: 3 });
    }

    private startHandler = () => {
        this.bikeMap = undefined;
        $("#viewport").show();
        $("#messages").hide();

    }

    private endHandler = () => {
        $("#viewport").hide();
        $("#messages").show();
    }

}
