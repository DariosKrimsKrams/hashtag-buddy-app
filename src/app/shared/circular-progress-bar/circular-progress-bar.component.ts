import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.css'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressBarComponent {
  
  // @Input() size = 185;
  percentValue: number = 11;
  timeMax: number = 20;

  constructor() { }

  ngOnInit() {
    this.animate();
  }

  get text() {
    return `${this.percentValue.toFixed()} %`;
  }

  animate(): any {
    var that = this;
    let intervalId = setInterval(() => {
      that.percentValue++;
      if (that.percentValue == 99) {
        clearInterval(intervalId);
      }
    }, this.timeMax * 1000 / 99);
  }
  
}
