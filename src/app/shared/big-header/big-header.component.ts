import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'ns-big-header',
  templateUrl: './big-header.component.html',
  styleUrls: ['./big-header.component.scss'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigHeaderComponent implements OnInit {

  @Input() public image: string;
  @Input() public darkmode: boolean;

  constructor(
    private readonly cd: ChangeDetectorRef
  ) {
    this.cd.detach();
  }

  public ngOnInit(): void {
    this.cd.detectChanges();
  }

  public get imagePath(): string {
    return '~/app/assets/images/header/' + this.image;
  }

}
