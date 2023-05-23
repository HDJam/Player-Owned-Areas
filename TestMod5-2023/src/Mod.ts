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
import Areas, { Area } from "./Areas";

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

        // this.globalData.MasterAreaMap = new Map<string, Area>();

        // Areas.MasterAreaMap = this.globalData.MasterAreaMap;
        // log.info("MasterAreaArr: " + Areas.MasterAreaMap);
    }

    public override onUninitialize(): void {
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
        log.warn(data);

        if (data) {
            return data;
        }


        log.warn("Area save data was undefined. Sending default data.")
        return (areaData[areaId] = {
            AreaData: new Area()
        });

    }

    /**
    * Stores data
    * @param area Area
    * @returns Boolean
    */
    public setStoredAreaData<K extends keyof IAreaData>(area: IAreaData, key: K): boolean {
        // initializes it if it doesn't exist
        // this.getStoredAreaData(area.ID);

        log.info(`setStoredAreaData set info (${localPlayer.name}: ${area.AreaData.ID})`);
        log.info(area);

        // this.globalData.areaData.AreaData[0] = area.ID;
        // this.globalData.areaData.AreaData[1] = area;
        // this.globalData.areaData.AreaData = [area.ID, area];
        // this.data.areaData[area.ID] = [area.ID, area];
        // this.data.areaData[area.ID] = area;
        // this.data.areaData[area.ID] =  [area.ID, area];
        //this.data.areaData[area.ID] = { AreaData: [area.ID, area] };
        this.data.areaData[area.AreaData.ID] = area;

        log.info("setStoredAreaData");
        // log.info(area);

        return true;
    }

    /**
    * Sets a blank area in storage
    * @param area Area
    * @returns Boolean
    */
    public delStoredAreaData<K extends keyof IAreaData>(area: IAreaData, player: Player, key: K): boolean {
        // initializes it if it doesn't exist
        //this.getStoredAreaData(area.AreaID);

        log.info(`delStoredAreaData (${localPlayer.name}: ${area.AreaData.ID})`);

        if (player.name == "" || player.name == undefined) {
            player.messages.type(MessageType.Stat).send(this.MsgAbandonAreaUnassigned)
            return false;
        }

        if (player.name == area.AreaData.OwnedBy) {
            try {
                //this.data.areaData[area.ID] = { AreaData: [new Area()] };
                this.data.areaData[area.AreaData.ID].AreaData = new Area();
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

    @EventHandler(GameScreen, "show")
    public onGameScreenVisible(): void {
        //log.info("onGameScreenVisible occurred!");
        //localPlayer.messages.type(MessageType.Good).send(this.messageMOTD);
    }

    @EventHandler(EventBus.Players, "postMove")
    public onPlayerMove(player: Player, tile: Tile, fromTile: Tile): void {


        this.getStoredAreaData(Areas.getAreaId(player), "AreaData");

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
    public Areas(_: any, player: Player, args: string) {
        var cmdArgs = args.split(" ");
        log.info(cmdArgs)

        switch (cmdArgs[0]) {
            case "help":
                log.warn("Not Implimented");
                //getAreasHelp();
                break;
            case "check":
                // Check area availability
                this.checkArea(player);
                break;
            case "claim":
                //AreaCheckOwnership()
                //CheckBalance()
                //does player have maximum plot allowance?
                //AreaBuy();
                this.ClaimArea(player);

                break;
            case "abandon":
                var areaId = Areas.getAreaId(player);
                var area = this.getStoredAreaData(areaId, "AreaData");
                this.delStoredAreaData(area, player, "AreaData");
                break;
            default:
                player.messages.type(MessageType.Bad).send(this.MsgUnknownCommand)
                log.warn("Not Implimented");
                break;
        }
    }


    ////////////////////////////////////
    // Methods
    //

    private ClaimArea(player: Player) {
        var areaId = Areas.getAreaId(player);
        var area = this.getStoredAreaData(areaId, "AreaData");

        if (area.AreaData.Claimable == true) {
            area.AreaData.ID = areaId;
            area.AreaData.Claimable = false;
            area.AreaData.OwnedBy = player.name;
            log.info("Area is claimable. Attempting to store data:")
            log.info(area)
            this.setStoredAreaData(area, "AreaData");
        }

        if (area.AreaData.Claimable == false) {
            player.messages.type(MessageType.Warning).send(this.MsgAreaNotAvailable);
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

        if (!area) {
            // message user error occurred
            log.warn("getStoredAreaData returned undefined!")
            return;
        }


        //log.info(area["_Claimable"]);

        if (area.AreaData.Claimable == true) {
            // message user area is available
            player.messages.type(MessageType.Good).send(this.msgLandAreaAvailable);
            log.info("Area is unclaimed!")
            return;
        }

        localPlayer.messages.type(MessageType.Warning).send(this.MsgAreaNotAvailable);
        log.info(`Area is already claimed by ${area.AreaData.OwnedBy}`);
    }


    /**
      * DEPRECIATED Get the area details from the specified position
      * @param islandId  Island Identifier 
      * @param x         x pos
      * @param y         y pos
      * @returns         object TBD
      */
    // public getAreaData(areaId: string): Area {
    //     var iArea: Area = this.getStoredAreaData(areaId);

    //     return iArea;
    // }

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

