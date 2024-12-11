# Step 1: Use the official Node.js image as a base image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the dependencies inside the container
RUN npm install

# Step 5: Copy the rest of your backend code into the container
COPY . .

# Step 6: Expose port 5000 (the backend port)
EXPOSE 5000

# Step 7: Start the backend server (adjust the start command if necessary)
CMD ["npm", "start"]
