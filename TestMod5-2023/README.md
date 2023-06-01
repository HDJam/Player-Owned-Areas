# AREAS 
This mod will allow admins to create "safe" zones for players and 


# Commands
## Area Commands
| Command | Subcommand | Description                                                                                                                                        |
|---------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| /areas  | check      | Check current area that the player is standing on. The command will explain if the area is available or claimed in chat.                           |
| /areas  | claim      | Allows player to claim the area they are currently on. Claim command will respond with if successful, error, or if another player already claimed. |
| /areas  | abandon    | Allows player to abandon the area they are currently on if owned by the player.                                                                    |
| /areas  | count      | Allows the player to see how many areas they claimed vs the maximum allowed on the server. Default maximum is 16.                                  |

## Help Commands
| Command | Subcommand | Parameter | Result               |
|---------|------------|-----------|----------------------|
| /areas  | help       | (None)    | General help message |
| /areas  | help       | check     | Check description    |
| /areas  | help       | claim     | Claim description    |
| /areas  | help       | abandon   | Abandon description  |
| /areas  | help       | commands  | Commands description |

## Admin Commands
| Command Word | Subcommand | Parameter 1   | Parameter 2   | Description                                                 |
|--------------|------------|---------------|---------------|-------------------------------------------------------------|
| /areas       | admin      |               |               | Unknown command message will display.                       |
| /areas       | admin      | <player name> |               | Get player details and owned areas.                         |
| /areas       | admin      | FlushData     | <player name> | Reset's specified player's data. This includes owned areas. |

## Debug Commands
| Command Word | Subcommand | Parameter | Sub-Param 1   | Sub-Param 2   | Description                                                   |
|--------------|------------|-----------|---------------|---------------|---------------------------------------------------------------|
| /areas       | debug      | claim     | <player name> |               | Claim an area in the name of a player.                        |
| /areas       | debug      | friends   | <add/remove>  | <player name> | Add or remove a friend to the area currently standing on.     |
| /areas       | debug      | abandon   |               |               | Abandon an area the user is standing on no matter the player. |
| /areas       | debug      | reinit    | <player name> |               | Reset player data. This does not include owned areas.         |
| /areas       | debug      | (None)    |               |               | Show default admin help message.                              |