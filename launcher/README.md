# Electron Launcher

## Build

### Ubuntu
Install [docker-ce](https://docs.docker.com/engine/install/ubuntu/).

```
# Clone this repository:
git clone https://github.com/stereum-dev/ethereum-node.git

# change directory
cd launcher

# then start the build
sudo DOCKER_BUILDKIT=1 docker build -o out .

# now install the generated package
sudo snap install out/stereum-launcher_0.0.0_amd64.snap --dangerous

# run stereum-launcher
stereum-launcher
```

## Common
```
npm install -g modernizr
npm install
```

### Build electron
```
# ensure that we have the latest libs. If we skip this step it may happen that libs are missing in the final bundle
npm install
# start electron build
npm run electron:build
```
### Test (run locally) electron
```
npm run electron:serve
```
