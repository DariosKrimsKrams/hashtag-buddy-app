import { Component, Input} from "@angular/core";

@Component({
  selector: 'ProgressBar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  moduleId: module.id,
})
export class ProgressBarComponent {

  constructor() { }

  columns;
  @Input() width: string;
  @Input() text: string;

  ngOnInit() {
    // this.isHistoryOpen = 0;
    let percent = 0;
    let intervalId = setInterval(() => {
      this.setProgressbarWidth(percent);
      percent++;
      if (percent > 100) {
        clearInterval(intervalId);
      }
    }, 5);
  }

  setProgressbarWidth(percent) {
    this.columns = percent + "*," + (100 - percent) + "*";
  }
}
