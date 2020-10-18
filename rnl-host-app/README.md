# rnl-host-app

This is the Python-based host application to run the RedNodeLabs gateway as part of the RTLS Demo Kit.

## Install

> Check that you are using Python@3.8.6 with python -V

In order to install this Python application, we recommend using a virtual environment:
```
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

If you prefer to install the application as a Python module, use the following command:
```
pip install "git+https://github.com/rednodelabs/rnl-demokit-rtls/tree/feature/add-gateway-serial-app/rnl-host-app#egg=rnl-gateway-serial-app&subdirectory=rnl-host-app"
```

Otherwise, to run it as a Python script, just clone this repository in your workspace:
```
git clone https://github.com/rednodelabs/rnl-demokit-rtls.git
cd rnl-demokit-rtls/rnl-host-app/rnl_gateway_serial_app
pip install -r requirements.txt
```

## Run

Before running it, be sure that the rnl-web-app is running in another terminal. Also, plug the USB dongle and check the assigned SERIAL_PORT.
For example, in Windows, run the device manager and check the port assigned to the dongle, e.g. COM4.

If you installed the application as a Python module (replace SERIAL_PORT with the name assgined to the dongle in your system):
```
rnl-gateway-serial-app SERIAL_PORT
```

Or in case you want to run it as a Python script:
```
python rnl_gateway_serial_app.py SERIAL_PORT
```

## Logging

In case you want to set up another logging configuration, indicate your file configuration with the option `--log-config`.
