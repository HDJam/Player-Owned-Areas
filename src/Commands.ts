import Log from "utilities/Log";
import { DataManager } from "./DataManager";
import Register from "mod/ModRegistry";
import { MessageType } from "game/entity/player/IMessageManager";
import Player from "game/entity/player/Player";
import Areas, { Area, AreaSettings } from "./Areas";
import { ModSettings } from "./ModSettings";
import { IAreaData } from "./IDataSave";
import Message from "language/dictionary/Message";
import { PlayerData } from "./PlayerData";

export default class Commands {
    /**
    * Initialize log and registry START
    */
    public constructor() {
        Commands.REGISTRY = this
    }

    // Mod shows in one color, Areas another. Consistent with log entries of main class.
    private static log: Log = new Log("[Mod]", "[Commands]");

    // Registry
    public static REGISTRY: Commands;

    // Messages
    @Register.message("MsgCmdPlayerMissing")
    public readonly MsgCmdPlayerMissing: Message;
    @Register.message("MsgCmdFriendSubCommandMissing")
    public readonly MsgCmdFriendSubCommandMissing: Message;
    @Register.message("MsgUnknownCommand")
    public readonly MsgUnknownCommand: Message;
    @Register.message("MsgAdminUnknownCommand")
    public readonly MsgAdminUnknownCommand: Message;
    @Register.message("MsgAreaCount")
    public readonly MsgAreaCount: Message;
    @Register.message("MsgNotEnoughPermissions")
    public readonly MsgNotEnoughPermissions: Message;
    @Register.message("MsgAreaNotOwned")
    public readonly MsgAreaNotOwned: Message;
    @Register.message("MsgFlushSuccess")
    public readonly MsgFlushSuccess: Message;
    @Register.message("MsgFlushFailure")
    public readonly MsgFlushFailure: Message;
    @Register.message("MsgAdminPlayerAreaCount")
    public readonly MsgAdminPlayerAreaCount: Message;


    // Help Messages
    @Register.message("MsgHelpGeneral")
    public readonly MsgHelpGeneral: Message;
    @Register.message("MsgHelpCommands")
    public readonly MsgHelpCommands: Message;
    @Register.message("MsgHelpCheck")
    public readonly MsgHelpCheck: Message;
    @Register.message("MsgHelpClaim")
    public readonly MsgHelpClaim: Message;
    @Register.message("MsgHelpAbandon")
    public readonly MsgHelpAbandon: Message;
    @Register.message("MsgHelpFriends")
    public readonly MsgHelpFriends: Message;
    @Register.message("MsgHelpCount")
    public readonly MsgHelpCount: Message;

    /**
     * Initialize log and registry END
     */
    public static CmdAreas(_: any, player: Player, args: string): void {
        this.log.info("Command received!");

        var cmdArgs = args.split(" ");
        const dataMgr = new DataManager;
        this.log.info(cmdArgs);

        switch (cmdArgs[0]) {
            case "help":
                this.GetAreasHelp(cmdArgs[1]);
                break;
            case "check":
                // Check area availability
                Areas.CmdCheckArea(player);
                break;
            case "count":
                // var areaCount = this.GetAreaCount(player);
                var areaCount = Areas.GetAreaCount(player);
                player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAreaCount, areaCount, ModSettings.MAX_CLAIMED_AREA)
                break;
            case "claim":
                Areas.ClaimArea(player);
                break;
            case "abandon":
                var areaId = Areas.getAreaId(player);
                var area = dataMgr.GetAreaData(areaId);
                Areas.PlayerAbandonArea(area, player);
                break;
            case "friends":
                var method = cmdArgs[1];
                if (method == undefined || method == "") {
                    player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgCmdFriendSubCommandMissing);
                    return;
                }

                // Depreciated, friends is now per player.
                // var areaId = Areas.getAreaId(player);

                // if (Areas.IsPlayerAreaOwner(areaId, player) == false) {
                //     player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgAreaNotOwned);
                //     return;
                // }

                var friendName = cmdArgs[2];
                if (friendName == undefined || friendName == "") {
                    // TODO: Msg for enter a player name and show syntax
                    // Enter a valid player name!
                    player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgCmdPlayerMissing);
                    return;
                }

                if (method.toLowerCase() == "add") {
                    PlayerData.AddFriend(player, friendName);
                    // Depreciated, friends is now per player.
                    // Areas.AddAreaFriend(player, friendName, true);
                }

                if (method.toLowerCase() == "remove") {
                    PlayerData.RemoveFriend(player, friendName);
                    // Depreciated, friends is now per player.
                    // Areas.RemoveAreaFriend(player, friendName, true);
                }

                break;
            case "debug":
                // Call debug functions
                if (PlayerData.IsUserAdmin(player.name)) {
                    this.CmdDebug(player, cmdArgs);
                }
                break;
            case "admin":
                if (PlayerData.IsUserAdmin(player.name)) {
                    this.CmdAdmin(player, cmdArgs);
                    return;
                }

                player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgNotEnoughPermissions);
                break;
            default:
                player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgUnknownCommand);
                // this.log.warn("Not Implimented");
                break;
        }
    }

    /**
     * 
     * @param player 
     * @param cmdArgs 
     * @returns 
     */
    private static CmdAdmin(player: Player, cmdArgs: Array<string>) {
        this.log.info("CmdAdmin");
        this.log.debug(`CmdArgs 1: ${cmdArgs[1]}`);
        const dataMgr = new DataManager;

        switch (cmdArgs[1]) {
            case "claim":
                // /Areas debug claim <player name>
                var areaId = Areas.getAreaId(player);
                var targetPlayerName = cmdArgs[2].toLowerCase();

                if (targetPlayerName == undefined || targetPlayerName == "") {
                    this.log.warn("Username was not sent!");
                    return;
                }

                var area: IAreaData = {
                    AreaData: new Area(),
                    Settings: new AreaSettings()
                };

                // Set data var
                area.AreaData.ID = areaId;
                area.AreaData.OwnedBy = targetPlayerName;
                area.AreaData.Claimable = false;
                area.Settings.isProtected = true;

                // Set data
                dataMgr.SetAreaData(area);
                break;
            case "friends":
                const method = cmdArgs[2];
                var targetPlayerName = cmdArgs[3];
                var targetFriendName = cmdArgs[4];

                if (method == undefined || method == "") {
                    this.log.info("Enter a sub-command! Syntax: /areas friends friends <add|remove> <player name> <player friend name>");
                    return;
                }

                if (targetPlayerName == undefined || targetPlayerName == "") {
                    this.log.info("Enter a sub-command! Syntax: /areas admin friends <add|remove> <player name> <player friend name>");
                    return;
                }

                if (targetFriendName == undefined || targetFriendName == "") {
                    this.log.info("Enter a sub-command! Syntax: /areas admin friends <add|remove> <player name> <player friend name>");
                    return;
                }

                var targetPlayer = PlayerData.GetTargetPlayerByName(targetPlayerName);

                if (targetPlayer == undefined) {
                    this.log.info("Enter a sub-command! Syntax: /areas admin friends <add|remove> <player name> <player friend name>");
                    return;
                }

                if (method.toLowerCase() == "add") {
                    PlayerData.AddFriend(targetPlayer, targetFriendName);
                    // Depreciated, friends is now per player.
                    // Areas.AddAreaFriend(player, cmdArgs[3], true);
                }

                if (method.toLowerCase() == "remove") {
                    PlayerData.RemoveFriend(targetPlayer, targetFriendName);
                    // Depreciated, friends is now per player.
                    // Areas.RemoveAreaFriend(player, cmdArgs[3], true);
                }

                break;
            case "abandon":
                // /Areas debug abandon
                var areaId = Areas.getAreaId(player);
                dataMgr.InitAreaData(areaId);
                break;
            case "reinit":
                var targetPlayerName = cmdArgs[2];
                if (targetPlayerName == undefined || targetPlayerName == "") {
                    this.log.info("Enter a player ID! Syntax: /areas debug reinit <player name>")
                    return;
                }

                var targetPlayer = PlayerData.GetTargetPlayerByName(targetPlayerName);

                if (targetPlayer == undefined) {
                    this.log.info("Player information not found.")
                    return;
                }

                dataMgr.InitPlayerData(targetPlayer);
                break;
            case "getplayerdata":
                // Ensure admin command sub-parameter is set
                if (cmdArgs[2] == undefined || cmdArgs[2] == "") {
                    this.log.warn("Enter a valid player name!");
                    return;
                }

                var targetPlayer = PlayerData.GetTargetPlayerByName(cmdArgs[2]);

                if (targetPlayer == undefined) {
                    this.log.warn(`User does not exist!`);
                    return;
                }

                this.log.info(`User ${[cmdArgs[2]]} exists!`);
                PlayerData.PrintStoredDataByPlayerName(targetPlayer, player);
                break;
            case "flushdata":
                // Ensure admin command sub-parameter is set
                if (cmdArgs[2] == undefined || cmdArgs[2] == "") {
                    this.log.warn("Enter a valid player name!");
                    return;
                }

                var targetPlayer = PlayerData.GetTargetPlayerByName(cmdArgs[2]);

                if (targetPlayer == undefined) {
                    this.log.warn(`User does not exist!`);
                    return;
                }

                this.log.info(`User ${[cmdArgs[2]]} exists!`);

                // Get list of area IDs
                var areaIDs = Areas.GetAreaDataByPlayerName(targetPlayer.name)

                this.log.info(`Flushing data: ${areaIDs}`)

                if (dataMgr.ReinitAllPlayerData(targetPlayer, areaIDs) == true) {
                    player.messages.type(MessageType.Good).send(this.REGISTRY.MsgFlushSuccess, targetPlayer.name);
                    return;
                }
                player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgFlushFailure, targetPlayer.name);
                break;
            case "count":
                // Ensure admin command sub-parameter is set
                if (cmdArgs[2] == undefined || cmdArgs[2] == "") {
                    this.log.warn("Enter a valid player name!");
                    return;
                }

                var targetPlayer = PlayerData.GetTargetPlayerByName(cmdArgs[2]);

                if (targetPlayer == undefined) {
                    this.log.warn("Server unable to identify player!");
                    return;
                }

                // var areaCount = this.GetAreaCount(targetPlayer);
                var areaCount = Areas.GetAreaCount(targetPlayer);

                player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAdminPlayerAreaCount, areaCount, ModSettings.MAX_CLAIMED_AREA)
                break;
            default:
                var commands = "/areas admin GetPlayerData <player name> \n/areas admin claim <player name> \n/areas admin abandon \n/areas admin reinit <player name> \n/areas admin flushdata <player name> \nCheck for more on the Github!"
                //\nLink: <a href='https://www.github.com/HDJam/Player-Owned-Area'>Open Github</a>";

                player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgAdminUnknownCommand, commands);
                this.log.warn("Not Implimented");
                break;
        }
    }

    /**
     * Send debug commands here to process testing calls.
     * @param player 
     * @param cmdArgs 
     */
    private static CmdDebug(player: Player, cmdArgs: Array<string>) {
        switch (cmdArgs[1]) {
            default:
                player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgUnknownCommand);
                // this.log.warn("Not Implimented");
                break;
        }
    }

    /**
     * Called when '/Areas help' is called. Arguments can be passed as well using spaces between each argument.
     * @param args Array of strings. Each position is split by a space in the command entered by the player.
     * @returns Nothing
     */
    private static GetAreasHelp(args: string): void {
        this.log.info("GetAreasHelp");
        this.log.info(args);

        switch (args) {
            case "check":
                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpCheck);
                // Check the current location for ownership. 
                // \nSyntax: /areas check
                break;
            case "claim":
                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpClaim);
                // Attempt to claim the current area.
                // \nSyntax: /areas claim
                break;
            case "abandon":
                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpAbandon);
                // Attempt to abandon your ownership of the current area.
                // \nSyntax: /areas abandon
                break;
            case "friends":
                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpFriends);
                // Attempt to abandon your ownership of the current area.
                // \nSyntax: /areas abandon
                break;
            case "count":
                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpCount);
                // Attempt to abandon your ownership of the current area.
                // \nSyntax: /areas abandon
                break;
            case "commands":
                var commands = "/areas check \n/areas claim \n/areas abandon \n/areas count \n/areas friends";
                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpCommands, commands);
                // Some basic commands are:\n
                // \"/areas check\", to check the plot you are on.
                // \n\"/areas claim\", to claim the plot if available.
                // \n\"/areas abandon\", to unclaim the land if you are the owner.
                break;
            default:
                this.log.debug("No sub-args received, general help")
                // No args were passed so user passed /areas help

                localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.MsgHelpGeneral);

                // Welcome to Areas help!\n
                // You may use \"/areas help commands\" to see command list\n
                // You may find command specific help by entering "/areas help <command>".\n
                // Example: /areas help check\n
                break;
        }
    }


}