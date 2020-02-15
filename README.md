# Cloudflare DynDns

[![Build Status](https://dev.azure.com/twsl/cloudflare-dyndns/_apis/build/status/twsI.cloudflare-dyndns?branchName=master)](https://dev.azure.com/twsl/cloudflare-dyndns/_build/latest?definitionId=11&branchName=master)
[![Docker Pulls](https://img.shields.io/docker/pulls/twsldev/cloudflare-dyndns)](https://hub.docker.com/r/twsldev/cloudflare-dyndns)

Keep your Cloudflare DNS records up to date.

## Setup

Configure your *config.json* and execute the `start` script afterwards. This requires the installation of node.js. The easier solution would be running the Docker container and edit or replace the config file.

## Operation

There are three different way to run the updater.

* Run as scheduled task
* Run once
* Run query to api endpoint

For running a scheduled task, set the `frequency` property in the *config.json*, which represents an integer value in minutes. In order to run the updater only once, just set the `frequency` to `0`. There is always the option to query the `/fritzbox` endpoint to trigger an update. More infos are embedded in the `/help` endpoint.

## Config
The [*config.json*](config.json) shows an example configuration. `ipv6Support` can be enabled or disabled. For each of your cloudflare accounts, you create a new object with `credentials` and `zones` properties. For more information on the credentials object, check the arguments for the [cloudflare](https://www.npmjs.com/package/cloudflare#configuration) library. The zone element got a `name` and `updates` property.

## Fritz!Box

Instead of relying on external websites or if you are using a VPN for some reason, you can always use the DynDns feature of your Fritz!Box router.
