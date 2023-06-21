# About 
This mod will allow admins to create "safe" zones on maps and allow players to create protected land for their bases!

# Settings
This mod has settings. You may modify the file "Out/ModSettings.js" file and change various options used in the mod.

| Setting                | Description                                              |
|------------------------|----------------------------------------------------------|
| MAX_CLAIMED_AREA       | The maximum number of areas a player may own per server. |
| ADMIN_PLAYERS          | Players that have access to Admin and Debug commands.    |
| ShowMOTD               | Show the custom Message of the Day on player login.      |
| MOTD                   | The message that displays to players when they login.    |
| AreaActionProtection   | The actions that are blocked for protected areas.        |

# Commands
## Area Commands
| Command | Subcommand | Parameters                      | Description                                                                                                                                        |
|---------|------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| /areas  | check      |                                 | Check current area that the player is standing on. The command will explain if the area is available or claimed in chat.                           |
| /areas  | claim      |                                 | Allows player to claim the area they are currently on. Claim command will respond with if successful, error, or if another player already claimed. |
| /areas  | abandon    |                                 | Allows player to abandon the area they are currently on if owned by the player.                                                                    |
| /areas  | count      |                                 | Allows the player to see how many areas they claimed vs the maximum allowed on the server. Default maximum is 16.                                  |
| /areas  | friends    | \<add\|remove\> \<player name\> | Add/Remove a friend to the current area.                                                                                                           |
| /areas  | friends    | list                            | Display list of current friend.                                                                                                                    |

## Help Commands
| Command | Subcommand | Parameter | Result               |
|---------|------------|-----------|----------------------|
| /areas  | help       | (None)    | General help message |
| /areas  | help       | check     | Check description    |
| /areas  | help       | claim     | Claim description    |
| /areas  | help       | abandon   | Abandon description  |
| /areas  | help       | commands  | Commands description |

## Admin Commands
| Command | Subcommand | Parameters                                                     | Description                                                                     |
|-------- |------------|----------------------------------------------------------------|---------------------------------------------------------------------------------|
| /areas  | admin      |                                                                | Unknown command message will display. (Will eventually show admin help message) |
| /areas  | admin      | \<player name\>                                                | Get player details and owned areas.                                             |
| /areas  | admin      | flushdata \<player name\>                                      | Reset's specified player's data. This includes owned areas.                     |
| /areas  | admin      | claim \<player name\>                                          | Claim an area in the name of a player.                                          |
| /areas  | admin      | friends \<add\|remove\> \<player name\> \<friend name\>        | Add or remove a friend to the area currently standing on.                       |
| /areas  | admin      | abandon                                                        | Abandon an area the user is standing on no matter the player.                   |
| /areas  | admin      | reinit \<player name\>                                         | Reset player data. This does not include owned areas.                           |

## Debug Commands
| Command | Subcommand | Parameters | Description                                                   |
|---------|------------|------------|---------------------------------------------------------------|
| /areas  | debug      |            | Unknown command received.                                     |