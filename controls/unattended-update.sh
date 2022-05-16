#!/bin/bash

if ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-stereum"; then
  ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-services"
fi

# EOF