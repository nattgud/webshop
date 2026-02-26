const express = require("express");
const router = express.Router({ mergeParams: true });
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require("fs/promises");
const app = express();
const db = require("../db");
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
// Public API
router.post('/login', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	try {
		if(req.session.username) return res.status(401).json({msg: "already logged in"});
		const { username, password } = req.body;
		const [users] = await db.execute("SELECT ld.username,ld.password FROM users u INNER JOIN logindata ld ON u.id = ld.user_id WHERE ld.username = ?;", [username]);
		if(users.length <= 0)  throw new Error("Fel användarnamn/lösenord");
		if(await bcrypt.compare(password, users[0].password)) {
			req.session.username = users[0].username;
		} else {
			 throw new Error("Fel användarnamn/lösenord");
		}
	} catch(e) {
		return res.status(500).json({state: false, msg: e.message});
	}
	return res.json({state: true, data: { username: req.session.username}});
});
router.post('/register', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(req.session.username) return res.status(401).json({msg: "already logged in"});
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		const { mail, password, fname, lname, phone } = req.body;
		if(!tools.validInput(mail) || !tools.validInput(password)) throw new Error("Inte korrekta uppgifter");
		const [userInsert] = await con.execute("INSERT INTO users() VALUES();");
		if(userInsert.affectedRows !== 1) throw new Error("Kunde inte registrera användaren");
		const [userDataInsert] = await con.execute("INSERT INTO userdata(user_id, email, first_name, last_name, phonenumber) VALUES(?, ?, ?, ?, ?);", [userInsert.insertId, mail, fname, lname, phone]);
		if(userDataInsert.affectedRows !== 1) throw new Error("Kunde inte registrera användaren");
		const [userPasswordInsert] = await con.execute("INSERT INTO logindata(user_id, username, password) VALUES(?, ?, ?);", [userInsert.insertId, mail, await tools.generatePassword(password)]);
		if(userPasswordInsert.affectedRows !== 1) throw new Error("Kunde inte registrera användaren");
		await con.commit();
	} catch(e) {
		await con.rollback();
		return res.status(500).json({state: false, msg: e.message});
	} finally {
		con.release();
	}
	return res.json({ state: true, data: { msg: "yay!" }});
});
router.post('/logout', (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	req.session.destroy();
	return res.json({ state: true});
});
router.get('/check', (req, res) => {
	res.json({ state: true, data: { loggedIn: (req.session.username || false) }});
});
router.get('/me', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.username) return res.status(401).json({msg: "not logged in"});
	try {
		const [users] = await db.execute("SELECT u.registered,ud.email,ud.first_name,ud.last_name,ud.phonenumber FROM users u INNER JOIN userdata ud ON u.id = ud.user_id WHERE ud.email = ?;", [req.session.username]);
		if(users.length <= 0) throw new Error("finns inte");
		return res.json({state: true, data: users[0]});
	} catch(e) {
		return res.status(500).json({state: false, msg: e.message});
	}
});
router.patch('/changePassword', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.username) return res.status(401).json({msg: "not logged in"});
	try {
		const { password } = req.body;
		if(password.length < 8 || password.trim() === "") throw new Error("för kort lösenord");
		const [users] = await db.execute("SELECT u.id FROM users u INNER JOIN userdata ud ON u.id = ud.user_id WHERE ud.email = ?;", [req.session.username]);
		if(users.length <= 0)  throw new Error("finns inte");
		const [ok] = await db.execute("UPDATE userdata SET password = ? WHERE user_id = ?;", [await tools.generatePassword(password), users[0].id]);
		if(ok.affectedRows === 1) return res.json({state: true});
		return res.json({state: false});
	} catch(e) {
		return res.status(500).json({state: false, msg: e.message});
	}
});
router.get("/orders", async (req, res) => {
	if(!req.session.username) return res.status(401).json({msg: "not logged in"});
	try {
		let [orders] = await db.execute("SELECT o.id orderId, p.title product, p.image, oi.amount, oi.product_price, o.cost totalCost,o.ordertime, o.state, o.name orderedBy, o.postal_service, o.postal_point FROM orderitems oi INNER JOIN orders o ON oi.order_id = o.id INNER JOIN userdata u ON u.user_id = o.user_id INNER JOIN products p ON p.id = oi.product_id WHERE u.email = ?;", [req.session.username]);
		res.json({state: true, data: orders.map(order => {
			order.orderId = hashids.encode(order.orderId);
			return order;
		})});
	} catch(e) {
		res.status(500).json({state: false, error: e.message});
	}
});

// Shop api
router.get("/shop/categories", async (req, res) => {
	try {
		const [cats] = await db.execute("SELECT c1.title,c2.title parent FROM categories c1 LEFT JOIN categories c2 ON c1.parent_categories_id = c2.id ORDER BY c1.title ASC;");
		res.json({state: true, data: cats});
	} catch(e) {
		res.status(500).json({state: false});
	}
});
//	, minPrice, maxPrice, inStock, search, sortBy, order, limit, page
router.get("/shop/categories/:category", async (req, res) => {
	try {
		const [allCats] = await db.execute("SELECT * FROM categories;");
		const { category } = req.params;
		let exists = false;
		allCats.forEach(check => {
			if(check.title.toLowerCase() == category.toLowerCase()) exists = check.title;
		});
		if(exists !== false || category.trim() === "*") {
			const rec = async parent => {
				const list = {};
				for(let cat of allCats) {
					if(cat.parent_categories_id === parent.id) {
						list[cat.title] = await rec(cat);
					}
				}
				const [count] = await db.execute("SELECT COUNT(p.id) amount FROM products p LEFT JOIN products_categories pc ON pc.products_id = p.id LEFT JOIN categories c ON c.id = pc.categories_id WHERE c.title = ?;", [parent.title]);
				if(Object.keys(list).length > 0) {
					list.__COUNT = count[0].amount;
					return list;
				} else {
					return count[0].amount;
				}
			}
			const tree = {};
			for(cat of allCats) {
				if(cat.title.toLowerCase() === category.toLowerCase() || (category.trim() === "*" && cat.parent_categories_id === null)) {
					tree[cat.title] = await rec(cat);
					if(category.trim() !== "*") break;
				}
			}
			return res.json({state: true, data: tree});
			// return res.status(500).json({state: false});
		} else {
			throw new Error("Fel");
		}
	} catch(e) {
		res.status(500).json({state: false});
	}
});

router.get("/shop/filters", async (req, res) => {
	try {
		const { ids } = req.query;
		const [filters] = await db.execute("SELECT f.id, f.title, f.units, ft.min_value AS min,ft.max_value AS max,GROUP_CONCAT(fv.value SEPARATOR ',') AS vals, CASE WHEN ft.filters_id IS NOT NULL THEN 'types' WHEN fv.filters_id IS NOT NULL THEN 'values' ELSE NULL END AS filter_type FROM filters f LEFT JOIN filter_types ft ON ft.filters_id = f.id LEFT JOIN filter_values fv ON fv.filters_id = f.id WHERE f.id IN ("+(Array(ids.split(",").length).fill('?').join(','))+") GROUP BY f.id, f.title, ft.min_value, ft.max_value;", ids.split(","));
		// const [filters] = await db.execute("SELECT f.title,IF(ft.min_value IS NOT NULL, MIN(ft.min_value), NULL) AS minv,IF(ft.max_value IS NOT NULL, MIN(ft.max_value), NULL) AS maxv,(SELECT ) AS alts FROM filters f LEFT JOIN filter_values fv ON fv.filters_id = f.id LEFT JOIN filter_types ft ON ft.filters_id = f.id WHERE f.id IN ("+(Array(ids.split(",").length).fill('?').join(','))+") GROUP BY f.id;", ids.split(","));
		res.json({state: true, data: filters});
	} catch(e) {
		res.status(500).json({state: false, error: e.message});
	}
});
router.get("/shop/info/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const [product] = await db.execute("SELECT p.title, p.short_description, p.full_description, p.price, p.image, p.stock_quantity, (SELECT GROUP_CONCAT(CONCAT(pf.filters_id, ':', IFNULL(CAST(pf.int_value AS CHAR), pf.str_value)) ORDER BY pf.filters_id SEPARATOR '|') FROM products_filters pf INNER JOIN filters f ON f.id = pf.filters_id WHERE pf.products_id = p.id) AS filters FROM products p WHERE p.id = ?;", [pid]);
		if(product.length === 1) {
			res.json({state: true, data: product[0] });
		} else {
			throw new Error("Kunde inte hämta");
		}
	} catch(e) {
		res.status(500).json({state: false, error: e.message });
	}
});
router.get('/shop/:category', async (req, res) => {
	try {
		const [existCheck] = await db.execute("SELECT title,id FROM categories;");
		const { category } = req.params;
		const { q, sortBy, order, limit, page, filter } = req.query;
		let exists = false;
		if(category !== "*") {
			existCheck.forEach(check => {
				if(check.title.toLowerCase() == category.toLowerCase()) exists = check.id;
			});
		} else {
			exists = true;
		}
		const sortCol = ["title", "price", "added"].indexOf(sortBy) !== -1 ? sortBy : "title";
		const norder = ["asc", "desc"].indexOf(order?.toLowerCase() ?? "none") !== -1 ? order.toUpperCase() : "ASC";
		const limitVal = limit !== undefined ? Math.max(1, Number(limit)) : 10;
		const pageVal = page !== undefined ? Math.max(0, Number(page) - 1) * limitVal : 0;
		let products = [];
		let filtersVal = "";
		if (filter !== undefined && filter !== "") {
			const parts = filter.split("|||").map(f => {
				const [filterId, type, value] = f.split(">>>");
				const safeId = parseInt(filterId);
				if (type === "int") {
					const [min, max] = value.split("_").map(v => parseInt(v));
					return `(EXISTS (SELECT 1 FROM products_filters pf WHERE pf.products_id = p.id AND pf.filters_id = ${safeId} AND pf.int_value BETWEEN ${min} AND ${max}))`;
				} else {
					const values = value.split(",").filter(t => t.trim() !== "");
					if (values.length === 0) return null;
					const inValues = values.map(t => `'${t.replace(/'/g, "\\'")}'`).join(",");
					return `(EXISTS (SELECT 1 FROM products_filters pf WHERE pf.products_id = p.id AND pf.filters_id = ${safeId} AND pf.str_value IN (${inValues})))`;
				}
			}).filter(Boolean);
			if (parts.length > 0) filtersVal = parts.join(" AND ") + " AND ";
		}
		if(exists === true) {
			[products] = await db.execute(`SELECT DISTINCT p.*, (SELECT GROUP_CONCAT(CONCAT(pf2.filters_id, ':', IFNULL(CAST(pf2.int_value AS CHAR), pf2.str_value)) ORDER BY pf2.filters_id SEPARATOR '|') FROM products_filters pf2 INNER JOIN filters f ON f.id = pf2.filters_id WHERE pf2.products_id = p.id) AS filters FROM products p WHERE ${filtersVal} p.title LIKE ? ORDER BY ${sortCol} ${norder} LIMIT ${pageVal},${limitVal}`, [`%${q}%`]);
		} else if(exists !== false) {
			[products] = await db.execute(`WITH RECURSIVE subcategories AS (SELECT id FROM categories WHERE id = ? UNION ALL SELECT c.id FROM categories c JOIN subcategories s ON c.parent_categories_id = s.id) SELECT DISTINCT p.*, (SELECT GROUP_CONCAT(CONCAT(pf2.filters_id, ':', IFNULL(CAST(pf2.int_value AS CHAR), pf2.str_value)) ORDER BY pf2.filters_id SEPARATOR '|') FROM products_filters pf2 INNER JOIN filters f ON f.id = pf2.filters_id WHERE pf2.products_id = p.id) AS filters FROM products p JOIN products_categories pc ON p.id = pc.products_id WHERE ${filtersVal} pc.categories_id IN (SELECT id FROM subcategories) AND p.title LIKE ? ORDER BY ${sortCol} ${norder} LIMIT ${pageVal},${limitVal}`, [exists, `%${q}%`]);
		} else {
			throw new Error("Fel");
		}
		let ids = products.map(product => product.id);
		let filterList = [];
		if(ids.length > 0) {
			[filterList] = await db.execute("SELECT DISTINCT filters_id AS id FROM products_filters pf WHERE pf.products_id IN ("+(Array(ids.length).fill('?').join(','))+");", ids);
		}
		return res.json({state: true, data: {products: products, filters: filterList}});
	} catch(e) {
		res.status(500).json({state: false, error: e.message, sql: e.sql});
	}
});

router.post("/cart", async (req, res) => {
	try {
		let { cart } = req.body;
		req.session.cart = cart;
		return res.json({state: true, data: req.session.cart});
	} catch(e) {
		return res.status(500).json({state: false});
	}
});
router.get("/cart", async (req, res) => {
	try {
		return res.json({ state: true, data: (req.session.cart === undefined)?[]:req.session.cart });
	} catch(e) {
		return res.status(500).json({state: false});
	}
});
router.delete("/cart", async (req, res) => {
	try {
		req.session.cart = [];
		await req.session.destroy();
		return res.json({ state: true });
	} catch(e) {
		console.log(e.message);
		return res.status(500).json({state: false});
	}
});
router.get("/cart/details", async (req, res) => {
	try {
		const details = [];
		if(req.session.cart === undefined || req.session.cart === null) return res.json({ state: true, data: details});
		for(let item of req.session.cart) {
			const [product] = await db.execute("SELECT id,title,price,stock_quantity stock FROM products WHERE id = ?;", [item[0]]);
			if(product.length === 1) {
				product[0].amount = item[1];
				details.push(product[0]);
			} else {
				throw new Error("Fel");
			}
		};
		return res.json({ state: true, data: details});
	} catch(e) {
		return res.status(500).json({state: false});
	}
});
router.post("/cart/order", async (req, res) => {
	let orderID = null;
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		const {
			name, 
			mail, 
			phone, 
			address, 
			postal, 
			city, 
			service, 
			point, 
			cardName, 
			cardNumber, 
			cardDate, 
			cardCVC
		} = req.body;
		if(req.session.cart === undefined || req.session.cart === null) return res.json({ state: true});
		let totalCost = 0;
		const orderItems = [];
		for(let item of req.session.cart) {
			const [data] = await con.execute("SELECT id,price FROM products WHERE id = ?;", [item[0]]);
			if(data[0] !== undefined) {
				if(data[0].price !== undefined) {
					orderItems.push({ id: data[0].id, price: Number(data[0].price), amount: Number(item[1])});
					totalCost += Number(data[0].price) * item[1];
				} else {
					await con.rollback();
					throw new Error("product price doesn't exist.");
				}
			} else {
				await con.rollback();
				throw new Error("product doesn't exist.");
			}
		}
		let userID = null;
		if(req.session.username) {
			const [userData] = await con.execute("SELECT user_id FROM userdata WHERE email = ?;", [req.session.username]);
			if(userData[0].user_id === undefined) throw new Error("Användaren finns inte");
			userID = userData[0].user_id;
		}
		const [order] = await con.execute("INSERT INTO orders(user_id, cost, name, mail, phone, address, postal, city, postal_service, postal_point) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [
			userID,
			totalCost,
			name, 
			mail, 
			phone, 
			address, 
			postal, 
			city, 
			service, 
			point
		]);
		orderID = order.insertId;
		const [pay] = await con.execute("INSERT INTO payments(order_id, name, number, expires, cvc) VALUES(?, ?, ?, ?, ?);", [
			order.insertId,
			cardName, 
			cardNumber, 
			cardDate, 
			cardCVC
		]);
		orderItems.forEach(async item => {
			const [ok] = await con.execute("UPDATE products SET stock_quantity = stock_quantity-1 WHERE id = ?;", [
				item.id
			]);
		});
		orderItems.forEach(async item => {
			const [ok] = await con.execute("INSERT INTO orderitems(order_id, product_id, amount, product_price) VALUES(?, ?, ?, ?);", [
				orderID, item.id, item.amount, item.price
			]);
		});
		await con.commit();
		delete req.session.cart;
	} catch(e) {
		await con.rollback();
		return res.status(500).json({state: false, msg: e.message});
	} finally {
		con.release();
	}
	return res.json({ state: true, data: { ref: hashids.encode(orderID) }});
});

// Leverans
router.get("/delivery/services", async (req, res) => {
	try {
		const list = [
			"Postnord"
		];
		return res.json({ state: true, data: list });
	} catch(e) {
		return res.status(500).json({state: false});
	}
});
router.get("/delivery/points/:service/:postal", async (req, res) => {
	try {
		const { service, postal } = req.params;
		const deliveryPoints = {
			Postnord: [
				"Kristianstad C Ombud",
				"City Gross",
				"ICA Maxi",
				"Hemköp",
				"PostNord Ombud Vilan",
				"Malmö C Ombud",
				"ICA Kvantum Malmö",
				"Hemköp Malmö",
				"PostNord Ombud Limhamn",
				"Göteborg Nordstan Ombud",
				"ICA Kvantum Göteborg",
				"Hemköp Göteborg",
				"PostNord Ombud Hisingen",
				"Stockholm C Ombud",
				"ICA Kvantum Stockholm",
				"Hemköp Stockholm",
				"PostNord Ombud Söder",
				"Uppsala C Ombud",
				"ICA Kvantum Uppsala",
				"Hemköp Uppsala"
			],
			DHL: [
				"Kristianstad C DHL Servicepoint",
				"City Gross Kristianstad DHL Pickup",
				"ICA Maxi Kristianstad DHL Dropoff",
				"Hemköp Kristianstad DHL Center",
				"DHL Express Vilan, Kristianstad",
				"Malmö C DHL Servicepoint",
				"ICA Kvantum Malmö DHL Pickup",
				"Hemköp Malmö DHL Dropoff",
				"DHL Hub Limhamn, Malmö",
				"Göteborg Nordstan DHL Servicepoint",
				"ICA Kvantum Göteborg DHL Pickup",
				"Hemköp Göteborg DHL Dropoff",
				"DHL Express Hisingen, Göteborg",
				"Stockholm C DHL Servicepoint",
				"ICA Kvantum Stockholm DHL Pickup",
				"Hemköp Stockholm DHL Dropoff",
				"DHL Dropoff Söder, Stockholm",
				"Uppsala C DHL Servicepoint",
				"ICA Kvantum Uppsala DHL Pickup",
				"Hemköp Uppsala DHL Dropoff"
			]
		};
		const index = parseInt(postal.slice(-2)) % deliveryPoints[service].length;
		const result = [];
		for (let i = 0; i < 3; i++) {
			result.push(deliveryPoints[service][(index + i) % deliveryPoints[service].length]);
		}
		return res.json({ state: true, data: result });
	} catch(e) {
		return res.status(500).json({state: false});
	}
});

module.exports = router