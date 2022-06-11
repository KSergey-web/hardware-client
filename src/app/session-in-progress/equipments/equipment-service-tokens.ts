import { InjectionToken } from "@angular/core";
import { IAlteraDe1SoCService } from "./interfaces/equipment-service/altera-de1-so-c-service.interface";
import { IStk500Service } from "./interfaces/equipment-service/stk500-service.interface";

export const I_ALTERA_DE1_So_C_SERVICE = new InjectionToken<IAlteraDe1SoCService>('I_ALTERA_DE1_So_C_SERVICE');
export const I_STK500_SERVICE = new InjectionToken<IStk500Service>('I_STK500_SERVICE');
export const I_STM32_SERVICE = new InjectionToken<IStk500Service>('I_STM32_SERVICE');