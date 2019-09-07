
type CallBack = (data?: any) => void;

export class EventEmitter {
    private map: Map<string, CallBack[]> = new Map();
    public on(event: string, callback: CallBack) {
        const handlers = this.map.get(event);

        if (handlers) {
            return handlers.push(callback);
        }

        this.map.set(event, [callback]);
    }

    public off(event: string, callback: () => void) {
        const handlers = this.map.get(event);

        if (handlers) {
            this.map.set(event, handlers.filter((item) => item !== callback));
        }

    }

    public emit(event: string, data?: any) {
        const handlers = this.map.get(event);
        if (!handlers) {
            return;
        }
        for (const callback of handlers) {
            callback(data);
        }
    }
}
