import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { Color } from 'tns-core-modules/color';
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
  @Output() public onClick = new EventEmitter<void>();
  @Output() public onClickCensored = new EventEmitter<void>();

  constructor(
    private readonly page: Page
  ) { }

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

  public onLoaded(): void {
    const label = this.label.nativeElement;
    if (this.page.ios) {
      const layer = label.ios.layer;
      layer.backgroundColor = UIColor.whiteColor.CGColor;
      if (this.isActive) {
        const color = new Color('#FFB184');
        layer.backgroundColor = color.ios.CGColor;
      }
      layer.shadowOffset = CGSizeMake(0, 5);
      layer.shadowOpacity = 0.4;
      layer.shadowRadius = 6;
      layer.cornerRadius = 6;
    }
  }

  public triggerClick(): void {
    this.isActive = !this.isActive;
    const label = this.page.getViewById('label');
    if (this.page.ios) {
      const layer = label.ios.layer;
      if (this.isActive) {
        const color = new Color('#FFB184');
        layer.backgroundColor = color.ios.CGColor;
      } else {
        layer.backgroundColor = UIColor.whiteColor.CGColor;
      }
    }
    return;

    if (!this.censored) {
      this.onClick.emit();
    } else {
      this.onClickCensored.emit();
    }
  }
}
