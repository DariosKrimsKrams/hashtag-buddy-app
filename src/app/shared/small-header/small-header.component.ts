import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isIOS } from 'tns-core-modules/platform';

@Component({
  selector: 'ns-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss'],
  moduleId: module.id,
})
export class SmallHeaderComponent {

  public isIOS: boolean;
  @Input() public image: string;
  @Input() public title: string;
  @Output() public OpenMenu = new EventEmitter<string>();

  constructor() {
    this.isIOS = isIOS;
  }

  public openMenu(): void {
    this.OpenMenu.emit();
  }

}
