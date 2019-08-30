import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ns-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss'],
  moduleId: module.id,
})
export class SmallHeaderComponent {

  @Input() public image: string;
  @Input() public title: string;
  @Output() public OpenMenu = new EventEmitter<string>();

  public openMenu(): void {
    this.OpenMenu.emit();
  }

}
