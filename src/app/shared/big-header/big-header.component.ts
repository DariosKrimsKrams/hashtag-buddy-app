import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ns-big-header',
  templateUrl: './big-header.component.html',
  styleUrls: ['./big-header.component.scss'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigHeaderComponent implements OnInit {

  constructor(
    private readonly cd: ChangeDetectorRef
  ) { 
    this.cd.detach();
  }

  ngOnInit() {
    this.cd.detectChanges();
  }

}
