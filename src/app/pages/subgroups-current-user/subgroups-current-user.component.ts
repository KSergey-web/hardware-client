import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';

@Component({
  templateUrl: './subgroups-current-user.component.html',
  styleUrls: ['./subgroups-current-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubgroupsCurrentUserComponent implements OnInit {
  constructor(
    private subgroupService: SubgroupService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  toSubgroup(subgroup: ISubgroup) {
    this.router.navigate([`main-page/subgroup/${subgroup.id}`]);
  }

  subgroups: ISubgroup[] = [];

  ngOnInit(): void {
    this.getSubgroups();
  }

  private getSubgroups() {
    this.subgroupService
      .getSubgroupsByCurrentUser()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: this.handleResponseSubroups.bind(this),
      });
  }

  handleResponseSubroups(subgroups: ISubgroup[]): void {
    this.subgroups = subgroups;
    this.changeDetector.detectChanges();
  }
}
