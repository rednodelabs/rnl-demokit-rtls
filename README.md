# RedNodeLabs RTLS Demo Kit  

## Kit Content 

RedNodeLabs RTLS Demo Kit includes the following: 

* 8x Decawave MDEK1001 Development Boards 
* 8x CR123A Rechargeable Batteries 
* 1x Battery Charger 
* 1x Nordic nRF52840 USB Dongle 


## Kit Description 

Our RTLS Demo Kit provides a system with up to eight nodes showcasing the possibilities of our reliable and low-latency 2.4 GHz wireless mesh network 
working in combination with our accurate Real-Time Localization System (RTLS) application based on UWB. 

Six nodes are configured as fixed anchors and two nodes act as mobile tags. The USB dongle is used as a gateway for data collection and visualization in a PC. 

All the nodes are power-optimized and able to run with small batteries, making the system a great fit for plug & play applications in sport, industry or 
consumer markets; particularly in the harshest environments and when no complex infrastructure deployment is desired. 


## Prerequisites 

The PC application is compatible with Windows, Linux and macOS. The following software is required: 

* Python 3.9, with pip 
* Node.js 12.19.0 or later, with npm 
* Git 


## Getting Started Guide 

Use Git to clone the software package: 
```
git clone https://github.com/rednodelabs/rnl-demokit-rtls.git
``` 

Open a command line window and install the dependencies of the Node.js web app: 
```
cd rnl-web-app
npm install
```  

Run the Node.js web server: 
```
node app.js 
```

Open a second command line window and install the dependencies of the Python host app:  
```
cd rnl-host-app
pip install –r requirements.txt
```   

While the web server is running and the USB dongle is plugged, execute the Python app (replacing
SERIAL_PORT with the name of the port assigned to the dongle in your system): 
```
python rnl_run.py SERIAL_PORT
```

Open a web browser and access the Demo UI:

http://localhost:3000/

For more detailed installation instructions check the individual README files in the rnl-web-app and rnl-host-app folders.


## User Guide 

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
* Make sure that the web app is previously running in another terminal and that the specified SERIAL_PORT is correct.
* Make sure that the Python version is 3.9.
* If the Web UI is not properly showing the data, unplug and plug the USB dongle and restart the host app (CTRL + C to stop it).

If the nodes show an erratic behavior, e.g. too many packet errors or distances are missing, check their battery level.