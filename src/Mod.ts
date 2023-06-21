import { MessageType } from "game/entity/player/IMessageManager";
import Register from "mod/ModRegistry";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import Message from "language/dictionary/Message";
import { EventHandler } from "event/EventManager";
import { EventBus } from "event/EventBuses";
import Tile from "game/tile/Tile";
import Player from "game/entity/player/Player";
import { IGlobalData, ISaveData } from "./IDataSave";
import Version from "./Version";
import Areas from "./Areas";
import Ignite from "game/entity/action/actions/Ignite";
import { IInjectionApi, InjectObject, InjectionPosition, Inject } from "utilities/class/Inject";
import Human from "game/entity/Human";
import { IOptions } from "save/data/ISaveDataGlobal";
import { ModSettings } from "./ModSettings";
import GameScreen from "ui/screen/screens/GameScreen";
import { DataManager } from "./DataManager";
import { ActionType } from "game/entity/action/IAction";
import { Direction } from "utilities/math/Direction";

// Permission Checks/Injects
import Attack from "game/entity/action/actions/Attack";
import Build from "game/entity/action/actions/Build";
import Butcher from "game/entity/action/actions/Butcher";
import Chop from "game/entity/action/actions/Chop";
import DetachContainer from "game/entity/action/actions/DetachContainer";
import Dig from "game/entity/action/actions/Dig";
import Drop from "game/entity/action/actions/Drop";
import Extinguish from "game/entity/action/actions/Extinguish";
import Gather from "game/entity/action/actions/Gather";
import GatherLiquid from "game/entity/action/actions/GatherLiquid";
import GrabAll from "game/entity/action/actions/GrabAll";
import Harvest from "game/entity/action/actions/Harvest";
import Hitch from "game/entity/action/actions/Hitch";
import Melee from "game/entity/action/actions/Melee";
import Mine from "game/entity/action/actions/Mine";
import OpenContainer from "game/entity/action/actions/OpenContainer";
import PickUp from "game/entity/action/actions/PickUp";
import PickUpAllItems from "game/entity/action/actions/PickUpAllItems";
import PickUpItem from "game/entity/action/actions/PickUpItem";
import PlaceDown from "game/entity/action/actions/PlaceDown";
import Pour from "game/entity/action/actions/Pour";
import PourOnYourself from "game/entity/action/actions/PourOnYourself";
import PropOpenDoor from "game/entity/action/actions/PropOpenDoor";
import Release from "game/entity/action/actions/Release";
import Ride from "game/entity/action/actions/Ride";
import SetDown from "game/entity/action/actions/SetDown";
import SmotherFire from "game/entity/action/actions/SmotherFire";
import StokeFire from "game/entity/action/actions/StokeFire";
import Tame from "game/entity/action/actions/Tame";
import Till from "game/entity/action/actions/Till";
import ToggleTilled from "game/entity/action/actions/ToggleTilled";
import Throw from "game/entity/action/actions/Throw";
import Unhitch from "game/entity/action/actions/Unhitch";


// Untested:
import ToggleContainers from "game/entity/action/actions/ToggleContainer";
import ToggleDoors from "game/entity/action/actions/ToggleDoor";
import ToggleHitch from "game/entity/action/actions/ToggleHitch";
import ToggleVehicle from "game/entity/action/actions/ToggleVehicle";
import AddFuel from "game/entity/action/actions/AddFuel";
import StartFire from "game/entity/action/actions/StartFire";
import Lockpick from "game/entity/action/actions/Lockpick";
import CageCreature from "game/entity/action/actions/CageCreature";
import Uncage from "game/entity/action/actions/Uncage";
import PickUpExcrement from "game/entity/action/actions/PickUpExcrement";
import AttachContainer from "game/entity/action/actions/AttachContainer";
import CloseContainer from "game/entity/action/actions/CloseContainer";
import Commands from "./Commands";
import { PlayerData } from "./PlayerData";


//import ToggleProtectedItems from "game/entity/action/actions/ToggleProtectedItems";

let log: Log;

export default class Main extends Mod {

    ////////////////////////////////////
    // Messages
    //

    @Register.message("MsgMotd")
    public readonly MsgMotd: Message;
    @Register.message("MsgUnknownCommand")
    public readonly MsgUnknownCommand: Message;
    @Register.message("MsgAdminUnknownCommand")
    public readonly MsgAdminUnknownCommand: Message;
    @Register.message("MsgAreaCount")
    public readonly MsgAreaCount: Message;
    @Register.message("MsgNotEnoughPermissions")
    public readonly MsgNotEnoughPermissions: Message
    @Register.message("MsgGetPlayerAreaDetails")
    public readonly MsgGetPlayerAreaDetails: Message
    @Register.message("MsgGetPlayerDetails")
    public readonly MsgGetPlayerDetails: Message
    @Register.message("MsgFlushSuccess")
    public readonly MsgFlushSuccess: Message
    @Register.message("MsgFlushFailure")
    public readonly MsgFlushFailure: Message
    @Register.message("MsgCmdPlayerMissing")
    public readonly MsgCmdPlayerMissing: Message
    @Register.message("MsgCmdFriendSubCommandMissing")
    public readonly MsgCmdFriendSubCommandMissing: Message
    @Register.message("MsgAreaNotOwned")
    public readonly MsgAreaNotOwned: Message;

    // Help Messages
    @Register.message("MsgHelpGeneral")
    public readonly MsgHelpGeneral: Message;
    @Register.message("MsgHelpCommands")
    public readonly MsgHelpCommands: Message;
    @Register.message("MsgHelpCheck")
    public readonly MsgHelpCheck: Message;
    @Register.message("MsgHelpClaim")
    public readonly MsgHelpClaim: Message;
    @Register.message("MsgHelpAbandon")
    public readonly MsgHelpAbandon: Message;
    @Register.message("MsgHelpFriends")
    public readonly MsgHelpFriends: Message;
    @Register.message("MsgHelpCount")
    public readonly MsgHelpCount: Message;

    // your LogTest instance will be instantiated here. Don't make any more instances of LogTest yourself or it will break

    // Register other classes
    @Register.registry(Areas)
    public readonly logAreas: Areas;
    @Register.registry(DataManager)
    public readonly logDataManager: DataManager;
    @Register.registry(Commands)
    public readonly logCommands: DataManager;
    @Register.registry(PlayerData)
    public readonly logPlayerData: DataManager;

    private _AreaProtected: boolean = true;

    ////////////////////////////////////
    // Overrides
    //

    /**
     * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
     */
    public override initializeSaveData(data?: ISaveData) {
        return !this.needsUpgrade(data) ? data : {
            areaData: {},
            playerData: {},
            lastVersion: game.modManager.getVersion(this.getIndex()),
        };
    }

    /**
     * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
     */
    public override initializeGlobalData(data?: IGlobalData) {
        return !this.needsUpgrade(data) ? data : {
            lastVersion: game.modManager.getVersion(this.getIndex()),
        };
    }

    public override onInitialize(): void {
        log = this.getLog();
    }

    public override onLoad(): void {
        log.info("Init HelloWorld");
    }

    public override onUnload(): void {
        log.info("Dispose HelloWorld");
    }


    ////////////////////////////////////
    // Data Storage
    //

    @Mod.saveData<Mod>()
    public data: ISaveData;

    // Static member for other classes to call to
    @Mod.saveData<Mod>()
    public static data: ISaveData;

    @Mod.globalData<Mod>()
    public globalData: IGlobalData;

    ////////////////////////////////////
    // Events
    //

    /**
     * Immediately do the following:
     * - Show MOTD message if enabled in ModSettings.ts
     * - Check area for protection on load
     */
    @EventHandler(GameScreen, "show")
    public onScreenShow() {
        if (ModSettings.ShowMOTD == true) {
            localPlayer.messages.type(MessageType.Good).send(this.MsgMotd, ModSettings.MOTD);
        }

        // Check if facing area is protected
        this._AreaProtected = Areas.CheckAreaProtected(localPlayer);
        log.warn("Area protected: ", this._AreaProtected);
    }

    /**
     * When a player changes direction, check if the facing area is protected.
     * @param player The player
     * @param direction Direction the player is facing
     */
    @EventHandler(EventBus.Players, "updateDirection")
    public onPlayerDirectionChange(player: Player, direction: Direction): void {
        // When player looks around, does the facing tile exist in a new area
        if (Areas.IsNewArea(player.tile, player.facingTile) == true) {
            log.debug("Facing Area Protected: ", this._AreaProtected);

            // Check if facing area is protected
            this._AreaProtected = Areas.CheckAreaProtected(player);
        }
    }

    /**
     * When a player enters a new tile, check if the facing tile is protected.
     * @param player The player
     * @param tile The tile the player moved to
     * @param fromTile The tile the player moved from
     */
    @EventHandler(EventBus.Players, "postMove")
    public onPlayerMove(player: Player, tile: Tile, fromTile: Tile): void {

        // When the tile the player just entered is a new area.
        if (Areas.IsNewArea(tile, fromTile) == true) {
            this._AreaProtected = Areas.CheckAreaProtected(player);
            log.warn("Area protected: ", this._AreaProtected);
        }
    }


    ////////////////////////////////////
    // Commands
    //

    @Register.command("Areas")
    public CmdAreas(_: any, player: Player, args: string) {
        Commands.CmdAreas(_, player, args);
    }


    ////////////////////////////////////
    // Methods
    //

    /**
     * Checks if game needs an upgrade
     * @param data 
     * @returns 
     */
    private needsUpgrade(data?: { lastVersion?: string }) {
        if (!data) {
            return true;
        }

        const versionString = game.modManager.getVersion(this.getIndex());
        const lastLoadVersionString = (data && data.lastVersion) || "0.0.0";

        if (versionString === lastLoadVersionString) {
            return false;
        }

        const version = new Version(versionString);
        const lastLoadVersion = new Version(lastLoadVersionString);

        return lastLoadVersion.isOlderThan(version);
    }


    ////////////////////////////////////
    // Areas protection Events
    //

    /**
     * Check if dig action is allowed based on player's facing tile protection properties.
     * @param api API to send the unusable message so the player cannot dig. Action will be allowed if facing tile is not protected.
     * @param action 
     * @returns 
     */
    @InjectObject(Dig, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Till, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(ToggleTilled, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(ToggleDoors, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(ToggleHitch, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(ToggleVehicle, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Ignite, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Build, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Drop, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Butcher, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Chop, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(DetachContainer, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Extinguish, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(AddFuel, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(StartFire, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(StokeFire, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(SmotherFire, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Gather, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(GatherLiquid, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(GrabAll, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Harvest, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Lockpick, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Mine, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Tame, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Throw, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Unhitch, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(CageCreature, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Uncage, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PlaceDown, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PickUp, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PickUpAllItems, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PickUpExcrement, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PickUpItem, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(SetDown, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(ToggleContainers, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Pour, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PourOnYourself, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Release, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Attack, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(AttachContainer, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(OpenContainer, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(CloseContainer, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Ride, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Hitch, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(Melee, "canUseHandler", InjectionPosition.Pre)
    @InjectObject(PropOpenDoor, "canUseHandler", InjectionPosition.Pre)
    public onCanUseActionToInjectInto(api: IInjectionApi<any, "canUseHandler">, ...args: unknown[]) {

        // If in protected area, ignore request
        if (this._AreaProtected == false) {
            return;
        }

        const ActionId = api.executingInstance.type;

        // Check mod settings to see if action is blocked
        const actionProtectBool = ModSettings.AreaActionProtection.filter(element => {
            if (element == ActionId) {
                return element;
            }
        });

        // Not in block list, ignore event
        if (actionProtectBool != ActionId) {
            return;
        }

        log.info(`[Action Detail] ID=${ActionId}, Text=${ActionType[ActionId]}, ActionProtectionCheck=${actionProtectBool}, AreaProtected=${this._AreaProtected}`)

        // If the action is a protectable action per the mod config
        //      AND the area is considered protected from the player.
        if (actionProtectBool && this._AreaProtected) {
            log.warn(`BLOCKING ID=${ActionId}, Text=${ActionType[ActionId]}`);
            // log.info(`${ActionType[ActionId]} hidden`)
            api.returnValue = { usable: false }; // set the return of the canUseHandler to the action not being usable
            api.cancelled = true; // prevent normal canuse functionality
            return;
        }
    }

    @Inject(Human, "updateDirection", InjectionPosition.Post)
    public ChangeDirection(api: IInjectionApi<Human<any>, "updateDirection">, tile: Tile, updateVehicleDirection?: boolean | undefined) {
        log.info(`Player is looking at tile: x=${tile.x},y=${tile.y}`);

        // Check if area player is looking at is protected and not a friend of owner.
        this._AreaProtected = Areas.CheckAreaProtected(localPlayer);

        return;
    }


    /**
     * Can player auto pickup items?
     * @param api 
     * @param options 
     */
    @Inject(Human, "setOptions", InjectionPosition.Post)
    public onSetPickupItemsOptions(api: IInjectionApi<any, "setOptions">, options: IOptions) {
        log.debug("onSetPickupItemsOptions");

        const human = api.executingInstance;
        log.warn("Human Action", human.type);

        // If user auto pickup is enabled, disable temporarily
        if (human.options.autoPickup)
            Object.defineProperty(human.options, "autoPickup", {
                get: () => {
                    var isAreaProtected = Areas.CheckAreaProtected(localPlayer);
                    log.info(`Area protected: ${isAreaProtected}`);

                    if (isAreaProtected === true) {
                        log.debug("Set canPickUpItems = false");
                        const canPickUpItems = false; // whether items can be picked up on the tile the human is on
                        return canPickUpItems;
                    }

                    log.debug("Set canPickUpItems = true");
                    const canPickUpItems = true; // whether items can be picked up on the tile the human is on
                    return canPickUpItems;
                },
                set: () => { return options.autoPickup } // not sure whether this line is required or not
            });

        // If user auto pickup is enabled, re-enable it temporarily
        if (human.options.autoPickupOnIdle)
            Object.defineProperty(human.options, "autoPickupOnIdle", {
                get: () => {
                    var isAreaProtected = Areas.CheckAreaProtected(localPlayer);
                    log.info(`Area protected: ${isAreaProtected}`);

                    if (isAreaProtected === true) {
                        log.debug("Set canPickupOnIdle = false")
                        const canPickUpItems = false; // whether items can be picked up on the tile the human is on
                        return canPickUpItems;
                    }

                    log.debug("Set canPickupOnIdle = true")
                    const canPickUpItems = true; // whether items can be picked up on the tile the human is on
                    return canPickUpItems;
                },
                set: () => { return options.autoPickupOnIdle; } // not sure whether this line is required or not
            });
        return;
    }
}