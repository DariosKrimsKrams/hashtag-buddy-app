import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  moduleId: module.id,
})
export class AuthComponent implements OnInit {

  dialogOpen = false;
  signin = false;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  goPrevPage() {
    this.router.navigate(['/settings'], {
      transition: {
        name: 'slideRight',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  goHome() {
    this.router.navigate(['/home'], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  goSignIn() {
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

  showDialog() {
    this.dialogOpen = true;
  }

  closeDialog() {
    this.dialogOpen = false;
  }

}
