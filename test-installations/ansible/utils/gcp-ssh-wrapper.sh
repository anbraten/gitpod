#!/usr/bin/env bash
# Copyright (c) 2022 Gitpod GmbH. All rights reserved.
# Licensed under the GNU Affero General Public License (AGPL).
# See License-AGPL.txt in the project root for license information.

# https://unix.stackexchange.com/a/568099/385206
# https://binx.io/blog/2021/03/10/how-to-tell-ansible-to-use-gcp-iap-tunneling/

# "host" is next to the last, cmd is the last argument of ssh command.
# shellcheck disable=SC2124
host="${@: -2: 1}"
cmd="${@: -1: 1}"

# ControlMaster=auto & ControlPath=... speedup Ansible execution 2 times.
socket="/tmp/ansible-ssh-${host}-22-iap"

exec gcloud compute ssh "$host" \
  --tunnel-through-iap \
  --quiet\
  --command "$cmd" \
  -- \
  -C \
  -o ControlMaster=auto \
  -o ControlPersist=20 \
  -o PreferredAuthentications=publickey \
  -o KbdInteractiveAuthentication=no \
  -o PasswordAuthentication=no \
  -o ConnectTimeout=20 \
  -o ControlPath="$socket"
