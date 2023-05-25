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
import { IActionApi, IActionHandlerApi, IActionUsable } from "game/entity/action/IAction";
import Human from "game/entity/Human";
import Dig, { IDigTileCanUse } from "game/entity/action/actions/Dig";
import { IInjectionApi, Inject, InjectObject, InjectionPosition } from "utilities/class/Inject";

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

    private CheckAreaProtected(player: Player): boolean {
        const facingAreaId = Areas.getAreaIdTile(player.facingTile);
        const playersAffectedSet = this.data.areaData[facingAreaId] // don't remember how save data works off the top of my head

        // If area is not protected
        if (playersAffectedSet.Settings.isProtected == false) {
            log.info("Area is not protected.");
            return false;
        }

        if (playersAffectedSet.AreaData.OwnedBy == player.name) {
            log.info("Player owns area.");
            return false;
        }

        log.info("Area protected, disable player functions.");
        return true;

    }


    @InjectObject(Dig, "canUseHandler", InjectionPosition.Pre)
    public onCanUseActionToInjectInto(api: IInjectionApi<typeof Dig, "canUseHandler">, action: IActionHandlerApi<Human, IActionUsable>) {
        var isAreaProtected = this.CheckAreaProtected(localPlayer);

        log.info(`isAreaProtected = ${isAreaProtected}`)
        if (isAreaProtected) {
            log.info("Dig action concealed")
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }

        //api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
        //api.cancelled = false; // prevent normal canuse functionality

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




}

