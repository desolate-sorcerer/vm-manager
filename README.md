VM Manager

A simple virtual machine management system that helps you monitor and manage your virtual machines.
What is this?

VM Manager is a web application that:

    Connects to your virtual machine hosts

    Displays all your VMs in one place

    Shows VM status (running, stopped, etc.)

    Tracks resources like RAM and CPU

    Stores VM information in a database

Quick Start
Prerequisites

    Python 3.7+

    PostgreSQL database

    Libvirt (for VM connections)

Installation

    Clone the repository

git clone https://github.com/desolate-sorcerer/vm-manager.git
cd vm-manager
./install


Setup Database

    Create a PostgreSQL database

    Update the connection string in database.py:
    python

'postgresql+psycopg2://username:password@localhost/your-db-name'

Run the application

./start

How it works

    Add your VM hosts in the network configuration

    Scan for VMs - the system connects to your hosts and discovers all virtual machines

    View all VMs in a simple dashboard

    See VM details like name, status, resources, and which host they're on

Features

    📊 VM Overview: See all your virtual machines at a glance

    🔄 Status Monitoring: Track if VMs are running, stopped, or paused

    💾 Resource Tracking: Monitor RAM and CPU allocation

    🌐 Multi-host Support: Manage VMs across different hosts

    💾 Database Storage: All VM data is saved for quick access

Project Structure
text

vm-manager/
├── app/
│   ├── models/          # Database models
│   ├── static/          # Database services
│   └── services/        # VM management logic
├── database.py          # Database connections
└── instance_services.py # VM operations

Usage

After setup, you can:

    View all VMs and their status

    See detailed information about each VM

    Monitor which host each VM is running on

Support

If you have issues:

    Check your database connection

    Make sure Libvirt is installed and running

    Verify your VM host connections are correct

This is a simple tool to help you keep track of your virtual machines!
