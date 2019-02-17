import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ns-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.css'],
  moduleId: module.id,
})
export class HashtagComponent implements OnInit {

  @Input() name: string;
  @Input() isActive: boolean;
  @Output() onClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  triggerClick() {
    this.onClick.emit();
  }

}
