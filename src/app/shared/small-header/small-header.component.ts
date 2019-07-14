import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ns-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss'],
  moduleId: module.id,
})
export class SmallHeaderComponent implements OnInit {

  @Input() image: string;
  @Input() title: string;
  @Output() OpenMenu = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    
  }

  openMenu() {
    this.OpenMenu.emit();
  }

}
