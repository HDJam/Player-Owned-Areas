import Player from "game/entity/player/Player";
import Tile from "game/tile/Tile";
import Log from "utilities/Log";
import Register from "mod/ModRegistry";
import Message from "language/dictionary/Message";
import { MessageType } from "game/entity/player/IMessageManager";


export class Area {
    public ID: string = "0";
    public OwnedBy: string = "";
    public Claimable: boolean = true;
}

export class AreaSettings {
    /**
     * Is the area protected?
     */
    isProtected: boolean = false;

    /**
     * What is the area friend list?
     * If user is in list, allow past area protection
     */
    friends: Array<string> = [];
}

// LogTest.ts
// export class LogTest {

//     public static REGISTRY: LogTest;

//     @Register.message("motd")
//     public readonly motd: Message;

//     public constructor() {
//         LogTest.REGISTRY = this;
//     }

//     public static LogTest() {
//         localPlayer.messages.type(MessageType.Stat).send(LogTest.REGISTRY.motd);
//     }
// }

export default class Areas {

    /**
     * Initialize log and registry START
     */
    public static REGISTRY: Areas;

    @Register.message("motd")
    public readonly motd: Message;

    public constructor() {
        Areas.REGISTRY = this;
    }

    // Mod shows in one color, Areas another. Consistent with log entries of main class.
    private static log: Log = new Log("[Mod]", "[Areas]");
    /**
     * Initialize log and registry END
     */

    /**
     * Test the log and message to player.
     */
    public static LogTest() {
        localPlayer.messages.type(MessageType.Stat).send(this.REGISTRY.motd);
        this.log.info("Test! log1")
    }



    /**
     * Gets the player's coordinates and creates an area ID.
     * @param player Player object
     * @returns Area ID string
     */
    public static getAreaId(player: Player): string {
        const IID = player.islandId.split(",");
        const XID = Math.floor(player.x / 16);
        const YID = Math.floor(player.y / 16);

        const areaID = `${IID[0]}${IID[1]}${XID}${YID}`;
        return areaID;
        // this.getAreaData(areaID, XID, YID)

        // Debugging
        // log.info(`fromIID=${fromIID}; fromXID=${fromXID}; fromYID=${fromYID};`);
        // log.info(`IID=${IID}; XID=${XID}; YID=${YID};`);
        // log.info(`fromAreaID=${fromAreaID}; areaID=${areaID}`);
        // log.info(`X:${tile.x} Y=${tile.y} | XID:${XID} YID=${YID}`);
    }

    /**
     * Gets the player facing tile coordinates and creates an area ID.
     * @param player Player object
     * @returns Area ID string
     */
    public static getAreaIdTile(tile: Tile): string {
        const IID = tile.islandId.split(",");
        const XID = Math.floor(tile.x / 16);
        const YID = Math.floor(tile.y / 16);

        const areaID = `${IID[0]}${IID[1]}${XID}${YID}`;
        return areaID;
        // this.getAreaData(areaID, XID, YID)

        // Debugging
        // log.info(`fromIID=${fromIID}; fromXID=${fromXID}; fromYID=${fromYID};`);
        // log.info(`IID=${IID}; XID=${XID}; YID=${YID};`);
        // log.info(`fromAreaID=${fromAreaID}; areaID=${areaID}`);
        // log.info(`X:${tile.x} Y=${tile.y} | XID:${XID} YID=${YID}`);
    }

    /**
     * Determines if the current zone the player is located at a border.
     * @param player Player object
     * @returns boolean
     */
    public static isAreaBorderPlayer(player: Player): boolean {

        // Current player island width -1
        // -1 because map index 0 and max index are unavailable to players
        const southEastBorder = Math.floor(player.island.world.width / 16) - 1;

        // Get current coordinates on island in a 16/16 "chunk" area and
        //    identify the zone by the floor of the equasion. 
        const xID = Math.floor(player.x / 16);
        const yID = Math.floor(player.y / 16);

        // If player is at East or West border chunk
        if (xID == 0 || xID == southEastBorder) {
            return true;
        }

        // If player is at North or South border chunk
        if (yID == 0 || yID == southEastBorder) {
            return true;
        }

        return false;
    }

}