# Reboot into Windows

Adds a **Reboot into Windows** entry to the GNOME power menu (top-right corner)
on a dual-boot Ubuntu/Windows machine.

One click and the computer restarts straight into Windows. This only applies to
that one restart: the next time you reboot normally, you are back in Ubuntu
(or whatever your usual default is). Nothing in your GRUB setup is changed
permanently, and the normal shutdown/restart options stay as they are.

## What's in here

| File | Purpose |
|------|---------|
| `reboot-windows` | Small script: tells GRUB "boot Windows next time", then reboots. |
| `extension/` | The GNOME extension that adds the menu entry. |
| `install.sh` | Installs everything for you. |

## Quick start

1. Open a terminal in this folder and run:
   ```bash
   ./install.sh
   ```
   You will be asked for your password once (to allow the GRUB command without
   a password prompt later).
2. Log out and log back in.
3. Click the power icon in the top-right corner. Choose **Reboot into Windows**.

## If something doesn't work

- **Entry not visible:** make sure the extension is on:
  `gnome-extensions enable reboot-windows@local`, then log out and in again.
- **Reboots into Ubuntu instead of Windows:** the Windows entry name in the
  `reboot-windows` script may differ on your machine. List the names with
  `grep -E "menuentry 'Windows" /boot/grub/grub.cfg` and update the script.
  Then run `./install.sh` again.
- **Different setup:** the script assumes the entry is called
  `Windows Boot Manager (on /dev/nvme0n1p1)`. Change that line for other disks.

## Uninstall

```bash
gnome-extensions disable reboot-windows@local
rm -r ~/.local/share/gnome-shell/extensions/reboot-windows@local
rm ~/.local/bin/reboot-windows
sudo rm /etc/sudoers.d/reboot-windows
```
