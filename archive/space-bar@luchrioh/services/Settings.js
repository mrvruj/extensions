const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const { Gio } = imports.gi;
var Settings = class Settings {
    constructor() {
        this.state = ExtensionUtils.getSettings(`${Me.metadata['settings-schema']}.state`);
        this.behaviorSettings = ExtensionUtils.getSettings(`${Me.metadata['settings-schema']}.behavior`);
        this.shortcutsSettings = ExtensionUtils.getSettings(`${Me.metadata['settings-schema']}.shortcuts`);
        this.mutterSettings = new Gio.Settings({ schema: 'org.gnome.mutter' });
        this.wmPreferencesSettings = new Gio.Settings({
            schema: 'org.gnome.desktop.wm.preferences',
        });
        this.workspaceNamesMap = SettingsSubject.createJsonObjectSubject(this.state, 'workspace-names-map');
        this.dynamicWorkspaces = SettingsSubject.createBooleanSubject(this.mutterSettings, 'dynamic-workspaces');
        this.showEmptyWorkspaces = SettingsSubject.createBooleanSubject(this.behaviorSettings, 'show-empty-workspaces');
        this.scrollWheel = SettingsSubject.createStringSubject(this.behaviorSettings, 'scroll-wheel');
        this.smartWorkspaceNames = SettingsSubject.createBooleanSubject(this.behaviorSettings, 'smart-workspace-names');
        this.enableActivateWorkspaceShortcuts = SettingsSubject.createBooleanSubject(this.shortcutsSettings, 'enable-activate-workspace-shortcuts');
        this.enableMoveToWorkspaceShortcuts = SettingsSubject.createBooleanSubject(this.shortcutsSettings, 'enable-move-to-workspace-shortcuts');
        this.workspaceNames = SettingsSubject.createStringArraySubject(this.wmPreferencesSettings, 'workspace-names');
    }
    static init() {
        Settings._instance = new Settings();
        Settings._instance.init();
    }
    static destroy() {
        Settings._instance?.destroy();
        Settings._instance = null;
    }
    static getInstance() {
        return Settings._instance;
    }
    init() {
        SettingsSubject.initAll();
    }
    destroy() {
        SettingsSubject.destroyAll();
    }
}
class SettingsSubject {
    constructor(_settings, _name, _type) {
        this._settings = _settings;
        this._name = _name;
        this._type = _type;
        this._subscribers = [];
        SettingsSubject._subjects.push(this);
    }
    static createBooleanSubject(settings, name) {
        return new SettingsSubject(settings, name, 'boolean');
    }
    static createStringSubject(settings, name) {
        return new SettingsSubject(settings, name, 'string');
    }
    static createStringArraySubject(settings, name) {
        return new SettingsSubject(settings, name, 'string-array');
    }
    static createJsonObjectSubject(settings, name) {
        return new SettingsSubject(settings, name, 'json-object');
    }
    static initAll() {
        for (const subject of SettingsSubject._subjects) {
            subject._init();
        }
    }
    static destroyAll() {
        for (const subject of SettingsSubject._subjects) {
            subject._destroy();
        }
        SettingsSubject._subjects = [];
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._setValue(value);
    }
    subscribe(subscriber, { emitCurrentValue = false } = {}) {
        this._subscribers.push(subscriber);
        if (emitCurrentValue) {
            subscriber(this._value);
        }
    }
    _init() {
        this._getValue = () => {
            switch (this._type) {
                case 'boolean':
                    return this._settings.get_boolean(this._name);
                case 'string':
                    return this._settings.get_string(this._name);
                case 'string-array':
                    return this._settings.get_strv(this._name);
                case 'json-object':
                    return JSON.parse(this._settings.get_string(this._name));
                default:
                    throw new Error('unknown type ' + this._type);
            }
        };
        this._setValue = (value) => {
            switch (this._type) {
                case 'boolean':
                    return this._settings.set_boolean(this._name, value);
                case 'string':
                    return this._settings.set_string(this._name, value);
                case 'string-array':
                    return this._settings.set_strv(this._name, value);
                case 'json-object':
                    return this._settings.set_string(this._name, JSON.stringify(value));
                default:
                    throw new Error('unknown type ' + this._type);
            }
        };
        this._value = this._getValue();
        const changed = this._settings.connect(`changed::${this._name}`, () => this._updateValue(this._getValue()));
        this._disconnect = () => this._settings.disconnect(changed);
    }
    _destroy() {
        this._disconnect();
        this._subscribers = [];
    }
    _updateValue(value) {
        this._value = value;
        this._notifySubscriber();
    }
    _notifySubscriber() {
        for (const subscriber of this._subscribers) {
            subscriber(this._value);
        }
    }
}
SettingsSubject._subjects = [];
