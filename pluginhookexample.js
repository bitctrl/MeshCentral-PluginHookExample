'use strict';
/**********************************************************************
 * Copyright (C) 2025 BitCtrl Systems GmbH
 * 
 * pluginhookexample.js
 * 
 * @author  Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>
 * @author  Daniel Hammerschmidt <daniel@redneck-engineering.com>
 * @version 0.0.1
 *********************************************************************/

const { getPluginShortName, getPluginConfig, requirePluginHooks } = require('../pluginhookscheduler');

const PLUGIN_SHORT_NAME = getPluginShortName(__dirname);
const pluginConfig = getPluginConfig(PLUGIN_SHORT_NAME, () => ({}));

requirePluginHooks(
  'hook_beforeCreateMeshAgent',
  'hook_afterCreateMeshAgent',
  'hook_beforeCreateMeshRelay',
  'hook_afterCreateMeshRelay',
  'hook_beforeCreateLocalRelay',
  'hook_afterCreateLocalRelay',
  'hook_beforeCreateMeshUser',
  'hook_afterCreateMeshUser',
  'hook_beforeNotifyUserOfDeviceStateChange',
  'hook_afterNotifyUserOfDeviceStateChange',
);

let meshserver, webserver;

module.exports = {
  [PLUGIN_SHORT_NAME]: function (pluginHandler) {
    meshserver = pluginHandler.parent;
    return {}; void {
      server_startup: function () {
        webserver = meshserver.webserver;
      },
      hook_beforeCreateMeshAgent(parent, db, ws, req, args, domain) {
        console.log(new Date().toISOString(), 'hook_beforeCreateMeshAgent', req.url, req.socket.remotePort);
      },
      hook_afterCreateMeshAgent(meshagent, parent, db, ws, req, args, domain) {
        ws.on('close', pluginHandler.callHook.bind(pluginHandler, 'hook_agentDisconnected', meshagent));
        return console.log(new Date().toISOString(), 'hook_afterCreateMeshAgent', encodeURIComponent(meshagent.nonce).slice(0, 24)), meshagent;
      },
      hook_agentCoreIsStable(meshagent) {
        console.log(new Date().toISOString(), 'hook_agentCoreIsStable', meshagent.agentName ?? meshagent.name ?? meshagent.nodeid );
      },
      hook_agentDisconnected(meshagent) {
        console.log(new Date().toISOString(), 'hook_agentDisconnected', meshagent.agentName ?? meshagent.name ?? meshagent.nodeid );
      },
      hook_beforeCreateMeshRelay(parent, ws, req, domain, user, cookie) {
        console.log(new Date().toISOString(), 'hook_beforeCreateMeshRelay', req.url);
      },
      hook_afterCreateMeshRelay(meshrelay, parent, ws, req, domain, user, cookie) {
        return console.log(new Date().toISOString(), 'hook_afterCreateMeshRelay'), meshrelay;
      },
      hook_beforeCreateLocalRelay(parent, ws, req, domain, user, cookie) {
        console.log(new Date().toISOString(), 'hook_beforeCreateLocalRelay', req.url);
      },
      hook_afterCreateLocalRelay(localrelay, parent, ws, req, domain, user, cookie) {
        return console.log(new Date().toISOString(), 'hook_afterCreateLocalRelay'), localrelay;
      },
      hook_beforeCreateMeshUser(parent, db, ws, req, args, domain, user) {
        console.log(new Date().toISOString(), 'hook_beforeCreateMeshUser', req.url);
      },
      hook_afterCreateMeshUser(meshuser, parent, db, ws, req, args, domain, user) {
        return console.log(new Date().toISOString(), 'hook_afterCreateMeshUser'), meshuser;
      },
      hook_beforeNotifyUserOfDeviceStateChange(__, nodeid, connectTime, connectType, powerState, serverid, stateSet, extraInfo) {
        console.log(new Date().toISOString(), 'hook_beforeNotifyUserOfDeviceStateChange', stateSet);
      },
      hook_afterNotifyUserOfDeviceStateChange(__, meshid, nodeid, connectTime, connectType, powerState, serverid, stateSet, extraInfo) {
        return console.log(new Date().toISOString(), 'hook_beforeNotifyUserOfDeviceStateChange'), stateSet;
      },
    };
  },
};
