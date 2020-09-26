import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import { isIOS } from '@nativescript/core';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  moduleId: module.id,
})

export class ErrorComponent implements OnInit {

  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
  }

  public ngOnInit(): void {
  }

  public clickGoHome(): void {
    this.router.navigate([`/home`], {
      transition: {
        name: 'slideRight',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

}
