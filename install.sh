#!/bin/bash
echo ""
echo "=== conduit install script ==="
echo ""
echo "checking environment"
CONDUIT_PLATFORM="linux"
if [[ "$OSTYPE" == "linux-gnu" ]]; then # linux
  echo " > platform: linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then # macos
  CONDUIT_PLATFORM="macos"
  echo " > platform: macos"
else # unknown OS / windows
  echo " > platform: [$OSTYPE]"
  echo "your platform is not supported by this script. aborting."
  exit 1
fi
if [[ `uname -m` == "x86_64" ]]; then # 64-bit
  echo " > arch: x86_64"
else # unknown / unsupported arch
  echo " > arch: `uname -m`"
  echo "your platform is not supported by this script. aborting."
  exit 1
fi
if [[ `which git` == "" ]]; then
  echo "you must install git before running this script. aborting."
  exit 1
else
  echo " > git: `which git`"
fi
if [[ `which tar` == "" ]]; then
  echo "you must install tar before running this script. aborting."
  exit 1
else
  echo " > tar: `which tar`"
fi
DOWNLOAD_MODE="curl"
if [[ `which curl` == "" ]]; then
  DOWNLOAD_MODE="wget"
  if [[ `which wget` == "" ]]; then
    echo "you must have either wget or curl installed before running this script. aborting."
    exit 1
  else
    echo " > wget: `which wget`"
  fi
else
  echo " > curl: `which curl`"
fi
echo " > download mode: $DOWNLOAD_MODE"
echo " > environment check complete."
echo ""
echo "downloading latest release of conduit from github"
mkdir -p /tmp/conduit-installer || exit 1
rm -rf /tmp/conduit-installer/* || exit 1
curl -L -o /tmp/conduit-installer/conduit.tar.gz https://gitreleases.dev/gh/sam0x17/conduit/latest/conduit-$CONDUIT_PLATFORM-x86.tar.gz || exit 1
echo ""
echo "extracting tar.gz archive"
cd /tmp/conduit-installer || exit 1
tar -xzf conduit.tar.gz || exit 1
echo ""
echo "installing binary to ~/.conduit"
mkdir -p ~/.conduit || exit 1
mv ./conduit ~/.conduit/conduit || exit 1
echo ""
if [[ `which conduit` == "" ]]; then
  echo "adding ~/.conduit to PATH"
  echo 'export PATH=$PATH:~/.conduit' >> ~/.bashrc
  echo "conduit has been added to your PATH, you should log out and log back in."
fi
echo "done."
echo ""