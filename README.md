## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `Files To Update`

-   raffleContract.js - for updating the deployed contracts address AND the ABI (which is currently updated)

### `Files to be aware of`

-   etherumApi.js - utilizes ethers.js and is the apps client for making calls
-   ethereumProvider - simply provides functions for getting providers and signers
-   RafflePage.js - utilizes the ethereumApi.js
