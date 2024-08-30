# Molecule Test Environment
## Requirements
You'll need to have `docker` and `python` with `pip` intalled. You can then install poetry with the following command:
```bash
pip install poetry
```

## Usage
### Install dependencies
To install the dependencies, run the following command:
```bash
poetry install
```
This will install the dependencies in a virtual environment located in the `.venv` directory.
### Open the virtual environment
There are several ways to open a virtual environment. Here is the way you can do it with poetry:
```bash
poetry shell 
```
### Install ansible collections
Our playbooks use the `community.docker` collection. Check your python version in [.venv/lib](./.venv/lib) and adapt the following command accordingly before running it:
```bash
ansible-galaxy collection install community.docker -p .venv/lib/python3.10/site-packages/ansible_collections
```
### Hetzner Cloud API Token
To run the tests, you'll need to have a Hetzner Cloud API token. Once you have the token, you can set it as an environment variable:
```bash
export HCLOUD_TOKEN=<YOUR_API_TOKEN> # on macOS and Linux
```
### Run tests
To run tests, cd into `./roles/<role-to-test>` and run:
```bash
molecule test
molcule test -s <scenario-name>
```
### Extra Information
- The roles `update-changes`, `configure-updates` and `configure-firewall` use the `docker` driver. This means that the tests will run in a docker container on your machine. Therefore, you'll need to have docker installed and running.

- All other roles use the `hcloud` driver. This means that the tests will run on a Hetzner Cloud server. You'll need to have a Hetzner Cloud API token to run these tests. Also make sure you have the `HCLOUD_TOKEN` environment variable set.

- If you run on windows, you can use an Ubuntu VM where you can install an empty stereum node to have python and docker installed. You can of course also install them yourself, or get this thing running on windows :^)
