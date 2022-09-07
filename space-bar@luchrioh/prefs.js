const Me = imports.misc.extensionUtils.getCurrentExtension();
const { BehaviorPage } = Me.imports.preferences.BehaviorPage;
const { ShortcutsPage } = Me.imports.preferences.ShortcutsPage;
function init() { }
function fillPreferencesWindow(window) {
    [new BehaviorPage(), new ShortcutsPage()].forEach((pageObject) => {
        pageObject.window = window;
        pageObject.init();
        window.add(pageObject.page);
    });
}
