# Wifirst Connect

This tool will automatically check (every hour) if your wifirst connection is down or not and will **authenticate** automatically for you.

## How to use it ?

### Command Line Interface (CLI)

```sh
$ npm start
```

### Systemd service

```sh
# Will copy install wifirst-connect in your system
$ ./install.sh

# Only if you want wifirst-connect to stay even after a reboot, you can enable the service
$ systemctl enable wifirst-connect

# Start the service (will check every hour for the connection)
$ systemctl start
```

*May the force be with you*
