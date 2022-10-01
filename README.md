# extensions

These are my Gnome extensions (~/.local/share/gnome-shell/extensions) for my Pop!OS rice. These are customized for my system and may not work out of the box on yours.

Some notes: 

1. I'm running a 3840x2400 monitor with 2x UI scaling and 0.85 font scaling. The font is Fira Sans Compressed patched with Nerd icons.
2. Dash to Panel is doing a lot of work here. The bar width is 16px. The font-size is 10. The order of the panel is as follows: Left Box, Right Box (aligned left), Center Box (aligned right), Status Tray, Date/Time.
3. Resource Monitor is only used to show network up/down in one indicator. Vitals is used for uptime, temp, CPU, mem, and storage.
4. Executor is running the following script in the right-box of the panel. 
    - if [ $(echo $(xdotool getactivewindow getwindowname)) == '@!0,0;BDHF' ];
      then
        echo ' ';
      else
        echo $(xdotool getactivewindow getwindowname) | head -c 275;
      fi
     - there is an additional echo ' ' which adds some padding between the Pop-shell indicator and Executor. 
