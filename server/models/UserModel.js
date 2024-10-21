import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Import bcrypt

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique email addresses
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) { // Only hash the password if it's been modified
        const salt = await bcrypt.genSalt(10); // Specify salt rounds
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
