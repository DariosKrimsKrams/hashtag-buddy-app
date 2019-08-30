import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  moduleId: module.id,
})
export class AuthComponent implements OnInit {

  public dialogOpen = false;
  public signin = false;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
  }

  public goPrevPage(): void {
    this.router.navigate(['/settings'], {
      transition: {
        name: 'slideRight',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public goHome(): void {
    this.router.navigate(['/home'], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public goSignIn(): void {
    this.signin = true;
    this.dialogOpen = false;
    // this.router.navigate(["/settings/signin"], {
    //   transition: {
    //     name: "slideLeft",
    //     duration: 500,
    //     curve: "easeOut"
    //   }
    // })
  }

  public showDialog(): void {
    this.dialogOpen = true;
  }

  public closeDialog(): void {
    this.dialogOpen = false;
  }

}
