import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { catchError, take } from 'rxjs/operators';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';

@Injectable()
export class SubgroupResolver implements Resolve<ISubgroup> {
  constructor(
    private subgroupService: SubgroupService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ISubgroup> | Promise<ISubgroup> | ISubgroup {
    const id = route.paramMap.get('id');
    if (id === null) {
      this.router.navigate(['subgroups']);
    }
    return this.getSubgroup(+id!);
  }

  private getSubgroup(id: number): Observable<ISubgroup> {
    return this.subgroupService
      .getSubgroupById(id)
      .pipe(take(1), catchError(this.someError.bind(this)));
  }

  someError(err: HttpErrorResponse): Observable<any> {
    console.error(err);
    let text = 'Что-то пошло не так';
    if (err.status == 404) text = 'Погруппа не найдена';
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    const ref = bulder
      .addHeader('Ошибка')
      .addText(text)
      .setDangerStyle()
      .openAlertModal();
    ref.result.finally(() => this.router.navigate(['subgroups']));
    throw err;
  }
}
