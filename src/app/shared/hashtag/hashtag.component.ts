import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { isIOS } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page/page';

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

  constructor(
    private readonly page: Page
  ) {
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

  public onLoaded(): void {
    console.log('onLoaded -> handleIosShadow');

    // const page = args.object;
    console.log(this.page);
    const label = this.page.getViewById('label');
    console.log(label);

    if (this.page.ios) {
      const layer = label.ios.layer;
      // layer.backgroundColor = UIColor.whiteColor.CGColor;
      layer.backgroundColor = 'white';
      // layer.shadowOffset = CGSizeMake(0, 1);
      layer.shadowOpacity = 1;
      layer.shadowRadius = 5;
      layer.cornerRadius = 20;
    }
  }

  public triggerClick(): void {
    this.isActive = !this.isActive;
    return;

    if (!this.censored) {
      this.onClick.emit();
    } else {
      this.onClickCensored.emit();
    }
  }
}
