# rnl-host-app

This is the python-based host application to run the RedNodeLabs Serial Gateway as part of the RTLS DemoKit.

This repository defines the software package that has the functionality of serving as bridge between the wireless network and the backend application.

## Install

In order to install this python application, we always recommend to make use of virtual environment and work inside it.
```
python3 -m venv venv
source venv/bin/activate
```

If you prefer to install the application in your environment, do it following the next instruction:
```
pip install "git+https://github.com/rednodelabs/rnl-demokit-rtls#egg=rnl-gateway-serial-app&subdirectory=rnl-host-app"
```

Otherwise, if you prefer to run it as a python script, just clone this repository in your workspace:
```
git clone https://github.com/rednodelabs/rnl-demokit-rtls.git
cd rnl-demokit-rtls/rnl-host-app/rnl_gateway_serial_app
pip install -r requirements.txt
```

## Run

Depending on the previous step, you should be able to run the application once installed as following:
```
rnl-gateway-serial-app /dev/tty.usbmodem0000000000001
```

Or in case you cloned the repository locally and you prefer to run it from there:
```
python3 rnl-gateway-serial-app.py /dev/tty.usbmodem0000000000001
```

In case you want to set up another logging configuration, please indicate your file configuration with the option `--log-config`.
