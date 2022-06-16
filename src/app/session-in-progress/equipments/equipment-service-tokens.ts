import { InjectionToken } from '@angular/core';
import { IAlteraDe1SoCService } from './interfaces/equipment-service/altera-de1-so-c-service.interface';
import { IStk500Service } from './interfaces/equipment-service/stk500-service.interface';
import { IButtonInteraction } from './interfaces/interactions-with-controls/button-interaction.interface';
import { IFirmwareInteraction } from './interfaces/interactions-with-controls/firmware-interaction.interface';
import { IResistorInteraction } from './interfaces/interactions-with-controls/resistor-interaction.interface';
import { ISwitchInteraction } from './interfaces/interactions-with-controls/switch-interaction.interface';

export const I_ALTERA_DE1_So_C_SERVICE =
  new InjectionToken<IAlteraDe1SoCService>('I_ALTERA_DE1_So_C_SERVICE');
export const I_STK500_SERVICE = new InjectionToken<IStk500Service>(
  'I_STK500_SERVICE'
);
export const I_STM32_SERVICE = new InjectionToken<IStk500Service>(
  'I_STM32_SERVICE'
);

export const I_FIRMWARE_INTERACTION_SERVICE =
  new InjectionToken<IFirmwareInteraction>('I_FIRMWARE_INTERACTION_SERVICE');

export const I_BUTTON_INTERACTION_SERVICE =
  new InjectionToken<IButtonInteraction>('I_BUTTON_INTERACTION_SERVICE');

export const I_SWITCH_INTERACTION_SERVICE =
  new InjectionToken<ISwitchInteraction>('I__SWITCH_INTERACTION_SERVICE');

export const I_RESISTOR_INTERACTION_SERVICE =
  new InjectionToken<IResistorInteraction>('I__RESISTOR_INTERACTION_SERVICE');
