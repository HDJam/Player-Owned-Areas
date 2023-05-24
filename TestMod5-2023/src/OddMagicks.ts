import Jump, { IJumpCanUse } from "game/entity/action/actions/Jump";
import { IActionHandlerApi } from "game/entity/action/IAction";
import Human from "game/entity/Human";
import { IStatMax, Stat } from "game/entity/IStats";
import ItemEquipInfo from "game/inspection/infoProviders/item/use/ItemEquipInfo";
import { IGetUseInfo } from "game/inspection/infoProviders/UseInfo";
import { MagicalPropertyType } from "game/magic/MagicalPropertyType";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import { IInjectionApi, InjectionPosition, InjectObject } from "utilities/class/Inject";
import { IVector3 } from "utilities/math/IVector";
import Math2 from "utilities/math/Math2";

export default class OddMagicks extends Mod {

	@Register.magicalProperty("floaty", {
		isApplicable: (item, itemDescription) => !!itemDescription.equip,
		getInfo: item => ({
			max: 0.3,
			value: () => 0.05 + item.island.seededRandom.float() * 0.2,
		}),
	})
	public readonly magicalPropertyFloaty: MagicalPropertyType;

	@InjectObject(Jump, "canUseHandler", InjectionPosition.Post)
	protected onJumpCanUseHandler(api: IInjectionApi<typeof Jump, "canUseHandler">, action: IActionHandlerApi<Human, IJumpCanUse>) {
		const canUse = api.returnValue;
		if (!canUse?.usable && canUse?.message !== Message.TooExhaustedToJump) {
			// do nothing, the jump failed for some other reason than not enough stamina
			return;
		}

		const floatyAmount = action.executor.getEquippedItems()
			.map(item => item.magic?.get(this.magicalPropertyFloaty) ?? 0)
			.splat(Math2.sum);

		const stamina = action.executor.stat.get<IStatMax>(Stat.Stamina)!;
		const jumpStamina = Math.floor(((10 + action.executor.getScaledWeight() / 4) / 75) * stamina.max * Math.max(0.1, 1 - floatyAmount));

		if (stamina.value < jumpStamina) {
			return api.returnValue = {
				usable: false,
				message: Message.TooExhaustedToJump,
			};
		}

		const jumpPosition: IVector3 = {
			x: action.executor.x + (action.executor.direction.x * 2),
			y: action.executor.y + (action.executor.direction.y * 2),
			z: action.executor.z,
		};

		const jumpTile = action.executor.island.getTileFromPoint(jumpPosition);

		return api.returnValue = {
			usable: true,
			stamina,
			jumpStamina,
			jumpTile,
		};
	}

	@InjectObject(ItemEquipInfo.methods, "getMagicalEquipTypes", InjectionPosition.Post)
	protected onItemEquipInfoGetMagicalEquipTypes(api: IInjectionApi<typeof ItemEquipInfo["methods"], "getMagicalEquipTypes">, info: IGetUseInfo<typeof ItemEquipInfo>) {
		api.returnValue?.add(this.magicalPropertyFloaty);
	}

	@InjectObject(ItemEquipInfo.methods, "isMagicalPropertyPercentage", InjectionPosition.Post)
	protected onItemEquipInfoIsMagicalPropertyPercentage(api: IInjectionApi<typeof ItemEquipInfo["methods"], "isMagicalPropertyPercentage">, info: IGetUseInfo<typeof ItemEquipInfo>, type: MagicalPropertyType) {
		if (type === this.magicalPropertyFloaty) {
			api.returnValue = true;
		}
	}
}