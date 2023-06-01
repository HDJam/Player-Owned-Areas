import { MessageType } from "game/entity/player/IMessageManager";
import Register from "mod/ModRegistry";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import Message from "language/dictionary/Message";
import { EventHandler } from "event/EventManager";
import { EventBus } from "event/EventBuses";
import Tile from "game/tile/Tile";
import Player from "game/entity/player/Player";
import { IAreaData, IGlobalData, IPlayerData, ISaveData } from "./IDataSave";
import Version from "./Version";
import { Area, AreaSettings, Areas } from "./Areas";
import Ignite from "game/entity/action/actions/Ignite";
import { IInjectionApi, InjectObject, InjectionPosition, Inject } from "utilities/class/Inject";
import ToggleTilled from "game/entity/action/actions/ToggleTilled";
import Human from "game/entity/Human";
import { IOptions } from "save/data/ISaveDataGlobal";
import { ModSettings } from "./ModSettings";

// Permission Checks/Injects
import Attack from "game/entity/action/actions/Attack";
import Build from "game/entity/action/actions/Build";
import Butcher from "game/entity/action/actions/Butcher";
import Chop from "game/entity/action/actions/Chop";
import DetachContainer from "game/entity/action/actions/DetachContainer";
import Dig from "game/entity/action/actions/Dig";
import Drop from "game/entity/action/actions/Drop";
import Extinguish from "game/entity/action/actions/Extinguish";
import Gather from "game/entity/action/actions/Gather";
import GatherLiquid from "game/entity/action/actions/GatherLiquid";
import GrabAll from "game/entity/action/actions/GrabAll";
import Harvest from "game/entity/action/actions/Harvest";
import Melee from "game/entity/action/actions/Melee";
import Hitch from "game/entity/action/actions/Hitch";
import Mine from "game/entity/action/actions/Mine";
import OpenContainer from "game/entity/action/actions/OpenContainer";
import PickUp from "game/entity/action/actions/PickUp";
import PickUpAllItems from "game/entity/action/actions/PickUpAllItems";
import PickUpItem from "game/entity/action/actions/PickUpItem";
import PlaceDown from "game/entity/action/actions/PlaceDown";
import Pour from "game/entity/action/actions/Pour";
import PourOnYourself from "game/entity/action/actions/PourOnYourself";
import PropOpenDoor from "game/entity/action/actions/PropOpenDoor";
import Release from "game/entity/action/actions/Release";
import Ride from "game/entity/action/actions/Ride";
import SetDown from "game/entity/action/actions/SetDown";
import SmotherFire from "game/entity/action/actions/SmotherFire";
import StokeFire from "game/entity/action/actions/StokeFire";
import Tame from "game/entity/action/actions/Tame";
import Throw from "game/entity/action/actions/Throw";
import Unhitch from "game/entity/action/actions/Unhitch";


// Untested:
import ToggleContainers from "game/entity/action/actions/ToggleContainer";
import ToggleDoors from "game/entity/action/actions/ToggleDoor";
import ToggleHitch from "game/entity/action/actions/ToggleHitch";
import ToggleVehicle from "game/entity/action/actions/ToggleVehicle";

import AddFuel from "game/entity/action/actions/AddFuel";
import StartFire from "game/entity/action/actions/StartFire";
import Lockpick from "game/entity/action/actions/Lockpick";
import CageCreature from "game/entity/action/actions/CageCreature";
import Uncage from "game/entity/action/actions/Uncage";
import PickUpExcrement from "game/entity/action/actions/PickUpExcrement";
import AttachContainer from "game/entity/action/actions/AttachContainer";
import CloseContainer from "game/entity/action/actions/CloseContainer";
import { LogTest } from "./Areas"


//import ToggleProtectedItems from "game/entity/action/actions/ToggleProtectedItems";

let log: Log;

export default class Main extends Mod {

    ////////////////////////////////////
    // Messages
    //
    @Register.message("motd")
    public readonly messageMOTD: Message;
    @Register.message("PrevNextTileNames")
    public readonly messageHelloTerrain: Message;
    @Register.message("TileLocation")
    public readonly messageTileLocation: Message;
    @Register.message("NewAreaEntryMsg")
    public readonly messageNewAreaEntry: Message;

    @Register.message("MsgAreaBorder")
    public readonly msgAreaBorder: Message;
    @Register.message("MsgLandAreaAvailable")
    public readonly msgLandAreaAvailable: Message;
    @Register.message("MsgAreaNotAvailable")
    public readonly MsgAreaNotAvailable: Message;
    @Register.message("MsgUnknownCommand")
    public readonly MsgUnknownCommand: Message;
    @Register.message("MsgAdminUnknownCommand")
    public readonly MsgAdminUnknownCommand: Message;
    @Register.message("MsgAbandonAreaError")
    public readonly MsgAbandonAreaError: Message;
    @Register.message("MsgAbandonAreaSuccess")
    public readonly MsgAbandonAreaSuccess: Message;
    @Register.message("MsgAbandonAreaUnassigned")
    public readonly MsgAbandonAreaUnassigned: Message;
    @Register.message("MsgAbandonAreaNotOwner")
    public readonly MsgAbandonAreaNotOwner: Message;
    @Register.message("MsgAreaClaimSuccess")
    public readonly MsgAreaClaimSuccess: Message;
    @Register.message("MsgClaimAlreadyOwner")
    public readonly MsgClaimAlreadyOwner: Message;
    @Register.message("MsgAreaLimitHit")
    public readonly MsgAreaLimitHit: Message;
    @Register.message("MsgAreaCount")
    public readonly MsgAreaCount: Message;
    @Register.message("MsgNotEnoughPermissions")
    public readonly MsgNotEnoughPermissions: Message
    @Register.message("MsgGetPlayerAreaDetails")
    public readonly MsgGetPlayerAreaDetails: Message
    @Register.message("MsgGetPlayerDetails")
    public readonly MsgGetPlayerDetails: Message
    @Register.message("MsgAreaNotOwned")
    public readonly MsgAreaNotOwned: Message;
    @Register.message("MsgAreaFriendPreExists")
    public readonly MsgAreaFriendPreExists: Message;
    @Register.message("MsgAreaFriendAddSuccess")
    public readonly MsgAreaFriendAddSuccess: Message
    @Register.message("MsgAreaFriendAddFailure")
    public readonly MsgAreaFriendAddFailure: Message
    @Register.message("MsgAreaFriendNotInList")
    public readonly MsgAreaFriendNotInList: Message
    @Register.message("MsgAreaFriendRemoveSuccess")
    public readonly MsgAreaFriendRemoveSuccess: Message
    @Register.message("MsgAreaFriendRemoveFailure")
    public readonly MsgAreaFriendRemoveFailure: Message
    @Register.message("MsgFlushSuccess")
    public readonly MsgFlushSuccess: Message
    @Register.message("MsgFlushFailure")
    public readonly MsgFlushFailure: Message
    @Register.message("MsgCmdPlayerMissing")
    public readonly MsgCmdPlayerMissing: Message
    @Register.message("MsgCmdFriendSubCommandMissing")
    public readonly MsgCmdFriendSubCommandMissing: Message

    @Register.message("MsgAreaCheckIsFriend")
    public readonly MsgAreaCheckIsFriend: Message

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

    ////////////////////////////////////
    // Overrides
    //

    /**
     * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
     */
    public override initializeSaveData(data?: ISaveData) {
        return !this.needsUpgrade(data) ? data : {
            areaData: {},
            playerData: {},
            lastVersion: game.modManager.getVersion(this.getIndex()),
        };
    }

    /**
     * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
     */
    public override initializeGlobalData(data?: IGlobalData) {
        return !this.needsUpgrade(data) ? data : {
            lastVersion: game.modManager.getVersion(this.getIndex()),
        };
    }

    public override onInitialize(): void {
        log = this.getLog();
    }

    public override onLoad(): void {
        log.info("Init HelloWorld");
    }

    public override onUnload(): void {
        log.info("Dispose HelloWorld");
    }


    ////////////////////////////////////
    // Data Storage
    //

    @Mod.saveData<Mod>()
    public data: ISaveData;
    @Mod.globalData<Mod>()
    public globalData: IGlobalData;

    private GetAreaDataByPlayerName(targetPlayerName: string): Array<String> {
        log.debug("GetAreaDataByPlayerName");
        const data = this.data;
        var PlayerAreas = new Array<String>;

        // Extract the area IDs owned by given player name.
        for (var index in data.areaData) {

            if (data.areaData[index].AreaData.OwnedBy == targetPlayerName) {
                PlayerAreas.push(data.areaData[index].AreaData.ID);
            }
            log.info(index);
        }

        return PlayerAreas;
    }

    private GetPlayerDataById(targetPlayerId: string): IPlayerData | undefined {
        log.debug("GetPlayerDataById");
        const data = this.data;
        return data.playerData[targetPlayerId];
    }

    private PrintStoredDataByPlayerName(targetPlayer: Player, player: Player) {
        log.debug("PrintStoredDataByPlayerName");
        const data = this.data;
        const playerData = this.GetPlayerDataById(targetPlayer.identifier);
        var PlayerAreaIDs = this.GetAreaDataByPlayerName(targetPlayer.name);

        for (var index in data.areaData) {
            if (data.areaData[index].AreaData.OwnedBy == targetPlayer.name) {
                PlayerAreaIDs.push(data.areaData[index].AreaData.ID);
            }
        }

        log.debug("---");
        log.debug(playerData);
        log.debug("---");
        log.debug(PlayerAreaIDs);
        log.debug("---");

        var AreaMsgStr = this.FormatMsgPlayerAreaIDs(PlayerAreaIDs);

        // Output result to admin chat menu
        if (playerData) {
            player.messages.type(MessageType.Warning).send(this.MsgGetPlayerDetails, playerData.ID, playerData.Name, playerData.ClaimedAreas);
        }

        if (AreaMsgStr) {
            player.messages.type(MessageType.Warning).send(this.MsgGetPlayerAreaDetails, AreaMsgStr);
        }

        /*
                    Player Details:\n
                    ID: {0}\n
                    Name: {1}\n
                    Claimed Areas: {2}
                */

        return;
    }

    /**
    * Parses data for area by key AreaID. Returns data if found.
    * @param areaId Area ID to get.
    * @param key The key returned by data.
    * @returns Area obj if found
    */
    public GetAreaData(areaId: string): IAreaData {
        log.info("getStoredAreaData");
        log.info(`areaId: ${areaId};`);
        var areaInfo = new Area();
        areaInfo.ID = areaId

        const data = this.data.areaData[areaId];
        //const data = areaData[areaId];

        if (data) {
            return data;
        }

        log.warn("Area save data was undefined. Sending default data.")

        return this.InitAreaData(areaId)
    }

    /**
    * Stores area data by area ID
    * @param area Area
    * @returns Boolean
    */
    public SetAreaData(area: IAreaData): boolean {
        log.info(`setStoredAreaData set info (${localPlayer.name}: ${area.AreaData.ID})`);
        log.info(area);

        // this.data.areaData[area.AreaData.ID] = area;
        this.data.areaData[area.AreaData.ID] = area;

        return true;
    }

    private AdminResetAreaDataDebug(areaId: string) {
        log.info("AdminResetAreaDataDebug");

        var area: IAreaData;
        var areaData = this.data.areaData;
        area = (areaData[areaId] = {
            AreaData: new Area(),
            Settings: new AreaSettings()
        });

        area.AreaData.ID = areaId;

        log.info(area)

        this.data.areaData[area.AreaData.ID] = area;
        log.info("Success!");
    }

    /**
    * Sets a blank area in storage
    * @param area Area
    * @returns Boolean
    */
    public DelAreaData(area: IAreaData, player: Player): boolean {
        // initializes it if it doesn't exist
        log.info(`delStoredAreaData (${player.name}: ${area.AreaData.ID})`);

        if (player.name == "" || player.name == undefined) {
            player.messages.type(MessageType.Stat).send(this.MsgAbandonAreaUnassigned)
            return false;
        }

        if (player.name.toLowerCase() == area.AreaData.OwnedBy.toLowerCase()) {
            try {
                this.data.areaData[area.AreaData.ID] = {
                    AreaData: new Area(),
                    Settings: new AreaSettings()
                };

                player.messages.type(MessageType.Stat).send(this.MsgAbandonAreaSuccess)
                this.AddAreaCount(player, -1);
                return true;
            }
            catch (err) {
                player.messages.type(MessageType.Bad).send(this.MsgAbandonAreaError)
                log.error(err);
                return false
            }
        }

        player.messages.type(MessageType.Bad).send(this.MsgAbandonAreaNotOwner)
        return false;
    }

    /**
     * Reset all player data including reinitializing areas the player owned to default state.
     * @param targetPlayer The player to be flushed.
     * @param player The player sending the request for message responses.
     * @returns Boolean, true = success
     */
    private ReinitAllPlayerData(targetPlayer: Player, player: Player): boolean {
        log.debug("ReinitAllPlayerData");
        const areas = this.GetAreaDataByPlayerName(targetPlayer.name);
        var playerData = this.GetPlayerDataById(targetPlayer.identifier);
        var data = this.data;


        // If areas were in player's name, clear each areaId.
        if (areas.length > 0) {
            for (var index in areas) {
                const areaId = areas[index].toString();
                log.debug("Areas:")
                log.debug(areaId)
                log.debug(`Resetting area ID: ${areaId}`)
                data.areaData[areaId] = {
                    AreaData: new Area,
                    Settings: new AreaSettings
                }
            }
            log.debug("Player areas flushed.")
        }

        // If player data is undefined
        if (playerData == undefined) {
            log.debug("Player data did not exist.")
            return true;
        }

        // Update the claimed areas only (Retain name and ID may be useful?)
        playerData.ClaimedAreas = 0;
        data.playerData[playerData.ID] = playerData;

        log.debug("Player data flushed.")

        return true;
    }

    ////////////////////////////////////
    // Events
    //

    @EventHandler(EventBus.Players, "postMove")
    public onPlayerMove(player: Player, tile: Tile, fromTile: Tile): void {
        // Quick clean check of area:
        // ==========================
        // this.CmdAreas(0, player, "check");
        // return;

        // Testing checks:
        // ===============
        const areaId = Areas.getAreaId(player);
        const area = this.GetAreaData(areaId)
        log.info(area);

        // LogTest.LogTest();

        // If area is not player area, disable them by turning into a ghost.
        // if (area.AreaData.Claimable == false && area.AreaData.OwnedBy != player.name) {

        // this.data.areaData[area.AreaData.ID] = area;
        // Not working
        // log.info(this.data.areaData[areaId]);
        // player.state = 4
        //return true;
        //     return;
        // }

        // If area is not another player's area, change back to human.
        //player.state = 0
        //return true;

        //this.getStoredAreaData(area.AreaData.ID);

        /*
            Area ID Mapping
            [IID] = Island ID 00 (starting map)
            [XID] = X of 80-95 = 5
            [YID] = Y of 320-335 / 16 = 20
            ===================================
            [AreaID] = IID XID YID
            Possible AreaID=00520
         */

        // Get area ID, XID, and YID and send concattenated to checkNewArea

        // const IID = player.islandId.split(",");
        // const XID = Math.floor(tile.x / 16);
        // const YID = Math.floor(tile.y / 16);
        // const fromIID = fromTile.islandId.split(",");
        // const fromXID = Math.floor(fromTile.x / 16);
        // const fromYID = Math.floor(fromTile.y / 16);

        // const fromAreaID = `${fromIID[0]}${fromIID[1]}${fromXID}${fromYID}`;
        // const areaID = `${IID[0]}${IID[1]}${XID}${YID}`;

        /**
         * Check a chunk before a player moves.
         *  If area is unclaimed or is owned by player or a friend of player area... Allow entry/interaction
         *  If area is claimed by a stranger, block player from claiming, possibly block from entering? 
         *      Or stop player interactions with objects within.
         *  Block stranger from claiming adjacent areas unless friends with adjacent owned areas
         * 
         * Probably need some rules/config...
         *  Max areas per player
         *  Allow areas per island (if limited to 5 areas, this would allow 5 areas per map)
         *  Is area safe from mobs
         *  Is area safe from strangers
         *  Are chests safe from strangers
         */
    }


    ////////////////////////////////////
    // Commands
    //

    @Register.command("Areas")
    public CmdAreas(_: any, player: Player, args: string) {
        log.info("Command received!");

        var cmdArgs = args.split(" ");
        log.info(cmdArgs);


        switch (cmdArgs[0]) {
            case "help":
                this.GetAreasHelp(cmdArgs[1]);
                break;
            case "check":
                // Check area availability
                this.checkArea(player);
                break;
            case "count":
                const areaCount = this.GetAreaCount(player);
                player.messages.type(MessageType.Good).send(this.MsgAreaCount, areaCount, ModSettings.MAX_CLAIMED_AREA)
                break;
            case "claim":
                this.ClaimArea(player);
                break;
            case "abandon":
                var areaId = Areas.getAreaId(player);
                var area = this.GetAreaData(areaId);
                this.DelAreaData(area, player);
                break;
            case "friends":
                var method = cmdArgs[1];
                if (method == undefined || method == "") {
                    // TODO: Change to player response
                    // log.info("Enter a sub-command! Syntax: /areas friends <add|remove> <player name>");
                    player.messages.type(MessageType.Bad).send(this.MsgCmdFriendSubCommandMissing);
                    return;
                }

                var areaId = Areas.getAreaId(player);
                var area = this.GetAreaData(areaId);

                if (area.AreaData.OwnedBy != player.name) {
                    player.messages.type(MessageType.Bad).send(this.MsgAreaNotOwned);
                    return;
                }

                var friendName = cmdArgs[2].toLowerCase();

                if (friendName == undefined || friendName == "") {
                    // TODO: Msg for enter a player name and show syntax
                    // Enter a valid player name!
                    player.messages.type(MessageType.Bad).send(this.MsgCmdPlayerMissing);
                    return;
                }

                if (method.toLowerCase() == "add") {
                    this.AddAreaFriend(player, friendName, true);
                }

                if (method.toLowerCase() == "remove") {
                    this.RemoveAreaFriend(player, friendName, true);
                }

                break;
            case "debug":
                // Call debug functions
                if (this.IsUserAdmin(player.name)) {
                    this.CmdDebug(player, cmdArgs);
                }
                break;
            case "admin":
                if (this.IsUserAdmin(player.name)) {
                    this.CmdAdmin(player, cmdArgs);
                    return;
                }

                player.messages.type(MessageType.Bad).send(this.MsgNotEnoughPermissions);
                break;
            default:
                player.messages.type(MessageType.Bad).send(this.MsgUnknownCommand);
                log.warn("Not Implimented");
                break;
        }
    }

    private CmdAdmin(player: Player, cmdArgs: Array<string>) {
        log.info("CmdAdmin");
        log.debug(`CmdArgs 1: ${cmdArgs[1]}`);
        switch (cmdArgs[1]) {
            case "claim":
                // /Areas debug claim <player name>
                var areaId = Areas.getAreaId(player);
                var area: IAreaData;
                var areaData = this.data.areaData;
                var targetPlayerName = cmdArgs[2].toLowerCase();

                if (targetPlayerName == undefined || targetPlayerName == "") {
                    log.warn("Username was not sent!");
                    return;
                }

                // Create new IAreaData object
                area = (areaData[areaId] = {
                    AreaData: new Area(),
                    Settings: new AreaSettings()
                });

                // Set data

                area.AreaData.ID = areaId;
                area.AreaData.OwnedBy = targetPlayerName;
                area.AreaData.Claimable = false;
                area.Settings.isProtected = true;

                // Set data
                this.SetAreaData(area);
                break;
            case "friends":
                var method = cmdArgs[2];
                if (method == undefined || method == "") {
                    log.info("Enter a sub-command! Syntax: /areas debug friends <add|remove> <player name>");
                }

                if (method.toLowerCase() == "add") {
                    this.AddAreaFriend(player, cmdArgs[3], true);
                }

                if (method.toLowerCase() == "remove") {
                    this.RemoveAreaFriend(player, cmdArgs[3], true);
                }

                break;
            case "abandon":
                // /Areas debug abandon
                var areaId = Areas.getAreaId(player);

                this.AdminResetAreaDataDebug(areaId);
                break;
            case "reinit":
                const playerName = cmdArgs[2].toLowerCase();
                if (playerName == undefined || playerName == "") {
                    log.info("Enter a player ID! Syntax: /areas debug reinit <player name>")
                    return;
                }

                var targetPlayer = this.GetTargetPlayerObjByName(playerName);

                if (targetPlayer == undefined) {
                    log.info("Player information not found.")
                    return;
                }

                this.InitPlayerData(targetPlayer);
                break;
            case "getplayerdata":
                // Ensure admin command sub-parameter is set
                if (cmdArgs[2] == undefined || cmdArgs[2] == "") {
                    log.warn("Enter a valid player name!");
                    return;
                }

                var targetPlayer = this.GetTargetPlayerObjByName(cmdArgs[2]);

                if (targetPlayer == undefined) {
                    log.warn(`User does not exist!`);
                    return;
                }

                log.info(`User ${[cmdArgs[2]]} exists!`);
                var result = this.PrintStoredDataByPlayerName(targetPlayer, player);

                log.info(result);

                break;
            case "flushdata":
                // Ensure admin command sub-parameter is set
                if (cmdArgs[2] == undefined || cmdArgs[2] == "") {
                    log.warn("Enter a valid player name!");
                    return;
                }

                var targetPlayer = this.GetTargetPlayerObjByName(cmdArgs[2]);

                if (targetPlayer == undefined) {
                    log.warn(`User does not exist!`);
                    return;
                }

                log.info(`User ${[cmdArgs[2]]} exists!`);

                if (this.ReinitAllPlayerData(targetPlayer, player) == true) {
                    player.messages.type(MessageType.Good).send(this.MsgFlushSuccess, targetPlayer.name);
                    return;
                }
                player.messages.type(MessageType.Bad).send(this.MsgFlushFailure, targetPlayer.name);
                break;
            default:
                player.messages.type(MessageType.Bad).send(this.MsgAdminUnknownCommand);
                // 
                log.warn("Not Implimented");
                break;
        }
    }

    /**
     * Send debug commands here to process testing calls.
     * @param player 
     * @param cmdArgs 
     */
    private CmdDebug(player: Player, cmdArgs: Array<string>) {
        switch (cmdArgs[1]) {

            default:
                player.messages.type(MessageType.Bad).send(this.MsgUnknownCommand);
                log.warn("Not Implimented");
                break;
        }
    }

    ////////////////////////////////////
    // Methods
    //

    /**
     * Called when '/Areas help' is called. Arguments can be passed as well using spaces between each argument.
     * @param args Array of strings. Each position is split by a space in the command entered by the player.
     * @returns Nothing
     */
    private GetAreasHelp(args: string): void {
        log.info("GetAreasHelp");
        log.info(args);

        switch (args) {
            case "check":
                localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpCheck);
                // Check the current location for ownership. 
                // \nSyntax: /areas check
                break;
            case "claim":
                localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpClaim);
                // Attempt to claim the current area.
                // \nSyntax: /areas claim
                break;
            case "abandon":
                localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpAbandon);
                // Attempt to abandon your ownership of the current area.
                // \nSyntax: /areas abandon
                break;
            case "commands":
                localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpCommands);
                // Some basic commands are:\n
                // \"/areas check\", to check the plot you are on.
                // \n\"/areas claim\", to claim the plot if available.
                // \n\"/areas abandon\", to unclaim the land if you are the owner.
                break;
            default:
                log.debug("No sub-args received, general help")
                // No args were passed so user passed /areas help

                localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpGeneral);

                // Welcome to Areas help!\n
                // You may use \"/areas help commands\" to see command list\n
                // You may find command specific help by entering "/areas help <command>".\n
                // Example: /areas help check\n
                break;
        }
    }

    /**
     * Process area claim request.
     * @param player Current player.
     * @returns nothing
     */
    private ClaimArea(player: Player): void {
        const limit = this.CheckPlayerAreaLimit(player);

        if (limit == true) {
            player.messages.type(MessageType.Warning).send(this.MsgAreaLimitHit, ModSettings.MAX_CLAIMED_AREA)
            return;
        }


        var areaId = Areas.getAreaId(player);
        var area = this.GetAreaData(areaId);

        if (area.AreaData.OwnedBy == player.name) {
            player.messages.type(MessageType.Warning).send(this.MsgClaimAlreadyOwner);
            return;
        }

        if (area.AreaData.Claimable == false) {
            player.messages.type(MessageType.Warning).send(this.MsgAreaNotAvailable, area.AreaData.OwnedBy);
        }

        if (area.AreaData.Claimable == true) {
            area.AreaData.ID = areaId;
            area.AreaData.Claimable = false;
            area.AreaData.OwnedBy = player.name;

            area.Settings.isProtected = true;

            log.info("Area is claimable. Attempting to store data:")
            log.info(area)
            if (this.SetAreaData(area) === true) {
                player.messages.type(MessageType.Stat).send(this.MsgAreaClaimSuccess);
                this.AddAreaCount(player, 1);
                return;
            }
        }
    }

    /**
     * Check area details when called by player command.
     * Command: /areas check
     * @param player Player object for checking position.
     * @returns void
     */
    private checkArea(player: Player) {
        var areaId: string;
        var isBorder: Boolean;

        isBorder = Areas.isAreaBorderPlayer(player);

        if (isBorder === true) {
            log.warn("Area is a border!");
            localPlayer.messages.type(MessageType.Warning).send(this.msgAreaBorder);
            return;
        }

        log.debug("Area is not a border!");

        areaId = Areas.getAreaId(player);

        log.debug(`Area ID: ${areaId}`);

        var area = this.GetAreaData(areaId);

        if (area == undefined) {
            this.InitAreaData(areaId);

            // message user error occurred
            log.warn("getStoredAreaData returned undefined!")
            return;
        }

        if (area.AreaData.Claimable == true) {
            // message user area is available
            player.messages.type(MessageType.Stat).send(this.msgLandAreaAvailable);
            log.info("Area is unclaimed!")
            return;
        }

        player.messages.type(MessageType.Warning).send(this.MsgAreaNotAvailable, area.AreaData.OwnedBy);

        if (area.Settings.friends.includes(player.name.toLowerCase())) {
            player.messages.type(MessageType.Good).send(this.MsgAreaCheckIsFriend);
        }

        log.info(`Area is already claimed by ${area.AreaData.OwnedBy}`);
    }


    private needsUpgrade(data?: { lastVersion?: string }) {
        if (!data) {
            return true;
        }

        const versionString = game.modManager.getVersion(this.getIndex());
        const lastLoadVersionString = (data && data.lastVersion) || "0.0.0";

        if (versionString === lastLoadVersionString) {
            return false;
        }

        const version = new Version(versionString);
        const lastLoadVersion = new Version(lastLoadVersionString);

        return lastLoadVersion.isOlderThan(version);
    }


    /**
     * Checks if the area the player is facing is protected by player-owned area.
     * True = protected; false = unprotected.
     * @param player Current player.
     * @returns Boolean
     */
    private CheckAreaProtected(player: Player): boolean {
        const facingAreaId = Areas.getAreaIdTile(player.facingTile);
        var playersAffectedSet = this.data.areaData[facingAreaId] // don't remember how save data works off the top of my head

        // Initialize data if not existing
        if (playersAffectedSet == undefined) {
            log.warn("Area save data was undefined. Creating new data.");
            this.InitAreaData(facingAreaId);
            return false;
        }

        if (playersAffectedSet.AreaData.OwnedBy == player.name) {
            log.debug("Player owns area.");
            return false;
        }

        log.debug("Area was defined");

        // If area is not protected
        if (playersAffectedSet.Settings.isProtected == false) {
            log.debug("Area is not protected.");
            return false;
        }

        log.debug(`Area is protected. Checking if ${player.name} is friend.`);

        // If player is in ally list
        if (playersAffectedSet.Settings.friends.includes(player.name.toLowerCase())) {
            log.debug("Player is friend and has access to area functions.");
            return false;
        }

        log.debug("User not a friend of owner");

        log.debug("Area protected, disable player functions.");
        return true;
    }

    /**
     * Init area data
     * @param areaId The area identifier
     * @returns IAreaData
     */
    private InitAreaData(areaId: string): IAreaData {
        log.info("InitAreaData");
        var data = this.data.areaData;

        // Store data
        return data[areaId] = {
            AreaData: { ID: areaId, OwnedBy: "", Claimable: true },
            Settings: new AreaSettings()
        };
    }

    /**
     * Initialize player data if it does not exist
     * @param player Player object
     * @param key PlayerData
     * @returns number
     */
    private InitPlayerData(player: Player): IPlayerData {
        log.info("InitPlayerData");
        var pdata = this.data.playerData;

        // Store data
        return pdata[player.identifier] = {
            ID: player.identifier,
            Name: player.name,
            ClaimedAreas: 0
        };
    }

    /**
     * Gets the current stored area count for player
     * @param player Player object
     * @returns Number or 0 if no areas existed
     */
    public GetAreaCount(player: Player): number {
        log.info("GetAreaCount");
        const playerData = this.data.playerData;
        const data = playerData[player.identifier];


        // If data exists
        if (data) {
            log.info("Data existed!");
            // Return claimed area count
            return data.ClaimedAreas;
        }

        log.info("Data didn't exist!");
        // If data didnt exist, create it.
        this.InitPlayerData(player);

        // Return 0 as new players never have claimed areas by default
        return 0;
    }

    /**
     * Checks player area limit. If no limit exists, data is created and 0 is returned.
     * @param player Pass the player data
     * @returns 
     */
    public CheckPlayerAreaLimit(player: Player): boolean {
        log.info("CheckPlayerAreaLimit");
        const playerData = this.data.playerData;
        const data = playerData[player.identifier];

        // If data exists
        if (data) {
            log.info("Data existed!");
            // Check if areas is at or higher than limit
            if (data.ClaimedAreas >= ModSettings.MAX_CLAIMED_AREA) {
                log.info(`Player has max areas claimed! ${data.ClaimedAreas}/${ModSettings.MAX_CLAIMED_AREA}`);
                return true;
            }

            log.info(`Player not at max areas claimed. ${data.ClaimedAreas}/${ModSettings.MAX_CLAIMED_AREA}`);
            // If limit or higher not met
            return false;
        }

        log.info("Data did not exist.")
        // If data didnt exist, create it.
        this.InitPlayerData(player);

        // Return false as new user will never have limit
        return false;
    }

    /**
     * Add area count to the player's total. If player data doesnt exist, it is initialized.
     * @param player Player Data
     * @param num Send 1 or -1 to add or remove 1
     * @returns Nothing
     */
    public AddAreaCount(player: Player, num: number) {
        log.info("AddAreaCount");
        const playerData = this.data.playerData;
        const data = playerData[player.identifier];

        // If data exists, increment claimedAreas and store
        if (data) {
            log.info("Data existed!");
            data.ClaimedAreas += num;
            playerData[player.identifier] = data;
            return;
        }

        log.info("Data didn't exist.");

        // Init player data since didnt exist
        var newData = this.InitPlayerData(player);

        // If data exists, increadse area count
        if (newData) {
            newData.ClaimedAreas++;
            playerData[player.identifier] = newData;
        }

        return;
    }

    /**
     * Check if user is an administrative user
     * @param name 
     * @returns boolean
     */
    private IsUserAdmin(name: string): boolean {
        var admins = ModSettings.ADMIN_PLAYERS;

        log.warn("User Admin Check");
        log.info(admins);

        if (admins.includes(name.toLowerCase())) {
            log.info("User is an administrator!");
            return true;
        }

        log.info("User is NOT an administrator!");
        return false;
    }

    /**
     * Outputs a string containing all the player-owned areas by Area ID
     * @param data Array of areas
     * @returns string
     */
    private FormatMsgPlayerAreaIDs(data: String[]): string {
        var message = "";
        for (var index in data) {
            message += `${data[index]}\n`
        }

        /*
            Claimed Areas:\n
            {0}
         */
        return message;
    }

    /**
     * Add a friend to area settings.
     * @param playerId The player identifier
     * @param targetPlayerName The target player name
     * @param forceSet If admin sends debug command, change by force if value is in list.
     */
    private AddAreaFriend(player: Player, targetPlayerName: string, forceSet: boolean = false) {
        const areaId = Areas.getAreaId(player);

        // Get stored area data
        const areaInfo = this.GetAreaData(areaId);

        // Check if area data exists and belongs to player
        if (areaInfo.AreaData.OwnedBy == "") {
            // Inform user area is not owned by anyone
            player.messages.type(MessageType.Bad).send(this.MsgAreaNotOwned);
            // Area is not claimed by anyone.
            return;
        }

        // Check if area friends already has this user
        if (areaInfo.Settings.friends.includes(targetPlayerName.toLowerCase())) {
            // Inform user that this area already has this player as a friend
            player.messages.type(MessageType.Bad).send(this.MsgAreaFriendPreExists, targetPlayerName);
            // Area settings already has {0} specified!
            return;
        }

        // Add target player name to friends list
        areaInfo.Settings.friends.push(targetPlayerName.toLowerCase());

        // Store area data
        if (this.SetAreaData(areaInfo)) {
            // Inform user the player was added successfully
            player.messages.type(MessageType.Good).send(this.MsgAreaFriendAddSuccess, targetPlayerName);
        } else {
            player.messages.type(MessageType.Good).send(this.MsgAreaFriendAddFailure, targetPlayerName);
        }
    }

    /**
     * Remove a friend to area settings.
     * @param playerId The player identifier
     * @param targetPlayerName The target player name
     * @param forceSet If admin sends debug command, change by force if value is in list.
     */
    private RemoveAreaFriend(player: Player, targetPlayerName: string, forceSet: boolean = false) {
        const areaId = Areas.getAreaId(player);

        // Get stored area data
        const areaInfo = this.GetAreaData(areaId);

        // Check if area data exists and belongs to player
        if (areaInfo.AreaData.OwnedBy == "") {
            // Inform user area is not owned by anyone
            player.messages.type(MessageType.Bad).send(this.MsgAreaNotOwned);
            // Area is not claimed by anyone.
            return;
        }

        // Check if area friends already has this user
        if (areaInfo.Settings.friends.includes(targetPlayerName) == false) {
            // Inform user that this area already has this player as a friend
            player.messages.type(MessageType.Bad).send(this.MsgAreaFriendNotInList, targetPlayerName);
            // Area settings already has {0} specified!
            return;
        }

        // Add target player name to friends list
        areaInfo.Settings.friends.push(targetPlayerName);

        // Store area data
        if (this.SetAreaData(areaInfo)) {
            // Inform user the player was added successfully
            player.messages.type(MessageType.Good).send(this.MsgAreaFriendRemoveSuccess, targetPlayerName);
        } else {
            player.messages.type(MessageType.Good).send(this.MsgAreaFriendRemoveFailure, targetPlayerName);
        }
    }

    /**
     * Grabs the player object from playerManager if the player exists in game data.
     * @param name Name of player
     * @returns Player or undefined if not found.
     */
    private GetTargetPlayerObjByName(name: string): Player | undefined {
        return game.playerManager.getByName(name);
    }



    ////////////////////////////////////
    // Areas protection Events
    //

    /**
     * Check if dig action is allowed based on player's facing tile protection properties.
     * @param api API to send the unusable message so the player cannot dig. Action will be allowed if facing tile is not protected.
     * @param action 
     * @returns 
     */
    @InjectObject(Dig, "canUseHandler", InjectionPosition.Pre)
    public onCanUseActionToInjectInto(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        log.debug(`isAreaProtected = ${isAreaProtected}`)
        if (isAreaProtected) {
            log.debug("Dig action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }


    @InjectObject(ToggleTilled, "canUseHandler", InjectionPosition.Pre)
    public onCanUseTill(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Till action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(ToggleDoors, "canUseHandler", InjectionPosition.Pre)
    public onCanUseToggleDoors(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("ToggleDoors action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(ToggleHitch, "canUseHandler", InjectionPosition.Pre)
    public onCanUseToggleHitch(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("ToggleHitch action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(ToggleVehicle, "canUseHandler", InjectionPosition.Pre)
    public onCanUseVehicle(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Vehicle action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Ignite, "canUseHandler", InjectionPosition.Pre)
    public onCanUseIgnite(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Ignite action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Build, "canUseHandler", InjectionPosition.Pre)
    public onCanUseBuild(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Build action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Drop, "canUseHandler", InjectionPosition.Pre)
    public onCanUseDrop(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Drop action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Butcher, "canUseHandler", InjectionPosition.Pre)
    public onCanUseButcher(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Butcher action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Chop, "canUseHandler", InjectionPosition.Pre)
    public onCanUseChop(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Chop action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(DetachContainer, "canUseHandler", InjectionPosition.Pre)
    public onCanUseDetachContainer(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("DetachContainer action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Extinguish, "canUseHandler", InjectionPosition.Pre)
    public onCanUseExtinguish(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Extinguish action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(AddFuel, "canUseHandler", InjectionPosition.Pre)
    public onCanUseAddFuel(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("AddFuel action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(StartFire, "canUseHandler", InjectionPosition.Pre)
    public onCanUseStartFire(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("StartFire action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(StokeFire, "canUseHandler", InjectionPosition.Pre)
    public onCanUseStokeFire(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("StokeFire action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(SmotherFire, "canUseHandler", InjectionPosition.Pre)
    public onCanUseSmotherFire(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("SmotherFire action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Gather, "canUseHandler", InjectionPosition.Pre)
    public onCanUseGather(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Gather action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(GatherLiquid, "canUseHandler", InjectionPosition.Pre)
    public onCanUseGatherLiquid(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("GatherLiquid action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(GrabAll, "canUseHandler", InjectionPosition.Pre)
    public onCanUseGrabAll(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("GrabAll action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Harvest, "canUseHandler", InjectionPosition.Pre)
    public onCanUseHarvest(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Harvest action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Lockpick, "canUseHandler", InjectionPosition.Pre)
    public onCanUseLockpick(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Lockpick action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Mine, "canUseHandler", InjectionPosition.Pre)
    public onCanUseMine(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Mine action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Tame, "canUseHandler", InjectionPosition.Pre)
    public onCanUseTame(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Tame action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Throw, "canUseHandler", InjectionPosition.Pre)
    public onCanUseThrow(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Throw action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Unhitch, "canUseHandler", InjectionPosition.Pre)
    public onCanUseUnhitch(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Unhitch action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(CageCreature, "canUseHandler", InjectionPosition.Pre)
    public onCanUseCageCreature(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("CageCreature action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Uncage, "canUseHandler", InjectionPosition.Pre)
    public onCanUseUncage(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Uncage action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PlaceDown, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePlaceDown(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PlaceDown action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PickUp, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePickUp(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PickUp action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PickUpAllItems, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePickUpAllItems(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PickUpAllItems action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PickUpExcrement, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePickUpExcrement(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PickUpExcrement action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PickUpItem, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePickUpItem(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PickUpItem action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(SetDown, "canUseHandler", InjectionPosition.Pre)
    public onCanUseSetDown(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("SetDown action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(ToggleContainers, "canUseHandler", InjectionPosition.Pre)
    public onCanUseToggleContainers(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("ToggleContainers action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Pour, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePour(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Pour action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PourOnYourself, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePourOnYourself(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PourOnYourself action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Release, "canUseHandler", InjectionPosition.Pre)
    public onCanUseRelease(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Release action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Attack, "canUseHandler", InjectionPosition.Pre)
    public onCanUseAttack(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Attack action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(AttachContainer, "canUseHandler", InjectionPosition.Pre)
    public onCanUseAttachContainer(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("AttachContainer action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(OpenContainer, "canUseHandler", InjectionPosition.Pre)
    public onCanUseOpenContainer(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("OpenContainer action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(CloseContainer, "canUseHandler", InjectionPosition.Pre)
    public onCanUseCloseContainer(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("CloseContainer action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Ride, "canUseHandler", InjectionPosition.Pre)
    public onCanUseRide(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Ride action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Hitch, "canUseHandler", InjectionPosition.Pre)
    public onCanUseHitch(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("Hitch action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(PropOpenDoor, "canUseHandler", InjectionPosition.Pre)
    public onCanUsePropOpenDoor(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PropOpenDoor action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @InjectObject(Melee, "canUseHandler", InjectionPosition.Pre)
    public onCanUseMelee(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        if (isAreaProtected) {
            log.debug("PropOpenDoor action hidden")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    /**
     * Can player auto pickup items?
     * @param api 
     * @param options 
     */
    @Inject(Human, "setOptions", InjectionPosition.Post)
    public onSetPickupItemsOptions(api: IInjectionApi<any, "setOptions">, options: IOptions) {
        log.debug("onSetPickupItemsOptions");

        const human = api.executingInstance;

        // If user auto pickup is enabled, disable temporarily
        if (human.options.autoPickup)
            Object.defineProperty(human.options, "autoPickup", {
                get: () => {
                    var isAreaProtected = this.CheckAreaProtected(localPlayer);
                    log.info(`Area protected: ${isAreaProtected}`);

                    if (isAreaProtected === true) {
                        log.debug("Set canPickUpItems = false");
                        const canPickUpItems = false; // whether items can be picked up on the tile the human is on
                        return canPickUpItems;
                    }

                    log.debug("Set canPickUpItems = true");
                    const canPickUpItems = true; // whether items can be picked up on the tile the human is on
                    return canPickUpItems;
                },
                set: () => { return options.autoPickup } // not sure whether this line is required or not
            });

        // If user auto pickup is enabled, re-enable it temporarily
        if (human.options.autoPickupOnIdle)
            Object.defineProperty(human.options, "autoPickupOnIdle", {
                get: () => {
                    var isAreaProtected = this.CheckAreaProtected(localPlayer);
                    log.info(`Area protected: ${isAreaProtected}`);

                    if (isAreaProtected === true) {
                        log.debug("Set canPickupOnIdle = false")
                        const canPickUpItems = false; // whether items can be picked up on the tile the human is on
                        return canPickUpItems;
                    }

                    log.debug("Set canPickupOnIdle = true")
                    const canPickUpItems = true; // whether items can be picked up on the tile the human is on
                    return canPickUpItems;
                },
                set: () => { return options.autoPickupOnIdle; } // not sure whether this line is required or not
            });
        return;
    }
}

