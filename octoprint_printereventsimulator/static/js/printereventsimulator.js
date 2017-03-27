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

        self.eventHistory = ko.observableArray([]);
        self.lastEvent = ko.observable({name: "Event Simulator", payload: ""});

        self.selectedOption = ko.observable("OPERATIONAL");
        self.stateOptions = ko.observableArray(["OPEN_SERIAL",
            "DETECT_SERIAL",
            "DETECT_BAUDRATE",
            "CONNECTING",
            "OPERATIONAL",
            "PRINTING",
            "PAUSED",
            "CLOSED",
            "ERROR",
            "CLOSED_WITH_ERROR",
            "TRANFERING_FILE",
            "OFFLINE",
            "UNKNOWN",
            "NONE"]);

        self.onBeforeBinding = function () {
            self.settings = self.settingsViewModel.settings.plugins.printereventsimulator;
			console.log("Printer events Settings: " + self.settings );
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "printereventsimulator") {
                return;
            }

            console.log("Event seen: '" + data.eventEvent + "', payload: " + JSON.stringify(data.eventPayload));

            var eventDetails = {name: data.eventEvent, payload: JSON.stringify(data.eventPayload)};
            self.eventHistory.push(eventDetails);
            self.lastEvent(eventDetails);
        }

        // Printing
        self.printStarted = function() {
            console.log("Fake PrintStarted");
            // File is depricated in 1.3.0 but still used by the timelapse component
            OctoPrint.simpleApiCommand(self.pluginId, "PrintStarted", {name: "FakePrint", path:".", origin:"local", file: "/gcode/FakePrint.gcode"}, {});
        };

        self.printFailed = function() {
            console.log("Fake PrintFailed");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintFailed", {name: "FakePrint", path:".", origin:"local", file: "/gcode/FakePrint.gcode"}, {});
        };

        self.printDone = function() {
            console.log("Fake PrintDone");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintDone", {name: "FakePrint", path:".", origin:"local", time: 123456, file: "/gcode/FakePrint.gcode"}, {});
        };

        self.printCancelled = function() {
            console.log("Fake PrintCancelled");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintCancelled", {name: "FakePrint", path:".", origin:"local", file: "/gcode/FakePrint.gcode"}, {});
        };

        self.printPaused = function() {
            console.log("Fake PrintPaused");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintPaused", {name: "FakePrint", path:".", origin:"local", file: "/gcode/FakePrint.gcode"}, {});
        };

        self.printResumed = function() {
            console.log("Fake PrintResumed");
            OctoPrint.simpleApiCommand(self.pluginId, "PrintResumed", {name: "FakePrint", path:".", origin:"local", file: "/gcode/FakePrint.gcode"}, {});
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

        self.printerError = function() {
            console.log("Fake Error");
            OctoPrint.simpleApiCommand(self.pluginId, "Error", {error: "Error Message..."}, {});
        };

        self.printerStateChanged = function() {
            console.log("Fake PrinterStateChanged");
            var payload = {state_id: self.selectedOption(), state_string: self.selectedOption()};
            OctoPrint.simpleApiCommand(self.pluginId, "PrinterStateChanged", payload, {});
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
