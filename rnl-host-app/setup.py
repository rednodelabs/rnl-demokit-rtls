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
    python_requires='>=3.7',
    install_requires=[
        'pyserial>=3.4',
        'cstruct>=1.8',
        'sklearn',
        'python-socketio[client]>=4.3.1',
        'dijkstar>=2.5.0',
        'numpy>=1.16.4',
        'scipy>=1.3.0',
        'pyarmor>=6.4.3'
    ]
)
