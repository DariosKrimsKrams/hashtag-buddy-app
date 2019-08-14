import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'ns-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  moduleId: module.id
})
export class ModalComponent implements OnInit {
  
  public showIcon: boolean;
  public headline: string;
  public desc: string;
  public buttonOk: string;
  public buttonCancel: string;

  constructor(
    private readonly params: ModalDialogParams
  ) {}

  ngOnInit() {
    const autoCloseTime = this.params.context.autoCloseTime || undefined;
    this.showIcon = this.params.context.showIcon === true || false;
    this.headline = this.params.context.headline || '';
    this.desc = this.params.context.desc || '';
    this.buttonOk = this.params.context.buttonOk || '';
    this.buttonCancel = this.params.context.buttonCancel || '';

    if (autoCloseTime !== undefined) {
      setTimeout.bind(this)(() => {
        this.close('autoClose');
      }, autoCloseTime);
    }
  }

  public close(reason: string): void {
    this.params.closeCallback(reason);
  }

  public ok(): void {
    this.close('ok');
  }

  public cancel(): void {
    this.close('cancel');
  }

}
