#!/bin/bash
export JAVA_HOME=/nix/store/hjqlrb1224nrxvci6fx4k9kh9s8mdnv3-openjdk-17.0.17+8/lib/openjdk
export PATH=$JAVA_HOME/bin:$PATH
./apache-maven-3.9.6/bin/mvn -f ia_assistant/java_backend/pom.xml compile