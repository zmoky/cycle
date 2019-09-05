import $ from "jquery";
import { GameController } from "GameController";

const MENU_MAIN = "#menu-overlay > .main";
const MENU_NEW = "#menu-overlay > .new";
const MENU_JOIN = "#menu-overlay > .join";
const MENU_LOBBY = "#menu-overlay > .lobby";

export class MenuController {

    private current;

    constructor(game: GameController) {
        $(window).on("keyup", this.keyHandler);

        $("body").click(this.menuClickHandler);
    }

    public open() {
        //
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
            case "Left":
                break;
            case "Right":
                break;
            case "Esc":
            case "Escape":
                this.openMain();
                break;

        }
    }

    private closeCurrent() {
        if (this.current) {
            $(this.current).hide();
            delete this.current;
        }
    }

    public openMain() {
        this.closeCurrent();

        this.current = $(MENU_MAIN);
        $(this.current).show();
    }

    public openNew() {
        this.closeCurrent();

        this.current = $(MENU_NEW);
        $(this.current).show();
    }

    public openJoin() {
        this.closeCurrent();

        this.current = $(MENU_JOIN);
        $(this.current).show();
    }

    public openLobby() {
        this.closeCurrent();

        this.current = $(MENU_LOBBY);
        $(this.current).show();
    }

    private menuClickHandler = (ev: Event) => {
        switch ($(ev.target).data("menu")) {
            case "new":
                this.openNew();
                break;
            case "main":
                this.openMain();
                break;
            case "join":
                this.openJoin();
                break;
            case "lobby":
                this.openLobby();
                break;
            case "ready":
                if ($(ev.target).text() == "Ready (No)") {
                    $(ev.target).text("Ready (Yes)");
                } else {
                    $(ev.target).text("Ready (No)");
                }
                break;

        }
    }
}
