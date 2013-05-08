#!/bin/sh
#====================================================================================================
#
# Builds a simulation for deployment.
#
# Author: Chris Malley (PixelZoom, Inc.)
#
#====================================================================================================

PROJECT=beers-law-lab
REQUIREJS=require-2.1.4.js
RESOURCE_DIRS="images"
COMMON_CSS="../phetcommon/css/phetcommon.css"
COPY_SCRIPTS="../phetcommon/js/util/check-assertions.js ../phetcommon/js/util/query-parameters.js"
DEPLOY_DIR=./deploy

#====================================================================================================

echo "Building ${PROJECT} ..."

echo "Cleaning output directory ..."
rm -rf $DEPLOY_DIR/*

echo "Creating minified script ..."
grunt || { echo 'grunt failed' ; exit 1; }

echo "Copying 3rd-party libs ..."
cp -rp lib $DEPLOY_DIR

echo "Copying resources ..."
for dir in $RESOURCE_DIRS; do
    cp -rp ${dir} ${DEPLOY_DIR}
done

echo "Consolidating CSS files ..."
cp -rp css $DEPLOY_DIR
for css in ${COMMON_CSS}; do
  cp -p ${css} ${DEPLOY_DIR}/css
done

echo "Copying scripts that are loaded before RequireJS ..."
mkdir $DEPLOY_DIR/js
for script in ${COPY_SCRIPTS}; do
  cp -p ${script} ${DEPLOY_DIR}/js
done

echo "Modifying HTML file..."
HTML_FILE=${PROJECT}.html
BACKUP_SUFFIX=.bup
cp ${HTML_FILE} ${DEPLOY_DIR}
sed -i ${BACKUP_SUFFIX} "s/<script data-main=\"js\/${PROJECT}-config.js\" src=\"lib\/${REQUIREJS}\">/<script type=\"text\/javascript\" src=\"${PROJECT}.min.js\">/g" $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/..\/phetcommon\/css\/phetcommon.css/css\/phetcommon.css/g' $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/..\/phetcommon\/js\/util\/check-assertions.js/js\/check-assertions.js/g' $DEPLOY_DIR/${HTML_FILE}
sed -i ${BACKUP_SUFFIX} 's/..\/phetcommon\/js\/util\/query-parameters.js/js\/query-parameters.js/g' $DEPLOY_DIR/${HTML_FILE}
rm $DEPLOY_DIR/${HTML_FILE}${BACKUP_SUFFIX}

echo "Done."

#====================================================================================================




