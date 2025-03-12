'use strict';
/**********************************************************************
 * Copyright (C) 2025 BitCtrl Systems GmbH
 * 
 * pluginhookexample.js
 * 
 * @author  Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>
 * @author  Daniel Hammerschmidt <daniel@redneck-engineering.com>
 * @version 0.0.2
 *********************************************************************/

const { PLUGIN_SHORT_NAME } = require('../pluginhookscheduler')({
  __dirname,
  requiredPluginHooks: [
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
  ],
});

// add hooks to configuration if not in config.json
const { pluginConfig: hookSchedulerConfig } = require('../pluginhookscheduler')({__dirname: __dirname + '../pluginhookscheduler'});
[
  'hook_beforeCreateExample', 'hook_afterCreateExample',
  'hook_beforeCreateAnotherExample', 'hook_afterCreateAnotherExample',
].forEach((hookname) => {
  hookSchedulerConfig.backendhooks.hasOwnProperty(hookname) || (hookSchedulerConfig.backendhooks[hookname] = []);
});

// mimic the MeshCentral API, the same name is used in both namespaces to demonstrate aliases
const example = { namespace1: { handler: {} }, namespace2: { handler:{} } };

example.namespace1.handler.CreateExample = function CreateExample(value) {
  var obj = { answer: value };
  console.log(new Date().toISOString(), 'namespace1.handler.CreateExample', JSON.stringify([value, obj]));
  return obj;
};

example.namespace2.handler.CreateExample = function CreateExample(value) {
  var obj = { answer: value };
  console.log(new Date().toISOString(), 'namespace2.handler.CreateExample', JSON.stringify([value, obj]));
  return obj;
};

// mimic two other plugins
const module1 = { exports: {} }, PLUGIN_1_SHORT_NAME = PLUGIN_SHORT_NAME + '_1';
const module2 = { exports: {} }, PLUGIN_2_SHORT_NAME = PLUGIN_SHORT_NAME + '_2';

// this fake-plugin creates wrapper around tha API functions and hooks into both of them before and after

module1.exports[PLUGIN_1_SHORT_NAME] = function (pluginHandler) {
  const PLUGIN_SHORT_NAME = PLUGIN_1_SHORT_NAME;
  const meshserver = pluginHandler.parent;
  let webserver;
  return {
    server_startup() {
      webserver = meshserver.webserver;
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.server_startup');
      pluginHandler.wrapFunctionCall(example.namespace1.handler, 'CreateExample');
      pluginHandler.wrapFunctionCall(example.namespace2.handler, 'CreateExample', 'CreateAnotherExample');
      // call the API with a delay
      setTimeout(() => {
        const value1 = 17;
        const value2 = 23;
        console.log('###');
        const obj1 = example.namespace1.handler.CreateExample(value1);
        console.log('###');
        const obj2 = example.namespace2.handler.CreateExample(value2);
        console.log('###');
        console.log(new Date().toISOString(), 'Examples created:', JSON.stringify([value1, obj1]), JSON.stringify([value2, obj2]));
        console.log('###');
      }, 1000);
    },
    hook_beforeCreateExample(value) {
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.hook_beforeCreateExample', value);
    },
    hook_afterCreateExample(obj, value) {
      obj.answer += 12;
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.hook_afterCreateExample', JSON.stringify([value, obj]));
    },
    hook_beforeCreateAnotherExample(value) {
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.hook_beforeCreateAnotherExample', value);
    },
    hook_afterCreateAnotherExample(obj, value) {
      obj.answer += 19;
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.hook_afterCreateAnotherExample', JSON.stringify([value, obj]));
    },
  }
};

// this fake-plugin hooks into both one of the APIs mentioned above as well as the predefined APIs wrapped in pluginhookscheduler

module2.exports[PLUGIN_2_SHORT_NAME] = function (pluginHandler) {
  const PLUGIN_SHORT_NAME = PLUGIN_2_SHORT_NAME;
  const meshserver = pluginHandler.parent;
  let webserver;
  return {
    server_startup() {
      webserver = meshserver.webserver;
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.server_startup');
    },
    hook_beforeCreateExample(value) {
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.hook_beforeCreateExample', value);
    },
    hook_afterCreateExample(obj, value) {
      obj.answer += 13;
      console.log(new Date().toISOString(), PLUGIN_SHORT_NAME + '.hook_afterCreateExample', JSON.stringify([value, obj]));
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
};

// this is the export for the real plugin

module.exports = {
  [PLUGIN_SHORT_NAME]: function (pluginHandler) {
    pluginHandler.plugins[PLUGIN_1_SHORT_NAME] = module1.exports[PLUGIN_1_SHORT_NAME](pluginHandler);
    pluginHandler.plugins[PLUGIN_2_SHORT_NAME] = module2.exports[PLUGIN_2_SHORT_NAME](pluginHandler);
    return {};
  }
};
