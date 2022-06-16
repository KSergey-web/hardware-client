import { InjectionToken } from '@angular/core';
import { IButtonInteraction } from './interfaces/interactions-with-controls/button-interaction.interface';
import { IFirmwareInteraction } from './interfaces/interactions-with-controls/firmware-interaction.interface';
import { IResistorInteraction } from './interfaces/interactions-with-controls/resistor-interaction.interface';
import { ISwitchInteraction } from './interfaces/interactions-with-controls/switch-interaction.interface';

export const I_FIRMWARE_INTERACTION_SERVICE =
  new InjectionToken<IFirmwareInteraction>('I_FIRMWARE_INTERACTION_SERVICE');

export const I_BUTTON_INTERACTION_SERVICE =
  new InjectionToken<IButtonInteraction>('I_BUTTON_INTERACTION_SERVICE');

export const I_SWITCH_INTERACTION_SERVICE =
  new InjectionToken<ISwitchInteraction>('I__SWITCH_INTERACTION_SERVICE');

export const I_RESISTOR_INTERACTION_SERVICE =
  new InjectionToken<IResistorInteraction>('I__RESISTOR_INTERACTION_SERVICE');
