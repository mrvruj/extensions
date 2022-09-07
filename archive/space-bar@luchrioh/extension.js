const Me = imports.misc.extensionUtils.getCurrentExtension();
const { KeyBindings } = Me.imports.services.KeyBindings;
const { ScrollHandler } = Me.imports.services.ScrollHandler;
const { Settings } = Me.imports.services.Settings;
const { showActivities } = Me.imports.services.showActivities;
const { Workspaces } = Me.imports.services.Workspaces;
const { WorkspacesBar } = Me.imports.ui.WorkspacesBar;
class Extension {
    constructor() {
        this.workspacesBar = null;
        this.scrollHandler = null;
    }
    enable() {
        Settings.init();
        showActivities(false);
        Workspaces.init();
        KeyBindings.init();
        this.workspacesBar = new WorkspacesBar();
        this.workspacesBar.init();
        this.scrollHandler = new ScrollHandler();
        this.scrollHandler.init(this.workspacesBar.button);
    }
    disable() {
        Settings.destroy();
        Workspaces.destroy();
        KeyBindings.destroy();
        this.scrollHandler?.destroy();
        this.scrollHandler = null;
        this.workspacesBar?.destroy();
        this.workspacesBar = null;
        showActivities(true);
    }
}
function init() {
    return new Extension();
}
