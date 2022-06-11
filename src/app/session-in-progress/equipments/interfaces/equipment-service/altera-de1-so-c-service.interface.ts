import { IButtonInteraction } from "../interactions-with-controls/button-interaction.interface";
import { IFirmwareInteraction } from "../interactions-with-controls/firmware-interaction.interface";
import { ISwitchInteraction } from "../interactions-with-controls/switch-interaction.interface";

export interface IAlteraDe1SoCService extends IFirmwareInteraction, IButtonInteraction, ISwitchInteraction {
    
}