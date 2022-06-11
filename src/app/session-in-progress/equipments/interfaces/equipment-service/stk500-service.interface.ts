import { IButtonInteraction } from "../interactions-with-controls/button-interaction.interface";
import { IFirmwareInteraction } from "../interactions-with-controls/firmware-interaction.interface";
import { IResistorInteraction } from "../interactions-with-controls/resistor-interaction.interface";

export interface IStk500Service extends IFirmwareInteraction, IButtonInteraction, IResistorInteraction {
    
}