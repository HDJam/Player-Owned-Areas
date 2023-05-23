import Mod from "mod/Mod";
import Player from "game/entity/player/Player";

export class Area {


    // public ID: string;
    // public OwnedBy: string;
    // public Claimable: boolean;

    private _ID: string;
    public get ID(): string {
        return this._ID;
    }
    public set ID(v: string) {
        this._ID = v;
    }

    private _OwnedBy: string = "";
    public get OwnedBy(): string {
        return this._OwnedBy;
    }
    public set OwnedBy(v: string) {
        this._OwnedBy = v;
    }

    private _Claimable: boolean = false;
    public get Claimable(): boolean {
        return this._Claimable;
    }
    public set Claimable(v: boolean) {
        this._Claimable = v;
    }


}

export default class Areas extends Mod {

    public static getAreaId(player: Player) {
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
     * Check if the area is a border. Border lots are off limits for claims
     * @param AreadID AreaID = IID XID YID
     * @returns 
     */
    public static isAreaBorderCoord(xID: number, yID: number): boolean {
        // 31 is border-right maximum for 512x512 island bounds
        // TODO: Add in island bounds for future island size updates
        if (xID == 0 || xID == 31) {
            return false;
        }

        // 31 is border-bottom maximum for 512x512 island bounds
        if (yID == 0 || yID == 31) {
            return false;
        }

        return true;
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