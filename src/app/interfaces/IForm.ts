import { FormControl } from "@angular/forms";

export type IForm<T> = {
  [K in keyof T]: FormControl<T[K]>;
};
