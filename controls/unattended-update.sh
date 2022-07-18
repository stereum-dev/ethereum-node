#!/bin/bash

ansible-playbook -v genericPlaybook.yaml --extra-vars "stereum_role=update-os"

# EOF