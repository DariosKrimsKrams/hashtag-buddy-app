import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { CustomerService } from '~/app/storages/customer.service';

@Component({
  selector: 'ns-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  moduleId: module.id,
})
export class AboutComponent implements OnInit {

  public userId: string;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly customerService: CustomerService,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.userId = this.customerService.getCustomerId().substr(0, 10);
  }

  goPrevPage() {
    this.router.navigate(["/settings"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

}
