
let counter = 1;

export class Player {

    constructor(
        public id: number = counter++,
        public x: number,
        public y: number,
        public speed: 1,
        public status: number = 0, // pending, joined
        public socket: SocketIO.Socket
    ) {

    }
}
