 # 🎬 CineVerse - Full Stack Movie App <br>

 ## 📌 Project Overview <br>
CineVerse is a full-stack web application designed to provide an immersive movie experience. <br>
Backend: Node.js, Express.js, MongoDB <br>
Frontend: React.js <br>
Database: MongoDB <br>
Additional Script: Python (for sentiment analysis)


## 🛠 Prerequisites <br>
Before setting up, ensure you have the following installed on your system:
Node.js (Latest LTS version recommended) <br>
npm (Included with Node.js) <br>
MongoDB (Either running locally or using MongoDB Atlas) <br>
Python (Required if you are using app.py) <br>

## 🚀 Setup & Installation <br>
### 1. Clone the Repository <br>
Clone the CineVerse repository to your local machine and change to the project directory: <br>
git clone https://github.com/VaishnaviShimpi/CineVerse.git <br>
cd CineVerse

 ### 2. Set Up Environment Variables
In the root directory, change .env file and add the following: <br>
MONGO_URI=your_mongodb_connection_string <br>
JWT_SECRET=your_jwt_secret_key <br>
PORT=5000 <br>

### 3. Install Dependencies <br>
cd CineVerse <br>
npm install

### 4. Install Frontend Dependencies <br>
Next, navigate to the frontend folder and install its dependencies: <br>
cd ../frontend <br>
npm install

### 5. Run the Development Servers
In the 1st Terminal <br>
cd CineVerse <br>
npm run start <br>

In the 2nd Terminal <br>
cd frontend/src <br>
node server.js <br>

