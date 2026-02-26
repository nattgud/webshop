const popup = {
	timer: null,
	open: msg => {
		clearTimeout(popup.timer);
		document.querySelector("#loader span").textContent = msg;
		document.querySelector("#loader").classList.add("open");
		popup.timer = setTimeout(() => {
			document.querySelector("#loader").classList.remove("open");
		}, 1000+(msg.length*25));
	}
};
const tools = {
	sqlTimestamp: (date, format) => {
		date = new Date(date.replace(' ', 'T'));
		const pad = (n) => n.toString().padStart(2,'0');
		const map = {
			Y: date.getFullYear(),
			y: (""+date.getFullYear()).substring(2),
			m: pad(date.getMonth()+1),
			d: pad(date.getDate()),
			h: pad(date.getHours()),
			i: pad(date.getMinutes()),
			s: pad(date.getSeconds())
		};
		return format.replace(/[Yymdhis]/g, (c) => map[c] ?? c);
	}
}

window.addEventListener("load", async () => {
	const onePage = false;

	// loading tools
	const searchVals = {
		order: "price",
		dir: "asc",
		limit: 150,
		page: 1,
		query: "",
		filter: []
	};

	// url parsing
	const fullURL = location.href.split("?");
	const params = {}
	let tparams = (fullURL.length === 1)?false:fullURL[1].split("&").forEach(param => {
		params[param.split("=")[0]] = decodeURIComponent(param.split("=")[1]);
	});
	if(params.q !== undefined) {
		searchVals.query = params.q;
	}
	const url = fullURL[0].split("/");
	const page = (url[3] === "" || url[3] === undefined)?false:decodeURIComponent(url[3]);
	const subPage = (url[4] === "" || url[4] === undefined)?false:decodeURIComponent(url[4]);

	if(page === "admin") {
		return false;
	}
	
	document.querySelector("#mainTitle").addEventListener("click", e => {
		if(onePage) {
			load.content.startPage();
		} else {
			location.assign("/");
		}
	});
	// input-buy element class
	class InputBuyClass extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._valuePrice = null;
			this._valueAmount = null;
			this._valueId = null;
			this._price = document.createElement("SPAN");
			this._amountContainer = document.createElement("SPAN");
			this._amount = document.createElement("SPAN");
			this._amountButtonLower = document.createElement("SPAN");
			this._amountButtonLower.classList.add("material-symbols-outlined");
			this._amountButtonHigher = document.createElement("SPAN");
			this._amountButtonHigher.classList.add("material-symbols-outlined");
			this._totalCost = document.createElement("SPAN");
			this._style = document.createElement("LINK");
			this._style.rel = "stylesheet";
			this._style.href = "/css/input_buy.css";
			this._style2 = document.createElement("LINK");
			this._style2.rel = "stylesheet";
			this._style2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
		}
		static get observedAttributes() {
			return ["text"];
		}
		connectedCallback() {
			this.render();
		}
		attributeChangedCallback(name, oldValue, newValue) {
			// if(this.hasAttribute("preview")) {
			// 	this._img.style.display = "block";
			// } else {
			// 	this._img.style.display = "none";
			// }
			if (oldValue !== newValue) {
				this.render();
			}
		}
		set price(v) {
			v = Number(v);
			let upd = false;
			if((v >= 0)?v:0 !== this._valuePrice && this._valuePrice !== null) upd = true;
			this._valuePrice = (v >= 0)?v:0;
			if(upd) this.hasChanged();
		}
		get stock() {
			return this._valueStock;
		}
		set stock(v) {
			v = Number(v);
			let upd = false;
			if((v >= 0)?v:0 !== this._valueStock && this._valueStock !== null) upd = true;
			this._valueStock = (v >= 0)?v:0;
			if(upd) this.hasChanged();
		}
		get price() {
			return this._valuePrice;
		}
		set amount(v) {
			v = Number(Math.max(0, Math.min(Number(v), this._valueStock)));
			let upd = false;
			if(v !== null && v !== this._valueAmount) upd = true;
			this._valueAmount = v;
			if(upd) this.hasChanged();
		}
		get amount() {
			return this._valueAmount;
		}
		setup(stock, price, amount) {
			this._valueStock = Number(stock !== undefined?stock:0);
			this._valuePrice = Number(price !== undefined?price:0);
			this._valueAmount = Number(amount !== undefined?amount:0);
			this.render();
		}
		async updFromCart() {
			const ret = await cart.get(this._valueId);
			if(ret !== false) {
				if(ret[1] !== undefined) {
					this._valueAmount = ret[1];
					this.render();
				}
			}
		}
		hasChanged() {
			this.dispatchEvent(new CustomEvent('change', {
				detail: { amount: this._valueAmount, price: this._valuePrice, stock: this._valueStock },
				bubbles: true,
				composed: true
			}));
			this.render();
		}
		render() {
			if(this.shadowRoot.querySelector("SPAN") === null) {
				this.shadowRoot.appendChild(this._style);
				this.shadowRoot.appendChild(this._style2);

				this._amountButtonLower.textContent = "remove";
				this._amountButtonLower.addEventListener("click", e => {
					this.amount = this.amount-1;
					this.render();
				});
				this.shadowRoot.appendChild(this._amountButtonLower);

				this._amountContainer.appendChild(this._price);
				this._amountContainer.appendChild(this._amount);
				this._amountContainer.appendChild(this._totalCost);
				this.shadowRoot.appendChild(this._amountContainer);

				this._amountButtonHigher.textContent = "add";
				this._amountButtonHigher.addEventListener("click", e => {
					this.amount = this.amount+1;
					this.render();
				});
				this.shadowRoot.appendChild(this._amountButtonHigher);
			}
			this._price.textContent = this._valuePrice;
			this._amount.textContent = this._valueAmount;
			this._totalCost.textContent = Number(this._valueAmount)*Number(this._valuePrice);
		}
	}
	customElements.define("input-buy", InputBuyClass);
	class InputFilterClass extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._type = null;
			this._preType = null;
			this._id = false;
			this._min = 0;
			this._max = 100;
			this._alts = [];
			this._units = "";
			this._topBar = document.createElement("DIV");
			this._topBar.classList.add("topBar");
			this._name = document.createElement("SPAN");
			this._name.addEventListener("click", e => this.classList.toggle("open"));
			this._rangeVal1 = document.createElement("SPAN");
			this._rangeVal2 = document.createElement("SPAN");
			this._topBar.appendChild(this._rangeVal1);
			this._topBar.appendChild(this._name);
			this._topBar.appendChild(this._rangeVal2);
			this._container = document.createElement("SPAN");
			this._altContainer = document.createElement("SPAN");
			this._altContainer.classList.add("type_alt");
			this._altContainer.classList.add("alts");
			this.createAlt = txt => {
				const newAlt = document.createElement("SPAN");
				newAlt.textContent = txt;
				newAlt.classList.add("selected");
				newAlt.addEventListener("click", e => {
					if(newAlt.classList.contains("selected")) {
						newAlt.classList.remove("selected");
					} else {
						newAlt.classList.add("selected");
					}
				});
				this._altContainer.appendChild(newAlt);
			}
			this._container.appendChild(this._altContainer);
			this._rangeContainer = document.createElement("SPAN");
			this._rangeContainer.classList.add("type_range");

			this._rangeSlider = document.createElement("SPAN");
			this._rangeSlider.classList.add("slider");
			this._rangeBg = document.createElement("DIV");
			this._rangeBg.classList.add("bg");
			this._rangeSlider.appendChild(this._rangeBg);
			this._rangeFrom = document.createElement("DIV");
			this._rangeFrom.classList.add("drag");
			this._rangeFrom.classList.add("material-symbols-outlined");
			this._rangeFrom.textContent = "arrow_right";
			this._rangeFrom.style.left = "5px";
			this._rangeSlider.appendChild(this._rangeFrom);
			this._rangeTo = document.createElement("DIV");
			this._rangeTo.classList.add("drag");
			this._rangeTo.classList.add("material-symbols-outlined");
			this._rangeTo.textContent = "arrow_left";
			this._rangeTo.style.left = "145px";
			this._rangeSlider.appendChild(this._rangeTo);
			this._rangeContainer.appendChild(this._rangeSlider);

			this._rangeFromMove = false;
			this._rangeFromValue = 0;
			this._rangeFrom.addEventListener("mousedown", e => this._rangeFromMove = true);
			window.addEventListener("mousemove", e => {
				if(!this._rangeFromMove) return false;
				const parentPos = this._rangeSlider.getBoundingClientRect();
				let newPos = (e.clientX-parentPos.left)-5;
				newPos = Math.max(newPos, 5);
				newPos = Math.min(newPos, 10+(this._rangeToValue*140)-(15*140/100));
				this._rangeFromValue = (newPos-5)/140;
				this._rangeFrom.style.left = newPos+"px";
				this._rangeVal1.textContent = Math.round((this._rangeFromValue * (this._max-this._min)) + this._min)+this._units;
			});
			window.addEventListener("mouseup", e => this._rangeFromMove = false);
			this._rangeToMove = false;
			this._rangeToValue = 1;
			this._rangeTo.addEventListener("mousedown", e => this._rangeToMove = true);
			window.addEventListener("mousemove", e => {
				if(!this._rangeToMove) return false;
				const parentPos = this._rangeSlider.getBoundingClientRect();
				let newPos = (e.clientX-parentPos.left)-5;
				newPos = Math.max(newPos, (this._rangeFromValue*140)+(15*140/100));
				newPos = Math.min(newPos, 145);
				this._rangeToValue = (newPos-5)/140;
				this._rangeTo.style.left = newPos+"px";
				this._rangeVal2.textContent = Math.round((this._rangeToValue * (this._max-this._min)) + this._min)+this._units;
			});
			window.addEventListener("mouseup", e => this._rangeToMove = false);
			this._container.appendChild(this._rangeContainer);
			this._style2 = document.createElement("LINK");
			this._style2.rel = "stylesheet";
			this._style2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
			this._style = document.createElement("STYLE");
			this._style.textContent = `
				:host {
					display: flex;
					flex-direction: column;
					align-items: center;
					border: 1px solid var(--border);
					border-radius: 5px;
					background-color: var(--bg-secondary);
					padding: 5px;
					margin: 2px;
					overflow: hidden;
					transition: background-color 200ms;
				}
				:host(:not(.open)) > span, :host(:not(.open)) > div:not(.topBar), :host(:not(.open)) > .topBar > span:not(:nth-of-type(2)) {
					display: none;
				}
				.topBar {
					display: flex;
					gap: 5px;
				}
				.topBar > span:not(:nth-of-type(2)) {
					font-size: 10pt;
				}
				.topBar > span:nth-of-type(2) {
					user-select: none;
					cursor: pointer;
					padding: 2px;
					background-color: var(--bg-secondary);
					color: var(--text-third);
					transition: background-color 200ms, color 200ms;
				}
				.topBar > span:nth-of-type(2):hover {
					background-color: var(--bg-secondary-hover2);
					color: var(--text-hover);
				}
				span:not(.alt) .type_alt {
					display: none;
				}
				span:not(.range) .type_range {
					display: none;
				}
				.type_range {
					display: grid;
					grid-template-columns: 1fr;
					justify-items: center;
				}
				.slider {
					position: relative;
					user-select: none;
				}
				.slider .bg {
					height: 20px;
					width: 160px;
					margin: 2px;
					background-color: var(--bg);
					border-radius: 10px;
				}
				.slider .drag {
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					height: 15px;
					width: 15px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--bg);
					background-color: var(--text);
				}
				.slider .drag {
					border-radius: 10px 0px 0px 10px;
				}
				.slider .drag:last-of-type {
					border-radius: 0px 10px 10px 0px;
				}
				.slider .drag:hover {
					background-color: var(--text-hover);
				}
				.alts {
					display: flex;
					flex-wrap: wrap;
					gap: 3px;
					max-width: 250px;
					padding: 5px 0px;
					justify-content: center;
				}
				.alts span {
					padding: 5px;
					background-color: var(--bg);
					border-radius: 5px;
					font-size: 10pt;
					border: 1px solid rgba(0,0,0,0);
					cursor: pointer;
					transition: background-color 200ms;
				}
				.alts span:hover {
					background-color: var(--bg-secondary-hover2);
				}
				.alts span.selected {
					background-color: var(--bg-third);
					color: var(--text-third);
					border-color: var(--border-third);
				}
				.range {
					display: flex;
					flex-direction: column;
					align-items: center;
				}
			`;
		}
		static get observedAttributes() {
			return ["text"];
		}
		connectedCallback() {
			this.render();
		}
		attributeChangedCallback(name, oldValue, newValue) {
			if (oldValue !== newValue) {
				this.render();
			}
		}
		get value() {
			if(!this.classList.contains("open")) return false;
			if(this._type === "range") {
				function mapVals(value, inMin, inMax, outMin, outMax) {
					return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))
				}
				return {
					id:		this._id,
					from:	mapVals(this._rangeFromValue, 0, 1, this._min, this._max), 
					to:		mapVals(this._rangeToValue, 0, 1, this._min, this._max)
				};
			} else if(this._type === "alts") {
				return {id: this._id, value: [...this._altContainer.querySelectorAll("span.selected")].map(el => el.textContent).join(",")};
			} else {
				return false;
			}
		}
		set value(v = false) {
			if(v === false) return false;
			this._id = v.id;
			if(v.filter_type === "values") {
				this._type = "alts";
				this._container.classList.add("alt");
				this._container.classList.remove("range");
				this._altContainer.innerHTML = "";
				const vals = v.vals.split(",");
				for(let val of vals) {
					this.createAlt(val);
				}
			} else if(v.filter_type === "types") {
				this._type = "range";
				this._container.classList.add("range");
				this._container.classList.remove("alt");
				this._min = v.min;
				this._max = v.max;
				this._units = v.units;
				// this._rangeFrom.value = Math.round((Number(v.max)-Number(v.min))/2);
				this._rangeVal1.textContent = this._min+this._units;
				this._rangeVal2.textContent = this._max+this._units;
			}
			this._name.textContent = v.title;
			this.render();
		}
		render() {
			if(this.shadowRoot.querySelector("span") === null) {
				this.shadowRoot.appendChild(this._style);
				this.shadowRoot.appendChild(this._style2);
				this.shadowRoot.appendChild(this._topBar);
				this.type = "none";
				this._container.appendChild(this._altContainer);
				this._container.appendChild(this._rangeContainer);
				this.shadowRoot.appendChild(this._container);
			}
		}
	}
	customElements.define("filter-input", InputFilterClass);

	const load = {
		resource: async (url, type = "GET", body = {}) => {
			const options = {
				method: type,
				credentials: "include",
				headers: { "Content-Type": "application/json" }
			};
			if(["POST", "PATCH"].indexOf(type) !== -1) options.body = JSON.stringify(body);
			try {
				const data = await fetch("http://localhost:3000/"+url, options).then(res => res.json());
				return (data?.state === true)?(data.data ?? true):false;
			} catch(e) {
				return false;
			}
		}, categories: async () => {
			return await load.resource("api/shop/categories");
		}, subCategories: async (cat = "*") => {
			return await load.resource("api/shop/categories/"+cat);
		}, products: async (category = "*") => {
			return await load.resource("api/shop/"+category+"?sortBy="+searchVals.order+"&order="+searchVals.dir+"&limit="+searchVals.limit+"&page="+searchVals.page+"&filter="+searchVals.filter+"&q="+searchVals.query);
		}, productsSearch: async (category = "*", filter = {}, sortBy = "price", sortDirection = "ASC") => {
			return await load.resource("api/shop/"+category+"");
		}, product: async id => {
			return await load.resource("api/shop/info/"+id);
		}, cart: async () => {
			return await load.resource("api/cart");
		},
		content: {
			products: async (cat = false) => {
				const main = document.querySelector("#page");
				main.classList.remove("checkoutPage");
				main.innerHTML = "";
				main.classList.remove("single");
				document.querySelector("#pageHeader").textContent = ((cat===false)?"Sök":cat) + ((searchVals.query==="")?"":(": \""+searchVals.query+"\""));
				const productsContainer = document.createElement("DIV");
				productsContainer.classList.add("productsContainer");
				let data = [];
				if(cat !== false) {
					data = await load.products(cat);
				} else {
					data = await load.products();
				}
				if(data === false) return false;
				let products = data.products;
				const filters = data.filters;
				const filterContainer = document.createElement("DIV");
				filterContainer.classList.add("filterContainer");

				let sortData = {
					column: "price",
					order: "ASC"
				};
				const sort = document.createElement("SELECT");
				const sortNames = { title: "Titel", price: "Pris", added: "Tillagd" };
				["title", "price", "added"].forEach(sortByColumn => {
					const option = document.createElement("OPTION");
					option.textContent = sortNames[sortByColumn];
					option.value = sortByColumn;
					if(sortByColumn === "price") {
						option.selected = true;
					}
					sort.appendChild(option);
				});
				sort.addEventListener("change", async e => {
					sortData.column = sort.value;
					searchVals.order = sortData.column;
					searchVals.dir = sortData.order;
					console.log("CHANGE", cat);
					products = await load.products(cat===false?"*":cat);
					drawProducts(products.products);
				});
				filterContainer.appendChild(sort);
				const sortOrder = document.createElement("SPAN");
				sortOrder.classList.add("material-symbols-outlined");
				sortOrder.classList.add("sortOrderButton");
				sortOrder.textContent = "arrow_downward";
				sortOrder.addEventListener("click", async e => {
					if(sortData.order === "ASC") {
						sortData.order = "DESC";
						sortOrder.textContent = "arrow_upward";
					} else {
						sortData.order = "ASC";
						sortOrder.textContent = "arrow_downward";
					}
					searchVals.dir = sortData.order;
					products = await load.products(cat===false?"*":cat);
					drawProducts(products.products);
				});
				filterContainer.appendChild(sortOrder);
				const subFilterContainer = document.createElement("SPAN");
				subFilterContainer.classList.add("filterList");
				const subSubFilterContainer = document.createElement("SPAN");
				const subSubSubFilterContainer = document.createElement("SPAN");
				const subFilterButton = document.createElement("SPAN");
				subFilterButton.classList.add("button");
				subFilterButton.textContent = "Filter";
				subFilterButton.addEventListener("click", e => {
					subFilterContainer.classList.toggle("open");
					if(subFilterContainer.classList.contains("open")) {
						subFilterButton.classList.add("on");
					} else {
						subFilterButton.classList.remove("on");
					}
				});
				filterContainer.appendChild(subFilterButton);
				const filterData = await load.resource("api/shop/filters?ids="+filters.map(filter => filter.id).join(","));
				for(filter of filterData) {
					if(filter.filter_type === "types") {
						let min = Infinity;
						let max = -Infinity;
						for(product of products) {
							if(product.filters === null) continue;
							const fList = product.filters.split("|").map(f => f.split(":"));
							for(let f of fList) {
								if(Number(f[0]) === filter.id) {
									if(Number(f[1]) < min) min = Number(f[1]);
									if(Number(f[1]) > max) max = Number(f[1]);
								}
							}
						}
						filter.min = Math.max(min, filter.min);
						filter.max = Math.min(max, filter.max);
					}
					const filterElement = document.createElement("filter-input");
					filterElement.value = filter;
					subSubSubFilterContainer.appendChild(filterElement);
				}
				subSubFilterContainer.appendChild(subSubSubFilterContainer);
				subFilterContainer.appendChild(subSubFilterContainer);
				filterContainer.appendChild(subFilterContainer);
				const filterApply = document.createElement("SPAN");
				filterApply.classList.add("button");
				filterApply.textContent = "Uppdatera produkter";
				filterApply.style.whiteSpace = "nowrap";
				filterContainer.appendChild(filterApply);
				filterApply.addEventListener("click", async e => {
					const filterValues = [...filterContainer.querySelectorAll("filter-input")].map(el => el.value).filter(val => val !== false).map(val => {
						if(val.value === undefined) {
							val.value = val.from+"_"+val.to;
							val.type = "int";
						} else {
							val.type = "str";
						}
						return val;
					}).map(val => val.id+">>>"+val.type+">>>"+val.value).join("|||");
					searchVals.filter = filterValues;
					products = await load.products(cat===false?"*":cat);

					drawProducts(products.products);
				});
				main.appendChild(filterContainer);
				
				const drawProducts = (list) => {
					productsContainer.innerHTML = "";
					list.forEach(product => {
						const container = document.createElement("DIV");
						container.addEventListener("click", e => {
							if(onePage) {
								load.content.product(product.id);
							} else {
								location.assign("/product/"+product.id);
							}
						});
						container.classList.add("product");
						if(product.stock_quantity <= 0) {
							container.classList.add("emptyStock");
						}
						const title = document.createElement("SPAN");
						title.classList.add("productTitle");
						title.textContent = product.title;
						const footer = document.createElement("SPAN");
						footer.classList.add("productFooter");
						const shortDesc = document.createElement("SPAN");
						shortDesc.classList.add("productShortDesc");
						shortDesc.textContent = product.short_description;
						const img = document.createElement("IMG");
						img.classList.add("productImage");
						img.src = "/product_images/"+product.image
						const price = document.createElement("SPAN");
						price.classList.add("productPrice");
						price.textContent = product.price;
						const amount = cart.get(product.id);
						container.appendChild(img);
						container.appendChild(title);
						footer.appendChild(shortDesc);
						footer.appendChild(price);
						if(amount !== false) {
							const inCart = document.createElement("SPAN");
							inCart.classList.add("productInCart");
							// inCart.textContent = amount[1];
							const textNode = document.createTextNode(amount[1]);
							const icon = document.createElement("SPAN");
							icon.classList.add("material-symbols-outlined");
							icon.textContent = "shopping_cart";
							inCart.appendChild(icon);
							inCart.appendChild(textNode);
							footer.appendChild(inCart);
						}
						container.appendChild(footer);
						productsContainer.appendChild(container);
					});
				}
				drawProducts(products);
				main.appendChild(productsContainer);
			},
			product: async id => {
				let product = await load.product(id);
				if(product === false) {
					popup.open("Kunde inte hitta produkten.");
					return false;
				}
				let filters = [];
				if(product.filters !== null) {
					filters = product.filters.split("|").map(filter => {
						return {
							id: filter.split(":")[0],
							value: filter.split(":")[1]
						};
					});
					const filterData = await load.resource("api/shop/filters?ids="+filters.map(filter => filter.id).join(","));
					filters = filters.map(filter => {
						for(let check of filterData) {
							if(check.id === Number(filter.id)) {
								return {
									title: check.title,
									value: filter.value,
									unit: check.units
								};
							}
						}
					});
				}
				
				const header = document.querySelector("#pageHeader");
				header.textContent = product.title;
				const main = document.querySelector("#page");
				main.classList.remove("checkoutPage");
				main.innerHTML = "";
				main.classList.add("single");

				const topContainer = document.createElement("DIV");
				topContainer.classList.add("topContainer");
				const leftContainer = document.createElement("DIV");
				leftContainer.classList.add("leftContainer");
				const rightContainer = document.createElement("DIV");
				rightContainer.classList.add("rightContainer");
				const bottomContainer = document.createElement("DIV");
				bottomContainer.classList.add("bottomContainer");

				const shortDesc = document.createElement("H3");
				shortDesc.textContent = product.short_description;
				
				const img = document.createElement("img");
				img.src = "/product_images/"+product.image;
				img.addEventListener("click", e => {
					const inpWindow = document.createElement("DIV");
					inpWindow.classList.add("fullscreen");
					const imgContainer = document.createElement("SPAN");
					imgContainer.classList.add("fullscreenImage");
					const img = document.createElement("IMG");
					img.src = "/product_images/"+product.image;
					imgContainer.appendChild(img);
					imgContainer.addEventListener("click", e => {
						inpWindow.parentNode.removeChild(inpWindow);
					});
					inpWindow.appendChild(imgContainer);
					document.querySelector("body").appendChild(inpWindow);
				});
				
				const longDesc = document.createElement("p");
				longDesc.textContent = product.full_description;
				
				const filtersText = document.createElement("SPAN");
				filtersText.classList.add("productFilters");
				for(let f of filters) {
					console.log(f);
					const filter = document.createElement("SPAN");
					const filterText = document.createElement("SPAN");
					filterText.textContent = f.title;
					const filterValue = document.createElement("SPAN");
					filterValue.textContent = f.value+((f.unit === null)?"":f.unit);
					filter.appendChild(filterText);
					filter.appendChild(filterValue);
					filtersText.appendChild(filter);

				}

				const buyInput = document.createElement("input-buy");
				buyInput.addEventListener("change", async e => {
					const amount = e.detail.amount;
					await cart.set(id, amount);
				});
				buyInput._valueId = String(id);
				buyInput.setup(product.stock_quantity, product.price, (cart.get(id) !== false)?cart.get(id)[1]:0);
				
				leftContainer.appendChild(img);
				rightContainer.appendChild(shortDesc);
				rightContainer.appendChild(filtersText);
				rightContainer.appendChild(buyInput);
				topContainer.appendChild(leftContainer);
				topContainer.appendChild(rightContainer);
				bottomContainer.appendChild(longDesc);
				main.appendChild(topContainer);
				main.appendChild(bottomContainer);
			},
			startPage: () => {
				const pageHeader = document.querySelector("#pageHeader");
				pageHeader.textContent = "Välkommen";
				const main = document.querySelector("#page");
				main.classList.add("startPage");
				main.classList.remove("checkoutPage");
				main.classList.remove("single");
				const content = document.createElement("P");
				content.textContent = "Välkommen till denna Webbshop. Här hittar du lite allt möjligt inom hemelektronik.";
				main.appendChild(content);
			}
		}
	};
	document.querySelector("#mainMenu").textContent = "Laddar...";
	const data = {
		categoryTree: await load.subCategories()
	};
	let cart = {
		data: (await load.cart()) || [],
		set: async (id, amount) => {
			id = String(id);
			let row = null;
			for(let dataRow in cart.data) {
				const d = cart.data[dataRow];
				if(d[0] === id) {
					row = dataRow;
					break;
				}
			}
			if(row === null) {
				cart.data.push([id, amount]);
			} else {
				if(amount === 0) {
					cart.data.splice(row, 1);
				} else {
					cart.data[row][1] = amount;
				}
			}
			const state = await load.resource("api/cart", "POST", {
				cart: cart.data
			});
			if(state !== false) {
				cart.draw();
			}
		},
		get: id => {
			try {
				for(let dataRow in cart.data) {
					const d = cart.data[dataRow];
					if(d[0] === id) {
						return cart.data[dataRow];
					}
				}
				return false;
			} catch(e) {
				console.log(e);
				return false;
			}
		},
		clear: async () => {
			const state = await load.resource("api/cart", "DELETE");
			if(state !== false) {
				cart.data = [];
				const cont = document.querySelector("#page.single");
				if(cont !== null) {
					cont.querySelector("input-buy").amount = 0;
				}
				location.reload();
			}
			return popup.open("Kunde inte nollställa kundvagnen.");
		},
		draw: async () => {
			const cartContainer = document.querySelector("#cartItems");
			const cartData = await load.resource("api/cart/details");
			cartContainer.innerHTML = "";
			let sum = 0;
			cartData.forEach(item => {
				item.price = Number(item.price);
				const itemContainer = document.createElement("DIV");
				const title = document.createElement("SPAN");
				title.textContent = item.title;
				const decr = document.createElement("SPAN");
				decr.classList.add("material-symbols-outlined");
				decr.classList.add("cartButton");
				decr.textContent = "remove";
				decr.addEventListener("click", e => {
					if(page !== "check-out") {
						cart.set(item.id, item.amount-1);
						if(String(item.id) === subPage) {
							document.querySelector("input-buy").updFromCart();
						}
					}
				});
				const amount = document.createElement("SPAN");
				amount.textContent = item.amount;
				const inc = document.createElement("SPAN");
				inc.classList.add("material-symbols-outlined");
				inc.classList.add("cartButton");
				inc.textContent = "add";
				inc.addEventListener("click", e => {
					if(page !== "check-out") {
						cart.set(item.id, (item.amount+1 > item.stock)?item.amount:(item.amount+1));
						if(String(item.id) === subPage) {
							document.querySelector("input-buy").updFromCart();
						}
					}
				});
				const price = document.createElement("SPAN");
				price.textContent = item.price;
				const itemTotal = document.createElement("SPAN");
				itemTotal.textContent = item.amount * item.price;
				sum += item.amount * item.price;
				itemContainer.appendChild(title);
				itemContainer.appendChild(decr);
				itemContainer.appendChild(amount);
				itemContainer.appendChild(inc);
				itemContainer.appendChild(price);
				itemContainer.appendChild(itemTotal);
				cartContainer.appendChild(itemContainer);
			});
			const total = document.querySelector("#cartTotal");
			total.textContent = sum;
		},
		drawPay: async () => {
			const pageHeader = document.querySelector("#pageHeader");
			pageHeader.textContent = "Kassa";
			const main = document.querySelector("#page");
			main.classList.add("checkoutPage");
			if(cart.data.length <= 0) {
				const info = document.createElement("P");
				info.textContent = "Din kundvagn är tom!";
				main.appendChild(info);
				return false;
			}

			const cartHeader = document.createElement("h3");
			cartHeader.textContent = "Uppgifter";
			main.appendChild(cartHeader);
			const inputName = document.createElement("INPUT");
			inputName.id = "inputName";
			inputName.placeholder = "Namn";
			const inputEmail = document.createElement("INPUT");
			inputEmail.id = "inputEmail";
			inputEmail.placeholder = "Epost";
			const inputPhone = document.createElement("INPUT");
			inputPhone.id = "inputPhone";
			inputPhone.placeholder = "Telefonnummer";
			const inputAddress = document.createElement("INPUT");
			inputAddress.id = "inputAddress";
			inputAddress.placeholder = "Adress";
			const inputPostal = document.createElement("INPUT");
			inputPostal.id = "inputPostal";
			inputPostal.placeholder = "Postnummer";
			const inputCity = document.createElement("INPUT");
			inputCity.id = "inputCity";
			inputCity.placeholder = "Stad";
			const container1 = document.createElement("DIV");
			const container2 = document.createElement("DIV");
			container1.appendChild(inputName);
			container1.appendChild(inputEmail);
			container1.appendChild(inputPhone);
			container2.appendChild(inputAddress);
			container2.appendChild(inputPostal);
			container2.appendChild(inputCity);
			main.appendChild(container1);
			main.appendChild(container2);
			
			const saveInfo = document.createElement("BUTTON");
			saveInfo.textContent = "Spara uppgifter";
			main.appendChild(saveInfo);

			const deliveryHeader = document.createElement("h3");
			deliveryHeader.textContent = "Leverans";
			const deliveryContent = document.createElement("DIV");
			deliveryContent.id = "deliveryContent";
			deliveryContent.classList.add("disabled");

			const servicesContainer = document.createElement("DIV");
			servicesContainer.id = "serviceContainer";
			const pointsContainer = document.createElement("DIV");
			pointsContainer.id = "pointsContainer";
			deliveryContent.appendChild(servicesContainer);
			deliveryContent.appendChild(pointsContainer);

			const payHeader = document.createElement("h3");
			payHeader.textContent = "Betalning";
			const payContainer = document.createElement("DIV");
			payContainer.id = "payContainer";
			payContainer.classList.add("disabled");

			const finalButton = document.createElement("BUTTON");
			finalButton.textContent = "beställ";
			finalButton.disabled = true;

			main.appendChild(deliveryHeader);
			main.appendChild(deliveryContent);
			main.appendChild(payHeader);
			main.appendChild(payContainer);
			main.appendChild(finalButton);

			// payContainer
			let payInputs = ["Namn", "Kortnummer", "Giltigt till (YY/MM)", "CVC"];
			payInputs = payInputs.map(txt => {
				const el = document.createElement("INPUT");
				el.placeholder = txt;
				payContainer.appendChild(el)
				return el;
			});
			
			saveInfo.addEventListener("click", e => {
				payContainer.classList.add("disabled");
				finalButton.disabled = true;
				let ok = true;
				const checks = [
					inputName,
					inputEmail,
					inputPhone,
					inputAddress,
					inputPostal,
					inputCity
				];
				// DEBUG
				for(let check of checks) {
					check.value = "12345";
				}
				checks[1].value = "test@test.com";
				checks[4].value = "12345";
				// END DEBUG
				if(deliveryContent.classList.contains("disabled")) {
					for(let check of checks) {
						let shortOk = true;
						if(check.value === "") {
							shortOk = false;
							popup.open("Du måste fylla i alla  uppgifter.");
							check.classList.add("warning");
						}
						if(check === inputEmail) {
							if(check.value.indexOf("@") === -1) {
								shortOk = false;
								popup.open("Du måste fylla i en korrekt epost.");
								check.classList.add("warning");
							}
						}
						if(shortOk === false) {
							ok = false;
						}
						if(shortOk === true) {
							check.classList.remove("warning");
						}
					}
				} else {
					deliveryContent.classList.add("disabled");
					for(let check of checks) {
						check.disabled = false;
					}
					ok = false;
				}
				if(ok === true) {
					for(let check of checks) {
						check.disabled = true;
					}
					deliveryContent.classList.remove("disabled");
					deliveryContent.innerHTML = "";
					servicesContainer.innerHTML = "";
					pointsContainer.innerHTML = "";
					const services = [
						"Postnord",
						"DHL"
					];
					services.forEach(service => {
						const serviceChoice = document.createElement("DIV");
						serviceChoice.textContent = service;
						const serviceChoiceIcon = document.createElement("SPAN");
						serviceChoiceIcon.classList.add("material-symbols-outlined");
						serviceChoice.insertBefore(serviceChoiceIcon, serviceChoice.firstChild);
						serviceChoice.addEventListener("click", async e => {
							payContainer.classList.add("disabled");
							finalButton.disabled = true;
							const els = servicesContainer.querySelectorAll("div");
							[...els].forEach(el => {
								el.classList.remove("selected");
							});
							serviceChoice.classList.add("selected");

							const points = await load.resource("api/delivery/points/"+service+"/"+inputPostal.value);
							if(points !== false) {
								pointsContainer.innerHTML = "";
								points.forEach(point => {
									const pointChoice = document.createElement("DIV");
									pointChoice.textContent = point;
									const pointChoiceIcon = document.createElement("SPAN");
									pointChoiceIcon.classList.add("material-symbols-outlined");
									pointChoice.insertBefore(pointChoiceIcon, pointChoice.firstChild);
									pointChoice.addEventListener("click", async e => {
										payContainer.classList.remove("disabled");
										finalButton.disabled = false;
										const els2 = pointsContainer.querySelectorAll("div");
										[...els2].forEach(el2 => {
											el2.classList.remove("selected");
										});
										pointChoice.classList.add("selected");
										payInputs[0].value = "asdf";
										payInputs[1].value = "1234123412341234";
										payInputs[2].value = "02/09";
										payInputs[3].value = "213";
									});
									pointsContainer.appendChild(pointChoice);
								});
								deliveryContent.appendChild(pointsContainer);
							}
						});
						servicesContainer.appendChild(serviceChoice);
					});
					deliveryContent.appendChild(servicesContainer);
				}
			});

			// Pay-inputs events
			payInputs[1].addEventListener("keyup", e => {
				if(payInputs[1].value.length === 16) {
					payInputs[1].classList.remove("warning");
				} else {
					payInputs[1].classList.add("warning");
				}
			});
			payInputs[2].addEventListener("keyup", e => {
				if(
					payInputs[2].value.length === 5 && 
					payInputs[2].value[2] === "/" && 
					Number(payInputs[2].value.slice(3, 5)) <= 12 && 
					Number(payInputs[2].value.slice(3, 5)) > 0) {
					payInputs[2].classList.remove("warning");
				} else {
					payInputs[2].classList.add("warning");
				}
			});
			payInputs[3].addEventListener("keyup", e => {
				if(payInputs[3].value.length === 3) {
					payInputs[3].classList.remove("warning");
				} else {
					payInputs[3].classList.add("warning");
				}
			});
			finalButton.addEventListener("click", async e => {
				let ok = true;
				for(let el of payInputs) {
					el.classList.remove("warning");
					if(el.value.trim() === "") {
						ok = false;
						el.classList.add("warning");
					}
				}
				if(payInputs[1].value.length != 16) {
					payInputs[1].classList.add("warning");
					ok = false;
				}
				if(payInputs[2].value.length != 5) {
					payInputs[2].classList.add("warning");
					ok = false;
				}
				if(payInputs[2].value.length !== 5 || payInputs[2].value[2] !== "/" ||  Number(payInputs[2].value.substring(3, 5)) > 12 || Number(payInputs[2].value.substring(3, 5)) < 1) {
					payInputs[3].classList.add("warning");
					ok = false;
				}
				if(ok === false) {
					popup.open("Alla kortdetaljer måste fyllas i korrekt.")
				} else {
					const postData = {
						name:		inputName?.value,
						mail:		inputEmail?.value,
						phone:		inputPhone?.value,
						address:	inputAddress?.value,
						postal:		inputPostal?.value,
						city:		inputCity?.value,
						service:	servicesContainer.querySelector(".selected")?.textContent,
						point:		pointsContainer.querySelector(".selected")?.textContent,
						cardName:	payInputs[0].value,
						cardNumber:	payInputs[1].value,
						cardDate:	payInputs[2].value,
						cardCVC:	payInputs[3].value
					};
					for(let c in postData) {
						if(postData[c].trim() === "") {
							popup.open("Något gick fel. Se över alla uppgifter och försök igen.");
							return false;
						}
					}
					const ok = await load.resource("api/cart/order", "POST", postData);
					if(ok === false) {
						popup.open("Något gick fel.");
						return false;
					}
					location.assign("/success/"+ok.ref);
				}
			});
		}
	};
	cart.draw();
	document.querySelector("#cartClear").addEventListener("click", async e => {
		await cart.clear();
	});
	document.querySelector("#cartPay").addEventListener("click", async e => {
		if(onePage) {
			cart.drawPay();
		} else {
			location.assign("/check-out");
		}
	});
	const mainMenu = document.querySelector("#mainMenu");
	const createMainMenuTreeItem = (itemName, item, level) => {
		const ul = document.createElement("ul");
		let open = false;
		if(page === "browse" && subPage !== false) {
			if(subPage === itemName) {
				open = true;
			}
		}
		Object.entries(item).forEach(([key, value]) => {
			if (key === "__COUNT") return;
			const li = document.createElement("li");
			const content = document.createElement("SPAN");
			content.classList.add("menuItem");
			const txt = document.createElement("SPAN");
			txt.style.paddingLeft = Math.round(level*15)+"px"
			txt.classList.add("menuItemText");
			txt.textContent = key;//+"("+value._COUNT+")";
			txt.addEventListener("click", e => {
				if(onePage) {
					load.content.products(key);
					mainMenu.classList.remove("open");
				} else {
					location.assign("/browse/"+key);
				}
			});
			content.appendChild(txt);
			let link = null;
			if(value?.__COUNT !== undefined) {
				link = document.createElement("SPAN");
				link.classList.add("menuItemLink");
				link.classList.add("material-symbols-outlined");
				link.textContent = "keyboard_arrow_right";
				link.addEventListener("click", e => {
					link.parentNode.parentNode.classList.toggle("open");
					if(link.parentNode.parentNode.classList.contains("open")) {
						link.textContent = "keyboard_arrow_down";
					} else {
						link.textContent = "keyboard_arrow_right";
					}
				});
				content.appendChild(link);
			} else {
				if(page === "browse" && subPage !== false) {
					if(subPage === key) {
						li.classList.add("open");
						open = true;
					}
				}
			}
			li.appendChild(content);
			if (value && typeof value === "object") {
				const ret = createMainMenuTreeItem(key, value, level+1);
				if(ret[1] === true) {
					open = true;
					li.classList.add("open");
					if(link !== null) {
						if(li.classList.contains("open")) {
							link.textContent = "keyboard_arrow_down";
						} else {
							link.textContent = "keyboard_arrow_right";
						}
					}
				}
				li.appendChild(ret[0]);
			}
			ul.appendChild(li);
		});
    	return [ul, open];
	};
	mainMenu.innerHTML = "";
	const searchBar = document.createElement("INPUT");
	searchBar.placeholder = "Sök";
	searchBar.addEventListener("keyup", e => {
		if(e.key === "Enter") {
			if(searchBar.value.trim() !== "") {
				location.assign("/browse/"+(subPage===false?"":subPage)+"?q="+searchBar.value);
			}
		}
	});
	mainMenu.appendChild(searchBar);
	const mainMenuItems = createMainMenuTreeItem("all", data.categoryTree, 0.5)[0];
	const createMainMenuItem = (txt, icon = false) => {
		const li = document.createElement("LI");
		const container = document.createElement("SPAN");
		container.classList.add("menuItem");
		if(icon !== false) {
			const iconElement = document.createElement("SPAN");
			iconElement.classList.add("material-symbols-outlined");
			iconElement.textContent = icon;
			container.appendChild(iconElement);
		}
		const text = document.createElement("SPAN");
		text.classList.add("menuItemText");
		text.style.paddingLeft = "8px";
		text.textContent = txt;
		container.appendChild(text);
		li.appendChild(container);
		mainMenuItems.appendChild(li);
		return { li: li, container: container, text: text };
	};
	const userStatus = await load.resource("api/check");
	if(userStatus?.loggedIn === false) {
		const mainMenuUser = createMainMenuItem("Logga in", "login");
		mainMenuUser.container.addEventListener("click", e => {
			location.assign("/login");
		});
		const mainMenuReg = createMainMenuItem("Registrera konto", "person_add");
		mainMenuReg.container.addEventListener("click", e => {
			location.assign("/register");
		});
	} else {
		const mainMenuUser = createMainMenuItem(userStatus.loggedIn, "person");
		mainMenuUser.container.addEventListener("click", e => {
			location.assign("/user");
		});
		const mainMenuOrders = createMainMenuItem("Ordrar", "orders");
		mainMenuOrders.container.addEventListener("click", e => {
			location.assign("/orders");
		});
		const mainMenuUserLogout = createMainMenuItem("Logga ut", "logout");
		mainMenuUserLogout.container.addEventListener("click", async e => {
			const state = await load.resource("api/logout", "POST");
			if(state === true) {
				location.assign("/");
			}
		});
	}

	mainMenu.appendChild(mainMenuItems);
	const mainMenuButton = document.querySelector("#mainMenuButton");
	mainMenuButton.addEventListener("click", e => {
		if(mainMenu.classList.contains("open")) {
			mainMenu.classList.remove("open");
		} else {
			mainMenu.classList.add("open");
		}
	});
	const cartMenuButton = document.querySelector("#cartMenuButton");
	const cartContainer = document.querySelector("#cart");
	cartMenuButton.addEventListener("click", e => {
		if(cartContainer.classList.contains("open")) {
			cartContainer.classList.remove("open");
		} else {
			cartContainer.classList.add("open");
		}
	});
	// draw correct page
	if(onePage === false) {
		if(page === "browse") {
			load.content.products(subPage);
			mainMenu.classList.remove("open");
		} else if(page === "product" && subPage !== false) {
			load.content.product(subPage);
		} else if(page === "login") {
			const mainHeader = document.querySelector("#pageHeader");
			mainHeader.textContent = "Logga in";
			const main = document.querySelector("#page");
			main.innerHTML = "";
			const username = document.createElement("INPUT");
			username.placeholder = "E-post";
			const password = document.createElement("INPUT");
			password.placeholder = "Lösenord";
			password.type = "password";
			const sendButton = document.createElement("BUTTON");
			sendButton.textContent = "Logga in";
			sendButton.addEventListener("click", async e => {
				if(username.value.trim() === "" || password.value.trim() === "") {
					popup.open("Du måste fylla i e-post och lösenord");
					return false;
				}
				const ret = await load.resource("api/login", "POST", {
					username: username.value,
					password: password.value
				});
				if(ret !== false) {
					location.assign("/");
				} else {
					popup.open("Du har fyllt i fel användarnamn och/eller lösenord!");
				}
			});
			main.appendChild(username);
			main.appendChild(password);
			main.appendChild(sendButton);
		} else if(page === "register") {
			const mainHeader = document.querySelector("#pageHeader");
			mainHeader.textContent = "Registrera nytt konto";
			const main = document.querySelector("#page");
			main.innerHTML = "";
			const fname = document.createElement("INPUT");
			fname.placeholder = "Förnamn";
			const lname = document.createElement("INPUT");
			lname.placeholder = "Efternamn";
			const phone = document.createElement("INPUT");
			phone.placeholder = "Telefonnummer";
			const username = document.createElement("INPUT");
			username.placeholder = "E-post";
			const password = document.createElement("INPUT");
			password.placeholder = "Lösenord";
			password.type = "password";
			const vpassword = document.createElement("INPUT");
			vpassword.placeholder = "Lösenord igen";
			vpassword.type = "password";
			const sendButton = document.createElement("BUTTON");
			sendButton.textContent = "Skapa konto";
			sendButton.addEventListener("click", async e => {
				if(username.value.trim() === "" || password.value.trim() === "") {
					popup.open("Du måste fylla i e-post och lösenord");
					return false;
				}
				if(password.value.trim() === vpassword.value.trim()) {
					const ret = await load.resource("api/register", "POST", {
						mail:		username.value,
						password:	password.value,
						fname:		fname.value,
						lname:		lname.value,
						phone:		phone.value
					});
					if(ret !== false) {
						location.assign("/login");
					}
				} else {
					popup.open("Lösenorden måste vara samma.")
				}
			});
			main.appendChild(fname);
			main.appendChild(lname);
			main.appendChild(username);
			main.appendChild(phone);
			main.appendChild(password);
			main.appendChild(vpassword);
			main.appendChild(sendButton);
		} else if(page === "user") {
			if(userStatus.loggedIn === false) location.assign("/");
			const userData = await load.resource("api/me");
			console.log(userData);
			const mainHeader = document.querySelector("#pageHeader");
			mainHeader.textContent = "Hej, "+(userData?.first_name ?? "okänd")+"!";
			const main = document.querySelector("#page");
			main.innerHTML = "";
			main.classList.add("userPage");

			const nameLabel = document.createElement("P");
			nameLabel.textContent = "Namn";
			const name = document.createElement("P");
			name.textContent = userData?.first_name+" "+userData?.last_name;
			main.appendChild(nameLabel);
			main.appendChild(name);

			const mailLabel = document.createElement("P");
			mailLabel.textContent = "Epost (användarnamn)";
			const mail = document.createElement("P");
			mail.textContent = userData?.email;
			main.appendChild(mailLabel);
			main.appendChild(mail);

			const phoneLabel = document.createElement("P");
			phoneLabel.textContent = "Telefonnummer";
			const phone = document.createElement("P");
			phone.textContent = userData?.phonenumber;
			main.appendChild(phoneLabel);
			main.appendChild(phone);

			const passwordLabel = document.createElement("P");
			passwordLabel.textContent = "Byt lösenord:";
			const empty = document.createElement("P");
			const nowPassword = document.createElement("INPUT");
			nowPassword.type = "password";
			nowPassword.placeholder = "Nuvarande lösenord";
			const newPassword = document.createElement("INPUT");
			newPassword.type = "password";
			newPassword.placeholder = "Nytt lösenord";
			main.appendChild(passwordLabel);
			main.appendChild(empty);
			main.appendChild(nowPassword);
			main.appendChild(newPassword);
			const passwordButton = document.createElement("BUTTON");
			passwordButton.textContent = "Byt lösenord"
			passwordButton.addEventListener("click", async e => {
				const state = await load.resource("api/changePassword", "PATCH", {
					password: newPassword.value.trim()
				});
				if(state === true) {
					popup.open("Lösenordet är nu bytt!");
					nowPassword.value = "";
					newPassword.value = "";
				} else {
					popup.open("Kunde inte byta lösenord. Försök igen.");
				}
			});
			const empty2 = document.createElement("P");
			main.appendChild(empty2);
			main.appendChild(passwordButton);
		} else if(page === "check-out") {
			document.querySelector("#cart").classList.add("disabled");
			cart.drawPay();
		} else if(page === "success") {
			const mainHeader = document.querySelector("#pageHeader");
			mainHeader.textContent = "Beställning lagd!";
			const main = document.querySelector("#page");
			main.classList.add("successPage");
			const successText = document.createElement("P");
			successText.textContent = "Din beställning är lagd och kommer hanteras snarast!";
			successText.style.margin = "2px";
			const successText2 = document.createElement("P");
			successText2.textContent = "Vid eventuella frågor, använd referensnumret nedan.";
			successText2.style.margin = "2px";
			const code = document.createElement("h3");
			code.style.fontStyle = "italic";
			code.textContent = subPage;
			main.innerHTML = "";
			main.appendChild(successText);
			main.appendChild(successText2);
			main.appendChild(code);
		} else if(page === "orders") {
			if(userStatus.loggedIn === false) {
				location.assign("/");
				return false;
			}
			const mainHeader = document.querySelector("#pageHeader");
			mainHeader.textContent = "Beställningar";
			const main = document.querySelector("#page");
			main.classList.add("ordersPage");
			main.innerHTML = "";
			const orderData = await load.resource("api/orders");
			if(orderData === false) {
				popup.open("Kunde inte hämta beställningar. Försök igen.");
				return false;
			}
			let orders = {};
			orderData.forEach(order => {
				if(orders[order.orderId] === undefined) orders[order.orderId] = {
					products: [],
					state: order.state,
					date: order.ordertime,
					by: order.orderedBy,
					postalService: order.postal_service,
					postalPoint: order.postal_point,
					cost: order.totalCost
				};
				orders[order.orderId].products.push({
					name: order.product,
					image: order.image,
					amount: order.amount,
					price: Number(order.product_price)
				});
			});
			console.log("order", orders);
			for(let orderID in orders) {
				const order = orders[orderID];
				const orderContainer = document.createElement("DIV");
				const orderTitleContainer = document.createElement("DIV");
				const orderTitle = document.createElement("h3");
				orderTitle.textContent = orderID;
				const orderIcon = document.createElement("h3");
				orderIcon.classList.add("material-symbols-outlined");
				orderIcon.textContent = {
					ordered:	"order_approve",
					shipped:	"delivery_truck_speed",
					delivered:	"check",
					cancelled:	"cancel_presentation",
					refunded:	"currency_exchange",
					returned:	"assignment_return"
				}[order.state];
				const orderstatus = document.createElement("h3");
				orderstatus.textContent = {
					ordered:	"Order lagd",
					shipped:	"Skickad",
					delivered:	"Levererad",
					cancelled:	"Ångrad",
					refunded:	"Återbetalad",
					returned:	"Returnerad"
				}[order.state];
				orderTitleContainer.appendChild(orderTitle);
				orderTitleContainer.appendChild(orderIcon);
				orderTitleContainer.appendChild(orderstatus);
				orderContainer.appendChild(orderTitleContainer);
				
				const orderDetails = document.createElement("SPAN");
				orderDetails.classList.add("details");
				const orderBy = document.createElement("p");
				orderBy.textContent = "Av: "+order.by;
				orderDetails.appendChild(orderBy);
				const orderDate = document.createElement("p");
				orderDate.textContent = tools.sqlTimestamp(order.date, "Y/m/d h:i");
				orderDetails.appendChild(orderDate);
				orderContainer.appendChild(orderDetails);

				const productsContainer = document.createElement("DIV");
				productsContainer.classList.add("productList");
				order.products.forEach(product => {
					const productContainer = document.createElement("DIV");
					const productImage = document.createElement("IMG");
					productImage.src = "/product_images/"+product.image;
					productContainer.appendChild(productImage);
					const productTitle = document.createElement("P");
					productTitle.textContent = product.name;
					productContainer.appendChild(productTitle);
					const productPrice = document.createElement("P");
					productPrice.textContent = product.price+"kr";
					productContainer.appendChild(productPrice);
					const productAmount = document.createElement("P");
					productAmount.textContent = "*"+product.amount+"st";
					productContainer.appendChild(productAmount);
					productsContainer.appendChild(productContainer);
				});
				orderContainer.appendChild(productsContainer);

				const costContainer = document.createElement("DIV");
				costContainer.textContent = "Totalt: "+order.cost+"kr";
				orderContainer.appendChild(costContainer);
				
				main.appendChild(orderContainer);
			}
		} else if(page === "search") {
			searchVals.query = subPage;
			load.content.products();
		} else if(page === false) {
			load.content.startPage();
		} else {
			const mainHeader = document.querySelector("#pageHeader");
			mainHeader.textContent = "404 - Sidan finns inte";
			const main = document.querySelector("#page");
			const errorText = document.createElement("P");
			errorText.textContent = "Något fel ledde dig hit. Om det är från dig eller oss låter vi vara osagt.";
			main.innerHTML = "";
			main.style.gridTemplateColumns = "1fr";
			main.appendChild(errorText);
		}
	}
	code.load = async () => {
		return await load.resource("api/codecount");
	}
});
var code = {
	load: null
};