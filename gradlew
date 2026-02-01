#!/usr/bin/env sh

#
# Copyright 2015 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

##############################################################################
##
##  Gradle start up script for UN*X
##
##############################################################################

#-----------------------------------------------------------------------------
#
#   NOTICE: This script is based on the standard Gradle wrapper script, but has
#   been modified to work in an environment where `java` might not be on the
#   PATH. It tries to locate a suitable JDK.
#
#-----------------------------------------------------------------------------

# Attempt to set APP_HOME
# Resolve links: $0 may be a link
PRG="$0"
# Need this for relative symlinks.
while [ -h "$PRG" ] ; do
    ls=`ls -ld "$PRG"`
    link=`expr "$ls" : '.*-> \(.*\)$'`
    if expr "$link" : '/.*' > /dev/null; then
        PRG="$link"
    else
        PRG=`dirname "$PRG"`"/$link"
    fi
done

# Get the absolute path to the script's directory.
APP_HOME=`dirname "$PRG"`
APP_HOME=`cd "$APP_HOME" && pwd`

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

# OS specific support. $var _must_ be set to either true or false.
cygwin=false
msys=false
darwin=false
case "`uname`" in
  CYGWIN*) cygwin=true ;;
  Darwin*) darwin=true ;;
  MINGW*) msys=true ;;
esac

# For Cygwin, ensure paths are in UNIX format before anything is touched
if $cygwin ; then
    [ -n "$APP_HOME" ] && APP_HOME=`cygpath --unix "$APP_HOME"`
    [ -n "$JAVA_HOME" ] && JAVA_HOME=`cygpath --unix "$JAVA_HOME"`
fi

# Attempt to locate a Java installation.
# We need to do this because `java` might not be on the PATH.

# If JAVA_HOME is not set, try to find it.
if [ -z "$JAVA_HOME" ]; then
    # Try to find a JDK in /nix/store, which is common in this environment
    if [ -d "/nix/store" ]; then
        # Prefer Zulu JDK 17 if available
        JAVA_HOME_CANDIDATE=`find /nix/store -maxdepth 1 -type d -name "*-zulu-ca-jdk-17.*" -print -quit`
        if [ -n "$JAVA_HOME_CANDIDATE" ] && [ -x "$JAVA_HOME_CANDIDATE/bin/java" ]; then
            JAVA_HOME="$JAVA_HOME_CANDIDATE"
        else
            # Fallback to any other Zulu JDK
            JAVA_HOME_CANDIDATE=`find /nix/store -maxdepth 1 -type d -name "*-zulu-ca-jdk-*" -print -quit`
            if [ -n "$JAVA_HOME_CANDIDATE" ] && [ -x "$JAVA_HOME_CANDIDATE/bin/java" ]; then
                JAVA_HOME="$JAVA_HOME_CANDIDATE"
            fi
        fi
    fi

    # If still not found, check standard locations.
    if [ -z "$JAVA_HOME" ]; then
        if [ -d "/usr/lib/jvm/default-java" ]; then
             JAVA_HOME="/usr/lib/jvm/default-java"
        elif [ `uname` = "Darwin" ]; then
             JAVA_HOME=`/usr/libexec/java_home`
        fi
    fi
fi

# If we still don't have a JAVA_HOME, we're stuck.
if [ -z "$JAVA_HOME" ]; then
    echo "ERROR: Unable to locate a Java Virtual Machine."
    echo "Please set the JAVA_HOME environment variable to point to a valid JDK installation."
    exit 1
fi

# Set the Java command.
JAVACMD="$JAVA_HOME/bin/java"

# Check if the Java command is executable.
if [ ! -x "$JAVACMD" ]; then
    echo "ERROR: The JAVA_HOME environment variable is set to an invalid directory: $JAVA_HOME"
    echo "The file $JAVACMD is not executable."
    echo "Please set JAVA_HOME to a valid JDK installation."
    exit 1
fi

# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
DEFAULT_JVM_OPTS="-Xmx64m -Xms64m"

# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD="maximum"

# Increase the maximum number of open files
if [ "$cygwin" = "false" ] && [ "$darwin" = "false" ] ; then
    MAX_FD_LIMIT=`ulimit -H -n`
    if [ $? -eq 0 ] ; then
        if [ "$MAX_FD" = "maximum" ] || [ "$MAX_FD" = "max" ] ; then
            # Use the system limit
            MAX_FD="$MAX_FD_LIMIT"
        fi
        ulimit -n $MAX_FD
        if [ $? -ne 0 ] ; then
            echo "Could not set maximum file descriptor limit: $MAX_FD"
        fi
    fi
fi

# Add the wrapper jar to the classpath
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"

# Combine all JVM options into an array.
# We rely on shell's word splitting here.
JVM_OPTS_ARRAY=($DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS)


# Download the wrapper jar if it doesn't exist
WRAPPER_JAR_PATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"
if [ ! -f "$WRAPPER_JAR_PATH" ]; then
    # The properties file should exist and define the download URL
    WRAPPER_PROPS_PATH="$APP_HOME/gradle/wrapper/gradle-wrapper.properties"
    if [ ! -f "$WRAPPER_PROPS_PATH" ]; then
        echo "ERROR: Wrapper properties file not found: $WRAPPER_PROPS_PATH"
        exit 1
    fi
    # Read the download URL from the properties file.
    WRAPPER_URL=`grep distributionUrl "$WRAPPER_PROPS_PATH" | sed 's/distributionUrl=//'`

    echo "Downloading $WRAPPER_URL"
    # Ensure the target directory exists
    mkdir -p `dirname "$WRAPPER_JAR_PATH"`

    if [ -x "`which wget`" ] ; then
        wget -q -O "$WRAPPER_JAR_PATH" "$WRAPPER_URL"
    elif [ -x "`which curl`" ] ; then
        curl -# -L -o "$WRAPPER_JAR_PATH" "$WRAPPER_URL"
    else
        echo "ERROR: Neither wget nor curl is available to download the wrapper."
        exit 1
    fi
fi


# Execute Gradle.
# The "${JVM_OPTS_ARRAY[@]}" syntax expands the array into separate arguments.
exec "$JAVACMD" "${JVM_OPTS_ARRAY[@]}" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
