# SiS-PM WebServer
This WebServer application provides a useful way to manage an USB controlled power strips, produced by GEMBIRD LTD, by HTTP API.
Is a little component that you can easily integrate wherever you want. In example, with an Angular or Android application.
In summary, you can:
* **get/set** the status for single socket;
* **get/set** the schedule;
* **get** information about the device.

All functionalities are documented in detail by Swagger page, accessible by `<hostname/ip><port>/api/docs`.
Finally, the application is built with [NestJS](https://nestjs.com/), *"a progressive Node.js framework for building efficient, 
reliable and scalable server-side applications. "*

## Installation
After cloning this repository, you can install the application with **Docker** or **not**; I suggest you to use Docker. :wink:

### Docker
#### Find the device
Docker is an easy way to install this application. First of all, you need to know where the device is connected. 
Unfortunately, with this README I can help you only for Linux OS. For Windows, you could follow this guide:
[Devices in containers on Windows](https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/hardware-devices-in-containers). 
Good luck! :grinning:

By the way, on Linux OS you can know the location of device connected, via USB, by executing this command:
```bash
$ lsusb
```
In my case, the result is:
```
...
Bus 001 Device 011: ID 04b4:fd13 Cypress Semiconductor Corp. Energenie EG-PMS
...
```
Take note for `bus` and `device` values. I suggest you to consider only the `bus` value, in case the `device` value could change 
for some reason; `sispmctl` application is able to identify the device.

Now, you must configure `docker-compose.yml` by setting the `devices` section as below:
```yaml
- /dev/bus/usb/<number identified>
```

#### Define a port number (optional)
Finally, you could change the port another, by uncomment the `args` and `PORT` rows, specifying the port desired 
and setting the `ports` section. As default, the port will be `3000`.

#### Build and run
Now, all is ready to launch :rocket:. In same directory you must execute this command:
```bash
$ docker compose up -d
```
Enjoy!

### Without Docker
This installation is only possible for Linux OS. If you use Windows, consider the good idea to change OS for Linux. :kissing:

#### Install dependencies
First of all, you must install **Node.js** at version >= 16, ensure if is installed by executing:
```bash
$ node -v
```
Is also important to install and configure `sispmctl`. You can follow this guide: [SiS-PM Control for Linux](https://sispmctl.sourceforge.net/#mozTocId434726).
#### Define a port number (optional)
After this big step you could set a specific port for application. To do this, you must create an `.env` file at the root for cloned repository and
set:
```
PORT=4000
```
De default port is `3000`, even without `.env` file.

#### Build and run
Now, all is ready to launch :rocket:. In same directory you must execute these commands:
```bash
$ npm install
$ npm run start:prod
```