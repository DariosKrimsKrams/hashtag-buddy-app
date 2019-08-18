import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { UserService } from '~/app/storages/user.service';
import { Subscription } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.scss'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit, OnDestroy {

  public countDots: number = 0;
  public progress: number = 0;
  public tipNo: number;

  private tipTimeSec: number = 7;
  private intervalId: number;
  private subscription: Subscription;

  constructor(
    private page: Page,
    private readonly userService: UserService,
    private readonly router: RouterExtensions,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.subscription = this.userService.uploadFailedTriggered.subscribe(() => this.uploadFailed());

    this.animateDots();
    this.animateTips();
  }
  
  ngOnDestroy() {
    console.log("ngOnDestroy");
    this.subscription.unsubscribe();
    clearInterval(this.intervalId);
  }

  private animateDots(): void {
    this.intervalId = setInterval.bind(this)(() => {
      console.log("animateDots");
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
