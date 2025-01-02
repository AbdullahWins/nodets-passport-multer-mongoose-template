# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files into the container
COPY . .

# Build the app
RUN npm run build

# Expose the port your app will run on (e.g., 5000)
EXPOSE 5000

# Start the app using the start script
CMD ["npm", "start"]
