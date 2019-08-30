import * as application from 'tns-core-modules/application';
import * as platform from 'tns-core-modules/platform';

declare var android: any;

export function setStatusBarColors(): void {
    if (application.ios) {
        // remove due to API deprecated/removed
    }

    if (application.android) {
        application.android.on('activityStarted', function(): void {
            if (application.android && platform.device.sdkVersion >= '21') {
                const View = android.view.View;
                const window = application.android.startActivity.getWindow();
                window.setStatusBarColor(0x000000);

                const decorView = window.getDecorView();
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