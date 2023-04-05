import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[type=file]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileValueAccessorDirective,
      multi: true,
    },
  ],
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  onChange = (obj: any) => {};

  @HostListener('change', ['$event.target']) _handleInput(event: any) {
    this.onChange(<File>event.files[0]);
  }

  constructor(private element: ElementRef, private render: Renderer2) {}

  writeValue(value: any) {
    const normalizedValue = value == null ? '' : value;
    this.render.setProperty(
      this.element.nativeElement,
      'value',
      normalizedValue
    );
  }

  registerOnChange(fn: (obj: any) => {}) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {}

  nOnDestroy() {}
}
