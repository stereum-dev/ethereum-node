#!/bin/bash

START_TIME=$(date '+%s')

if ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-stereum"; then
  ansible-playbook -v finishUpdate.yaml
  ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-services"
  END_TIME=$(date '+%s')
  ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=restart-services restart_time_scope=$((END_TIME - START_TIME + 5))"
fi

# EOF