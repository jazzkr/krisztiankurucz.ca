# GoSquared for GRAV

This is a [GRAV](http://getgrav.org) plugin that adds the [GoSquared Analytics](https://gosquared.com) tracking code to GRAV pages.

# Installation

Installing the GoSquared plugin can be done in one of two ways.

## GPM Installation (Preferred) _Coming Soon_

The simplest way to install this plugin is via the [Grav Package Manager (GPM)](http://learn.getgrav.org/advanced/grav-gpm) through your system's Terminal (also called the command line).  From the root of your Grav install type:

`bin/gpm install gosquared`

This will install the GoSquared plugin into your `/user/plugins` directory within Grav. The plugin files should now be in `/your/site/grav/user/plugins/gosquared`

## Manual Installation

To install this plugin, just [download](https://github.com/cppl/grav-gosquared/archive/master.zip) the zip version of this repository and unzip it under `/your/site/grav/user/plugins`. Then, rename the folder to `gosquared`.

You should now have all the plugin files under

    /your/site/grav/user/plugins/gosquared

# Config Defaults

```
enabled: true  
gsn: ''  
gsInAdmin: false
```

If you need to change any value, then the best process is to copy the [gosquared.yaml](gosquared.yaml) file into your `users/config/plugins/` folder (create it if it doesn't exist), and then modify there. This will override the default settings.

# Usage

1. In your GoSquared account, open the domain you're using Grav on (or add one if needed).
2. At the bottom of the left side menu you will find *Settings* — click on it.
3. Copy the *GoSquared Site Token* and paste it into the settings for the plugin (I recommend **pasting** not typing...)
