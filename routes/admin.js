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
//	ADMIN
//	-	Login
router.post('/login', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	const { username, password } = req.body;
	const [users] = await db.execute("SELECT * FROM admin_users WHERE username = ?;", [username]);
		if(users.length <= 0) {
			await con.rollback();
			return res.status(401).json({ error: 'wrong' });
		}
	if(await bcrypt.compare(password, users[0].password)) {
		await db.execute("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP, last_ip = ? WHERE username = ?;", [req.ip, username]);
		const [me] = await db.execute("SELECT username FROM admin_users WHERE username = ?;", [username]);
		req.session.isAdmin = true;
		req.session.username = me[0].username;
		return res.json({state: true, username: me[0].username});
	} else {
		await con.rollback();
		return res.json({state: false});
	}
});
router.post('/logout', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	req.session.destroy();
	res.json({ success: true });
});
router.get('/check', async (req, res) => {
	res.json({ loggedIn: req.session.isAdmin || false , username: req.session.username});
});
router.get('/users', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	try {
		const [users] = await db.execute("SELECT username,created_at FROM admin_users;");
		return res.json(users);
	} catch(e) {
		return res.json({state: false, msg: e});
	}
});
router.post('/users', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { username, password } = req.body;
	if(!tools.validInput(username) || !tools.validInput(password)) return res.status(400).json({msg: "not valid input"});
	try {
		const state = await db.execute("INSERT INTO admin_users(username, password) VALUES(?, ?);", [username, await tools.generatePassword(password)]);
	} catch(e) {
		return res.json({state: false});
	}
	return res.json({state: true});
});
router.delete('/users/:user', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { user } = req.params;
	const [status] = await db.execute("DELETE FROM admin_users WHERE username = ?;", [user]);
	if(status.affectedRows > 0) return res.json({state: true});
	return res.json({state: false});
});
router.get('/products', async (req, res) => {
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const [products] = await db.execute("SELECT p.id AS pid,p.title,p.short_description,p.full_description description,p.price,p.image,p.stock_quantity AS stock,GROUP_CONCAT(c.title ORDER BY c.title SEPARATOR '|') AS categories,GROUP_CONCAT(DISTINCT c.title ORDER BY c.title SEPARATOR '|') AS categories, (SELECT GROUP_CONCAT(CONCAT(pf.filters_id, ':', IFNULL(CAST(pf.int_value AS CHAR), pf.str_value)) ORDER BY pf.filters_id SEPARATOR '|') FROM products_filters pf INNER JOIN filters f ON f.id = pf.filters_id WHERE pf.products_id = p.id) AS filters FROM products p LEFT JOIN products_categories pc ON p.id = pc.products_id LEFT JOIN categories c ON c.id = pc.categories_id GROUP BY p.id, p.title, p.short_description, p.full_description, p.price, p.image, p.stock_quantity ORDER BY p.id ASC;");
	res.json(products);
});
router.get('/productImages', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	const dir = "public/product_images";
	const images = await fs.readdir(dir);
	const filesWithStats = await Promise.all(
		images.map(async (file) => {
			const fullPath = path.join(dir, file);
			const stat = await fs.stat(fullPath);
			return { file, mtime: stat.mtime.getTime() };
		})
	);
	res.json(filesWithStats);
});
router.post('/productImages', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	upload.single("image")(req, res, async (err) => {
    	if (err) return res.status(400).json({ state: false, msg: err.message });
		if(!req.file) return res.status(400).json({state: false, message: "Fil saknas"});
		return res.status(200).json({state: true});
	});
});
router.delete('/productImages/:image', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	const { image } = req.params;
	const filePath = path.resolve('public/product_images', path.basename(image));
	if(await tools.fileExists(filePath) === false) return res.status(404).json({state: false});
	try {
		await fs.unlink(filePath);
	} catch(e) {
		return res.status(500).json({state: false});
	}
	res.json({state: true});
});
router.get('/categories', async (req, res) => {
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const [cats] = await db.execute("SELECT c1.title,c2.title parent,(SELECT COUNT(p.id) FROM products p INNER JOIN products_categories pc ON pc.products_id = c1.id) connectedProducts FROM categories c1 LEFT JOIN categories c2 ON c1.parent_categories_id = c2.id ORDER BY c1.title ASC;");
	res.json(cats);
});
const addCategory = async name => {
	const [cat] = await db.execute("INSERT INTO categories(title) VALUES(?)", [name]);
	return cat;
};
router.post('/products', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const checkList = [
		"productTitle", 
		"productPrice",
		"productStock", 
		"productCategories"
	];
	const ok = checkList.every(id => (typeof req.body[id] !== "number")?(req.body[id].length > 0):true && req.body[id] !== "");
	const {
		productTitle, 
		productShortDesc, 
		productLongDesc, 
		productPrice, 
		productImage, 
		productStock, 
		productFilters,
		productCategories
	} = req.body;
	if(!ok) return res.status(400).json({msg: "not valid input"});
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		const [iProd] = await con.execute("INSERT INTO products(title, short_description, full_description, price, image, stock_quantity) VALUES(?, ?, ?, ?, ?, ?);", [productTitle, productShortDesc, productLongDesc, productPrice, productImage, productStock]);
		for(filter of productFilters) {
			const [addFilter] = await con.execute("INSERT INTO products_filters(filters_id, products_id, int_value, str_value) VALUES(?, ?, ?, ?);", [filter.id, iProd.insertId, (filter.type === "int")?Number(filter.value):null, (filter.type === "str")?filter.value:null]);
		}
		for(cat of productCategories) {
			const [catExist] = await con.execute("SELECT id FROM categories WHERE title = ?;", [cat]);
			if(catExist.length === 0) {
				const iCat = await addCategory(cat);
				await con.execute("INSERT INTO products_categories(products_id, categories_id) VALUES(?, ?);", [iProd.insertId, iCat.insertId]);
			} else {
				await con.execute("INSERT INTO products_categories(products_id, categories_id) VALUES(?, ?);", [iProd.insertId, catExist[0].id]);
			}
		}
		await con.commit();
	} catch(e) {
		await con.rollback();
		return res.json({state: false, msg: e.message});
	} finally {
		con.release();
	}
	return res.json({state: true});
});
router.patch('/products', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const checkList = [
		"productTitle", 
		"productPrice", 
		"productStock", 
		"productCategories"
	];
	const ok = checkList.every(id => (typeof req.body[id] !== "number")?(req.body[id].length > 0):true && req.body[id] !== "");
	const {
		productTitle, 
		productShortDesc, 
		productLongDesc, 
		productPrice, 
		productImage, 
		productStock, 
		productFilters,
		productCategories,
		pid
	} = req.body;
	if(!ok) return res.status(400).json({msg: "not valid input"});
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		const [iProd] = await con.execute("UPDATE products SET title = ?, short_description = ?, full_description = ?, price = ?, image = ?, stock_quantity = ? WHERE id = ?;", [productTitle, productShortDesc, productLongDesc, productPrice, productImage, productStock, pid]);
		const clearCatRelations = await con.execute("DELETE FROM products_categories WHERE products_id = ?;", [pid]);
		const [ok] = await con.execute("DELETE FROM products_filters WHERE products_id = ?;", [pid]);
		for(filter of productFilters) {
			const [addFilter] = await con.execute("INSERT INTO products_filters(filters_id, products_id, int_value, str_value) VALUES(?, ?, ?, ?);", [filter.id, pid, (filter.type === "int")?Number(filter.value):null, (filter.type === "str")?filter.value:null]);
		}
		productCategories.forEach(async cat => {
			const [catExist] = await con.execute("SELECT id FROM categories WHERE title = ?;", [cat]);
			if(catExist.length === 0) {
				const [iCat] = await con.execute("INSERT INTO categories(title) VALUES(?)", [cat]);
				await con.execute("INSERT INTO products_categories(products_id, categories_id) VALUES(?, ?);", [pid, iCat.insertId]);
			} else {
				await con.execute("INSERT INTO products_categories(products_id, categories_id) VALUES(?, ?);", [pid, catExist[0].id]);
			}
		});
		await con.commit();
	} catch(e) {
		await con.rollback();
		return res.status(500).json({state: false, error: e.message});
	} finally {
		con.release();
	}
	return res.json({state: true});
});
router.delete('/products/:product', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		const { product } = req.params;
		const [status] = await db.execute("DELETE FROM products WHERE id = ?;", [product]);
		if(status.affectedRows === 0) throw new Error("Ingen produkt raderades");
		const [status2] = await db.execute("DELETE FROM products_filters WHERE products_id = ?;", [product]);
		await con.commit();
	} catch(e) {
		await con.rollback();
		return res.status(500).json({state: false, msg: e.message});
	} finally {
		con.release();
	}
	return res.json({state: true});
});
router.patch('/categories', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { move, to } = req.body;
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		let targ = (move.trim() === to.trim())?null:to;
		let toId = null;
		if(targ !== null) {
			[toId] = await con.execute("SELECT id FROM categories WHERE title = ?;", [to]);
		}
		const [moveStatus] = await con.execute("UPDATE categories SET parent_categories_id = ? WHERE title = ?;", [(targ === null)?null:toId[0].id, move.trim()]);
		await con.commit();
	} catch(e) {
		await con.rollback();
		return res.status(500).json({state: false, msg: e.message});
	} finally {
		con.release();
	}
	return res.json({ state: true });
});
router.post('/categories', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { cat } = req.body;
	if(cat === undefined || cat.trim() === "") return res.status(400).json({msg: "not valid input"});
	try {
		const state = await db.execute("INSERT INTO categories(title) VALUES(?);", [cat]);
	} catch(e) {
		return res.json({state: false});
	}
	return res.json({state: true});
});
router.delete('/categories/:cat', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { cat } = req.params;
	const [status] = await db.execute("DELETE FROM categories WHERE title = ?;", [cat]);
	if(status.affectedRows > 0) return res.json({state: true});
	return res.json({state: false});
});
router.post('/filters', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { type, id, min, max, name, unit, alts } = req.body;
	const con = await db.getConnection();
	try {
		await con.beginTransaction();
		if(type === "range") {
			if(id === null) {
				const [createdFilter] = await con.execute("INSERT INTO filters (title, units) VALUES(?, ?);", [name, unit]);
				const [ok] = await con.execute("INSERT INTO filter_types (filters_id, min_value, max_value) VALUES(?, ?, ?);", [createdFilter.insertId, Number(min), Number(max)]);
			} else {
				const [updatedFilter] = await con.execute("UPDATE filters SET title = ?, units = ? WHERE id = ?;", [name, unit, id]);
				const [ok] = await con.execute("UPDATE filter_types SET min_value = ?, max_value = ? WHERE filters_id = ?;", [min, max, id]);
			}
		} else if(type === "alts") {
			if(id === null) {
				const [createdFilter] = await con.execute("INSERT INTO filters (title) VALUES(?);", [name]);
				alts.forEach(async alt => {
					const [ok] = await con.execute("INSERT INTO filter_values (filters_id, value) VALUES(?, ?);", [createdFilter.insertId, alt]);
				});
				
			} else {
				const [updatedFilter] = await con.execute("UPDATE filters SET title = ? WHERE id = ?;", [name, id]);
				const [deletedFilter] = await con.execute("DELETE FROM filter_values WHERE filters_id = ?;", [id]);
				alts.forEach(async alt => {
					const [ok] = await con.execute("INSERT INTO filter_values (filters_id, value) VALUES(?, ?);", [id, alt]);
				});
			}
		}
		await con.commit();
		return res.json({ state: true });
	} catch(e) {
		await con.rollback();
		return res.status(500).json({state: false, msg: e.message});
	} finally {
		con.release();
	}
});
router.get('/orders', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	// const { cat } = req.params;
	try {
		const [orders] = await db.execute("SELECT o.id, o.user_id,o.cost, o.ordertime, o.state, o.name, o.postal_service, ud.email FROM orders o LEFT JOIN users u ON u.id = o.user_id LEFT JOIN userdata ud ON ud.user_id = u.id;");
		return res.json({state: true, data: orders});
	} catch(e) {
		return res.status(500).json({state: false});
	}
});
router.patch('/orders', async (req, res) => {
	tools.addToAccesslog(req.ip, req.headers["user-agent"], req.url);
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const { id, state } = req.body;
	try {
		const [orders] = await db.execute("UPDATE orders SET state = ? WHERE id = ?;", [state, id]);
	if(orders.affectedRows > 0) return res.json({ state: true });
	} catch(e) {
		return res.status(500).json({state: false});
	}
});
router.get('/filters', async (req, res) => {
	if(!req.session.isAdmin) return res.status(401).json({msg: "not logged in"});
	const [cats] = await db.execute("SELECT f.id, f.title, f.units, ft.min_value AS min,ft.max_value AS max,GROUP_CONCAT(fv.value SEPARATOR ',') AS vals, CASE WHEN ft.filters_id IS NOT NULL THEN 'types' WHEN fv.filters_id IS NOT NULL THEN 'values' ELSE NULL END AS filter_type FROM filters f LEFT JOIN filter_types ft ON ft.filters_id = f.id LEFT JOIN filter_values fv ON fv.filters_id = f.id GROUP BY f.id, f.title, ft.min_value, ft.max_value;");
	res.json(cats);
});
module.exports = router