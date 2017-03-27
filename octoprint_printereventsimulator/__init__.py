# coding=utf-8
from __future__ import absolute_import

import logging
import logging.handlers

from octoprint.events import eventManager, Events

import flask

import octoprint.plugin

class PrintereventsimulatorPlugin(octoprint.plugin.SettingsPlugin,
                                  octoprint.plugin.AssetPlugin,
                                  octoprint.plugin.TemplatePlugin,
								  octoprint.plugin.SimpleApiPlugin,
								  octoprint.plugin.EventHandlerPlugin):
	def initialize(self):
		self._logger.setLevel(logging.DEBUG)
		self._logger.info("Printer Event Simulator [%s] initialized..." % self._identifier)

	##~~ SettingsPlugin mixin

	def get_settings_defaults(self):
		return dict(
			# put your plugin's default settings here
		)

	def get_template_configs(self):
		return [
			#dict(type="navbar", custom_bindings=False),
			#dict(type="settings", custom_bindings=False),
			dict(type="tab", name="Printer Events")
		]

	##~~ AssetPlugin mixin

	def get_assets(self):
		# Define your plugin's asset files to automatically include in the
		# core UI here.
		return dict(
			js=["js/printereventsimulator.js"],
			css=["css/printereventsimulator.css"],
			less=["less/printereventsimulator.less"]
		)

	##~~ Softwareupdate hook

	def get_update_information(self):
		# Define the configuration for your plugin to use with the Software Update
		# Plugin here. See https://github.com/foosel/OctoPrint/wiki/Plugin:-Software-Update
		# for details.
		return dict(
			printereventsimulator=dict(
				displayName="Printer Event Simulator Plugin",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="Tinamous",
				repo="OctoPrint-PrinterEventSimulator",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/Tinamous/OctoPrint-PrinterEventSimulator/archive/{target_version}.zip"
			)
		)


	# API POST command options
	def get_api_commands(self):
		return dict(
			PrintStarted = [],
			PrintFailed = [],
			PrintDone = [],
			PrintCancelled = [],
			PrintPaused = [],
			PrintResumed = [],
			Connecting = [],
			Connected = ["port", "baudrate"],
			Disconnecting = [],
			Disconnected = [],
			Error = ["error"],
			PrinterStateChanged = ["state_id", "state_string"],
		)

	# API POST command
	# POST: http://localhost:5000/api/plugin/printereventsimulator
	# X-Api-Key: <key>
	# {
	#	"command": "setFan0",
	#	"percentage": "100"
	# }
	def on_api_command(self, command, data):
		self._logger.info("On Api Data: {}".format(data))

		# Printer Events
		if command == "PrintStarted":
			self._logger.info("PrintStarted requested.....")
			eventManager().fire(Events.PRINT_STARTED, data)
		elif command == "PrintFailed":
			self._logger.info("PrintFailed requested ")
			eventManager().fire(Events.PRINT_FAILED, data)
		elif command == "PrintDone":
			self._logger.info("PrintDone requested")
			eventManager().fire(Events.PRINT_DONE, data)
		elif command == "PrintCancelled":
			self._logger.info("PrintCancelled requested")
			eventManager().fire(Events.PRINT_CANCELLED, data)
		elif command == "PrintPaused":
			self._logger.info("PrintPaused requested")
			eventManager().fire(Events.PRINT_PAUSED, data)
		elif command == "PrintResumed":
			self._logger.info("PrintResumed requested")
			eventManager().fire(Events.PRINT_RESUMED, data)

		# Communication Events
		elif command == "Connecting":
			self._logger.info("Connecting requested")
			eventManager().fire(Events.CONNECTING)
		elif command == "Connected":
			self._logger.info("Connected requested.")
			# payload = dict(port="VIRTUAL", baudrate="9600")
			# push the payload through
			eventManager().fire(Events.CONNECTED, data)
		elif command == "Disconnecting":
			self._logger.info("Disconnecting requested")
			eventManager().fire(Events.DISCONNECTING)
		elif command == "Disconnected":
			self._logger.info("Disconnected requested")
			eventManager().fire(Events.DISCONNECTED)
		elif command == "Error":
			self._logger.info("Error requested", data)
			eventManager().fire(Events.ERROR) # Needs info
		elif command == "PrinterStateChanged":
			self._logger.info("PrinterStateChanged requested")
			eventManager().fire(Events.PRINTER_STATE_CHANGED, data)


	# EventHandler Plugin
	def on_event(self, event, payload):
		self._logger.info("Event! {}".format(event))

		# Publish the event for the javascript to pick up.
		# TODO: allow settings to disable this
		pluginData = dict(
			eventEvent = event,
			eventPayload=payload)
		self._plugin_manager.send_plugin_message(self._identifier, pluginData)

	# Create a fake printer object
	# This is how the virtual printer works.
	def serial_factory(self, comm_instance, port, baudrate, read_timeout):
		self._logger.warn("serial_factory!")
		# Need to add VIRTUAL2 into the additional ports settings.
		# additionalPorts = settings().get(["serial", "additionalPorts"])
		#settings().set("serial/additionalPorts", "/VIRTUAL2")
		if not port == "VIRTUAL2":
			return None

		#serial_obj = virtual.VirtualPrinter(seriallog_handler=seriallog_handler, read_timeout=float(read_timeout))
		return None

	def fake_printer_factory(self, components, *args, **kwargs):
		# Printer is initialized through plugin so logger is not available now
		#self._logger.warn("fake_printer_factory!")
		# TODO: Return a printer?
		return None

	# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "Printer Event Simulator Plugin"

def __plugin_load__():
	plugin = PrintereventsimulatorPlugin()

	global __plugin_implementation__
	__plugin_implementation__ = PrintereventsimulatorPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
		"octoprint.comm.transport.serial.factory": plugin.serial_factory,
		"octoprint.printer.factory": plugin.fake_printer_factory,
	}

