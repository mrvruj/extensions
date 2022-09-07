const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
function showActivities(show) {
    const activities_button = Main.panel.statusArea['activities'];
    if (activities_button) {
        if (show && !Main.sessionMode.isLocked) {
            activities_button.container.show();
        }
        else {
            activities_button.container.hide();
        }
    }
}
