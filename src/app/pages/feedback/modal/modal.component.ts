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

  constructor(
    private params: ModalDialogParams,
    private router: RouterExtensions,
    ) {}

  ngOnInit() {}

  close() {
    this.params.closeCallback();
  }

  goHome() {
    this.close();
    setTimeout.bind(this)(() => { 
      this.router.navigate(["/home"], {
        transition: {
          name: "slideLeft",
          duration: 500,
          curve: "easeOut"
        }
      })
    }, 100);    
  }
}