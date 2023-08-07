#/bin/sh
# call this from the root directory psm-client (eg. ./ci-cd/get-package-version.sh)
# returns the version specified in package.json
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo $PACKAGE_VERSION