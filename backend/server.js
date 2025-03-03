import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Allows us to use the .env file
dotenv.config();

// Create an express app
const app = express();

// Allows us to use JSON in the body of the request
app.use(express.json());
app.use(cors({
  origin: '*' // Allow all origins, or specify your frontend URL
}));
// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the port from the .env file or 4000
const port = process.env.PORT;

// Try to connect to the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        console.log(e);
    }
}

// Format Of A DB Entry (Task Model)
const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// User Schema for logging in and signing up
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware for authentication
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from the Authorization header
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
        req.userId = decoded.id; // Attach the user ID to the request object
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Get All Tasks (for logged-in users)
app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }); // Find tasks associated with the logged-in user
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// If you want to handle any other routes, send the index.html file to let React Router work
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Create a Task (for logged-in users)
app.post('/api/task', authMiddleware, async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ message: 'Task content is required' });
    }

    try {
        // Create a new task and associate it with the logged-in user's ID
        const newTask = new Task({
            task,
            userId: req.userId, // Attach the userId from the JWT token
        });

        await newTask.save(); // Save the task to the database
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Task completion status
app.put('/api/task/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: id, userId: req.userId }); // Ensure the task belongs to the logged-in user
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

        task.completed = !task.completed; // Toggle task completion status
        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Task
app.delete('/api/task/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId }); // Ensure the task belongs to the logged-in user
        if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Username already taken' });

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
});
