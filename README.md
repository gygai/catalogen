# catalogen

## Project Structure

This project is organized as follows:

- `/apps` - Contains web applications related to the project.
    - `/site` - The main web application, handles the authentication and serves the store.
   - `/commerce` - Handles e-commerce mock api.
   - `/agent` - The smart agent to genrate the contextual catalog .


- `/packages` - Contains reusable packages that can be used across applications.
    - `/catalog` - A package containing catalog ui functionalities.


### Package manger - PNPM
This project uses pnpm as the package manager. To install pnpm, run the following command:
```bash
npm install -g pnpm
```

### Running the project

#### Run specific app:
```bash
pnpm --filter site dev
```
OR
```bash
cd apps/site
pnpm dev
```

Run all apps:
```bash
pnpm dev
```