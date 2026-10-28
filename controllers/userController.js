const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

const { userSchema } = require("../validation/userSchema");

// Helper Functions

// 1. Hash password
async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt}:${derivedKey.toString("hex")}`;
}

// 2. Compare password
async function comparePassword(inputPassword, storedHash) {
    const [salt, key] = storedHash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = await scrypt(inputPassword, salt, 64);
    return crypto.timingSafeEqual(derivedKey, keyBuffer);  
}

// Register a new user

const register = async (req, res) => {
    if (!req.body) req.body = {};
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = global.users.find(
        (user) => user.email === value.email
    );
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await hashPassword(value.password);
    const newUser = {
        id: global.users.length + 1,
        name: value.name,
        email: value.email,
        hashedPassword,
    };
    global.users.push(newUser);
    global.user_id = newUser;

    return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    });
}

// Logon
const logon = async (req, res) => {
    const { email, password } = req.body;

    const user = global.users.find((user) => user.email === email);

    const goodCredentials = user && await comparePassword(password, user.hashedPassword);

    if (!goodCredentials) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    global.user_id = user;

    return res.status(200).json({
        message: "User logged in successfully",
        name: user.name,
        email: user.email,
    });
};

// Logoff
const logoff = (req, res) => {
    global.user_id = null;

    return res.status(200).json({ 
        message: "User logged off successfully" 
    });
};
    

module.exports = {
    register,
    logon,
    logoff,
};

