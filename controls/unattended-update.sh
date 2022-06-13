#!/bin/bash

if ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-stereum"; then
  ansible-playbook -v finishUpdate.yaml
  ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-services"
fi

# EOF