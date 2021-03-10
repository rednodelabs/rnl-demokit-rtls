# RedNodeLabs RTLS Demo Kit  

## Kit Content

RedNodeLabs RTLS Demo Kit includes the following:

* 7x Decawave MDEK1001 Development Boards
* 1x Nordic nRF52840 USB Dongle

## Kit Description

Our RTLS Demo Kit provides a system with up to eight nodes showcasing the possibilities of our reliable and low-latency 2.4 GHz wireless mesh network
working in combination with our accurate Real-Time Localization System (RTLS) application based on UWB.

Six nodes are configured as fixed anchors and one node act as mobile tag. The USB dongle is used as a gateway for data collection and visualization in a PC.

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

In case you want to activate the logging, run the application with the following command:
```
node app.js --log
```

A logging file will be created in the current directory.


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

Otherwise, if you prefer to install the application as a Python module, use the following commands:
```
pip install wheel
pip install "git+https://github.com/rednodelabs/rnl-demokit-rtls#egg=rnl-gateway-serial-app&subdirectory=rnl-host-app"
```

### Run

Before running it, be sure that the rnl-web-app is running in another terminal the RNL USB dongle is plugged to the computer.
For example, in Windows, run the device manager and check the port assigned to the dongle, e.g. COM4.

In case you want to run it as a Python script:
```
python rnl_gateway_serial_app.py
```

If you installed the application as a Python module:
```
rnl-gateway-serial-app
```

### Logging

In case you want to set up another logging configuration, indicate your file configuration with the option `--log-config`.


# User Guide

The Start button in the top-right corner of the page indicates the status of the demo.

* If the web app is running, but the host app is stopped, the Start button is red.
* If both the web app and the host app are running, the Start button is green.

Before clicking on the button to start the demo, the amount of averaging for calculating the tag position can be adjusted (from 2 to 16 samples) and a 2D or 3D fit can be selected.

The UI has three tabs:

* In the Data Bus tab, statistics about the operation of the mesh bus are displayed.
* In the Ranging tab, statistics about the operation of the UWB ranging are displayed.
* In the Map tab, a 2D representation of the anchors and tag is shown. Map can be freely mirrored in both axis to better resemble the actual position of the nodes. Real-time coordinates are shown in the table below.


## Anchor placement

For an optimal location of the infrastructure and the tags, the following indications should be followed:

* For a 2D fit, at least three anchors should be used, e.g. anchors 3, 4 and 5. The anchors must be placed forming a triangle. Do not place them in the same line. For an optimal result, place them at the same height.
* For a 3D fit, at least four anchors should be used, e.g. anchors 3, 4, 5 and 6. The first three anchors must be placed forming a triangle and ideally at the same height. The fourth anchor must be place in a different plane (e.g. at a higher height).

Results are better if all the anchors are in range of each other. The anchors should not be moved after the current execution of the demo has been started. If their positions change, stop and start
the demo again to recalculate their positions.


## Troubleshooting

If the host app initialization fails, check the following:
* Make sure that the web app is previously running in another terminal and that the RNL USB dongle is correctly plugged in.
* Make sure that the Python version is exactly as indicated.
* If the Web UI is not properly showing the data, unplug and plug the USB dongle and restart the host app (CTRL + C to stop it).

If the nodes show an erratic behavior, e.g. too many packet errors or distances are missing, check their battery levels.
