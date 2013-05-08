#!/bin/sh
#====================================================================================================
#
# Builds a simulation for deployment.
#
# Author: Chris Malley (PixelZoom, Inc.)
#
#====================================================================================================

PROJECT=beers-law-lab
HTML_FILE=${PROJECT}.html
DEPLOY_DIR=./deploy

# start with a clean directory
echo "Cleaning output directory ..."
rm -rf $DEPLOY_DIR/*

# create the minified script
echo "Creating minified script ..."
grunt
# TODO bail here if grunt failed

# 3rd-party dependencies that are not in the minified script
echo "Copying 3rd-party libs ..."
cp -rp lib $DEPLOY_DIR

# resources
echo "Copying resources ..."
cp -rp images $DEPLOY_DIR

# consolidate CSS files into one directory
echo "Consolidating CSS files ..."
cp -rp css $DEPLOY_DIR
cp -rp ../phetcommon/css/* $DEPLOY_DIR/css

# copy scripts that are loaded outside of requirejs
echo "Copying scripts that are loaded outside of RequireJS ..."
mkdir $DEPLOY_DIR/js
cp -p ../phetcommon/js/util/check-assertions.js ${DEPLOY_DIR}/js
cp -p ../phetcommon/js/util/query-parameters.js ${DEPLOY_DIR}/js

# copy the HTML file and fix it up
echo "Modifying HTML file..."
BACKUP_SUFFIX=.bup
cp ${HTML_FILE} ${DEPLOY_DIR}
sed -i ${BACKUP_SUFFIX} 's/<script data-main="js\/$(PROJECT)-config.js" src="lib\/require-2.1.4.js">/<script type="text\/javascript" src="$(PROJECT).min.js">/g' $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/..\/phetcommon\/css\/phetcommon.css/css\/phetcommon.css/g' $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/..\/phetcommon\/js\/util\/check-assertions.js/js\/check-assertions.js/g' $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/..\/phetcommon\/js\/util\/query-parameters.js/js\/query-parameters.js/g' $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/Malley/Foo/g' $DEPLOY_DIR/${HTML_FILE}
rm $DEPLOY_DIR/${HTML_FILE}${BACKUP_SUFFIX}

echo "Done."




