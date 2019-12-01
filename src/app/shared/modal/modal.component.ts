import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'ns-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  moduleId: module.id
})
export class ModalComponent implements OnInit {

  public icon: string;
  public headline: string;
  public headline2: string;
  public desc: string;
  public buttonOk: string;
  public buttonCancel: string;
  public autoCloseFunc: Function;
  public okFunc: Function;
  public cancelFunc: Function;

  constructor(
    private readonly params: ModalDialogParams
  ) {}

  public ngOnInit(): void {
    const autoCloseTime = this.params.context.autoCloseTime || undefined;
    this.icon = this.params.context.icon || undefined;
    this.headline = this.params.context.headline || '';
    this.headline2 = this.params.context.headline2 || '';
    this.desc = this.params.context.desc || '';
    this.buttonOk = this.params.context.buttonOk || '';
    this.buttonCancel = this.params.context.buttonCancel || '';
    this.autoCloseFunc = this.params.context.autoCloseFunc || undefined;
    this.okFunc = this.params.context.okFunc || undefined;
    this.cancelFunc = this.params.context.cancelFunc || undefined;

    if (autoCloseTime !== undefined) {
      setTimeout.bind(this)(() => {
        this.close('autoClose');
      }, autoCloseTime);
    }
  }

  public close(reason: string): void {
    switch (reason) {
      case 'autoClose':
        if (this.autoCloseFunc !== undefined) {
          this.autoCloseFunc();
        }
        break;
      case 'ok':
        if (this.okFunc !== undefined) {
          this.okFunc();
        }
        break;
      case 'cancel':
        if (this.cancelFunc !== undefined) {
          this.cancelFunc();
        }
        break;
    }
    this.params.closeCallback();
  }

  public ok(): void {
    this.close('ok');
  }

  public cancel(): void {
    this.close('cancel');
  }

  public get iconPath(): string {
    return '~/app/assets/images/' + this.icon + '.png';
  }

}
