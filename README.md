# Cowtools

Cowtools is a suite of tools to visualize Coincidence of Wants (CoWs) in batch auctions within the Cowswap protocol. The application provides insights into historical volume, showcases a CoWiness leaderboard, and displays data on recent batches.


## Screenshot

![App Screenshot](https://i.imgur.com/S42RYuk.jpg)
[CowTools.info](https://cowtools.info)



## Features

- Interactive dashboard with data visualization for batch auctions
- Historical volume chart (based on Recharts)
- CoWiness leaderboard
- Recent batches table (based on `@tanstack/react-table`)
- Data fetching from Subgraphs and [Cowtools API](https://api.cowtools.info) with GraphQL and React Query
- Theming and customizable layout with Radix UI components
- Responsive design for various screen sizes

## Setting Up

Before setup, make sure you have Node.js and npm installed on your machine. You can download and install Node.js from [here](https://nodejs.org) and npm will be included along with it. Also, make sure you have Git installed which can be found [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

1. Clone the repository:

```bash
git clone https://github.com/your-github-username/repository.git
```

2. Install the dependencies:

```bash
cd repository
npm install
```

3. Create a `.env.local` file in the root of the project with the following content:

```bash
MONGODB_URI=<your_mongodb_uri>
MONGODB_DB_NAME=<your_mongodb_db_name>
MONGODB_COLLECTION_NAME=<your_mongodb_collection_name>
API_KEY=<your_api_key>
```

4. Run the development server:

```bash
npm run dev
```


## Development Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm start`: Serves the app in production mode
- `npm run lint`: Lints the codebase
- `npm run lint:fix`: Fixes linting issues automatically
- `npm run typecheck`: Checks for TypeScript issues



## Authors

- [@0xaaiden](https://www.github.com/0xaaiden)
- [@raymond2338](https://www.github.com/raymond2338)



## License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).
