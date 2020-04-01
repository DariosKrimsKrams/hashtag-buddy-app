import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isIOS } from 'tns-core-modules/platform';

@Component({
  selector: 'ns-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.scss'],
  moduleId: module.id
})
export class HashtagComponent implements OnInit {

  public isIOS: boolean;
  @Input() public name: string;
  @Input() public isActive: boolean;
  @Input() public censored: boolean;
  @Output() public onClick = new EventEmitter<void>();
  @Output() public onClickCensored = new EventEmitter<void>();

  constructor() {
    this.isIOS = isIOS;
  }

  public ngOnInit(): void {
    if (this.censored) {
      const length = this.name.length;
      const trimLength = length > 5 ? 4 : length - 2;
      this.name = this.name.substr(0, trimLength + 1);
      const minAmountOfStars = 4;
      const amountOfStars =
        length - trimLength >= minAmountOfStars
          ? length
          : trimLength + minAmountOfStars;
      for (let i = trimLength; i < amountOfStars; i++) {
        this.name += '*';
      }
    }
  }

  public triggerClick(): void {
    if (!this.censored) {
      this.onClick.emit();
    } else {
      this.onClickCensored.emit();
    }
  }
}
