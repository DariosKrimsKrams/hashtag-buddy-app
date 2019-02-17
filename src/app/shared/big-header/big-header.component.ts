import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ns-big-header',
  templateUrl: './big-header.component.html',
  styleUrls: ['./big-header.component.css'],
  moduleId: module.id,
})
export class BigHeaderComponent implements OnInit {

  @Output() OpenMenu = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  openMenu() {
    this.OpenMenu.emit();
  }

}
