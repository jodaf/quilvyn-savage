## Savage Worlds plugins for the Quilvyn RPG character sheet generator

The quilvyn-savage package bundles modules that extend Quilvyn to work with
the Savage Worlds RPG, applying the rules of the
<a href="https://www.peginc.com/store/savage-worlds-adventure-edition-core-rules-pdf-swade/">Savage Worlds Adventure Edition</a>,
<a href="https://peginc.com/store/savage-worlds-deluxe-explorers-edition/">Savage Worlds Deluxe Edition</a>,
<a href="https://www.drivethrurpg.com/product/319036/Deadlands-The-Weird-West"> Deadlands: THe Weird West</a>, and
<a href="https://www.drivethrurpg.com/product/361286/PathfinderR-for-Savage-Worlds-Core-Rules"</a>Pathfinder for Savage Worlds Core Rules</a>.

### Requirements

quilvyn-savage relies on the core modules installed by the quilvyn-core package.

### Installation

To use quilvyn-savage, unbundle the release package into a plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS["Savage Worlds Deluxe Edition"] = {
      url:'plugins/SWD.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };
    RULESETS["Savage Worlds Adventurer's Edition"] = {
      url:'plugins/SWADE.js',
      group:'Savage Worlds'
    };
    RULESETS["Deadlands - The Weird West"] = {
      url:'plugins/WeirdWest.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };
    RULESETS["Pathfinder for SWADE"] = {
      url:'plugins/PF4SW.js',
      group:'Savage Worlds',
      require:'SWADE.js'
    };

### Usage

Once the SWADE plugin is installed as described above, start Quilvyn and
check the box next to "Savage Worlds Adventurer's Edition" from the rule set
menu in the initial window.
