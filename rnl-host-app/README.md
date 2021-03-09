# rnl-host-app

This is the Python-based host application to run the RedNodeLabs gateway as part of the RTLS Demo Kit.

## Install

> Check that you are using Python@3.9.2 with python -V

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

In order to run it as a Python script, just run it as:
```
cd rnl_gateway_serial_app
pip install -r requirements.txt
```

Otherwise, if you prefer to install the application as a Python module, use the following commands:
```
pip install wheel
pip install "git+https://github.com/rednodelabs/rnl-demokit-rtls#egg=rnl-gateway-serial-app&subdirectory=rnl-host-app"
```

## Run

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

## Logging

In case you want to set up another logging configuration, indicate your file configuration with the option `--log-config`.
