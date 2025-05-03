const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const vehicleRoutes = require('./routes/vehicle.route');
const customerRoutes = require('./routes/customer.route');
const feedbackRouter = require('./routes/feedback.route');
const employeeRoutes = require('./routes/employee.route');
const contactRoutes = require('./routes/contact.route');
const pickupRoutes = require('./routes/pickup.route');

const dailyCollectionRoutes = require('./routes/dailyCollection.route');
const taskRoutes = require('./routes/task.route');
const salaryRoutes = require('./routes/salary.route');
const paymentRouter = require('./routes/payment.route');
const MnHRoutes = require ('./routes/MnH.route')

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Specify your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Session configuration
app.use(session({
    secret: '520518451848', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 } // Adjust cookie settings as needed
}));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/vehicle", vehicleRoutes);
app.use("/customer", customerRoutes);
app.use('/feedback', feedbackRouter);
app.use('/employee', employeeRoutes);
app.use('/contact', contactRoutes);
app.use("/pickup", pickupRoutes);
app.use('/dailycollection', dailyCollectionRoutes);
app.use('/task', taskRoutes);
app.use('/salary', salaryRoutes);
app.use('/payment', paymentRouter);
app.use('/MnH', MnHRoutes);



const PORT = process.env.PORT || 8020;

mongoose.connect("mongodb+srv://wast:wast123@wast.6og7c.mongodb.net/?retryWrites=true&w=majority&appName=wast")
    .then(() => {
        console.log(`Connected to MongoDB and server running on port ${PORT}`);
        app.listen(PORT, () => console.log("Server connection successful"));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
