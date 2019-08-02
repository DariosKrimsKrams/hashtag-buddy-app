import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { DeviceService } from '~/app/services/device-photos.service';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { Page } from 'tns-core-modules/ui/page/page';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';
import { SelectPhotoService } from '~/app/services/business-logic/select-photo.service';


@Component({
  selector: 'ns-confirm-image',
  templateUrl: './confirm-image.component.html',
  styleUrls: ['./confirm-image.component.scss'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmImageComponent implements OnInit {

  public photo: ImageAsset;
  @Output() public onClickCancel = new EventEmitter<void>();

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly deviceService: DeviceService,
    private readonly selectPhotoService: SelectPhotoService,
    private readonly cd: ChangeDetectorRef,
  ) {
    cd.detach();
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.loadImage();
  }

  loadImage(): void {
    this.photo = this.deviceService.getSelectedPhoto();
    this.cd.detectChanges();
  }

  confirmImage(): void {
    this.openLoadingPage();
    this.selectPhotoService.saveAndUploadPhoto().subscribe((photoId) => {
      this.openResultsPage(photoId);
      this.cd.detectChanges();
    }, (e) => {
      let locaKey = e === 'customer failed' ? 'toast_create_customer_at_upload_failed' : 'toast_upload_failed';
      Toast.makeText(localize(locaKey), 'long').show();
      setTimeout.bind(this)(() => {
        this.goPrevPage();
      }, 1000);
    });
  }

  public chooseImage(): void {
    this.selectPhotoService.pickImage().subscribe((image) => {
      this.photo = image;
      this.cd.detectChanges();
    });
  }

  public goPrevPage(): void {
    this.onClickCancel.emit();
  }

  private openLoadingPage(): void {
    this.router.navigate([`/home/loading-hashtags`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  private openResultsPage(id: number): void {
    this.router.navigate([`/home/results/${id}`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

}
