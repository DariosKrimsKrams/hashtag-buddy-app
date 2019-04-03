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
import { FeedbackRepository } from '../../services/feedback-repository.service';

@Component({
  selector: 'ns-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  moduleId: module.id,
})
export class FeedbackComponent implements OnInit {

  openmenu = false;

  public email = '';
  public message = '';
  
  constructor(
    private page: Page,
    private router: RouterExtensions,
    private modalService: ModalDialogService, 
    private viewContainerRef: ViewContainerRef,
    private feedbackRepositoryService: FeedbackRepository,
    ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  openMenu(target: View): void {
    this.dismissSoftKeybaord();
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  leaveFeedback() {
    if(this.email === "" || this.message === ""){
      console.log('empty');
      return false;
    }
    let feedback: AppFeedback = {
      customerId: "0317a2e8e1bbae79184524ea1322c152407a0bc1e7f4837571ee3517e9360da4", 
      email: this.email, 
      message: this.message
    }
    this.feedbackRepositoryService.addAppFeedback(feedback);
    // .subscribe(feedback => {
    //   this.showModal();
    // });    
  }

  goHome() {
    this.router.navigate(["/home"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    })
  }

  showModal() {
    const options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRef,
        fullscreen: false,
        context: {}
    };
    this.modalService.showModal(ModalComponent, options);
  }

  dismissSoftKeybaord() {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  emailChange(text: string) {
    this.email = text;
  }

  messageChange(text: string) {
    this.message = text;
  }

}
