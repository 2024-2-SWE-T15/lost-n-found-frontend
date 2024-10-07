# Lost n' Found Frontend Repository

## Requirements

> **NOTE:** For better development experience, using [NVM](https://github.com/nvm-sh/nvm) is highly recommended. NVM allows you to manage multiple Node.js versions on your machine.
>
> However, NVM is not mandatory; you can install Node.js globally and skip the NVM installation.

- Node.js v20.17.0
  - With NVM: `nvm install`
  - Without NVM: [Download Node.js](https://nodejs.org/en/download/)
- Yarn
  - After Node.js installed, `npm install -g yarn`


## Setup & Development

After cloning the repository, navigate to the project directory and run the following commands:

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the development server:
   ```bash
   yarn dev
   ```
3. Open the link provided in the terminal to (usually `http://localhost:5173`) view the project in your browser.

## Testing on Other Devices

By default, the development server is only accessible on your local machine. To test the project on other devices, you need to make the server accessible on your local network by providing the `--host` flag:

```bash
yarn dev --host
```
