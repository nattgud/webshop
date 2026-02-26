const express = require("express");
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require("fs/promises");
const app = express();
const db = require("./db");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const multer = require("multer");
const Hashids = require("hashids");
const path = require('path');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/product_images');
	},
	filename: (req, file, cb) => {
		const suffix = Date.now() + "_" + Math.floor(Math.random()*10000);
		cb(null, suffix + path.extname(file.originalname));
	}
});
const hashids = new Hashids(
	"webshopsecretsalt",
	8
);
const upload = multer({ storage });
app.use(express.json());

app.use(session({
	secret: 'adminhashpassword',
	resave: false,
	saveUninitialized: false,
	cookie: { httpOnly: true, secure: false }
}));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

const tools = {
	generatePassword: async input => {
		const pass = await bcrypt.hash(input, 10);
		return pass;
	},
	validInput: (input) => {
		if(input === undefined) return false;
		return input.length > 0 && input.trim() !== "";
	},
	addToAccesslog: async (ip, agent, url = "") => {
		await db.execute("DELETE FROM accesslog WHERE accessed_at < NOW() - INTERVAL 2 DAY;");
		db.execute("INSERT INTO accesslog(ip, user_agent, url) VALUES(?, ?, ?);", [ip ?? "unknown", agent, url]);
	},
	async fileExists(path) {
		try {
			await fs.access(path);
			return true;
		} catch {
			return false;
		}
	}
};
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/product_images", express.static(path.join(__dirname, "public/product_images")));
app.use("/admin", adminRouter);
app.use("/api", userRouter);


app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});
app.get("/", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/success/:id", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/browse/:cat", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/product/:id", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/check-out", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/login", (req, res) => {
	try {
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/register", (req, res) => {
	try {
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/user", (req, res) => {
	try {
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/orders", (req, res) => {
	try {
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/search/:query", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});
app.get("/:error", (req, res) => {
	try {
		tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
		res.sendFile(path.join(__dirname, "public", "index.html"));
	} catch(e) {
		res.status(500).send("<h1>Något gick fel!</h1><p>Försök igen</p>");
	}
});

// extra
app.get("/api/codecount", async (req, res) => {
	try {
		const files = [
			"./server.js",
			"./db.js",
			"./public/index.html",
			"./public/admin.html",
			"./public/css/admin.css",
			"./public/css/input_buy.css",
			"./public/css/style.css",
			"./public/js/admin.js",
			"./public/js/app.js",
		];
		let totalChars = 0;
		let totalLines = 0;
		for (const file of files) {
			const content = await fs.readFile(file, "utf8");
			totalChars += content.length;
			totalLines += content.split("\n").length;
		}
		return res.json({ state: true, data: {
			filesCount: files.length,
			totalChars,
			totalLines
		}});
	} catch(e) {
		return res.status(500).json({state: false});
	}
});


app.listen(3000, () => {
	console.log("Servern kör på http://localhost:3000");
});