import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  moduleId: module.id,
})

export class ErrorComponent implements OnInit {

  constructor(
    private readonly page: Page, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

}
