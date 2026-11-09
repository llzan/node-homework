const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const pool = require("../db/pg-pool");

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
    if (derivedKey.length !== keyBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(derivedKey, keyBuffer);  
}

// Register a new user

const register = async (req, res, next) => {
    if (!req.body) req.body = {};

    const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            details: error.details,
        });
    }
    let result = null;

    value.hashed_password = await hashPassword(value.password);

    try {
        result = await pool.query(
            `INSERT INTO users (email, name, hashed_password)
             VALUES ($1, $2, $3)
             RETURNING id, email, name`,
            [value.email, value.name, value.hashed_password]
        );
    } catch (e) {
        if (e.code === "23505") {
            return res.status(400).json({
                message: "Email already exists",
            });
        }
        return next(e);
    }

    const user = result.rows[0];

    global.user_id = user.id;

    return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
    });
};

// Logon
const logon = async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    const user = result.rows[0];

    const goodCredentials = await comparePassword(
        password,
        user.hashed_password
    );

    if (!goodCredentials) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    global.user_id = user.id;

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

