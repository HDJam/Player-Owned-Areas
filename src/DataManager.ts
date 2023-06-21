import Message from "language/dictionary/Message";
import Register from "mod/ModRegistry";
import Log from "utilities/Log";
import { IAreaData, IPlayerData } from "./IDataSave";
import Main from "./Mod";
import { Area, AreaSettings } from "./Areas";
import Player from "game/entity/player/Player";

export class DataManager {
    /**
     * Initialize log and registry START
     */
    public static REGISTRY: DataManager;

    @Register.message("")
    public readonly Msg: Message;

    public constructor() {
        DataManager.REGISTRY = this
    }

    private log: Log = new Log("[Mod]", "[DataManager]");
    /**
     * Initialize log and registry END
     */

    /**
     * Get data save instance from Main
     */
    private data = Main.data;

    ////////////////////////////////////
    // Hybrid methods
    //

    /**
     * Reset all player data including reinitializing areas the player owned to default state.
     * @param targetPlayer The player to be flushed.
     * @param player The player sending the request for message responses.
     * @returns Boolean, true = success
     */
    public ReinitAllPlayerData(targetPlayer: Player, areaIDs: [string, IAreaData][]): boolean {
        this.log.debug("[ReinitAllPlayerData]");

        if (areaIDs.length > 0) {
            this.log.debug("Areas:")
            for (var index in areaIDs) {
                const areaId = areaIDs[index][1].AreaData.ID;

                this.log.debug(areaId)

                this.InitAreaData(areaId);
            }
            this.log.debug(`Player areas flushed for ${targetPlayer.name}`);
        }

        this.InitPlayerData(targetPlayer);

        this.log.debug("Player data flushed.")

        return true;
    }


    ////////////////////////////////////
    // Area methods
    //

    /**
     * Initialize area data
     * @param areaId The area identifier
     * @returns IAreaData
     */
    public InitAreaData(areaId: string): IAreaData {
        this.log.info("[InitAreaData]");
        var data = this.data.areaData;

        this.log.info(areaId)
        this.log.info(data)

        // Store data
        return data[areaId] = {
            AreaData: { ID: areaId, OwnedBy: "", Claimable: true },
            Settings: new AreaSettings()
        };
    }

    /**
    * Parses data for area by key AreaID. Returns data if found.
    * @param areaId Area ID to get.
    * @param key The key returned by data.
    * @returns Area obj if found
    */
    public GetAreaData(areaId: string): IAreaData {
        this.log.info(`[getStoredAreaData] areaId: ${areaId};`);
        var areaInfo = new Area();
        areaInfo.ID = areaId

        const data = this.data.areaData[areaId];
        //const data = areaData[areaId];

        if (data) {
            return data;
        }

        this.log.warn("[getStoredAreaData] Area save data was undefined. Sending default data.")

        var dataMgr = new DataManager;
        return dataMgr.InitAreaData(areaId)
    }

    /**
     * Get all stored areas
     * @returns Array of area data
     */
    public GetAllAreaData() {
        this.log.info("[GetAllAreaData]");
        var areaData = this.data.areaData;
        this.log.debug(areaData);
        return areaData
    }

    /**
    * Stores area data by area ID
    * @param area Area
    * @returns Boolean
    */
    public SetAreaData(area: IAreaData): boolean {
        this.log.info(`[SetAreaData] set info (${localPlayer.name}: ${area.AreaData.ID})`);
        this.log.info(area);

        try {
            // Lowercase all entries before storage
            area.AreaData.OwnedBy = area.AreaData.OwnedBy.toLowerCase();
            this.data.areaData[area.AreaData.ID] = area;
        } catch (ex) {
            this.log.error(ex)
            return false;
        }

        return true;
    }


    ////////////////////////////////////
    // Player methods
    //

    /**
     * Initialize player data
     * @param player Player object
     * @param key PlayerData
     * @returns number
     */
    public InitPlayerData(player: Player): IPlayerData {
        this.log.info("[InitPlayerData]");
        var pdata = this.data.playerData;

        // Store data
        return pdata[player.identifier] = {
            ID: player.identifier,
            Name: player.name,
            ClaimedAreas: 0,
            Friends: []
        };
    }

    /**
     * Checks for player data. If none exists, a new player dataset is created.
     * @param player The target player 
     * @returns Player data
     */
    public GetPlayerData(player: Player) {
        this.log.info("[GetPlayerData]");
        const data = this.data.playerData[player.identifier];

        // If data didnt exist
        if (data == undefined) {
            this.log.info("Data didn't exist!");

            // Return new player data
            return this.InitPlayerData(player);
        }

        // If data exists
        this.log.info("Data existed!");
        return data;
    }

    /**
    * Get player data by player ID
    * @param targetPlayerId 
    * @returns 
    */
    public GetPlayerDataById(targetPlayerId: string): IPlayerData | undefined {
        this.log.debug("GetPlayerDataById");
        const data = this.data.playerData[targetPlayerId];
        return data;
    }

    /**
     * Saves new player data.
     * @param pdata The new player data to store
     * @returns Boolean
     */
    public SetPlayerData(pdata: IPlayerData): boolean {
        this.log.info("[SetPlayerData]");
        this.log.info(pdata);

        try {
            this.data.playerData[pdata.ID] = pdata;
        } catch (ex) {
            this.log.error(ex);
            return false
        }

        return true;
    }
}