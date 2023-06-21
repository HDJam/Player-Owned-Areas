import { Area, AreaSettings } from "./Areas";

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
    * Data within area
    */
    AreaData: Area;

    /**
     * Settings for area
     */
    Settings: AreaSettings;
}

export interface IPlayerData {
    /**
     * Number of areas currently claimed by user
     */
    ID: string;
    Name: string;
    ClaimedAreas: number;
    Friends: Array<string>;
}

export interface IGlobalData {
    lastVersion: string;
    //areaData: { [key: string]: IAreaData };
    areaData: IAreaData;
}