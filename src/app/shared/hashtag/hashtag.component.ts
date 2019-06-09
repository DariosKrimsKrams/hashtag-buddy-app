import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ns-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.css'],
  moduleId: module.id,
})
export class HashtagComponent implements OnInit {

  @Input() public name: string;
  @Input() public isActive: boolean;
  @Input() public censored: boolean;
  @Output() public onClick = new EventEmitter<void>();
  @Output() public onClickCensored = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    if(this.censored) {
      var length = this.name.length;
      var trimLength = length > 5 ? 4 : length - 2;
      this.name = this.name.substr(0, trimLength+1);
      var minAmountOfStars = 4;
      var amountOfStars = length-trimLength >= minAmountOfStars ? length : trimLength + minAmountOfStars;
			for(let i = trimLength; i < amountOfStars; i++) {
        this.name += '*';
      }
    }
  }

  triggerClick() {
    if(!this.censored) {
      this.onClick.emit();
    } else {
      this.onClickCensored.emit();
    }
  }

}
