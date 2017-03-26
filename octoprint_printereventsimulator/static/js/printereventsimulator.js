/*
 * View model for OctoPrint-PrinterEventSimulator
 *
 * Author: Stephen Harrison
 * License: AGPLv3
 */
$(function() {
    function PrintereventsimulatorViewModel(parameters) {
        var self = this;

        // assign the injected parameters, e.g.:
        self.pluginId = "printereventsimulator"
        self.loginStateViewModel = parameters[0];
        self.settingsViewModel = parameters[1];
        self.printer = parameters[1];

        self.onBeforeBinding = function () {
            self.settings = self.settingsViewModel.settings.plugins.printereventsimulator;
			console.log("Printer events Settings: " + self.settings );
        };

        // TODO: Implement your plugin's view model here.

        // Printing
        self.printStarted = function() {
            console.log("Fake PrintStarted");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintStarted", {}, {});
        };

        self.printFailed = function() {
            console.log("Fake PrintFailed");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintFailed", {}, {});
        };

        self.printDone = function() {
            console.log("Fake PrintDone");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintDone", {}, {});
        };

        self.printCancelled = function() {
            console.log("Fake PrintCancelled");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintCancelled", {}, {});
        };

        self.printPaused = function() {
            console.log("Fake PrintPaused");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintPaused", {}, {});
        };

        self.printResumed = function() {
            console.log("Fake PrintResumed");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintResumed", {}, {});
        };


        // Printer Communication
        self.connecting = function() {
            console.log("Fake Connecting");
            OctoPrint.simpleApiCommand(self.pluginId, "Connecting", {}, {});
        };

        self.connected = function() {
            console.log("Fake Connected");
            OctoPrint.simpleApiCommand(self.pluginId, "Connected", {port : "VIRTUAL", baudrate: 1200}, {});
        };

        self.disconnecting = function() {
            console.log("Fake Disconnecting");
            OctoPrint.simpleApiCommand(self.pluginId, "Disconnecting", {}, {});
        };

        self.disconnected = function() {
            console.log("Fake Disconnected");
            OctoPrint.simpleApiCommand(self.pluginId, "Disconnected", {}, {});
        };

        self.error = function() {
            console.log("Fake Error");
            OctoPrint.simpleApiCommand(self.pluginId, "Error", {error: "Error Message..."}, {});
        };

        self.printerStateChanged = function() {
            console.log("Fake PrinterStateChanged");
            OctoPrint.simpleApiCommand(self.pluginId, "PrinterStateChanged", {state_id: 1, state_string: "1"}, {});
        };

    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        PrintereventsimulatorViewModel,

        // e.g. loginStateViewModel, settingsViewModel, ...
        [ "loginStateViewModel", "settingsViewModel", "printerStateViewModel" ],

        // e.g. #settings_plugin_printereventsimulator, #tab_plugin_printereventsimulator, ...
        ["#settings_plugin_printereventsimulator", "#navbar_plugin_printereventsimulator", "#tab_plugin_printereventsimulator"]
    ]);
});
