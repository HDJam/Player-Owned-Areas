import Mod from "mod/Mod";
import Player from "game/entity/player/Player";
import Log from "utilities/Log";

let log: Log;

export class Area {

    private _ID: string;
    public get AreaID(): string {
        return this._ID;
    }
    public set AreaID(v: string) {
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

    public static getAreaId(player: Player, x: number, y: number) {
        const IID = player.islandId.split(",");
        const XID = Math.floor(x / 16);
        const YID = Math.floor(y / 16);


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
     * 
     * @param player 
     * @returns 
     */
    public static isAreaBorderPlayer(player: Player): boolean {
        // Add in new param for island width.
        // Current player island width: player.island.world.width

        const xID = Math.floor(player.x / 16);
        const yID = Math.floor(player.y / 16);

        // 31 is border-right maximum for 512x512 island bounds
        // TODO: Add in island bounds for future island size updates
        if (xID == 0 || xID == 31) {
            // localPlayer.messages.type(MessageType.Good).send(this.msgAreaBorder)
            return false;
        }

        // 31 is border-bottom maximum for 512x512 island bounds
        if (yID == 0 || yID == 31) {
            // localPlayer.messages.type(MessageType.Good).send(this.msgAreaBorder)
            return false;
        }

        return true;
    }

}