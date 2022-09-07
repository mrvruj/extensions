const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const { Adw } = imports.gi;
const { addCombo, addToggle } = Me.imports.preferences.common;
var scrollWheelOptions = {
    panel: 'Over top panel',
    'workspaces-bar': 'Over workspaces bar',
    disabled: 'Disabled',
};
var BehaviorPage = class BehaviorPage {
    constructor() {
        this.page = new Adw.PreferencesPage();
        this._settings = ExtensionUtils.getSettings(`${Me.metadata['settings-schema']}.behavior`);
    }
    init() {
        this.page.set_title('Behavior');
        this.page.set_icon_name('preferences-system-symbolic');
        this._initGeneralGroup();
        this._initSmartWorkspaceNamesGroup();
    }
    _initGeneralGroup() {
        const group = new Adw.PreferencesGroup();
        group.set_title('General');
        addToggle({
            settings: this._settings,
            group,
            key: 'show-empty-workspaces',
            title: 'Show empty workspaces',
        });
        addCombo({
            window: this.window,
            settings: this._settings,
            group,
            key: 'scroll-wheel',
            title: 'Switch workspaces with scroll wheel',
            options: scrollWheelOptions,
        });
        this.page.add(group);
    }
    _initSmartWorkspaceNamesGroup() {
        const group = new Adw.PreferencesGroup();
        group.set_title('Smart Workspace Names');
        group.set_description('Remembers open applications when renaming a workspace and automatically assigns workspace names based on the first application started on a new workspace.');
        addToggle({
            settings: this._settings,
            group,
            key: 'smart-workspace-names',
            title: 'Enable smart workspace names',
        });
        this.page.add(group);
    }
}
