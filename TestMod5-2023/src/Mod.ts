import { MessageType } from "game/entity/player/IMessageManager";
//import Register from "mod/ModRegistry";
import Register from "mod/ModRegistry";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import Message from "language/dictionary/Message";
import GameScreen from "ui/screen/screens/GameScreen";
import { EventHandler } from "event/EventManager";
import { EventBus } from "event/EventBuses";
import Tile from "game/tile/Tile";
import Player from "game/entity/player/Player";
import Areas, { Area } from "./Areas";
import { IAreaData, IGlobalData, ISaveData } from "./IDataSave";
import Version from "./Version";

let log: Log;

// export interface ISaveData {
//     lastVersion: string;
//     MasterAreaMap: Map<string, Area>;
// }

// export interface IGlobalData {
//     lastVersion: string;
//     MasterAreaMap: Map<string, Area>;
// }

export default class HelloWorld extends Mod {



    @Register.message("motd")
    public readonly messageMOTD: Message;
    @Register.message("PrevNextTileNames")
    public readonly messageHelloTerrain: Message;
    @Register.message("TileLocation")
    public readonly messageTileLocation: Message;
    @Register.message("NewAreaEntryMsg")
    public readonly messageNewAreaEntry: Message;

    /**
     * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
     */
    public override initializeSaveData(data?: ISaveData) {
        return !this.needsUpgrade(data) ? data : {
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
        // this.data.MasterAreaMap = Areas.MasterAreaMap;
        // log.info("MasterAreaArr: " + Areas.MasterAreaMap);
    }

    public override onLoad(): void {
        log.info("Init HelloWorld");
        // log.info("MasterAreaArr: " + Areas.MasterAreaMap);
        log.info(localPlayer.getMaxHealth());
    }

    public override onUnload(): void {
        log.info("Dispose HelloWorld");
    }

    //@EventHandler(EventBus.Audio, Music.Crux)


    @EventHandler(GameScreen, "show")
    public onGameScreenVisible(): void {
        //log.info("onGameScreenVisible occurred!");
        //localPlayer.messages.type(MessageType.Good).send(this.messageMOTD);
    }

    @EventHandler(EventBus.Players, "postMove")
    public onPlayerMove(player: Player, fromTile: Tile, tile: Tile): void | undefined {

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

        const IID = player.islandId.split(",");
        const XID = Math.floor(tile.x / 16);
        const YID = Math.floor(tile.y / 16);
        const fromIID = fromTile.islandId.split(",");
        const fromXID = Math.floor(fromTile.x / 16);
        const fromYID = Math.floor(fromTile.y / 16);

        const fromAreaID = `${fromIID[0]}${fromIID[1]}${fromXID}${fromYID}`;
        const areaID = `${IID[0]}${IID[1]}${XID}${YID}`;

        var result: IAreaData = Areas.getStoredAreaData(areaID, "ID");
        //this.getStoredAreaData(areaID, "AreaID");
        log.info(result);

        if (result.AreaData.Claimable === true) {
            var area = new Area();

            area.AreaID = areaID;
            area.Claimable = false;
            area.OwnedBy = player.name;

            Areas.setStoredAreaData(area)
        }

        return;

        // Debugging
        // log.info(`fromIID=${fromIID}; fromXID=${fromXID}; fromYID=${fromYID};`);
        // log.info(`IID=${IID}; XID=${XID}; YID=${YID};`);
        // log.info(`fromAreaID=${fromAreaID}; areaID=${areaID}`);
        log.info(`X:${tile.x} Y=${tile.y} | XID:${XID} YID=${YID}`);

        // Display the island ID and x/y coordinates of the player in chat
        // player.messages
        //     .type(MessageType.Stat)
        //     .send(this.messageTileLocation,
        //         player.island.getName(),
        //         player.islandId,
        //         tile.x,
        //         tile.y);

        // If the area the player is in matches
        if (areaID == fromAreaID) {
            return;
        }

        var isBorder = Areas.isAreaBorder(tile.x, tile.y);

        if (isBorder === false) {
            // TODO: Notify user land is border and cannot be claimed
            log.warn("Land is border of island and cannot be purchased")
            return;
        }


        var area = Areas.getAreaData(areaID);

        log.info(area);

        // Check if player is in new area
        // if (Areas.checkNewAreaOld(fromTile.x, fromTile.y, tile.x, tile.y)) { //Old method
        if (area != null) {
            player.messages
                .type(MessageType.Warning)
                .send(this.messageNewAreaEntry, areaID, fromAreaID);
        }

        // Display terrain names from and to the tile the user is looking at
        // player.messages
        //     .type(MessageType.Stat)
        //     .send(this.messageHelloTerrain,
        //         fromTile.getName(),
        //         tile.getName());







        // if (Areas.getAreaDetails(player.islandId, tile.x, tile.y)) {

        // }


        // Area coordinates:
        // x80-x90
        // y310-y320
        /**
         * Check a chunk before a player moves.
         *  If area is unclaimed or is owned by player or a friend of player area... Allow entry/interaction
         *  If area is claimed by a stranger, block player from claiming.
         *  Block stranger from claiming adjacent areas unless friends with adjacent owned areas
         * 
         * Probably need some rules/config...
         *  Max areas per player
         *  Allow areas per island (if limited to 5 areas, this would allow 5 areas per map)
         *  Is area safe from mobs
         *  Is area safe from strangers
         *  Are chests safe from strangers
         */








        return undefined;
    }

    @Register.command("CheckArea")
    public GetAreaDetails(_: any, player: Player, args: string) {

        var isBorder = Areas.isAreaBorder(player.x, player.y);

        if (isBorder === false) {
            // TODO: Notify user land is border and cannot be claimed
            log.warn("Land is border of island and cannot be purchased")
            return;
        }

        // create the user ID
        var areaId = Areas.getAreaId(player, player.x, player.y);

        // Get area data
        var areaData = Areas.getAreaData(areaId);

        log.info(areaData);


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

