#!/bin/bash
# Installs the "Reboot into Windows" power menu entry for GNOME.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UUID="reboot-windows@local"
EXT_DIR="$HOME/.local/share/gnome-shell/extensions/$UUID"
BIN_DIR="$HOME/.local/bin"

echo "Installing script to $BIN_DIR ..."
mkdir -p "$BIN_DIR"
install -m 755 "$DIR/reboot-windows" "$BIN_DIR/reboot-windows"

echo "Installing GNOME extension to $EXT_DIR ..."
mkdir -p "$EXT_DIR"
install -m 644 "$DIR/extension/metadata.json" "$DIR/extension/extension.js" "$EXT_DIR/"

echo "Allowing grub-reboot without a password (needs sudo) ..."
SUDOERS="/etc/sudoers.d/reboot-windows"
LINE="$USER ALL=(root) NOPASSWD: /usr/sbin/grub-reboot"
TMP="$(mktemp)"
echo "$LINE" > "$TMP"
sudo visudo -cf "$TMP" >/dev/null
sudo install -m 440 -o root -g root "$TMP" "$SUDOERS"
rm -f "$TMP"

gnome-extensions enable "$UUID" 2>/dev/null || true

cat <<MSG

Done. Log out and back in once so GNOME loads the new extension.
Then open the power menu (top right) - "Reboot into Windows" will be there.
MSG
