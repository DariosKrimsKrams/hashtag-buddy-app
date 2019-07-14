import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Color } from 'tns-core-modules/color';
import { Subscription } from 'rxjs';

@Component({
    selector: 'FloatLabel',
    moduleId: module.id,
    templateUrl: './float-label.component.html',
    styleUrls: ['./float-label.component.scss']
})
export class FloatLabelComponent implements OnInit, OnDestroy {
  private resetSubscription: Subscription;

  @Input() placeholder: string;
  @Input() secure: boolean;
  @Input() reset: EventEmitter<void>;
  @ViewChild('label', { read: ElementRef, static: false }) label: ElementRef;
  @ViewChild('textField', { read: ElementRef, static: false }) textField: ElementRef;
  @Output() userTextEmitter = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.reset !== undefined) {
      this.resetSubscription = this.reset.subscribe(() => this.resetText());
    }
  }

  ngOnDestroy() {
    if (this.resetSubscription !== undefined) {
      this.resetSubscription.unsubscribe();
    }
  }

  public onFocus(): void {
    const label = this.label.nativeElement;
    const textField = this.textField.nativeElement;

    label
      .animate({
        translate: { x: 0, y: -25 },
        opacity: 1
      })
      .then(() => {}, () => {});

    textField.borderBottomColor = new Color('#FFB184');
  }

  public onBlur(): void {
    const label = this.label.nativeElement;
    const textField = this.textField.nativeElement;

    if (!textField.text) {
      label
        .animate({
          translate: { x: 0, y: 0 },
          opacity: 0.6
        })
        .then(() => {}, () => {});
    }
    textField.borderBottomColor = new Color('#cec8c8');
  }

  public onChange(): void {
    this.userTextEmitter.emit(this.textField.nativeElement.text);
  }

  public resetText(): void {
    this.textField.nativeElement.text = '';
  }

  // Prevent the first textfield from receiving focus on Android
  // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
  public handleAndroidFocus(textField: any, container: any): void {
    // ToDo container needs to be a more outer GridLayout element
    if (container.android) {
      container.android.setFocusableInTouchMode(true);
      container.android.setFocusable(true);
      textField.android.clearFocus();
    }
  }

}
