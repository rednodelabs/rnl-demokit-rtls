import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="rnl-gateway-serial-app",
    version="2.1.0",
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
    python_requires='==3.9.2',
    install_requires=[
		'wheel==0.36.2',
		'bidict==0.21.2',
		'certifi==2020.12.5',
		'chardet==4.0.0',
		'Dijkstar==2.5.0',
		'idna==2.10',
		'joblib==1.0.1',
		'numpy==1.20.1',
		'pyarmor==6.6.2',
		'pyserial==3.5',
		'python-engineio==3.14.2',
		'python-socketio==5.0.0',
		'requests==2.25.1',
		'scikit-learn @ git+git://github.com/rednodelabs/scikit-learn@ddbc560603a6633b97fefeb2f2adfcfdf6bb0417',
		'scipy==1.6.1',
		'six==1.15.0',
		'threadpoolctl==2.1.0',
		'urllib3==1.26.3'
    ]
)
