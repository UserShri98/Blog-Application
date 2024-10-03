const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', function (next) {
    const user = this;

    // Only hash the password if it has been modified
    if (!user.isModified("password")) return next();

    // Generate a salt and hash the password
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    // Set the salt and the hashed password on the user object
    user.salt = salt;
    user.password = hashedPassword;

    next();
});

// Static method to match passwords
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User Not Found");

    const salt = user.salt;
    const hashedPassword = user.password;

    // Check if the salt is undefined or not present
    if (!salt) throw new Error("Salt is missing from the user");

    const userProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userProvidedPassword) throw new Error("Incorrect Password");

    const token=createTokenForUser(user);
    return token;
});

// Create the User model
const User = model("user", userSchema);

module.exports = User;
