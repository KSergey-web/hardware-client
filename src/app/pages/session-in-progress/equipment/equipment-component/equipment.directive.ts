import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[equipmentHost]',
})
export class EquipmentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
