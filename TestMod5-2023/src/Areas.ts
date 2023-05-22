import Mod from "mod/Mod";
import { IAreaData, IGlobalData, ISaveData } from "./IDataSave";
import Player from "game/entity/player/Player";

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
    public static isAreaBorder(xID: number, yID: number): boolean {
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
     * Get the area details from the specified position
     * @param islandId  Island Identifier 
     * @param x         x pos
     * @param y         y pos
     * @returns         object TBD
     */
    public static getAreaData(areaId: string): Area {
        var iArea = this.getStoredAreaData(areaId, "ID");
        var area = new Area();

        area.AreaID = iArea.AreaData.AreaID;
        area.Claimable = iArea.AreaData.Claimable;
        area.OwnedBy = iArea.AreaData.OwnedBy;

        console.log("getAreaDetails");
        console.log(area);

        return area;
    }




    ////////////////////////////////////
    // Data Storage
    //

    @Mod.saveData<Areas>()
    public static data: ISaveData;
    @Mod.globalData<Areas>()
    public globalData: IGlobalData;

    /**
     * Stores data
     * @param area Area
     * @returns Boolean
     */
    public static setStoredAreaData(area: Area): boolean {
        // initializes it if it doesn't exist
        this.getStoredAreaData(area.AreaID, "ID");

        this.data.areaData = { ID: area.AreaID, AreaData: area };

        console.log("setStoredAreaData");
        console.log(area);

        return true;
    }


    /**
    * Parses global data for area by key AreaID. Returns data if found.
    * @param areaId Area ID to get.
    * @param key The key returned by data.
    * @returns Area obj if found
    */
    public static getStoredAreaData<K extends keyof IAreaData>(areaId: string, key: K): IAreaData {
        console.log("getStoredAreaData");
        console.log(`areaId:${areaId}; key:${key};`);

        try {
            this.data.areaData;
        } catch (err) {
            var areaInfo = new Area();

            areaInfo.AreaID = areaId;
            areaInfo.Claimable = true;
            areaInfo.OwnedBy = "";

            const areaData = {
                ID: areaId,
                AreaData: areaInfo
            };
            return areaData;
        }

        const areaData = this.data.areaData;
        const data = areaData;

        console.log(`areaData:${data}`);

        return data;

    }

    /**
     * Parses global data for area by key AreaID. Returns data if found.
     * @param areaId Area ID to get.
     * @param key The key returned by data.
     * @returns Area obj if found
     */
    // public static getStoredAreaData<K extends keyof IAreaData>(areaId: string, key: K): IAreaData[K] {
    //     console.log("getStoredAreaData");
    //     console.log(`areaId:${areaId}; key:${key};`);


    //     // public static getStoredAreaData(areaId: string): IAreaData {
    //     const areaData = this.data.areaData;
    //     const data = areaData[areaId];


    //     console.log(data);

    //     if (data) {
    //         return data[key];
    //     }

    //     return ({
    //         AreaID: areaId,
    //         Claimable: true,
    //         OwnedBy: ""
    //     })[key];

    // }

    /**
     * Parses global data for area by key AreaID. Returns data if found.
     * @param areaId Area ID to get.
     * @returns Area obj if found
     */
    // public static getStoredAreaData(areaId: string): IAreaData {
    //     const areaData = this.data.areaData;
    //     const data = areaData[areaId];

    //     console.log("getStoredAreaData");
    //     console.log(data);

    //     if (data) {
    //         return data;
    //     }

    //     return (areaData[areaId] = {
    //         AreaID: areaId,
    //         Claimable: true,
    //         OwnedBy: ""
    //     });

    // }












    /**
     * ### function likely not needed - Replaced by getAreaData ###
     * Is the tile the player looking at in a new area.
     * TODO: Currently looking at single-digit destination x and y of 0 or 9 based on a 10x10 tiles-per-chunk size
     * TODO: Drathy confirmed maps are 512x512 by default. 0-511 for each axis assuming "0 index"
     * TODO: Figure out map bounds and divide into equal chunks. Drathy stated the bounds are
     *       factored by the power of 2. 256, 512, 1024 etc may be all potential axis bounds in the future
     *              
     * @param x   User is currently on x     
     * @param y   User is currently on y
     * @param x2  User is looking at x
     * @param y2  User is lookign at y
     * @returns boolean
     */
    public static checkNewArea(x: number, y: number, x2: number, y2: number): boolean {
        const x2Str = x2.toString();
        const y2Str = y2.toString();
        const xStr = x.toString();
        const yStr = y.toString();

        const destX = x2Str.charAt(x2Str.length - 1);
        const destY = y2Str.charAt(y2Str.length - 1);
        const srcX = xStr.charAt(xStr.length - 1);
        const srcY = yStr.charAt(yStr.length - 1);

        // TODO: Currently when player walks along 9 or 0 axis, they are spammed with warnings.
        //      IE: If on x=9 and walks up and down, y changes but not X.
        //      Need to identify a way to check all scenarios. However also need to come up with new 
        //      area "chunks" based on 512 map size.


        if (destX == "9" && srcX == "0") {
            return true;
        }

        if (destX == "0" && srcX == "9") {
            return true;
        }

        if (destY == "9" && srcY == "0") {
            return true;
        }

        if (destY == "0" && srcY == "9") {
            return true;
        }

        return false;
    }



    /**
  * Sets debug tools player data.
  * @param player The player to set data for.
  * @param key The key in `IPlayerData` to set data to.
  * @param value The value which should be stored in this key on the player data.
  * 
  * Note: If the player doesn't have data stored yet, it's created first.
  * 
  * Note: Emits `DebugToolsEvent.PlayerDataChange` with the id of the player, the key of the changing data, and the new value.
  */
    // public setPlayerData<K extends keyof IPlayerData>(player: Player, key: K, value: IPlayerData[K]) {
    //     // this.getPlayerData(player, key); // initializes it if it doesn't exist
    //     // this.data.playerData[player.identifier][key] = value;

    //     this.event.emit("playerDataChange", player.id, key, value);

    //     if (!this.hasPermission() && gameScreen) {
    //         gameScreen.dialogs.close(this.dialogMain);
    //         gameScreen.dialogs.close(this.dialogInspect);
    //     }
    // }

    /**
     * Returns a value from the debug tools player data.
     * @param player The player to get the data of.
     * @param key A key in `IPlayerData`, which is the index of the data that will be returned.
     * 
     * Note: If the player data doesn't yet exist, it will be created.
     */
    // public getPlayerData<K extends keyof IPlayerData>(player: Player, key: K): IPlayerData[K] {
    //     const playerData = this.data.playerData;
    //     const data = playerData[player.identifier];
    //     if (data) {
    //         return data[key];
    //     }

    //     return (playerData[player.identifier] = {
    //         weightBonus: 0,
    //         invulnerable: false,
    //         permissions: player.isServer(),
    //         fog: undefined,
    //         lighting: true,
    //     })[key];
    // }


}