import { ActionType } from "game/entity/action/IAction";

export class ModSettings {
    /**
     * Maximum areas allowed to own per player. (Default = 16)
     */
    public static readonly MAX_CLAIMED_AREA = 16;

    /**
     * Administrator users, NAMES MUST BE ALL LOWERCASE.
     */
    public static readonly ADMIN_PLAYERS = ["hdjam", "someguy"];

    /**
     * Show the MOTD on game load? (Default = true)
     */
    public static readonly ShowMOTD = true;

    /**
     * Enter a message of the day (Default = "Welcome to the server!")
     */
    public static readonly MOTD = "Welcome to the server!";

    /**
     * Actions that are disabled when an area is protected.
     * Comment a line below to disable specific protection.
     * Protections options are limited to what is available below.
     */
    public static readonly AreaActionProtection = [
        ActionType.AddFuel,
        ActionType.AttachContainer,
        ActionType.Attack,
        ActionType.Build,
        ActionType.Butcher,
        ActionType.CageCreature,
        ActionType.Chop,
        ActionType.CloseContainer,
        ActionType.DetachContainer,
        ActionType.Dig,
        ActionType.Drop,
        ActionType.Extinguish,
        ActionType.Gather,
        ActionType.GatherLiquid,
        ActionType.GrabAll,
        ActionType.Harvest,
        ActionType.Hitch,
        ActionType.Lockpick,
        ActionType.Melee,
        ActionType.Mine,
        ActionType.OpenContainer,
        ActionType.PickUp,
        ActionType.PickUpAllItems,
        ActionType.PickUpExcrement,
        ActionType.PickUpItem,
        ActionType.PlaceDown,
        ActionType.Pour,
        ActionType.PourOnYourself,
        ActionType.PropOpenDoor,
        ActionType.Release,
        ActionType.Ride,
        ActionType.SetDown,
        ActionType.SmotherFire,
        ActionType.StartFire,
        ActionType.Tame,
        ActionType.Till,
        ActionType.ToggleContainer,
        ActionType.ToggleDoor,
        ActionType.ToggleHitch,
        ActionType.ToggleTilled,
        ActionType.ToggleVehicle,
        ActionType.Throw,
        ActionType.Uncage,
        ActionType.Unhitch
    ];
}