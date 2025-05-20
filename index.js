

const dotenv = require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/dbConnect.js');
const app = express();
const PORT = process.env.PORT || 5000;

const authRouter = require('./routes/authRoute.js');
const productRouter = require('./routes/productRoute.js');
const cartRoutes= require("./routes/cartRoute.js");
const orderRoutes = require("./routes/orderRoute.js");

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler.js');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const cors = require('cors');

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database
dbConnect();

// Routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

app.use("/api/cart", cartRoutes);
app.use('/api/order', orderRoutes); 

// Static files
app.use('/uploads', express.static('uploads'));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
