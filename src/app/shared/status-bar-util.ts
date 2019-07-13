import * as application from 'tns-core-modules/application';
import * as platform from 'tns-core-modules/platform';

declare var android: any;

export function setStatusBarColors() {
    if (application.ios) {
        // remove due to API deprecated/removed
    }

    if (application.android) {
        application.android.on('activityStarted', function () {
            if (application.android && platform.device.sdkVersion >= '21') {
                let View = android.view.View;
                let window = application.android.startActivity.getWindow();
                window.setStatusBarColor(0x000000);

                let decorView = window.getDecorView();
                decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    // | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                    // | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
            }
        });
    }
}