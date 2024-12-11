# Step 1: Use official Node.js image as base
FROM node:20

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json for npm install
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the frontend code into the container
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Install a simple web server to serve the React app
RUN npm install -g serve

# Step 8: Expose the port for the frontend (changed to 3000)
EXPOSE 3000

# Step 9: Serve the React app using the `serve` command
CMD ["serve", "-s", "build", "-l", "3000"]
