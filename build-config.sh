#!/bin/bash
#====================================================================================================
#
# Configuration used by build.sh
#
#====================================================================================================

# Name of your project.
# Your HTML file must be named $PROJECT.html.
# Your RequireJS config file must be named $PROJECT-config.js.
PROJECT=beers-law-lab

# Directory where files will be created.
OUTPUT_DIR=./build

# Directories that contain resource files, these will be copied.
# Paths are relative to the directory where you run the build script.
# Double quotes around this value are required.
RESOURCE_DIRS="images"

# Common-code CSS file names, as they appear in your HTML file.
# Paths are relative to the directory where you run the build script.
# Double quotes around this value are required.
COMMON_CSS="../phetcommon/css/phetcommon.css"

# Common-code scripts that are loaded before RequireJS, as they appear in your HTML file.
# Paths are relative to the directory where you run the build script.
# Double quotes around this value are required.
COMMON_SCRIPTS="../phetcommon/js/util/check-assertions.js ../phetcommon/js/util/query-parameters.js"

#====================================================================================================