# MeshCentral-PluginHookExample

A plugin for [MeshCentral](https://github.com/Ylianst/MeshCentral) to demonstrate and test the plugin [MeshCentral-PluginHookScheduler](https://github.com/bitctrl/MeshCentral-PluginHookScheduler).

## Installation

See [Plugins - Installation & Usage](https://github.com/Ylianst/MeshCentral/blob/master/docs/docs/meshcentral/plugins.md)

To install, simply add the plugin configuration URL when prompted:
```
https://raw.githubusercontent.com/bitctrl/MeshCentral-PluginHookExample/main/config.json
```

## Configuration

### `meshcentral-data/config.json`
```json
{
  "$schema": "https://raw.githubusercontent.com/Ylianst/MeshCentral/master/meshcentral-config-schema.json",
  "settings": {
    "plugins": {
      "enabled": true,
      "pluginSettings": {
        "pluginhookscheduler": {
          "backendhooks": [
            ["server_startup", []],
            ["hook_setupHttpHandlers", []],
            ["hook_userLoggedIn", []],
            ["hook_processAgentData", []],
            ["hook_agentCoreIsStable", []],
            ["hook_beforeCreateMeshAgent", []],
            ["hook_afterCreateMeshAgent", []],
            ["hook_beforeCreateMeshRelay", []],
            ["hook_afterCreateMeshRelay", []],
            ["hook_beforeCreateLocalRelay", []],
            ["hook_afterCreateLocalRelay", []],
            ["hook_beforeCreateMeshUser", []],
            ["hook_afterCreateMeshUser", []],
            ["hook_beforeNotifyUserOfDeviceStateChange", []],
            ["hook_afterNotifyUserOfDeviceStateChange", []],
            ["*", []]
          ],
          "webuihooks": [
            ["#", ["NOT IMPLEMENTED YET"]]
          ]
        }
      }
    }
  }
}
```