import { Area } from "./Areas";

export interface ISaveData {
    lastVersion: string;
    /**
     * Data for each player in this save, indexed by their IDs.
     */
    //playerData: { [key: string]: IPlayerData };
    areaData: IAreaData
}

export interface IAreaData {
    /**
     * Area identifier
     */
    ID: string;

    /**
     * Data within area
     */
    AreaData: Area;

}

export interface IGlobalData {
    lastVersion: string;
    //areaData: { [key: string]: IAreaData };
    areaData: IAreaData;
}

// export interface IPlayerData {
//     /**
//      * Added to the player's strength
//      */
//     weightBonus: number;
//     /**
//      * Whether the player is immune to damage
//      */
//     invulnerable?: boolean;
//     /**
//      * Whether lighting is enabled
//      */
//     lighting?: boolean;
//     /**
//      * Whether the fog/field of view/fog of war is enabled
//      */
//     fog?: boolean;
//     /**
//      * Whether the player can use Debug Tools.
//      */
//     permissions?: boolean;
// }

