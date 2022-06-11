import { Observable } from "rxjs";

export interface IFirmwareInteraction {
    uploadFile: (selectedFile: File) => Observable<any>;

    clean: () => Observable<any>;

    reset: () => Observable<any>;
}