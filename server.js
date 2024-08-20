const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: process.env.EMAIL_USER, // Your Yahoo email address from .env
        pass: process.env.EMAIL_PASS  // Your Yahoo app password from .env
    },
    tls: {
        rejectUnauthorized: false
    }, 
    debug: true // Enable debug output
});

// API route for handling contact form submissions
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Log incoming request data
    console.log('Received contact request:', { name, email, message });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Your Yahoo email address
        to: process.env.EMAIL_USER,   // Send email to yourself for testing
        subject: `New message from ${name}`,
        text: `From: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Log error details for debugging
            return res.status(500).json({ success: false, message: 'Failed to send message' });
        }
        console.log('Email sent successfully:', info.response);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// Route to serve the HTML file (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});