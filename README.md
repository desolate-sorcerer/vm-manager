# VM Manager

## A simple virtual machine management system that helps you monitor and manage your virtual machines.
What is this?

1. VM Manager is a web application that:

2. Connects to your virtual machine hosts

3. Displays all your VMs in one place

4. Shows VM status (running, stopped, etc.)

5. Tracks resources like RAM and CPU

6. Stores VM information in a database

## Preview
![screenshot](images/screenshot_ui.png)


## Prerequisites

1. Python 3.7+

2. PostgreSQL database

3. Libvirt (for VM connections)

## Installation

Clone the repository
```
git clone https://github.com/desolate-sorcerer/vm-manager.git

cd vm-manager

# bash script to install needed dependecis and packages
./install
```

1. Setup Database

2. Create a PostgreSQL database

3. Update the connection string in database.py:

```
'postgresql+psycopg2://username:password@localhost/your-db-name'
```
## Run the application
```
# bash script to start
 ./start
```
## How it works

1. Add your VM hosts in the network configuration

2. Scan for VMs - the system connects to your hosts and discovers all virtual machines

3. View all VMs in a simple dashboard

4. See VM details like name, status, resources, and which host they're on

## Features

📊 VM Overview: See all your virtual machines at a glance

🔄 Status Monitoring: Track if VMs are running, stopped, or paused

💾 Resource Tracking: Monitor RAM and CPU allocation

🌐 Multi-host Support: Manage VMs across different hosts

💾 Database Storage: All VM data is saved for quick access
