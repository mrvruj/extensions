const Me = imports.misc.extensionUtils.getCurrentExtension();
const { Adw, Gdk, Gio, Gtk } = imports.gi;
const { DropDownChoice } = Me.imports.preferences.DropDownChoice;
function addToggle({ group, key, title, subtitle = null, settings, shortcutLabel, }) {
    const row = new Adw.ActionRow({ title, subtitle });
    group.add(row);
    if (shortcutLabel) {
        const gtkShortcutLabel = new Gtk.ShortcutLabel({
            accelerator: shortcutLabel,
            valign: Gtk.Align.CENTER,
        });
        row.add_prefix(gtkShortcutLabel);
    }
    const toggle = new Gtk.Switch({
        active: settings.get_boolean(key),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(key, toggle, 'active', Gio.SettingsBindFlags.DEFAULT);
    row.add_suffix(toggle);
    row.activatable_widget = toggle;
}
function addCombo({ group, key, title, subtitle = null, options, settings, window, }) {
    const model = Gio.ListStore.new(DropDownChoice);
    for (const id in options) {
        model.append(new DropDownChoice({ id, title: options[id] }));
    }
    const row = new Adw.ComboRow({
        title,
        subtitle,
        model,
        expression: Gtk.PropertyExpression.new(DropDownChoice, null, 'title'),
    });
    group.add(row);
    row.connect('notify::selected-item', () => settings.set_string(key, row.selected_item.id));
    function updateComboRowState() {
        row.selected =
            findItemPositionInModel(model, (item) => item.id === settings.get_string(key)) ?? Gtk.INVALID_LIST_POSITION;
    }
    const changed = settings.connect(`changed::${key}`, () => updateComboRowState());
    window.connect('unmap', () => settings.disconnect(changed));
    updateComboRowState();
}
function addKeyboardShortcut({ window, group, key, title, subtitle = null, settings, }) {
    const row = new Adw.ActionRow({
        title,
        subtitle,
        activatable: true,
    });
    group.add(row);
    const shortcutLabel = new Gtk.ShortcutLabel({
        accelerator: settings.get_strv(key)[0] ?? null,
        valign: Gtk.Align.CENTER,
    });
    row.add_suffix(shortcutLabel);
    const disabledLabel = new Gtk.Label({
        label: 'Disabled',
        css_classes: ['dim-label'],
    });
    row.add_suffix(disabledLabel);
    if (settings.get_strv(key).length > 0) {
        disabledLabel.hide();
    }
    else {
        shortcutLabel.hide();
    }
    function showDialog() {
        const dialog = new Gtk.Dialog({
            title: 'Set Shortcut',
            modal: true,
            use_header_bar: 1,
            transient_for: window,
            width_request: 400,
            height_request: 200,
        });
        const dialogBox = new Gtk.Box({
            margin_bottom: 12,
            margin_end: 12,
            margin_start: 12,
            margin_top: 12,
            orientation: Gtk.Orientation.VERTICAL,
            valign: Gtk.Align.CENTER,
        });
        const dialogLabel = new Gtk.Label({
            label: 'Enter new shortcut to change <b>' + title + '</b>.',
            use_markup: true,
            margin_bottom: 12,
        });
        dialogBox.append(dialogLabel);
        const dialogDimLabel = new Gtk.Label({
            label: 'Press Esc to cancel or Backspace to disable the keyboard shortcut.',
            css_classes: ['dim-label'],
        });
        dialogBox.append(dialogDimLabel);
        const keyController = new Gtk.EventControllerKey({
            propagation_phase: Gtk.PropagationPhase.CAPTURE,
        });
        dialog.add_controller(keyController);
        keyController.connect('key-pressed', (keyController, keyval, keycode, modifier) => {
            const accelerator = getAccelerator(keyval, modifier);
            if (accelerator) {
                if (keyval === Gdk.KEY_Escape && !modifier) {
                    // Just close the dialog
                }
                else if (keyval === Gdk.KEY_BackSpace && !modifier) {
                    shortcutLabel.hide();
                    disabledLabel.show();
                    settings.set_strv(key, []);
                }
                else {
                    shortcutLabel.accelerator = accelerator;
                    shortcutLabel.show();
                    disabledLabel.hide();
                    settings.set_strv(key, [accelerator]);
                }
                dialog.close();
            }
        });
        dialog.set_child(dialogBox);
        dialog.show();
    }
    row.connect('activated', () => showDialog());
}
function getAccelerator(keyval, modifiers) {
    const acceleratorName = Gtk.accelerator_name(keyval, modifiers);
    const isValid = Gtk.accelerator_valid(keyval, modifiers);
    if (isValid) {
        return acceleratorName;
    }
    else {
        return null;
    }
}
// From https://gitlab.com/rmnvgr/nightthemeswitcher-gnome-shell-extension/-/blob/main/src/utils.js
function findItemPositionInModel(model, predicate) {
    for (let i = 0; i < model.get_n_items(); i++) {
        if (predicate(model.get_item(i))) {
            return i;
        }
    }
    return undefined;
}
