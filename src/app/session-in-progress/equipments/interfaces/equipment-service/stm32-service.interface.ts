import { IButtonInteraction } from '../interactions-with-controls/button-interaction.interface';
import { IFirmwareInteraction } from '../interactions-with-controls/firmware-interaction.interface';

export interface IStm32Service
  extends IFirmwareInteraction,
    IButtonInteraction {}
