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
rm -rf ${OUTPUT_DIR}
mkdir ${OUTPUT_DIR}

echo "Creating minified script ..."
grunt || { echo 'grunt failed' ; exit 1; }

echo "Copying 3rd-party libs ..."
cp -rp lib $OUTPUT_DIR

echo "Copying resources ..."
for dir in $RESOURCE_DIRS; do
    cp -rp ${dir} ${OUTPUT_DIR}
done

echo "Consolidating CSS files ..."
cp -rp css ${OUTPUT_DIR}
for css in ${COMMON_CSS}; do
  cp -p ${css} ${OUTPUT_DIR}/css
done

echo "Copying scripts that are loaded before RequireJS ..."
mkdir ${OUTPUT_DIR}/js
for script in ${COMMON_SCRIPTS}; do
  cp -p ${script} ${OUTPUT_DIR}/js
done

echo "Modifying HTML file..."

HTML_FILE=${PROJECT}.html
BACKUP_SUFFIX=.bup
cp ${HTML_FILE} ${OUTPUT_DIR}

# change script tag to load minified script
sed -i ${BACKUP_SUFFIX} "s/<script data-main=\"js\/${PROJECT}-config.js\" src=\".*\">/<script type=\"text\/javascript\" src=\"${PROJECT}.min.js\">/g" ${OUTPUT_DIR}/${HTML_FILE}

# change the path of any CSS files that were consolidated
for css in ${COMMON_CSS}; do
  fromFile=`echo ${css} | sed -e 's/[\/]/\\&\//g' | tr '\&' '\'`
  toFile=css\\/`basename ${css}`
  sed -i ${BACKUP_SUFFIX} "s/${fromFile}/${toFile}/g" ${OUTPUT_DIR}/${HTML_FILE}
done

# change the path of any scripts that were copied
for script in ${COMMON_SCRIPTS}; do
  fromFile=`echo ${script} | sed -e 's/[\/]/\\&\//g' | tr '\&' '\'`
  toFile=js\\/`basename ${script}`
  sed -i ${BACKUP_SUFFIX} "s/${fromFile}/${toFile}/g" ${OUTPUT_DIR}/${HTML_FILE}
done

# delete sed backup files
rm ${OUTPUT_DIR}/${HTML_FILE}${BACKUP_SUFFIX}

echo "Done."

#====================================================================================================

# sed -e 's/[\/&]/\\&/g'



