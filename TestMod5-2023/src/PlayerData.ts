import Player from "game/entity/player/Player";
import { ISaveData } from "./IDataSave";
import Mod from "mod/Mod";
import { ModSettings } from "./Mod";

export class PlayerSaveData {
    public ID: string;
    public Name: string;
    public ClaimedAreas: number;
}

export class PlayerData {
    @Mod.saveData<Mod>()
    public static pdata: ISaveData;

    public initializeSaveData(data?: ISaveData) {
        return data = {
            areaData: {},
            playerData: {},
            lastVersion: "",
        };
    }


    private static InitPlayerData<K extends keyof ISaveData>(player: Player, key: K) {
        var pdata = this.pdata.playerData;
        return pdata[player.identifier] = {
            ID: player.identifier,
            Name: player.name,
            ClaimedAreas: 0
        };
    }

    /**
     * Checks player area limit. If no limit exists, data is created and 0 is returned.
     * @param player Pass the player data
     * @returns 
     */
    public static CheckPlayerAreaLimit(player: Player): boolean {
        const playerData = this.pdata.playerData;
        const data = playerData[player.identifier];

        // If data exists
        if (data) {
            // Check if areas is at or higher than limit
            if (data.ClaimedAreas >= ModSettings.MAX_CLAIMED_AREA) {
                return true;
            }

            // If limit or higher not met
            return false;
        }

        // If data didnt exist, create it.
        this.InitPlayerData(player, "playerData");

        // Return false as new user will never have limit
        return false;
    }

    /**
     * 
     * @param player Player Data
     * @param num Send 1 or -1 to add or remove 1
     * @returns Nothing
     */
    public static AddAreaCount(player: Player, num: number) {
        const playerData = this.pdata.playerData;
        const data = playerData[player.identifier];

        // If data exists, increment claimedAreas and store
        if (data) {

            data.ClaimedAreas++;
            playerData[player.identifier] = data;
        }

        this.InitPlayerData(player, "playerData");
        const newData = playerData[player.identifier];

        if (newData) {
            newData.ClaimedAreas++;
            playerData[player.identifier] = newData;
        }

        return;
    }

    public static GetAreaCount(player: Player): number {
        console.log("TEST");
        //log.info("Test!");
        const playerData = this.pdata.playerData;
        console.log("TEST");
        const data = playerData[player.identifier];
        console.log("TEST");


        // If data exists
        if (data) {
            console.log("TEST data");
            // Return claimed area count
            return data.ClaimedAreas;
        }
        console.log("TEST no data");
        // If data didnt exist, create it.
        this.InitPlayerData(player, "playerData");

        // Return 0 as new players never have claimed areas by default
        return 0;
    }
}