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
    loneWolf: boolean;

    roles: Role[];
    marks: Mark[];
};

export type Game = {
    id: number;
    players: Player[];
    state: "lobby" | "dusk" | "night" | "day" | "end";
    winners: Team[];
};