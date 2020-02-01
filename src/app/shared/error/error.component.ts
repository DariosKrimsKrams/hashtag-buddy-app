import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  moduleId: module.id,
})

export class ErrorComponent implements OnInit {

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
  }

  // public clickRetry(): void {

  // }

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
