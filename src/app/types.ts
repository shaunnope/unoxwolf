import { Context } from "grammy";

export interface SessionData {
    heyCounter: number;
    savedMessages?: SavedText[];
}  
export interface BotContext extends Context {
    session?: SessionData
}

export type Message = {
    from: string;
    chat?: string;
    text: string;
    date: string;
}

export interface Loggable {
    type: string
}

export class SavedText implements Loggable{
    type = "saved_messages";

    uid: number;
    from: string;
    chat?: string;
    text: string;
    date: number;

    constructor(uid: number, from: string, text: any, date: any) {
        this.uid = uid;
        this.from = from;
        this.text = text;
        this.date = date;
    }

    toString() {
        return "*Saved " + this.date +"*\n"+ this.text + "\n"
    }
}

export class User implements Loggable {
    type = "users";

    uid: number;
    state?: string;

    constructor(uid: number, state?: string) {
        this.uid = uid
        this.state = state
    }
}
