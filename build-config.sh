#!/bin/bash
#====================================================================================================
#
# Configuration used by build.sh
#
#====================================================================================================

# Name of your project. This is also the prefix of your HTML and RequireJS config files.
PROJECT=beers-law-lab

# Directory where files will be staged for deployment.
DEPLOY_DIR=./deploy

# Directories that contain resource files, these will be copied.
RESOURCE_DIRS="images"

# CSS file names that are not part of your project, as they appear in your HTML file.
COMMON_CSS="../phetcommon/css/phetcommon.css"

# Scripts that are loaded before RequireJS, as they appear in your HTML file.
COMMON_SCRIPTS="../phetcommon/js/util/check-assertions.js ../phetcommon/js/util/query-parameters.js"

#====================================================================================================