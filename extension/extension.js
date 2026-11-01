import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export default class RebootWindowsExtension extends Extension {
    enable() {
        this._tryAdd();
        // The system indicator may not exist yet when we are enabled early.
        if (!this._rebootWindowsItem) {
            this._retryId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
                this._tryAdd();
                if (this._rebootWindowsItem) {
                    this._retryId = null;
                    return GLib.SOURCE_REMOVE;
                }
                return GLib.SOURCE_CONTINUE;
            });
        }
    }

    _tryAdd() {
        const menu = Main.panel.statusArea.quickSettings?._system?._systemItem?.menu;
        if (!menu)
            return;

        const item = new PopupMenu.PopupMenuItem('Reboot into Windows');
        item.connect('activate', () => {
            Main.panel.closeQuickSettings();
            try {
                Gio.Subprocess.new(
                    [`${GLib.get_home_dir()}/.local/bin/reboot-windows`],
                    Gio.SubprocessFlags.NONE);
            } catch (e) {
                logError(e, 'reboot-windows failed');
            }
        });

        // Put it after Restart…
        menu.addMenuItem(item, 2);
        this._menu = menu;
        this._rebootWindowsItem = item;
    }

    disable() {
        if (this._retryId) {
            GLib.source_remove(this._retryId);
            this._retryId = null;
        }
        this._rebootWindowsItem?.destroy();
        this._rebootWindowsItem = null;
        this._menu = null;
    }
}
