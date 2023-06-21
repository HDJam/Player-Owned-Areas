import Player from "game/entity/player/Player";
import { ModSettings } from "./ModSettings";
import { DataManager } from "./DataManager";
import Log from "utilities/Log";
import Areas from "./Areas";
import { MessageType } from "game/entity/player/IMessageManager";
import { IAreaData } from "./IDataSave";
import Register from "mod/ModRegistry";
import Message from "language/dictionary/Message";

export class PlayerSaveData {
    public ID: string;
    public Name: string;
    public ClaimedAreas: number;
}

export class PlayerData {

    /**
    * Initialize log and registry START
    */
    public constructor() {
        PlayerData.REGISTRY = this
    }

    // Mod shows in one color, Areas another. Consistent with log entries of main class.
    private static log: Log = new Log("[Mod]", "[PlayerData]");

    // Registry
    public static REGISTRY: PlayerData;


    @Register.message("MsgGetPlayerAreaDetails")
    public readonly MsgGetPlayerAreaDetails: Message;
    @Register.message("MsgGetPlayerDetails")
    public readonly MsgGetPlayerDetails: Message;
    @Register.message("MsgFriendList")
    public readonly MsgFriendList: Message;
    @Register.message("MsgFriendListEmpty")
    public readonly MsgFriendListEmpty: Message;


    @Register.message("MsgAreaFriendAddSuccess")
    public readonly MsgAreaFriendAddSuccess: Message
    @Register.message("MsgAreaFriendAddFailure")
    public readonly MsgAreaFriendAddFailure: Message
    @Register.message("MsgAreaFriendNotInList")
    public readonly MsgAreaFriendNotInList: Message
    @Register.message("MsgAreaFriendRemoveSuccess")
    public readonly MsgAreaFriendRemoveSuccess: Message
    @Register.message("MsgAreaFriendRemoveFailure")
    public readonly MsgAreaFriendRemoveFailure: Message
    @Register.message("MsgAreaFriendPreExists")
    public readonly MsgAreaFriendPreExists: Message;



    /**
     * Initialize log and registry END
     */



    /**
     * Checks player area limit. If no limit exists, data is created and 0 is returned.
     * @param player Pass the player data
     * @returns 
     */
    public static CheckPlayerAreaLimit(player: Player): boolean {
        const dataMgr = new DataManager;
        const data = dataMgr.GetPlayerData(player);

        // Check if areas is at or higher than limit
        if (data.ClaimedAreas >= ModSettings.MAX_CLAIMED_AREA) {
            return true;
        }

        // If limit or higher not met
        return false;
    }

    /**
     * Add to player area count
     * @param player Player Data
     * @param num Send 1 or -1 to add or remove 1
     * @returns Nothing
     */
    public static AddAreaCount(player: Player, num: number) {
        const dataMgr = new DataManager;
        const data = dataMgr.GetPlayerData(player);

        // If data exists, increment claimedAreas and store
        if (data) {
            data.ClaimedAreas += num;
            dataMgr.SetPlayerData(data);
        }

        return;
    }

    public static GetAreaCount(player: Player): number {
        const dataMgr = new DataManager;
        const data = dataMgr.GetPlayerData(player);

        // Return claimed area count
        return data.ClaimedAreas;
    }

    public static PrintFriendList(player: Player): void {
        this.log.debug("[PrintStoredDataByPlayerName]");
        const dataMgr = new DataManager;
        const playerData = dataMgr.GetPlayerDataById(player.identifier);

        if (playerData == undefined) {
            player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgFriendListEmpty);
            return;
        }

        var friendList = "";

        playerData.Friends.filter(element => { return friendList += element + "\n" });

        this.log.debug(friendList);
        player.messages.type(MessageType.Good).send(this.REGISTRY.MsgFriendList, friendList);
    }

    public static PrintStoredDataByPlayerName(targetPlayer: Player, player: Player): void {
        this.log.debug("[PrintStoredDataByPlayerName]");
        const dataMgr = new DataManager;
        const playerData = dataMgr.GetPlayerDataById(targetPlayer.identifier);
        var playerAreas = Areas.GetAreaDataByPlayerName(targetPlayer.name);

        // Output result to admin chat menu
        if (playerData) {
            player.messages.type(MessageType.Warning).send(this.REGISTRY.MsgGetPlayerDetails, playerData.ID, playerData.Name, playerData.ClaimedAreas);
        }

        // Does player own areas?
        if (playerAreas.length == 0) {
            return;
        }

        // Format area IDs into a message
        var AreaMsgStr = this.FormatMsgPlayerAreaIDs(playerAreas);

        // If area message is longer than 0 chars, print.
        if (AreaMsgStr.length > 0) {
            player.messages.type(MessageType.Warning).send(this.REGISTRY.MsgGetPlayerAreaDetails, AreaMsgStr);
        }

        /*Output:
            Player Details:\n
            ID: {0}\n
            Name: {1}\n
            Claimed Areas: {2}
        */

    }

    /**
     * Outputs a string containing all the player-owned areas by Area ID
     * @param data Array of areas
     * @returns string
     */
    private static FormatMsgPlayerAreaIDs(data: [string, IAreaData][]): string {
        var message = "";
        for (var index in data) {
            message += `${data[index][1].AreaData.ID}\n`
        }

        /*
            Claimed Areas:\n
            {0}
         */
        return message;
    }

    /**
     * Grabs the player object from playerManager if the player exists in game data.
     * @param name Name of player
     * @returns Player or undefined if not found.
     */
    public static GetTargetPlayerByName(name: string): Player | undefined {
        return game.playerManager.getByName(name);
    }

    /**
     * Check if user is an administrative user
     * @param name 
     * @returns boolean
     */
    public static IsUserAdmin(name: string): boolean {
        var admins = ModSettings.ADMIN_PLAYERS;

        this.log.warn("User Admin Check");
        this.log.info(admins);

        if (admins.includes(name.toLowerCase())) {
            this.log.info("User is an administrator!");
            return true;
        }

        this.log.info("User is NOT an administrator!");
        return false;
    }

    /**
     * Adds friend to the player's friend list.
     * @param player 
     * @param targetPlayerName 
     * @returns 
     */
    public static AddFriend(player: Player, targetPlayerName: string) {
        const dataMgr = new DataManager;
        var data = dataMgr.GetPlayerData(player);
        var isFriend = this.IsFriend(player, targetPlayerName.toLowerCase());
        this.log.debug("Add Friend:", targetPlayerName);

        if (isFriend == true) {
            player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgAreaFriendPreExists, targetPlayerName);
            return false;
        }

        // Friend not in list, add
        if (isFriend == false) {
            this.log.debug("Add Friend Before:", data.Friends);

            data.Friends.push(targetPlayerName);

            this.log.debug("Add Friend After:", data.Friends);

            // If change writes successfully
            if (dataMgr.SetPlayerData(data) == true) {
                // Friend added successfully

                player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAreaFriendAddSuccess, targetPlayerName)
                return true;
            }

            player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAreaFriendAddFailure, targetPlayerName);
        }

        return false;
    }

    /**
     * Removes friend from player's friend list.
     * @param player 
     * @param targetPlayerName 
     * @returns 
     */
    public static RemoveFriend(player: Player, targetPlayerName: string) {
        const dataMgr = new DataManager;
        var data = dataMgr.GetPlayerData(player);

        this.log.debug("Remove Friend:", targetPlayerName);

        // Is friend not in list
        if (this.IsFriend(player, targetPlayerName.toLowerCase()) == false) {
            player.messages.type(MessageType.Bad).send(this.REGISTRY.MsgAreaFriendNotInList, targetPlayerName);
            return false;
        }

        // Friend in list, remove
        if (this.IsFriend(player, targetPlayerName.toLowerCase()) == true) {

            this.log.debug("Remove Friend Before:", data.Friends);

            // Remove "filter" element thet equals the target name
            data.Friends = data.Friends.filter(element => {
                if (element.toLowerCase() != targetPlayerName.toLowerCase())
                    return true;
            });

            this.log.debug("Remove Friend Result:", data.Friends);

            if (dataMgr.SetPlayerData(data) == true) {
                player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAreaFriendRemoveSuccess, targetPlayerName);
                return true;
            }

            player.messages.type(MessageType.Good).send(this.REGISTRY.MsgAreaFriendRemoveFailure, targetPlayerName);
        }

        return false;
    }

    /**
     * Checks of player is a friend
     * @param player 
     * @param targetPlayerName 
     * @returns 
     */
    public static IsFriend(player: Player, targetPlayerName: string) {
        const dataMgr = new DataManager;
        var data = dataMgr.GetPlayerData(player);

        this.log.debug("Friend list:", data.Friends);

        if (data.Friends.includes(targetPlayerName.toLowerCase())) {
            // player is friend
            return true;
        }

        return false;
    }
}