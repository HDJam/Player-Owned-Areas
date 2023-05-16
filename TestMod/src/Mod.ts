import { EventBus } from "event/EventBuses";
import { EventHandler } from "event/EventManager";
import { EquipType } from "game/entity/IHuman";
import { MessageType } from "game/entity/player/IMessageManager";
import Player from "game/entity/player/Player";
import { ItemType } from "game/item/IItem";
import Item from "game/item/Item";
import { ITile } from "game/tile/ITerrain";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import GameScreen from "ui/screen/screens/GameScreen";
import TileHelpers from "utilities/game/TileHelpers";

export default class TestMod extends Mod {
    @Register.message("Hello World!")
    public readonly messageHelloWorld: Message;    

    @Register.message("Nice branch!")
    public readonly messageNiceBranch: Message;

    @Register.message("Hello Terrain!")
	public readonly messageHelloTerrain: Message;


    @EventHandler(GameScreen, "show")
    public onGameScreenVisible(): void {
        localPlayer.messages.type(MessageType.Good).send(this.messageHelloWorld)
    }


    @EventHandler(EventBus.Players, "equip")
    public onItemEquip(player: Player, item: Item, slot: EquipType) {
        if (item.type !== ItemType.Branch) {
            return;
        }

        player.messages.type(MessageType.Good).send(this.messageNiceBranch);
    }
    

    @EventHandler(EventBus.Players, "preMove")
    public onMove(player: Player, fromX: number, fromY: number, fromZ: number, fromTile: ITile, nextX: number, nextY: number, nextZ: number, tile:ITile) : boolean | void | undefined {
        const tileType = TileHelpers.getType(tile);
        
        player.messages.type(MessageType.Stat).send(this.messageHelloTerrain, tileType);
        player.messages.type(MessageType.Stat).send(this.messageHelloTerrain, "test");
        this.getLog().info(tileType.toString)
        return undefined;
    }



    public override onInitialize() {
		//log = this.getLog();
        this.getLog().info("Test Mod is enabled!!!");
	}

	public override onLoad() {
        this.getLog().info("Hello World!");
	}

	public override onUnload() {
		this.getLog().info("Goodbye World!");
	}
}
