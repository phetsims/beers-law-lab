#!/bin/sh
#====================================================================================================
#
# Builds a simulation for deployment. Usage: build.sh [configFile]
#
# Author: Chris Malley (PixelZoom, Inc.)
#
#====================================================================================================

# parse commandline line, optional config file is first arg
CONFIG=${1:-./build-config.sh}
if [ ! -f ${CONFIG} ]; then
    echo "missing config file: ${CONFIG}"; exit 1
fi

# read the config file
source ./build-config.sh

echo "Building ${PROJECT} ..."

echo "Cleaning output directory ..."
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

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
for script in ${COMMON_SCRIPTS}; do
  cp -p ${script} ${DEPLOY_DIR}/js
done

echo "Modifying HTML file..."

HTML_FILE=${PROJECT}.html
BACKUP_SUFFIX=.bup
cp ${HTML_FILE} ${DEPLOY_DIR}

# change script tag to load minified script
sed -i ${BACKUP_SUFFIX} "s/<script data-main=\"js\/${PROJECT}-config.js\" src=\".*\">/<script type=\"text\/javascript\" src=\"${PROJECT}.min.js\">/g" $DEPLOY_DIR/${HTML_FILE}

# change the path of any CSS files that were consolidated
for css in ${COMMON_CSS}; do
  fromFile=`echo ${css} | sed -e 's/[\/]/\\&\//g' | tr '\&' '\'`
  toFile=css\\/`basename ${css}`
  sed -i ${BACKUP_SUFFIX} "s/${fromFile}/${toFile}/g" $DEPLOY_DIR/${HTML_FILE}
done

# change the path of any scripts that were copied
for script in ${COMMON_SCRIPTS}; do
  fromFile=`echo ${script} | sed -e 's/[\/]/\\&\//g' | tr '\&' '\'`
  toFile=js\\/`basename ${script}`
  sed -i ${BACKUP_SUFFIX} "s/${fromFile}/${toFile}/g" $DEPLOY_DIR/${HTML_FILE}
done

# delete sed backup files
rm $DEPLOY_DIR/${HTML_FILE}${BACKUP_SUFFIX}

echo "Done."

#====================================================================================================

# sed -e 's/[\/&]/\\&/g'



