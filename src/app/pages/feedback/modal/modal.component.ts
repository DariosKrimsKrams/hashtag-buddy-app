import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  moduleId: module.id,
})
export class ModalComponent implements OnInit {

  public button: string;

  constructor(
    private readonly params: ModalDialogParams,
    private readonly router: RouterExtensions,
  ) {}

  ngOnInit() {
    var autoClose = this.params.context.autoClose == true;
    this.button = this.params.context.button;

    if(autoClose) {
      setTimeout.bind(this)(() => { 
        this.close("autoClose");
      }, 1000);    
    }
  }

  public close(reason: string): void {
    this.params.closeCallback(reason);
  }

  public ok(): void {
    this.close("ok");
    setTimeout.bind(this)(() => { 
      this.router.navigate(["/home"], {
        transition: {
          name: "slideLeft",
          duration: 500,
          curve: "easeOut"
        }
      });
    }, 100);    
  }
}