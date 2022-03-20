#!/bin/sh

TEST_FILE=$1

TEST_DIST_FILE=/scripts/"${TEST_FILE}".js

docker compose run --rm k6 run --compatibility-mode=base "${TEST_DIST_FILE}"