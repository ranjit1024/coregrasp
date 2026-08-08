import { Bindings } from "../shared/types";

export class NOTIF_HUB {
    constructor(private state:DurableObject, private env: Bindings){};
    async fetch(req:Request){
        const upgrade = req.headers.get("Upgrade");
        if(upgrade === "websocket"){
            const pair = new WebSocketPair();
            const [client, server]  = Object.values(pair);
            
        }   
    }
}