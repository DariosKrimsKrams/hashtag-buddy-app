import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.css'],
  moduleId: module.id
})
export class CircularProgressBarComponent implements OnInit {
  
  private percentValue: number = 0;
  private timeSec: number = 20;

  constructor(
  ) { }

  ngOnInit() {
    this.animate();
  }

  public get text(): string {
    return `${this.percentValue.toFixed()} %`;
  }

  private animate(): void {
    let intervalId = setInterval.bind(this)(() => {
      this.percentValue++;
      if (this.percentValue >= 99) {
        clearInterval(intervalId);
      }
    }, this.timeSec * 1000 / 99);
  }
  
}
