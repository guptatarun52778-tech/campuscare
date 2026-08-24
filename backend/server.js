require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Check MySQL connection
db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

// Test route
app.get("/", (req, res) => {
    res.send("Campus Care Backend is Running!");
});
// Register a new user
app.post("/api/register", async (req, res) => {
    const { name, email, studentId, password } = req.body;

    if (!name || !email || !studentId || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, student_id, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, studentId, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("Error registering user:", err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email or Student ID already exists"
                        });
                    }

                    return res.status(500).json({
                        message: "Failed to register user"
                    });
                }

                res.status(201).json({
                    message: "Registration successful!",
                    userId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error("Password hashing error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
// Login user
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT id, name, email, student_id, password
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Error finding user:", err);

            return res.status(500).json({
                message: "Something went wrong"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        try {
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            res.status(200).json({
                message: "Login successful!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    student_id: user.student_id
                }
            });
        } catch (error) {
            console.error("Password verification error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    });
});
const blockedWords = [
    "madarchod",
    "bhenchod",
    "chutiya",
    "gandu",
    "harami",
    "kamina",
    "fuck",
    "fucking",
    "shit",
    "bitch",
    "bhosdike",
    "randi",
    "randa",
    "bsdk",
    "bkl",
    "mc",
    "bc",
    "kutta",
    "kutiya",
    "lund",
    "land",
    "lauda",
    "laudha",
];
// Submit a complaint
app.post("/api/complaints", (req, res) => {
    const {
        name,
        email,
        category,
        is_anonymous,
        complaint
    } = req.body;

    if (!category || !complaint) {
        return res.status(400).json({
            message: "Category and complaint are required"
        });
    }
    const complaintText = complaint.trim();

if (complaintText.length < 20) {
    return res.status(400).json({
        message: "Complaint must contain at least 20 characters."
    });
}

const containsAbusiveLanguage = blockedWords.some((word) =>
    complaintText.toLowerCase().includes(word.toLowerCase())
);

if (containsAbusiveLanguage) {
    return res.status(400).json({
        message:
            "Please use respectful language. Abusive or inappropriate language is not allowed."
    });
}

    const finalName = is_anonymous ? null : name;
    const finalEmail = is_anonymous ? null : email;

    const sql = `
        INSERT INTO complaints
        (name, email, category, is_anonymous, complaint)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            finalName,
            finalEmail,
            category,
            is_anonymous ? 1 : 0,
            complaintText
        ],
        (err, result) => {
            if (err) {
                console.error("Error saving complaint:", err);

                return res.status(500).json({
                    message: "Failed to save complaint"
                });
            }

            res.status(201).json({
                message: "Complaint submitted successfully!",
                complaintId: result.insertId
            });
        }
    );
});
// Track complaint
app.get("/api/complaints/:trackingId", (req, res) => {
    const { trackingId } = req.params;

    // CC3 -> 3
    if (!trackingId || !trackingId.toUpperCase().startsWith("CC")) {
        return res.status(400).json({
            message: "Invalid tracking ID"
        });
    }

    const complaintId = parseInt(
        trackingId.substring(2),
        10
    );

    if (isNaN(complaintId)) {
        return res.status(400).json({
            message: "Invalid tracking ID"
        });
    }

    const sql = `
        SELECT id, name, category, is_anonymous, complaint, status, created_at
        FROM complaints
        WHERE id = ?
    `;

    db.query(sql, [complaintId], (err, results) => {
        if (err) {
            console.error("Error tracking complaint:", err);

            return res.status(500).json({
                message: "Failed to track complaint"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const complaint = results[0];

        res.status(200).json({
            trackingId: `CC${complaint.id}`,
            complaint
        });
    });
});
// Admin - Get all complaints
app.get("/api/admin/complaints", (req, res) => {
    const sql = `
        SELECT
            id,
            name,
            email,
            category,
            is_anonymous,
            complaint,
            status,
            created_at
        FROM complaints
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching complaints:", err);

            return res.status(500).json({
                message: "Failed to fetch complaints"
            });
        }

        res.status(200).json({
            complaints: results
        });
    });
});


// Admin - Update complaint status
app.put("/api/admin/complaints/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "Under Review",
        "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid complaint status"
        });
    }

    const sql = `
        UPDATE complaints
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating complaint status:", err);

            return res.status(500).json({
                message: "Failed to update complaint status"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint status updated successfully"
        });
    });
});
app.post("/api/admin/create", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO admins (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("Error creating admin:", err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Admin email already exists"
                        });
                    }

                    return res.status(500).json({
                        message: "Failed to create admin"
                    });
                }

                res.status(201).json({
                    message: "Admin created successfully!",
                    adminId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error("Admin password hashing error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT id, name, email, password
        FROM admins
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Error finding admin:", err);

            return res.status(500).json({
                message: "Something went wrong"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid admin email or password"
            });
        }

        const admin = results[0];

        try {
            const passwordMatch = await bcrypt.compare(
                password,
                admin.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid admin email or password"
                });
            }

            res.status(200).json({
                message: "Admin login successful!",
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } catch (error) {
            console.error("Admin password verification error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    });
});
// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});