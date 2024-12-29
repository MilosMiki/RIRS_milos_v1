# Step 1: Use official Node.js image as base
FROM node:20

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json for npm install
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the backend code into the container
COPY . .

# Step 6: Build the backend (if necessary, for example with TypeScript)
RUN npm run build

# Step 7: Expose the port for the backend
EXPOSE 5000
EXPOSE 8080

# Step 8: Start the backend server
CMD ["npm", "run", "start"]
