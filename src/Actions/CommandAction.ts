import { EntityType } from "game/entity/IEntity";
import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import Commands from "../Commands";




/**
 * Player, area ID
 */
export default new Action(ActionArgument.Player, ActionArgument.String)
    .setUsableBy(EntityType.Human)
    .setHandler((action, player, args) => {
        if (!player) return;

        Commands.CmdAreas(null, player, args);

    });