import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { View } from "tns-core-modules/ui/core/view";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ModalComponent } from './modal/modal.component';
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as utils from "tns-core-modules/utils/utils";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import * as frame from "tns-core-modules/ui/frame";
import { AppFeedback } from '~/app/models/app-feedback';
import { CustomerService } from '~/app/storages/customer.service';
import { FeedbackRepository } from '~/app/services/repositories/feedback-repository.service';

@Component({
  selector: 'ns-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  moduleId: module.id,
})
export class FeedbackComponent implements OnInit {

  public email = '';
  public message = '';
  
  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly modalService: ModalDialogService, 
    private readonly viewContainerRef: ViewContainerRef,
    private readonly feedbackRepositoryService: FeedbackRepository,
    private readonly customerService: CustomerService,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  // public openMenu(target: View): void {
  //   this.dismissSoftKeybaord();
  //   const sideDrawer = <RadSideDrawer>app.getRootView();
  //   sideDrawer.showDrawer();
  // }

  // public closeMenu(): void {
  //   const sideDrawer = <RadSideDrawer>app.getRootView();
  //   sideDrawer.closeDrawer();
  // }

  public sendFeedback(): void {
    if(this.email === "" && this.message === ""){
      console.log("empty");
      return;
    }
    let feedback: AppFeedback = new AppFeedback({
      customerId: this.customerService.getCustomerId(), 
      email: this.email, 
      message: this.message
    });
    this.feedbackRepositoryService.sendAppFeedback(feedback)
    .subscribe(feedback => {
    });
    this.showModal();  
  }

  private showModal(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { autoClose: false, button: 'feedback_modal_button' }
    };
    this.modalService.showModal(ModalComponent, options);
  }

  public dismissSoftKeybaord(): void {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  public emailChange(text: string): void {
    this.email = text;
  }

  public messageChange(text: string): void {
    this.message = text;
  }

  goPrevPage() {
    this.router.navigate(["/settings"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    });
  }
}
