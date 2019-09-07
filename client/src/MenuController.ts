import $ from "jquery";
import { GameClientController } from "GameClientController";
import { GameEvent } from "GameEvent";
import { IPlayer } from "common/models/IPlayer";

const MENU_MAIN = "#menu-overlay > .main";
const MENU_NEW = "#menu-overlay > .new";
const MENU_JOIN = "#menu-overlay > .join";
const MENU_LOBBY = "#menu-overlay > .lobby";

export class MenuController {

    private current;

    constructor(private game: GameClientController) {
        $(window).on("keyup", this.keyHandler);
        $("body").click(this.menuClickHandler);

        this.game.on(GameEvent.RECEIVED_PLAYERS, this.playersUpdateHandler);
        this.game.on(GameEvent.JOINED, this.gameJoinedHandler);
        this.game.on(GameEvent.LEFT, this.gameLeftHandler);
        this.game.on(GameEvent.START, () => {
            this.closeCurrent();
        });
    }

    public open(menuSelector: string = MENU_MAIN) {
        this.closeCurrent();
        this.current = $(menuSelector);
        this.current.show();
    }

    private keyHandler = (ev: JQuery.KeyUpEvent) => {
        console.log(`Key press: ${ev.key}`);
        switch (ev.key) {
            case "Up":
                break;
            case "Down":
                break;
            case "Enter":
                break;
            case "ArrowLeft":
                this.game.turnLeft();
                break;
            case "ArrowRight":
                this.game.turnRight();
                break;
            case "Esc":
            case "Escape":
                this.open(MENU_MAIN);
                break;

        }
    }

    private closeCurrent() {
        if (this.current) {
            $(this.current).hide();
            delete this.current;
        }
    }

    private startGame() {
        this.game.newGame();
    }

    private menuClickHandler = (ev: JQuery.ClickEvent) => {
        console.log(`Menu clicked ${$(ev.target).data("menu")}`);
        switch ($(ev.target).data("menu")) {
            case "new":
                this.open(MENU_NEW);
                break;
            case "main":
                this.open(MENU_MAIN);
                break;
            case "join":
                this.queryGames();
                this.open(MENU_JOIN);
                break;
            case "leave":
                this.leaveGame();
                this.open(MENU_MAIN);
                break;
            case "ready":
                this.readyGame();
                break;
            case "lobby":
                this.game.join($(ev.target).data("game"));
                this.open(MENU_LOBBY);
                break;
            case "start":
                this.startGame();
                break;
        }
    }

    private gameJoinedHandler = () => {
        this.open(MENU_LOBBY);
    }

    private queryGames() {
        this.game.queryGames();
    }

    private leaveGame() {
        this.game.leave();
    }

    private readyGame() {
        this.game.ready();
    }

    private playersUpdateHandler = (players: IPlayer[]) => {
        const playersList = $("#players");
        playersList.empty();
        for (const player of players) {
            const status = player.ready ? " ( ready )" : "";
            playersList.append(`<div class="menu-item player">${player.name}${status}</div>`);
        }
    }

    private gameLeftHandler = () => {
        this.open(MENU_MAIN);
    }

}
