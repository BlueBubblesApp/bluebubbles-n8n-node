# BlueBubbles Node for n8n

The BlueBubbles Node for n8n enables an analyst to setup complex automated workflows using BlueBubbles.

## What is n8n?

n8n is an open-source and community-driven workflow platform to automate tasks using workflows and nodes. It's built on TypeScript/NodeJS, and supports drag-n-drop plugins, allowing us to create third-party nodes for the platform (in addition to the built-in nodes). Here are some links you may find useful:

-   Website: https://n8n.io
-   Node Documentation: https://docs.n8n.io

## Installation

After installing n8n, it should have created a path to place any third-party node definitions. The path is below:

`~/.n8n/custom`

The above directory should contain 2 sub-directories, `credentials` and `nodes`. To install the BlueBubbles node, follow these instructions:

1. If the `custom` directory didn't already exist, create it.

    - `mkdir ~/.n8n/custom/credentials`
    - `mkdir ~/.n8n/custom/nodes`

2. Extract the `n8n-node-bluebubbles.zip` file

    - The contents include 2 directories, `credentials` and `nodes`.

3. Copy the entire contents of the `credentials` directory (from the zip) into `~/.n8n/custom/credentials`
4. Copy the entire contents of the `nodes` directory (from the zip) into `~/.n8n/custom/nodes`
5. Restart the n8n process to pick up on the new BlueBubbles node
6. Refresh your n8n browser window
