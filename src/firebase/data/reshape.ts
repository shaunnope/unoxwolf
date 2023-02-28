
import { Message } from "@grammyjs/types";
import { SavedText } from "../../app/types";

const tags = {
    "bold": "*",
    "italic": "_",
    "underline": "__",
    "strikethrough": "~",
    "spoiler": "||"
}

/**
 * Converts a Message object to a SavedText object
 * @param msg 
 * @returns 
 */
 export function parseMessageG(msg: Message) {
    let sender = (msg.from?.first_name === undefined ? "" : msg.from?.first_name) + msg.from?.last_name;
    if (sender == "") sender = "User";

    // TODO: Markdown handling
    const entities = msg.entities;
    if (entities !== undefined) {
        for (const ent of entities) {
            switch (ent.type) {                
                case "bold":
                    break;
                
                case "italic":
                    break;

                case "underline":
                    break;

                case "strikethrough":
                    break;

                case "spoiler":
                    break;
            
            }
        }
    }

    const msg_id = msg.from?.id || -1;

    const parsed = new SavedText(msg_id, sender, msg.text, msg.date);
    
    return parsed;
}
