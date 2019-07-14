import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Color } from 'tns-core-modules/color';
import { Subscription } from 'rxjs';

@Component({
    selector: 'FloatLabel',
    moduleId: module.id,
    template: `
        <GridLayout rows="30, auto">
            <Label #label row="1" [text]="placeholder" opacity="0.6" fontSize="14" color="#000" class="input"></Label>
            <TextField #textField [secure]="secure" row="1" (focus)="onFocus()" (blur)="onBlur()" (textChange)="onChange()" color="#000" fontSize="15" borderBottomWidth="2" borderBottomColor="#cec8c8" padding="2"></TextField>
        </GridLayout>
    `
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
}
