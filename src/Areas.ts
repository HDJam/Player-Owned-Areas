import Player from "game/entity/player/Player";
import Tile from "game/tile/Tile";
import Log from "utilities/Log";
import Register from "mod/ModRegistry";
import Message from "language/dictionary/Message";
import { MessageType } from "game/entity/player/IMessageManager";
import { IAreaData } from "./IDataSave";
import { DataManager } from "./DataManager";
import { ModSettings } from "./ModSettings";
import { PlayerData } from "./PlayerData";

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

export default class Areas {

    /**
    * Initialize log and registry START
    */
    public constructor() {
        Areas.REGISTRY = this
    }

    // Mod shows in one color, Areas another. Consistent with log entries of main class.
    private static log: Log = new Log("[Mod]", "[Areas]");

    // Registry
    public static REGISTRY: Areas;

    // Messages
    @Register.message("motd")
    public readonly motd: Message;
    @Register.message("MsgAreaLimitHit")
    public readonly MsgAreaLimitHit: Message;
    @Register.message("MsgClaimAlreadyOwner")
    public readonly MsgClaimAlreadyOwner: Message;
    @Register.message("MsgAreaNotAvailable")
    public readonly MsgAreaNotAvailable: Message;
    @Register.message("MsgAreaClaimSuccess")
    public readonly MsgAreaClaimSuccess: Message;
    @Register.message("MsgAbandonAreaError")
    public readonly MsgAbandonAreaError: Message;
    @Register.message("MsgAbandonAreaSuccess")
    public readonly MsgAbandonAreaSuccess: Message;
    @Register.message("MsgAbandonAreaUnassigned")
    public readonly MsgAbandonAreaUnassigned: Message;
    @Register.message("MsgAbandonAreaNotOwner")
    public readonly MsgAbandonAreaNotOwner: Message;
    @Register.message("MsgAreaNotOwned")
    public readonly MsgAreaNotOwned: Message;
    @Register.message("MsgAreaBorder")
    public readonly msgAreaBorder: Message;
    @Register.message("MsgLandAreaAvailable")
    public readonly msgLandAreaAvailable: Message;
    @Register.message("MsgAreaCheckIsFriend")
    public readonly MsgAreaCheckIsFriend: Message
    @Register.message("MsgPlayerOwnsArea")
    public readonly MsgPlayerOwnsArea: Message;

    /**
     * Initialize log and registry END
     */



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

    /**
    * Gets the current stored area count for player
    * @param player Player object
    * @param playerData Player data
    * @returns Number or 0 if no areas existed
    */
    public static GetAreaCount(player: Player): number {
        this.log.info("[GetAreaCount]");

        const dataMgr = new DataManager;
        var data = dataMgr.GetPlayerData(player);

        return data.ClaimedAreas;
    }

    /**
     * Checks player area limit. If no limit exists, data is created and 0 is returned.
     * @param player Pass the player data
     * @returns 
     */
    private static CheckPlayerAreaLimit(player: Player): boolean {
        this.log.info("[CheckPlayerAreaLimit]");

        const dataMgr = new DataManager;
        const data = dataMgr.GetPlayerData(player);

        // Did reach limit
        if (data.ClaimedAreas >= ModSettings.MAX_CLAIMED_AREA) {
            return true;
        }

        // Did not reach limit
        return false;
    }

    /**
     * Process area claim request.
     * @param player Current player.
     * @returns nothing
     */
    public static ClaimArea(player: Player): void {
        this.log.info("[ClaimArea]")
        const limit = this.CheckPlayerAreaLimit(player);

        if (limit == true) {
            player.messages.type(MessageType.Warning).send(this.REGISTRY.MsgAreaLimitHit, ModSettings.MAX_CLAIMED_AREA)
            return;
        }

        const dataMgr = new DataManager;

        var areaId = Areas.getAreaId(player);
        var area = dataMgr.GetAreaData(areaId);


        if (this.IsPlayerAreaOwner(areaId, player) == true) {
            player.messages.type(MessageType.Stat).send(this.REGISTRY.MsgClaimAlreadyOwner);
            return;
        }

        if (area.AreaData.Claimable == false) {
            player.messages.type(MessageType.Warning).send(this.REGISTRY.MsgAreaNotAvailable, area.AreaData.OwnedBy);
        }

        if (area.AreaData.Claimable == true) {
            area.AreaData.ID = areaId;
            area.AreaData.Claimable = false;
            area.AreaData.OwnedBy = player.name.toLowerCase();

            area.Settings.isProtected = true;

            this.log.info("Area is claimable. Attempting to store data:")
            this.log.info(area)

            if (dataMgr.SetAreaData(area) === true) {
                player.messages.type(MessageType.Stat).send(this.REGISTRY.MsgAreaClaimSuccess);
                this.AddAreaCount(player, 1);
                return;
            }
        }
    }

    /**
    * Add area count to the player's total. If player data doesnt exist, it is initialized.
    * @param player Player Data
    * @param num Send 1 or -1 to add or remove 1
    * @returns Nothing
    */
    public static AddAreaCount(player: Player, num: number) {
        this.log.info("[AddAreaCount]");
        const dataMgr = new DataManager;
        var data = dataMgr.GetPlayerData(player);

        data.ClaimedAreas += num;

        dataMgr.SetPlayerData(data);
    }

    /**
     * Get area ID owned by the target player.
     * @param targetPlayerName Player name
     * @returns Array of area IDs
     */
    public static GetAreaDataByPlayerName(targetPlayerName: string): [string, IAreaData][] {
        this.log.debug("[GetAreaDataByPlayerName]");
        const dataMgr = new DataManager;
        const data = dataMgr.GetAllAreaData();

        // Convert object to array
        var areaList = Object.entries(data);

        // ************TODO: Put this filter in other comparisons (such as friends list)

        // Return all areas owned by the target player's name
        var ownedAreas = areaList.filter(element => {
            if (element[1].AreaData.OwnedBy.toLowerCase() == targetPlayerName.toLowerCase())
                return true;
        });

        return ownedAreas;
    }

    /**
    * Sets a blank area in storage
    * @param area Area
    * @returns Boolean
    */
    public static PlayerAbandonArea(area: IAreaData, player: Player): boolean {
        // initializes it if it doesn't exist
        this.log.debug(`[PlayerAbandonArea] (${player.name}: ${area.AreaData.ID})`);

        if (player.name == "" || player.name == undefined) {
            player.messages.type(MessageType.Stat).send(this.REGISTRY.MsgAbandonAreaUnassigned)
            return false;
        }

        if (player.name.toLowerCase() == area.AreaData.OwnedBy.toLowerCase()) {
            var dataMgr = new DataManager;
            var result = dataMgr.InitAreaData(area.AreaData.ID);

            // If owned by resets to blank
            if (result.AreaData.OwnedBy == "") {
                player.messages.type(MessageType.Stat).send(this.REGISTRY.MsgAbandonAreaSuccess);
                Areas.AddAreaCount(player, -1);
                return true;
            }

            player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgAbandonAreaError);
            return false;
        }

        player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgAbandonAreaNotOwner);
        return false;
    }

    /**
    * Checks if the area the player is facing is protected by player-owned area.
    * True = protected; false = unprotected.
    * @param player Current player.
    * @returns Boolean
    */
    public static CheckAreaProtected(player: Player): boolean {
        const facingAreaId = Areas.getAreaIdTile(player.facingTile);
        const dataMgr = new DataManager;
        var targetArea = dataMgr.GetAreaData(facingAreaId);

        // Initialize data if not existing
        if (targetArea == undefined) {
            this.log.warn("Area save data was undefined. Creating new data.");
            dataMgr.InitAreaData(facingAreaId);
            return false;
        }

        if (targetArea.AreaData.OwnedBy.toLowerCase() == player.name.toLowerCase()) {
            this.log.debug("Player owns area.");
            return false;
        }

        this.log.debug("Area was defined");

        // If area is not protected
        if (targetArea.Settings.isProtected == false) {
            this.log.debug("Area is not protected.");
            return false;
        }

        this.log.debug(`Area is protected. Checking if ${player.name} is friend.`);

        // If player is in friend list
        if (PlayerData.IsFriend(player, targetArea.AreaData.OwnedBy.toLowerCase())) {
            // if (targetArea.Settings.friends.includes(player.name.toLowerCase())) {
            this.log.debug("Player is friend and has access to area functions.");
            return false;
        }

        this.log.debug("User not a friend of owner");

        this.log.debug("Area protected, disable player functions.");
        return true;
    }

    /**
    * Check area details when called by player command.
    * Command: /areas check
    * @param player Player object for checking position.
    * @returns void
    */
    public static CmdCheckArea(player: Player) {
        var areaId: string;

        if (this.isAreaBorderPlayer(player) === true) {
            this.log.warn("Area is a border!");
            localPlayer.messages.type(MessageType.Warning).send(this.REGISTRY.msgAreaBorder);
            return;
        }

        const dataMgr = new DataManager;

        areaId = Areas.getAreaId(player);
        this.log.debug(`Area is not a border! Area ID: ${areaId}`);

        var area = dataMgr.GetAreaData(areaId);

        if (area == undefined) {
            dataMgr.InitAreaData(areaId);

            // message user error occurred
            this.log.warn("getStoredAreaData returned undefined!")
            return;
        }

        if (area.AreaData.Claimable == true) {
            // message user area is available
            player.messages.type(MessageType.Stat).send(this.REGISTRY.msgLandAreaAvailable);
            this.log.info("Area is unclaimed!")
            return;
        }

        if (this.IsPlayerAreaOwner(areaId, player)) {
            player.messages.type(MessageType.Stat).send(this.REGISTRY.MsgPlayerOwnsArea);
            return;
        }

        player.messages.type(MessageType.Warning).send(this.REGISTRY.MsgAreaNotAvailable, area.AreaData.OwnedBy);

        if (area.Settings.friends.includes(player.name.toLowerCase())) {
            player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAreaCheckIsFriend);
        }

        this.log.info(`Area is already claimed by ${area.AreaData.OwnedBy}`);
    }

    /**
     * Checks to see if player owns the area.
     * @param areaId The area ID
     * @param player The player for comparison
     * @returns 
     */
    public static IsPlayerAreaOwner(areaId: string, player: Player): boolean {
        const dataMgr = new DataManager;
        var area = dataMgr.GetAreaData(areaId);

        if (area.AreaData.OwnedBy.toLowerCase() == player.name.toLowerCase()) {
            return true;
        }

        return false;
    }

    /**
     * See if the area is owned.
     * @param areaData 
     * @returns 
     */
    public static IsAreaOwned(areaData: IAreaData): Boolean {
        if (areaData.AreaData.OwnedBy == "") {
            return false
        }
        return true;
    }


    /**
     * Determine if x or y of both tiles are the same area or not. 
     * @param newTile The tile the player moved to
     * @param fromTile The tile the player was on
     * @returns Boolean
     */
    public static IsNewArea(newTile: Tile, fromTile: Tile): Boolean {

        // If X doesnt match, new area detected
        if (Math.floor(newTile.x / 16) != Math.floor(fromTile.x / 16)) {
            return true;
        }

        // If Y doesnt match, new area detected
        if (Math.floor(newTile.y / 16) != Math.floor(fromTile.y / 16)) {
            return true;
        }

        // If neither match, not an new area.
        return false;
    }


    ////////////////////////////////////
    // Admin methods
    //
}

export class arr extends Array {
    public static RemoveStringEntry(targetPlayerName: string, areaInfo: IAreaData): string[] {
        const index = areaInfo.Settings.friends.indexOf(targetPlayerName) - 1;

        areaInfo.Settings.friends = areaInfo.Settings.friends.splice(index, 1);

        return areaInfo.Settings.friends;
    }
}