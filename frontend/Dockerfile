# Step 1: Use the official Node.js image as a base image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the dependencies inside the container
RUN npm install

# Step 5: Copy the rest of your frontend code into the container
COPY . .

# Step 6: Expose port 5000 (for React development server)
EXPOSE 5000

# Step 7: Build the React application
RUN npm run build

# Step 8: Start the React development server (adjust if you're using `npm start`)
CMD ["npm", "start"]
