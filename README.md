# extensions

These are my Gnome extensions (~/.local/share/gnome-shell/extensions) for my Pop!OS rice. These are customized for my system and may not work out of the box on yours.

Some notes: 

1. I'm running a 3840x2400 monitor with 2x UI scaling and 0.85 font scaling. The font is Fira Sans Compressed patched with Nerd icons.
2. Dash to Panel is doing a lot of work here. The bar width is 20px. The left-box font-size is 10 and the left-box spacing is 4px. The rest of the font sizes are 11 and spacing is 0. The order of the panel is as follows: Left Box, Right Box (aligned left), Center Box (aligned right), Status Tray, Date/Time.
3. The underline was made in a very hacky way. It uses a box-shadow in the stylesheets of several extensions (Space Bar, Vitals, Date-Menu Formatter) as well as the gnome-shell Catppuccin theme for the battery, volume, and date indicators. The box-shadow height in px is set such that it shows up with a Dash to Panel bar width of 20px, if either value is changed, the bar will disappear or change thickness. Very poor design, yes, I know. 
4. Resource Monitor is only used to show network up/down in one indicator. Vitals is used for uptime, temp, CPU, mem, and storage.
5. Executor is running the following script in the right-box of the panel. 
    - if [ $(echo $(xdotool getactivewindow getwindowname)) == '@!0,0;BDHF' ];
      then
        echo ' ';
      else
        echo $(xdotool getactivewindow getwindowname) | head -c 275;
      fi
     - there is an additional echo ' ' which adds some padding between the Pop-shell indicator and Executor. 
