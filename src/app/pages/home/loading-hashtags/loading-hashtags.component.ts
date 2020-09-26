import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '~/app/storages/user.service';
import { Subscription } from 'rxjs';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { environment } from '../../../environments/environment';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';

@Component({
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.scss'],
  moduleId: module.id
})
export class LoadingHashtagsComponent implements OnInit, OnDestroy {
  public countDots: number = 0;
  public progress: number = 0;
  public tipNo: number;

  private tipTimeSec: number = 7;
  private intervalId: number;
  private intervalId2: number;
  private timeoutId: number;
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(
    private page: Page,
    private readonly userService: UserService,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    this.subscription1 = this.userService.uploadFailedTriggered.subscribe(() => {
      this.uploadFailed();
      clearInterval(this.timeoutId);
      clearInterval(this.intervalId);
    });
    this.subscription2 = this.userService.uploadCompletedTriggered.subscribe(() => {
      clearInterval(this.intervalId);
      clearInterval(this.timeoutId);
    });

    this.animateDots();
    this.animateTips();
    disableIosSwipe(this.page);

    this.timeoutId = setTimeout.bind(this)(() => {
      this.uploadFailed();
      clearInterval(this.intervalId);
    }, (environment.loadingTimeSec + 3) * 1000);
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearInterval(this.intervalId2);
    if (!!this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (!!this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }

  private animateDots(): void {
    this.intervalId = setInterval.bind(this)(() => {
      this.countDots = this.countDots >= 3 ? 0 : this.countDots + 1;
    }, 600);
  }

  private animateTips(): void {
    this.tipNo = this.getRandom();
    this.intervalId2 = setInterval.bind(this)(() => {
      this.tipNo = this.getRandom();
    }, this.tipTimeSec * 1000);
  }

  private getRandom(): number {
    const min = 1;
    const max = 22;
    return Math.floor(Math.random() * (max - 0.01)) + min;
  }

  private uploadFailed(): void {
    clearInterval(this.intervalId);
    this.router.navigate([`/error`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

}
