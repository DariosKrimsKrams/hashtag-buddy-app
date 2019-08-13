import { Component, OnInit, Input } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';

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
    private readonly params: ModalDialogParams,
    private readonly router: RouterExtensions
  ) {}

  ngOnInit() {
    const autoClose = this.params.context.autoClose === true;
    this.showIcon = this.params.context.showIcon === true;
    this.headline = this.params.context.headline;
    this.desc = this.params.context.desc;
    this.buttonOk = this.params.context.buttonOk;
    this.buttonCancel = this.params.context.buttonCancel;

    if (autoClose) {
      setTimeout.bind(this)(() => {
        this.close('autoClose');
      }, 1000);
    }
  }

  public close(reason: string): void {
    this.params.closeCallback(reason);
  }

  public ok(): void {
    this.close('ok');
    this.redirectToHome();
  }

  public cancel(): void {
    this.close('cancel');
  }

  public redirectToHome(): void {
    setTimeout.bind(this)(() => {
      this.router.navigate(['/home'], {
        transition: {
          name: 'slideLeft',
          duration: 500,
          curve: 'easeOut'
        }
      });
    }, 100);
  }

}
