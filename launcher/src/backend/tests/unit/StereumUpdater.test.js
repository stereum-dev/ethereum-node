jest.mock("electron", () => ({
  app: {},
  BrowserWindow: { getAllWindows: () => [] },
  shell: { openExternal: jest.fn(() => Promise.resolve()) },
}));
jest.mock("electron-updater", () => ({ autoUpdater: { on: jest.fn(), downloadUpdate: jest.fn(), checkForUpdates: jest.fn() } }));

import { shell } from "electron";
import { autoUpdater } from "electron-updater";
import { StereumUpdater, RELEASES_URL } from "../../../StereumUpdater";

const logger = { info: jest.fn(), error: jest.fn() };
const platform = Object.getOwnPropertyDescriptor(process, "platform");
const updaterOn = (name) => {
  Object.defineProperty(process, "platform", { value: name });
  const updater = new StereumUpdater(logger, jest.fn());
  updater.updateWindow = { close: jest.fn(() => Promise.resolve()) };
  return updater;
};

afterEach(() => {
  Object.defineProperty(process, "platform", platform);
  jest.clearAllMocks();
});

test.each(["darwin", "win32"])("on %s the update opens the release page and continues into the app", async (name) => {
  const updater = updaterOn(name);
  expect(updater.getUpdateMode()).toEqual({ manual: true, url: RELEASES_URL });
  await updater.downloadUpdate();
  expect(shell.openExternal).toHaveBeenCalledWith(RELEASES_URL);
  expect(autoUpdater.downloadUpdate).not.toHaveBeenCalled();
  expect(updater.updateWindow.close).toHaveBeenCalled();
  expect(updater.createWindow).toHaveBeenCalledWith();
});

test("on Linux the update still downloads and installs itself", async () => {
  const updater = updaterOn("linux");
  expect(updater.getUpdateMode().manual).toBe(false);
  await updater.downloadUpdate();
  expect(autoUpdater.downloadUpdate).toHaveBeenCalled();
  expect(shell.openExternal).not.toHaveBeenCalled();
});
