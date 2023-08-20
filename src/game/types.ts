import type { Context } from '~/bot/context'

export enum Team {
    Village = "village",
    Werewolf = "werewolf",
    Tanner = "tanner",
    Vampire = "vampire",
    Assassin = "assassin",
    Alien = "alien",
    Synth = "synth",
    Symbiote = "symbiote",
    Mortician = "Mortician"
    
}

export type Action = {
    fn: Function; // TODO: define more specific type
}

export type Role = {
    name: string;
    team: Team;
    descCommand: string;
    description: string;

    actions: Action[];
    doppleActions: Action[];
}

export type Mark = {}

export type Player = {
    id: number;
    name: string;
    role: Role;
    mark: Mark;
    actions: Action[];
};

export type GameSettings = {
    joinTimeout: number;
    duskTimeout?: number;
    nightTimeout: number;
    dayTimeout?: number;
    voteTimeout: number;
    
    loneWolf: boolean;
    revealHistory?: boolean;

    roles: Role[];
    marks: Mark[];
};

export type GameInfo = {
    id: string;
    ctx: Context;
    createdTime: Date;
    endTime: Date | undefined;

    players: Player[];
    state: "lobby" | "starting" | "dusk" | "night" | "day" | "end";
    winners: Team[];

    settings: GameSettings;
};