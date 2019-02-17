import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.css'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressBarComponent {
  
  @Input() size = 185;

  constructor() { }

  ngOnInit() {
  }

  get height() {
    return this.size;
  };

  get value() {
      return 100;
  };

  get text() {
    return `${this.value.toFixed()} %`;
  }
}
