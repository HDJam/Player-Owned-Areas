import { MessageType } from "game/entity/player/IMessageManager";
import Register from "mod/ModRegistry";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import Message from "language/dictionary/Message";
import GameScreen from "ui/screen/screens/GameScreen";
import { EventHandler } from "event/EventManager";
import { EventBus } from "event/EventBuses";
import Tile from "game/tile/Tile";
import Player from "game/entity/player/Player";
import { IAreaData, IGlobalData, ISaveData } from "./IDataSave";
import Version from "./Version";
import Areas, { Area, AreaSettings } from "./Areas";
import Ignite from "game/entity/action/actions/Ignite";
import { IInjectionApi, InjectObject, InjectionPosition, Inject } from "utilities/class/Inject";
import ToggleTilled from "game/entity/action/actions/ToggleTilled";


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
import Human from "game/entity/Human";
import { IOptions } from "save/data/ISaveDataGlobal";








//import ToggleProtectedItems from "game/entity/action/actions/ToggleProtectedItems";


let log: Log;

export default class HelloWorld extends Mod {
    public readonly MAX_CLAIMED_AREA = 16


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

    public blockedAreasStorage: [string, Area];

    /**
    * Parses global data for area by key AreaID. Returns data if found.
    * @param areaId Area ID to get.
    * @param key The key returned by data.
    * @returns Area obj if found
    */
    public getStoredAreaData<K extends keyof IAreaData>(areaId: string, key: K): IAreaData {
        log.info("getStoredAreaData");
        log.info(`areaId:${areaId};`);
        var areaInfo = new Area();
        areaInfo.ID = areaId

        const areaData = this.data.areaData;
        const data = areaData[areaId];
        log.info(data);

        if (data) {
            return data;
        }


        log.warn("Area save data was undefined. Sending default data.")
        return (areaData[areaId] = {
            AreaData: new Area(),
            Settings: new AreaSettings()
        });

    }

    /**
    * Stores data
    * @param area Area
    * @returns Boolean
    */
    public setStoredAreaData<K extends keyof IAreaData>(area: IAreaData, key: K): boolean {
        log.info(`setStoredAreaData set info (${localPlayer.name}: ${area.AreaData.ID})`);
        log.info(area);

        // this.data.areaData[area.AreaData.ID] = area;
        this.data.areaData[area.AreaData.ID] = area;

        log.info("setStoredAreaData");

        return true;
    }

    private delStoredAreaDataDebug(area: IAreaData) {
        log.info("delStoredAreaDataDebug");
        log.info(area)

        this.data.areaData[area.AreaData.ID] = area;
        log.info("Success!");
    }

    /**
    * Sets a blank area in storage
    * @param area Area
    * @returns Boolean
    */
    public delStoredAreaData<K extends keyof IAreaData>(area: IAreaData, player: Player, key: K): boolean {
        // initializes it if it doesn't exist
        log.info(`delStoredAreaData (${localPlayer.name}: ${area.AreaData.ID})`);

        if (player.name == "" || player.name == undefined) {
            player.messages.type(MessageType.Stat).send(this.MsgAbandonAreaUnassigned)
            return false;
        }

        if (player.name == area.AreaData.OwnedBy) {
            try {
                //this.data.areaData[area.AreaData.ID].AreaData = new Area();
                this.data.areaData[area.AreaData.ID] = { AreaData: new Area(), Settings: new AreaSettings() };

                player.messages.type(MessageType.Stat).send(this.MsgAbandonAreaSuccess)
                return true;
            }
            catch (err) {
                player.messages.type(MessageType.Bad).send(this.MsgAbandonAreaError)
                log.error(err);
                return false
            }
        }

        if (player.name != area.AreaData.OwnedBy) {
            player.messages.type(MessageType.Bad).send(this.MsgAbandonAreaNotOwner)
        }

        return false;
    }

    ////////////////////////////////////
    // Events
    //

    // @EventHandler(Player, "preMove")
    // public preMove(player: Player, fromTile: Tile, toTile: Tile, isMoving: boolean): undefined | boolean | void {

    // }

    @EventHandler(GameScreen, "show")
    public onGameScreenVisible(): void {
        //log.info("onGameScreenVisible occurred!");
        //localPlayer.messages.type(MessageType.Good).send(this.messageMOTD);
    }

    @EventHandler(EventBus.Players, "postMove")
    public onPlayerMove(player: Player, tile: Tile, fromTile: Tile): void {
        // Quick clean check of area:
        // ==========================
        // this.CmdAreas(0, player, "check");
        // return;

        // Testing checks:
        // ===============
        const areaId = Areas.getAreaId(player);
        const area = this.getStoredAreaData(areaId, "AreaData")
        log.info(area);
        log.info(area.Settings);

        // If area is not player area, disable them by turning into a ghost.
        if (area.AreaData.Claimable == false && area.AreaData.OwnedBy != player.name) {

            // this.data.areaData[area.AreaData.ID] = area;
            // Not working
            log.info(this.data.areaData[areaId]);
            // player.state = 4
            //return true;
            return;
        }

        // If area is not another player's area, change back to human.
        player.state = 0
        //return true;

        //this.getStoredAreaData(area.AreaData.ID, "AreaData");

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
        var cmdArgs = args.split(" ");
        log.info(cmdArgs)

        switch (cmdArgs[0]) {
            case "help":
                //log.warn("Not Implimented");
                this.GetAreasHelp(cmdArgs[1]);
                break;
            case "check":
                // Check area availability
                this.checkArea(player);
                break;
            case "claim":
                this.ClaimArea(player);
                break;
            case "abandon":
                var areaId = Areas.getAreaId(player);
                var area = this.getStoredAreaData(areaId, "AreaData");
                this.delStoredAreaData(area, player, "AreaData");
                break;
            case "debug":
                // Call debug functions
                this.CmdDebug(player, cmdArgs);
                break;
            default:
                player.messages.type(MessageType.Bad).send(this.MsgUnknownCommand)
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
            case "claim":
                // /Areas debug claim <player name>
                var areaId = Areas.getAreaId(player);
                var area: IAreaData;
                var areaData = this.data.areaData;

                // Create new IAreaData object
                area = (areaData[areaId] = {
                    AreaData: new Area(),
                    Settings: new AreaSettings()
                });

                // Set data
                // cmdArgs[2] should be player name
                area.AreaData.ID = areaId;
                area.AreaData.OwnedBy = cmdArgs[2];
                area.AreaData.Claimable = false;
                area.Settings.isProtected = true;

                // Set data
                this.setStoredAreaData(area, "AreaData");
                break;
            case "abandon":
                // /Areas debug abandon
                var areaId = Areas.getAreaId(player);
                // var area = this.getStoredAreaData(areaId, "AreaData");
                // area.Settings.isProtected = false;

                var area: IAreaData;
                var areaData = this.data.areaData;
                area = (areaData[areaId] = {
                    AreaData: new Area(),
                    Settings: new AreaSettings()
                });

                area.AreaData.ID = areaId;

                this.delStoredAreaDataDebug(area);
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

        if (args == undefined) {
            log.info("No args received, general help")
            // No args were passed so user passed /areas help

            localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpGeneral);

            // Welcome to Areas help!\n
            // You may use \"/areas help commands\" to see command list\n
            // You may find command specific help by entering "/areas help <command>".\n
            // Example: /areas help check\n
            return;
        }

        switch (args) {
            case "commands":
                localPlayer.messages.type(MessageType.Stat).send(this.MsgHelpCommands);
                // Some basic commands are:\n
                // \"/areas check\", to check the plot you are on.
                // \n\"/areas claim\", to claim the plot if available.
                // \n\"/areas abandon\", to unclaim the land if you are the owner.
                break;
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
        }

    }

    /**
     * Process area claim request.
     * @param player Current player.
     * @returns nothing
     */
    private ClaimArea(player: Player): void {
        var areaId = Areas.getAreaId(player);
        var area = this.getStoredAreaData(areaId, "AreaData");

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
            if (this.setStoredAreaData(area, "AreaData") === true) {
                player.messages.type(MessageType.Stat).send(this.MsgAreaClaimSuccess);
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

        log.info("Area is not a border!");

        areaId = Areas.getAreaId(player);

        log.info(`Area ID: ${areaId}`);

        var area = this.getStoredAreaData(areaId, "AreaData");

        if (area == undefined) {
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

        localPlayer.messages.type(MessageType.Warning).send(this.MsgAreaNotAvailable, area.AreaData.OwnedBy);
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
        const playersAffectedSet = this.data.areaData[facingAreaId] // don't remember how save data works off the top of my head

        // If area is not protected
        if (playersAffectedSet.Settings.isProtected == false) {
            log.debug("Area is not protected.");
            return false;
        }

        if (playersAffectedSet.AreaData.OwnedBy == player.name) {
            log.debug("Player owns area.");
            return false;
        }

        log.debug("Area protected, disable player functions.");
        return true;

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
        log.info("onSetPickupItemsOptions");

        const human = api.executingInstance;

        // If user auto pickup is enabled, disable temporarily
        if (human.options.autoPickup)
            Object.defineProperty(human.options, "autoPickup", {
                get: () => {
                    var isAreaProtected = this.CheckAreaProtected(localPlayer);
                    log.info(`Area protected: ${isAreaProtected}`);

                    if (isAreaProtected === true) {
                        log.info("Set canPickUpItems = false");
                        const canPickUpItems = false; // whether items can be picked up on the tile the human is on
                        return canPickUpItems;
                    }

                    log.info("Set canPickUpItems = true");
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
                        log.info("Set canPickupOnIdle = false")
                        const canPickUpItems = false; // whether items can be picked up on the tile the human is on
                        return canPickUpItems;
                    }

                    log.info("Set canPickupOnIdle = true")
                    const canPickUpItems = true; // whether items can be picked up on the tile the human is on
                    return canPickUpItems;
                },
                set: () => { return options.autoPickupOnIdle; } // not sure whether this line is required or not
            });

        return;




        // if (isAreaProtected) {

        // log.warn("Item pickup = false");
        //return
        // }

        // log.warn("Item pickup = true");


        // Object.defineProperty(human.options, "autoPickup", {
        //     get: () => {
        //         const canPickUpItems = !isAreaProtected; // whether items can be picked up on the tile the human is on
        //         return canPickUpItems;
        //     },
        //     set: () => { } // not sure whether this line is required or not
        // });
        // Object.defineProperty(human.options, "autoPickupOnIdle", {
        //     get: () => {
        //         const canPickUpItems = !isAreaProtected // whether items can be picked up on the tile the human is on
        //         return canPickUpItems;
        //     },
        //     set: () => { } // not sure whether this line is required or not
        // });

    }
}

