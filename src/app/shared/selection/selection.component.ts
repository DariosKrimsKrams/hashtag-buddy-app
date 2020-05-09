import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Hashtag } from '~/app/models/hashtag';

@Component({
  selector: 'ns-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  @Output() public hashtagAdded: EventEmitter<Hashtag> = new EventEmitter<Hashtag>();
  @Output() public resetInput: EventEmitter<void> = new EventEmitter();
  @Input() public customUserHashtagsText: string = '';

  constructor() { }

  public ngOnInit(): void {
  }

}
