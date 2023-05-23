import { Area } from "./Areas";

export interface ISaveData {
    lastVersion: string;
    /**
     * Data for each player in this save, indexed by their IDs.
     */
    playerData: { [key: string]: IPlayerData };
    areaData: { [key: string]: IAreaData };

}

export interface IAreaData {
    /**
     * Area identifier
     */
    // ID: string;

    /**
     * Data within area
     */
    // AreaData: Area;

    AreaData: [string, Area];
}

export interface IGlobalData {
    lastVersion: string;
    //areaData: { [key: string]: IAreaData };
    areaData: IAreaData;
}

export interface IPlayerData {
    /**
     * Number of areas currently claimed by user
     */
    claimedAreas: Number;
}

