import { Application, Page, Device, Frame, isIOS } from '@nativescript/core';

declare var android: any;

export function setStatusBarColors(): void {
    if (!!Application.android) {
        Application.android.on('activityStarted', function(): void {
            if (Application.android && Device.sdkVersion >= '21') {
                const View = android.view.View;
                const window = Application.android.startActivity.getWindow();
                window.setStatusBarColor(0x000000);

                const decorView = window.getDecorView();
                decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                    // | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                );
            }
        });
    }
}

export function disableIosSwipe(page: Page): void {
    if (isIOS) {
        const controller = Frame.topmost().ios.controller;
        const navigationItem = controller.visibleViewController.navigationItem;
        navigationItem.setHidesBackButtonAnimated(true, false);
        page.enableSwipeBackNavigation = false;
    }
}