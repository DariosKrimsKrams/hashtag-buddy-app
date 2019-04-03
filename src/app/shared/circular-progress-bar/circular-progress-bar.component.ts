import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.css'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressBarComponent {
  
  // @Input() progress: number;
  percentValue: number = 11;
  timeMax: number = 20;
  text: string;

  constructor() { }

  ngOnInit() {
    this.animate();
  }

  private setText(): void {
    this.text = `${this.percentValue.toFixed()} %`;
  }

  private animate(): void {
    let intervalId = setInterval.bind(this)(() => {
      this.percentValue++;
      console.log("ProgessChanged", this.percentValue);
      this.setText();
      if (this.percentValue >= 99) {
        clearInterval(intervalId);
      }
    }, this.timeMax * 1000 / 99);
  }
  
}
