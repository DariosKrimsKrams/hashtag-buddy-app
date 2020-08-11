import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Color } from 'tns-core-modules/color';
import { isIOS } from 'tns-core-modules/platform';
import { Toasty, ToastDuration } from 'nativescript-toasty';
import { localize } from 'nativescript-localize/angular';
declare var CGSizeMake: any;
declare var UIColor: any;

@Component({
  selector: 'ns-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.scss'],
  moduleId: module.id
})
export class HashtagComponent implements OnInit {

  @ViewChild('label', { read: ElementRef, static: false }) public label: ElementRef;
  @Input() public name: string;
  @Input() public isActive: boolean;
  @Input() public censored: boolean;
  @Output() public onClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onClickCensored: EventEmitter<void> = new EventEmitter<void>();
  public isIOS: boolean;

  constructor(
  ) {
    this.isIOS = isIOS;
  }

  public ngOnInit(): void {
    if (this.censored) {
      const length = this.name.length;
      const trimLength = length > 5 ? 4 : length - 2;
      this.name = this.name.substr(0, trimLength + 1);
      const minAmountOfStars = 4;
      const amountOfStars = length - trimLength >= minAmountOfStars ? length : trimLength + minAmountOfStars;
      for (let i = trimLength; i < amountOfStars; i++) {
        this.name += '*';
      }
    }
  }

  public onLoaded(): void {
    setTimeout.bind(this)(() => {
      const label = this.label.nativeElement;
      const layer = label.ios.layer;
      layer.backgroundColor = UIColor.whiteColor.CGColor;
      layer.shadowOffset = CGSizeMake(0, 4);
      layer.shadowOpacity = 0.5;
      layer.shadowRadius = 4;
      layer.cornerRadius = 6;
      const color = new Color('#cccccc');
      layer.shadowColor = color.ios.CGColor;
    }, 1);
  }

  public triggerClick(): void {
    if (!this.censored) {
      this.onClick.emit();
    } else {
      this.onClickCensored.emit();
      // new Toasty({ text: localize('toast_hashtags_hidden') })
      //   .setToastDuration(ToastDuration.LONG)
      //   .show();
    }
  }

}
