import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Hashtag } from '~/app/models/hashtag';

@Component({
  selector: 'ns-insert-hashtags-form',
  templateUrl: './insert-hashtags-form.component.html'
})
export class InsertHashtagsFormComponent implements OnInit {

  @Output() public hashtagAdded: EventEmitter<Hashtag> = new EventEmitter<Hashtag>();
  @Output() public resetInput: EventEmitter<void> = new EventEmitter();
  @Input() public customUserHashtagsText: string = '';

  constructor() { }

  public ngOnInit(): void {
  }

  public addCustomHashtags(): void {
    const input = this.customUserHashtagsText;
    if (input === undefined) {
      console.error('error: addCustomHashtags triggered with text=undefined');
      return;
    }
    input.split(' ').map(word => {
      if (word.length !== 0) {
        word.split('#').map(word2 => {
          if (word2.length !== 0) {
            this.hashtagAdded.emit(new Hashtag(word2));
          }
        });
      }
    });
    this.resetInput.emit();
  }

}
