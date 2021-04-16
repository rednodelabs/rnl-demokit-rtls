![logo](./rnl-web-app/webpage/img/logo.png)

# RedNodeLabs RTLS Demo Kit  

## Kit Content

RedNodeLabs RTLS Demo Kit includes the following:

* 7x Decawave MDEK1001 Development Boards
* 1x Nordic nRF52840 USB Dongle

> The number of boards may be different depending on the particular configuration (number of anchors and tags) of your kit


## Kit Description

Our RTLS Demo Kit provides a system showcasing the possibilities of our reliable and low-latency 2.4 GHz wireless mesh network
working in combination with our accurate Real-Time Localization System (RTLS) application based on UWB.

Six nodes are configured as fixed anchors and one node acts as mobile tag. The USB dongle is used as a gateway for data collection and visualization in a PC.

All the nodes are power-optimized and able to run with small batteries, making the system a great fit for plug & play applications in sport, industry or
consumer markets; particularly in the harshest environments and when no complex infrastructure deployment is desired.


# Getting Started

## Prerequisites

The PC application is compatible with Windows, Linux and macOS. The following software is required:

* Python 3.9.2, with pip
* Node.js 12.19.0 or later, with npm
* Git


## rnl-web-app

This is the Node.js-based web application to run the RedNodeLabs web server as part of the RTLS Demo Kit.

### Install

In order to install this Node.js application, go to the current folder and run:
```
cd rnl-web-app
npm install
```

### Run

To run it, execute the following command:
```
node app.js
```

To check whether the web server is working, open a web browser and access the following address:

http://localhost:3000/

### Logging

In case you want to activate the logging, follow the next steps.
A logging file will be then created in the current directory every time
you start the application.

For simplified logging mode, please use:
```
node app.js -s
```

You will find two different JSON message formats.
The ranging type, containing the raw distances between nodes, e.g.:
```
{"type":"ranging","distances":[[1,2,100],[3,2,70]]}
```
where each element of the array refers the initiator node id in the first position,
the responder node in the second position, and finally the measured distance between them.

The coordinates type, containing the processed coordinates, e.g.:
```
{"type":"coordinates","active_anchors":3,"active_tags":0,"filter_strength":32,"active_anchors_coordinates":[[1,[0,0]],[2,[13.33396331373197,-6.00512497129295e-15]],[3,[-13.32942735622308,0.3477700492019254]]]}
```

For extended logging mode, please use:
```
node app.js -l
```


## rnl-host-app

This is the Python-based host application to run the RedNodeLabs gateway as part of the RTLS Demo Kit.

### Install

> Check that you are using Python@3.9.2 with python -V

In order to install this Python application, we recommend using a virtual environment:
```
cd rnl_gateway_serial_app
python -m venv venv
```

Then, to activate it, on Unix or MacOS, run:
```
source venv/bin/activate
```

On Windows, run:
```
venv\Scripts\activate.bat
```

In order to run it as a Python script, just run it as:
```
pip install -r requirements.txt
```

### Run

Before running it, be sure that the rnl-web-app is running in another terminal the RNL USB dongle is plugged.

In case you want to run it as a Python script:
```
python rnl_gateway_serial_app.py
```

If you installed the application as a Python module:
```
rnl-gateway-serial-app
```


# User Guide

The UI has three tabs:

* In the Bus tab, statistics about the operation of the mesh bus are displayed.
* In the Ranging tab, statistics about the operation of the ranging bus are displayed.
* In the Map tab, a 2D representation of the anchors and tags is shown. Map can be freely mirrored in both axis and rotated to better resemble the actual position of the nodes. Real-time coordinates are shown in the table below.


## Anchor placement

Results are better if all the anchors are in range of each other. The anchors should not be moved after the current execution of the demo has been started. If their positions change, stop and start
the demo again to recalculate their positions.

In 3D positioning mode, the first three anchors (e.g. anchors 1, 2 and 3) define the surface with z=0, so they should be placed at the same height. For accurate results, the remaining anchors (e.g. anchors 4, 5, etc.) should be placed at variable heights to have as much z variability as possible in their coordinates.

Instead of running the self-calibration procedure, it is possible to manually fix the anchor coordinates by setting `precomputed_positions = 1` in `rnl_ranging_config.py`.

## Troubleshooting

If the host app initialization fails, check the following:
* Make sure that the web app is previously running in another terminal and that the RNL USB dongle is correctly plugged in.
* Make sure that the Python version is exactly as indicated.
* If the Web UI is not properly showing the data, unplug and plug the USB dongle and restart the host app (CTRL + C to stop it).

If the nodes show an erratic behavior, e.g. too many packet errors or distances are missing, check their battery levels.
