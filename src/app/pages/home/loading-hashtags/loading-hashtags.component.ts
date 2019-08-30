import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { UserService } from '~/app/storages/user.service';
import { Subscription } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-loading-hashtags',
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
    });
    this.subscription2 = this.userService.uploadCompletedTriggered.subscribe(() => {
      clearInterval(this.intervalId);
    });

    this.animateDots();
    this.animateTips();
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

  private animateDots(): void {
    this.intervalId = setInterval.bind(this)(() => {
      this.countDots = this.countDots >= 3 ? 0 : this.countDots + 1;
    }, 600);
  }

  private animateTips(): void {
    this.tipNo = this.getRandom();
    setInterval.bind(this)(() => {
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
    this.redirectToHome();
  }

  private redirectToHome(): void {
    this.router.navigate([`/home`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }
}
