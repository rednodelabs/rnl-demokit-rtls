import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="rnl-gateway-serial-app",
    version="1.0.0",
    author="RedNodeLabs",
    author_email="javier@rednodelabs.com",
    description="RedNodeLabs DemoKit RTLS - Gateway Serial Application",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/rednodelabs/rnl-demokit-rtls",
    packages=setuptools.find_packages(),
    package_data={
        'rnl_gateway_serial_app': [
            'pytransform/platforms/darwin/x86_64/_pytransform.dylib',
            'pytransform/platforms/linux/x86_64/_pytransform.so',
            'pytransform/platforms/windows/x86_64/_pytransform.dll'
        ]
    },
    entry_points={
        'console_scripts':['rnl-gateway-serial-app=rnl_gateway_serial_app.rnl_gateway_serial_app:main'],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: End-User License Agreement between you and RedNodeLabs UG.",
        "Operating System :: OS Independent",
    ],
    python_requires='==3.8.6',
    install_requires=[
        'certifi==2020.6.20',
        'chardet==3.0.4',
        'cstruct==1.8',
        'Dijkstar==2.5.0',
        'idna==2.10',
        'joblib==0.17.0',
        'numpy==1.19.2',
        'pyarmor==6.4.3',
        'pyserial==3.4',
        'python-engineio==3.13.2',
        'python-socketio==4.6.0',
        'requests==2.24.0',
        'scikit-learn==0.23.2',
        'scipy==1.5.3',
        'six==1.15.0',
        'threadpoolctl==2.1.0',
        'urllib3==1.25.10',
        'websocket-client==0.57.0'
    ]
)
