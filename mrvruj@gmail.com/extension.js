/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const Main = imports.ui.main;

class Extension {
    constructor() {
        Main.panel.statusArea.aggregateMenu._network.indicators.hide();
        Main.panel.statusArea.aggregateMenu._bluetooth.indicators.hide();
    }

    enable() {
        Main.panel.statusArea.aggregateMenu._network.indicators.hide();
        Main.panel.statusArea.aggregateMenu._bluetooth.indicators.hide();
    }

    disable() {
        Main.panel.statusArea.aggregateMenu._network.indicators.hide();
        Main.panel.statusArea.aggregateMenu._bluetooth.indicators.hide();
    }
}

function init() {
    Main.panel.statusArea.aggregateMenu._network.indicators.hide();
    Main.panel.statusArea.aggregateMenu._bluetooth.indicators.hide();
    return new Extension();
}
