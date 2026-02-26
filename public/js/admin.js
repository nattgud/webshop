window.addEventListener("load", async () => {
	// ADMIN
	const admin = {
		panelLoadingTimer: null,
		updPanels: loggedIn => {
			if(loggedIn) {
				// if(document.querySelector("#loggedInPanel").style.display !== "block") updCats();
				admin.loadPanel();
				document.querySelector("#loggedInPanel").style.display = "block";
				document.querySelector("#loggedOffPanel").style.display = "none";
			} else {
				document.querySelector("#loggedInPanel").style.display = "none";
				document.querySelector("#loggedOffPanel").style.display = "block";
				document.querySelector("#adminUsersPanel").innerHTML = "";
			}
		},
		myUsername: null,
		updUsername: () => {
			document.querySelector("#loggedInPanel #username").textContent = admin.myUsername;
		},
		checkLogin: async () => {
			try {
				const data = await fetch("http://localhost:3000/admin/check", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include"
				}).then(res => res.json());
				if(data?.loggedIn === true) {
					admin.updPanels(true);
					admin.myUsername = data?.username;
					admin.updUsername();
				} else {
					admin.updPanels(false);
				}
				clearTimeout(admin.panelLoadingTimer);
			} catch(e) {
				console.log("error", JSON.stringify(e));
			}
			admin.panelLoadingTimer = setTimeout(admin.checkLogin, 5000);
		},
		lastProducts: null,
		updProducts: async () => {
			await admin.loadFilters();
			const productList = await fetch("http://localhost:3000/admin/products", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
				credentials: "include"
			}).then(res => res.json());
			if(admin.lastProducts !== JSON.stringify(productList)) {
				document.querySelector("#adminProductsCount").textContent = productList.length;
				admin.lastProducts = JSON.stringify(productList);
				const table = document.querySelector("#newProductForm #adminProductsPanel");
				table.innerHTML = "";
				productList.forEach(product => {
					const tr = document.createElement("TR");
					const tdNames = [
						"title",
						"short_description",
						"description",
						"price",
						"image",
						"stock",
						"filters",
						"categories",
					];
					tdNames.forEach(name => {
						const tmp = document.createElement("TD");
						tmp.dataset.original = product[name];
						if(name === "image") {
							const imgInput = document.createElement("image-input");
							imgInput.setAttribute("preview", "");
							imgInput.setAttribute("folder", "product_images");
							imgInput.value = product[name];
							tmp.appendChild(imgInput);
							imgInput.addEventListener("change", e => {
								if(imgInput.value != tmp.dataset.original) {
									tmp.classList.add("inputChanged");
								} else {
									tmp.classList.remove("inputChanged");
								}
							});
						} else if(name === "filters") {
							const filtersContainer = document.createElement("filters-select");
							if(product[name] !== null) {
								const filters = product[name].split("|").map(filter => {
									filter = filter.split(":");
									return {
										id: filter[0],
										value: filter[1]
									};
								});
								filtersContainer.value = filters;
							}
							tmp.appendChild(filtersContainer);
						} else if(name === "categories") {
							const catContainer = document.createElement("category-input");
							if(product[name] !== null) {
								catContainer.value = product[name].split("|");
							}
							tmp.appendChild(catContainer);
							catContainer.addEventListener("change", e => {
								if(catContainer.value.join("|") != tmp.dataset.original) {
									tmp.classList.add("inputChanged");
								} else {
									tmp.classList.remove("inputChanged");
								}
							});
						} else {
							tmp.textContent = product[name];
							tmp.contentEditable = true;
							if(name === "price") {
								tmp.addEventListener("beforeinput", e => {
									if(tmp.textContent.indexOf(".") !== -1 && e.data == ".") e.preventDefault();
									if (e.data && !/[\d.]/.test(e.data)) e.preventDefault();
								});
								tmp.addEventListener("blur", e => {
									tmp.textContent = tmp.textContent
										.replace(/(\..*)\./g, '$1')
										.replace(/(\.\d{2}).+$/, '$1');
								});
							}
							tmp.addEventListener("input", e => {
								if(tmp.textContent != tmp.dataset.original) {
									tmp.classList.add("inputChanged");
								} else {
									tmp.classList.remove("inputChanged");
								}
							});
						}
						tr.appendChild(tmp);
					});
					const delTD = document.createElement("TD");
					const delContainer = document.createElement("SPAN");
					delContainer.classList.add("button");
					delContainer.classList.add("button_warning");
					delContainer.classList.add("material-symbols-outlined");
					delContainer.textContent = "delete";
					delContainer.addEventListener("click", async e => {
						const state = await fetch("http://localhost:3000/admin/products/"+product.pid, {
							method: "DELETE",
							headers: { "Content-Type": "application/json" },
							credentials: "include"
						}).then(res => res.json());
						if(state?.state === true) {
							admin.updProducts();
						} else {
							popup.open("Kunde inte ta bort produkten.");
						}
					});
					delTD.appendChild(delContainer);
					tr.appendChild(delTD);
					const saveTD = document.createElement("TD");
					const saveContainer = document.createElement("SPAN");
					saveContainer.classList.add("button");
					saveContainer.classList.add("material-symbols-outlined");
					saveContainer.textContent = "save";
					saveContainer.addEventListener("click", async e => {
						if(saveContainer.getAttribute("disabled") !== null) return false;
						saveContainer.setAttribute("disabled", "");
						const data =  [...tr.querySelectorAll("td")].map(td => {
							if(td.querySelector("image-input") !== null) {
								return td.querySelector("image-input").value;
							} else if(td.querySelector("category-input")) {
								return td.querySelector("category-input").value;
							} else if(td.querySelector("filters-select")) {
								return td.querySelector("filters-select").value;
							} else {
								return td.textContent;
							}
						});
						const newProductStatus = await admin.loadResource("admin/products", "PATCH", {
							productTitle: data[0], 
							productShortDesc: data[1], 
							productLongDesc: data[2], 
							productPrice: Number(data[3]), 
							productImage: data[4], 
							productStock: Number(data[5]), 
							productFilters: data[6], 
							productCategories: data[7],
							pid: product.pid
						});
						saveContainer.removeAttribute("disabled");
						if(newProductStatus?.state === true) {
							document.querySelector("category-input")?.updCats(true);
							admin.updProducts();
						} else {
							popup.open("Kunde inte spara produkten");
						}
					});
					saveTD.appendChild(saveContainer);
					tr.appendChild(saveTD);
					table.appendChild(tr);
				});
			}
		},
		lastOrders: null,
		updOrders: async () => {
			await admin.loadFilters();
			let orderList = await fetch("http://localhost:3000/admin/orders", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
				credentials: "include"
			}).then(res => res.json());
			if(orderList?.state !== true) return false;
			orderList = orderList.data;
			if(admin.lastOrders !== JSON.stringify(orderList)) {
				document.querySelector("#adminOrdersCount").textContent = orderList.length;
				admin.lastOrders = JSON.stringify(orderList);
				const table = document.querySelector("#adminOrdersList");
				table.innerHTML = "";
				const stateList = {
					ordered:	"Order lagd",
					shipped:	"Skickad",
					delivered:	"Levererad",
					cancelled:	"Ångrad",
					refunded:	"Återbetalad",
					returned:	"Returnerad"
				};
				for(let order of orderList) {
					const row = document.createElement("TR");
					const time = document.createElement("TD");
					time.textContent = tools.sqlTimestamp(order.ordertime, "Y/m/d h:i");
					const user = document.createElement("TD");
					user.textContent = order.name+((order.user_id===null)?"":(" ("+order.email+")"));
					const state = document.createElement("TD");
					const stateSelect = document.createElement("SELECT");
					for(let stateId in stateList) {
						stateVal = stateList[stateId];
						const stateOption = document.createElement("OPTION");
						if(order.state === stateId) {
							stateOption.selected = true;
						}
						stateOption.value = stateId;
						stateOption.textContent = stateVal;
						stateSelect.appendChild(stateOption);
					}
					const lastState = 0;
					console.log(order);
					stateSelect.addEventListener("change", async e => {
						console.log("new val");
						let orderList = await fetch("http://localhost:3000/admin/orders", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							credentials: "include",
							body: JSON.stringify({
								id: order.id,
								state: stateSelect.value
							})
						}).then(res => res.json());
						if(orderList?.state === true) {
							admin.updOrders();
						} else {
							popup.open("Något gick fel. Försök igen.");
						}
					});
					state.appendChild(stateSelect);
					// state.textContent = order.state;
					const delivery = document.createElement("TD");
					delivery.textContent = order.postal_service;
					const cost = document.createElement("TD");
					cost.textContent = Number(order.cost)+"kr";
					row.appendChild(time);
					row.appendChild(user);
					row.appendChild(state);
					row.appendChild(delivery);
					row.appendChild(cost);
					table.appendChild(row);
				}
			}
		},
		login: async () => {
			popup.open("Försöker logga in...");
			const username = document.querySelector("#admin_login #username")?.value;
			const password = document.querySelector("#admin_login #password")?.value;
			try {
				const data = await fetch("http://localhost:3000/admin/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						username: username,
						password: password
					})
				}).then(res => res.json());
				if(data.state !== undefined) {
					if(data.state === true) {
						admin.myUsername = data?.username;
						admin.updUsername();
						// updCats();
						popup.open("Inloggad!");
						admin.updPanels(true);
					} else {
						popup.open("Kunde inte logga in.");
						admin.updPanels(false);
					}
				}
			} catch(e) {
				console.log(e);
			}
		},
		logout: async () => {
			popup.open("Loggar ut.");
			const data = await fetch("http://localhost:3000/admin/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include"
			}).then(res => res.json());
			popup.open("Utloggad.");
			admin.updPanels(false);
		},
		loadResource: async (url, type = "GET", body = {}) => {
			const options = {
				method: type,
				headers: { "Content-Type": "application/json" },
				credentials: "include"
			};
			if(["POST", "PATCH", "PUT"].indexOf(type) !== -1) options.body = JSON.stringify(body);
			try {
				const data = await fetch("http://localhost:3000/"+url, options).then(res => res.json());
				return data;
			} catch(e) {
				return false;
			}
		},
		lastUserList: [],
		loadPanel: async () => {
			admin.updProducts();
			admin.updOrders();
			const panel = document.querySelector("#adminUsersPanel");
			if(panel === null) return false;
			let userlistContainer = panel.querySelector("#adminUserList")
			if(userlistContainer === null) {
				userlistContainer = document.createElement("DIV");
				userlistContainer.id = "adminUserList";
				panel.appendChild(userlistContainer);
			}
			const data = await admin.loadResource("admin/users");
			if(admin.lastUserList != JSON.stringify(data)) {
				admin.lastUserList = JSON.stringify(data);
				document.querySelector("#loggedInPanel #adminUsersCount").textContent = data.length;
				userlistContainer.innerHTML = "";
				data.forEach(user => {
					const userContainer = document.createElement("SPAN");
					userContainer.textContent = user.username;
					const ts = document.createElement("SPAN");
					if(user.username !== admin.myUsername) {
						const deleteButton = document.createElement("SPAN");
						deleteButton.classList.add("material-symbols-outlined");
						deleteButton.classList.add("minibutton");
						deleteButton.textContent = "delete";
						deleteButton.addEventListener("click", async e => {
							const delData = await admin.loadResource("admin/users/"+user.username, "DELETE");
							if(delData?.state === true) {
								popup.open("Användaren har raderats.");
								admin.updPanels(true);
							} else {
								popup.open("Kunde inte radera användaren.");
							}
						});
						userContainer.appendChild(deleteButton);
					}
					ts.textContent = tools.sqlTimestamp(user.created_at, "y/m/d h:i");
					userContainer.appendChild(ts);
					userlistContainer.appendChild(userContainer);
				});
			}
		},
		updCats: () => {
			const container = document.querySelector("#adminCategoriesList");
			container.innerHTML = "";
			const nodes = {};
			if(window._cats === undefined) return false;
			if(window._cats.data === false) return false;
			window._cats.data.forEach(cat => nodes[cat.title] = {});
			const tree = {};
			window._cats.data.forEach(cat => {
				if (cat.parent === null) {
					tree[cat.title] = nodes[cat.title];
				} else {
					nodes[cat.parent][cat.title] = nodes[cat.title];
				}
			});
			const listContainer = document.querySelector("#adminCategoriesList");
			listContainer.innerHTML = "";
			function addChildren(ul, obj) {
				for (const key in obj) {
					const li = document.createElement('li');
					// li.textContent = key;
					const txt = document.createElement("SPAN");
					const del = document.createElement("SPAN");
					del.classList.add("material-symbols-outlined");
					del.classList.add("minibutton");
					del.textContent = "delete";
					del.addEventListener("click", async e => {
						const state = await admin.loadResource("admin/categories/"+key, "DELETE");
						if(state?.state === false) {
							if(state.msg !== undefined) {
								popup.open(state.msg);
							} else {
								popup.open("Något gick fel. Säker på att ingen produkt är kopplad till kategorin?");
							}
						} else {
							await document.querySelector("category-input").updCats(true);
							admin.updCats();
							popup.open("Kategorin raderades.");
						}
					});
					txt.textContent = key;
					txt.addEventListener("click", async e => {
						e.stopPropagation();
						e.preventDefault();
						if(li.classList.contains("forbidden") || listContainer.classList.contains("frozen")) return false;
						const first = listContainer.querySelector("#catMove1 > span");
						if(first !== null) {
							listContainer.querySelector("#catMove1")?.removeAttribute("id");
							listContainer.classList.remove("catMoving");
							listContainer.querySelector(".catMove").classList.remove("catMove");
							listContainer.classList.add("frozen");
							const state = await admin.loadResource("admin/categories", "PATCH", {
								move:	first.textContent.trim(),
								to:		key
							});
							if(state?.state === false) {
								if(state.msg !== undefined) {
									popup.open(state.msg);
								} else {
									popup.open("Något gick fel. Försök igen");
								}
								listContainer.classList.remove("frozen");
							} else {
								await document.querySelector("category-input").updCats(true);
								admin.updCats();
								listContainer.classList.remove("frozen");
							}
						} else {
							let children = [];
							[...li.querySelectorAll("li")].forEach(child => {
								child.classList.add("forbidden");
							});
							if(li.parentNode.parentNode.tagName == "LI") {
								li.parentNode.parentNode.classList.add("forbidden");
							}
							li.id = "catMove1";
							listContainer.classList.add("catMoving");
							li.classList.add("catMove");
						}
					})
					li.appendChild(txt);
					li.appendChild(del);
					ul.appendChild(li);
					const children = obj[key];
					if (Object.keys(children).length > 0) {
						const childUL = document.createElement('ul');
						li.appendChild(childUL);
						addChildren(childUL, children);
					}
				}
			}
			addChildren(listContainer, tree);
		},
		loadImages: async () => {
			let imgList = await admin.loadResource("admin/productImages");
			imgList.sort((a, b) => b.mtime-a.mtime);
			window._imageList = imgList;
			admin.updImages();
		},
		updImages: () => {
			if(Array.isArray(window._imageList)) {
				document.querySelector("#adminImgsCount").textContent = window._imageList.length;
				const container = document.querySelector("#adminImagesList");
				container.innerHTML = "";
				window._imageList.forEach(image => {
					const imgText = document.createElement("SPAN");
					const imgTextDelete = document.createElement("SPAN");
					imgTextDelete.classList.add("material-symbols-outlined");
					imgTextDelete.classList.add("minibutton");
					imgTextDelete.textContent = "delete";
					imgTextDelete.addEventListener("click", async e => {
						const state = await admin.loadResource("admin/productImages/"+image.file, "DELETE");
						if(state?.state === true) {
							popup.open("Bilden raderades.");
							admin.loadImages();
						} else {
							popup.open("Bilden kunde inte raderas.");
						}
					});
					imgText.appendChild(imgTextDelete);
					const imgTextText = document.createElement("SPAN");
					imgTextText.textContent = image.file.split(".")[0];
					imgTextText.addEventListener("click", e => {
						const inpWindow = document.createElement("DIV");
						inpWindow.classList.add("fullscreen");
						const imgContainer = document.createElement("SPAN");
						imgContainer.classList.add("fullscreenImage");
						const img = document.createElement("IMG");
						const imgName = document.createElement("SPAN");
						imgName.textContent = image.file;
						img.src = "product_images/"+image.file;
						imgContainer.appendChild(img);
						imgContainer.appendChild(imgName);
						imgContainer.addEventListener("click", e => {
							inpWindow.parentNode.removeChild(inpWindow);
						});
						inpWindow.appendChild(imgContainer);
						document.querySelector("body").appendChild(inpWindow);
					});
					const imgPreview = document.createElement("IMG");
					imgPreview.src = "product_images/"+image.file;
					const dateString = document.createElement("SPAN");
					const date = new Date(image.mtime);
					dateString.textContent = "("+date.getFullYear()+"-"+((date.getMonth()<10)?"0"+date.getMonth():date.getMonth())+"-"+((date.getDate()<10)?"0"+date.getDate():date.getDate())+" "+((date.getHours()<10)?"0"+date.getHours():date.getHours())+":"+((date.getMinutes()<10)?"0"+date.getMinutes():date.getMinutes())+":"+((date.getSeconds()<10)?"0"+date.getSeconds():date.getSeconds())+")";
					imgTextText.appendChild(imgPreview);
					imgText.appendChild(imgTextText);
					imgText.appendChild(dateString);
					container.appendChild(imgText);
				});
			} else {
				console.log("no image list");
			}
		},
		lastFilters: null,
		lastFiltersTS: 0,
		loadFilterData: async () => {
			if(admin.lastFiltersTS > (new Date()).getTime() - 1000) return false;
			admin.lastFiltersTS = (new Date()).getTime();
			const filters = await admin.loadResource("admin/filters", "GET");
			if(admin.lastFilters === JSON.stringify(filters)) return false;
			admin.lastFilters = JSON.stringify(filters);
			return true;
		},
		loadFilters: async () => {
			const upd = await admin.loadFilterData();
			if(upd === false) return false;
			document.querySelector("#adminFiltersCount").textContent = JSON.parse(admin.lastFilters).length;
			document.querySelector("#filterList").innerHTML = "";
			JSON.parse(admin.lastFilters).forEach(filter => {
				if(filter.filter_type === "types") {
					const inp = document.createElement("filter-range");
					inp.title = filter.title;
					inp.min = filter.min;
					inp.max = filter.max;
					inp.id = filter.id;
					inp.unit = filter.units;
					document.querySelector("#filterList").appendChild(inp);
				} else {
					const inp = document.createElement("filter-alts");
					inp.title = filter.title;
					inp.alts = filter.vals.split(",");
					inp.id = filter.id;
					document.querySelector("#filterList").appendChild(inp);
				}
			});
		}
	};


	class customElement1 extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._img = document.createElement("IMG");
			this._img.style.height = "50px";
			this._txt = document.createElement("SPAN");
			this._txt.style.padding = "5px";
			this._txt.style.display = "inline-block";
			this._txt.textContent = "Välj bild";
		}
		static get observedAttributes() {
			return ["text"];
		}
		connectedCallback() {
			this.render();
		}
		attributeChangedCallback(name, oldValue, newValue) {
			if(this.hasAttribute("preview")) {
				this._img.style.display = "block";
			} else {
				this._img.style.display = "none";
			}
			if (oldValue !== newValue) {
				this.render();
			}
		}
		get value() {
			return (this._txt.textContent === "Välj bild")?"":this._txt.textContent;
		}
		set value(v) {
			this._txt.textContent = v;
			if(v.trim() === "") {
				this._img.style.display = "none";
				this._txt.textContent = "Välj bild";
				this._txt.style.display = "inline-block";
			} else {
				this._img.style.display = "block";
				this._txt.style.display = "none";
			}
			if(this.value !== "") {
				this._img.src = (this.getAttribute("folder") ?? ".")+"/"+this.value;
			}
			this.dispatchEvent(new Event('change', { bubbles: true }));
		}
		render() {
			const text = this.getAttribute("url") ?? "";
			if(this.shadowRoot.querySelector("input") === null) {
				this.style.padding = "0px";
				this.style.display = "flex";
				this.style.justifyContent = "center";
				this.style.alignItems = "center";
				this.classList.add("button");
				this.addEventListener("click", async e => {
					const inpWindow = document.createElement("DIV");
					inpWindow.classList.add("fullscreen");
					await admin.loadImages();
					inpWindow.classList.add("imgPickerLista");
					const imageList = window._imageList.map(url => {
						const imgContainer = document.createElement("SPAN");
						if(url.file === this.value) {
							imgContainer.classList.add("selected");
						}
						const img = document.createElement("IMG");
						const imgName = document.createElement("SPAN");
						imgName.textContent = url.file;
						img.src = "product_images/"+url.file;
						imgContainer.appendChild(img);
						imgContainer.appendChild(imgName);
						imgContainer.addEventListener("click", e => {
							this.value = url.file;
							inpWindow.parentNode.removeChild(inpWindow);
						});
						return imgContainer;
					});
					imageList.forEach(img => {
						inpWindow.appendChild(img);
					});
					const closeButton = document.createElement("DIV");
					closeButton.classList.add("minibutton");
					closeButton.classList.add("material-symbols-outlined");
					closeButton.style.position = "fixed";
					closeButton.style.top = "10px";
					closeButton.style.right = "10px";
					closeButton.style.fontSize = "32pt";
					closeButton.textContent = "close";
					closeButton.addEventListener("click", e => {
						inpWindow.parentNode.removeChild(inpWindow);
					});
					inpWindow.appendChild(closeButton);
					document.querySelector("body").appendChild(inpWindow);
				});
				if(this.hasAttribute("preview")) {
					this._img.style.display = "block";
				} else {
					this._img.style.display = "none";
				}
				this.shadowRoot.appendChild(this._img);
				this.shadowRoot.appendChild(this._txt);
			}
		}
	}
	customElements.define("image-input", customElement1);
	class customElement2 extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._value = [];
			this._input = document.createElement("INPUT");
			this._input.addEventListener("focus", e => this.updCats());
			this._input.type = "text";
			this._newList = document.createElement("DATALIST");
			this._newList.id = "internalList";
			this._input.setAttribute("list", "internalList");
			this._input.setAttribute("autocomplete", "off");
			this._txt = document.createElement("SPAN");
			this._style = document.createElement("STYLE");
			this._style.textContent = `
				span {
					display: block;
				}
				span > span {
					display: inline-block;
					border: 1px solid #aaa;
					padding: 5px;
					border-radius: 5px;
					cursor: pointer;
					transition: background-color 200ms;
				}
				span > span:hover {
					background-color: #733;
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
		async updCats(force = false) {
			if(window._cats === undefined) {
				window._cats = {
					ts: new Date(0),
					data: []
				};
			}
			if((new Date()).getTime()-window._cats.ts.getTime() > 1000*5 || force) {
				const tmpData = await admin.loadResource("admin/categories");
				if(tmpData.msg !== undefined) return false;
				window._cats.ts = new Date();
				window._cats.data = tmpData;
				admin.updCats();
				document.querySelector("#loggedInPanel #adminCatsCount").textContent = window._cats.data.length;
			}
			if(this.getAttribute("cd") !== "1" || force) {
				this.setAttribute("cd", "1");
				setTimeout(() => {
					this.removeAttribute("cd");
				}, 100);
				const els = document.querySelectorAll("category-input");
				els.forEach(el => el.updCats());
				if(window._cats === undefined) return false;
				if(window._cats.data === false) return false;
				this._newList.innerHTML = "";
				window._cats.data.forEach(cat => {
					const option = document.createElement("OPTION");
					option.value = cat.title;
					this._newList.appendChild(option);
				});
			}
		}
		get value() {
			return this._value;
		}
		set value(v = false) {
			if(v === "") v = [];
			if(!Array.isArray(v)) {
				v = [v];
			}
			this._value = v;
			this.dispatchEvent(new Event('change', { bubbles: true }));
			this.updValues();
		}
		removeValue(v = null) {
			if(v === null) return false;
			let tmpValues = this.value;
			tmpValues.splice(tmpValues.indexOf(v), 1);
			this.value = tmpValues;
		}
		updValues() {
			this._txt.innerHTML = "";
			this._value.forEach(val => {
				const newCat = document.createElement("SPAN");
				newCat.textContent = val;
				newCat.addEventListener("click", e => {
					this.removeValue(newCat.textContent);
				});
				this._txt.appendChild(newCat);
			});
		}
		render() {
			if(this.shadowRoot.querySelector("input") === null) {
				this._input.placeholder = this.getAttribute("placeholder") ?? "";
				this.shadowRoot.appendChild(this._newList);
				this.shadowRoot.appendChild(this._style);
				this.updValues();
				this.updCats();
				this._input.addEventListener("keydown", async e => {
					if(e.key === "Enter") {
						e.preventDefault();
						this.value = [...this.value, this._input.value];
						this._input.value = "";
					}
				});
				this.shadowRoot.appendChild(this._input);
				this.shadowRoot.appendChild(this._txt);
			}
		}
	}
	customElements.define("category-input", customElement2);
	class customElement3 extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._id = null;
			this._min = 0;
			this._max = 100;
			this._title = "";
			this._unit = "";
			this._save = document.createElement("SPAN");
			this._save.textContent = "save";
			this._save.classList.add("material-symbols-outlined");
			this._save.classList.add("button");
			this._save.classList.add("save");
			this._delete = document.createElement("SPAN");
			this._delete.textContent = "delete";
			this._delete.classList.add("material-symbols-outlined");
			this._delete.classList.add("button");
			this._delete.classList.add("delete");
			this._minInput = document.createElement("INPUT");
			this._minInput.type = "number";
			this._minInput.placeholder = this._min;
			this._minInput.addEventListener("input", e => {
				this._min = Number(this._minInput.value);
			});
			this._maxInput = document.createElement("INPUT");
			this._maxInput.type = "number";
			this._maxInput.placeholder = this._max;
			this._maxInput.addEventListener("input", e => {
				this._max = Number(this._maxInput.value);
			});
			this._nameInput = document.createElement("INPUT");
			this._nameInput.placeholder = "Namn";
			this._nameInput.addEventListener("input", e => {
				this._title = this._nameInput.value;
			});
			this._unitInput = document.createElement("INPUT");
			this._unitInput.placeholder = "Enhet";
			this._unitInput.addEventListener("input", e => {
				this._unit = this._unitInput.value;
			});
			this._style2 = document.createElement("LINK");
			this._style2.rel = "stylesheet";
			this._style2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
			this._style = document.createElement("STYLE");
			this._style.textContent = `
				:host {
					display: grid;
					grid-template-columns: 70px 70px;
					border: 1px solid var(--border);
					border-radius: 5px;
					background-color: var(--bg-secondary);
					padding: 5px;
					margin: 2px;
					transition: background-color 200ms;
				}
				:host(.changed) {
					background-color: #600;
				}
				.button {
					text-align: center;
					cursor: pointer;
					transition: color 200ms;
				}
				.delete {
					color: #b00;
				}
				.delete:hover {
					color: #f00;
				}
				.save {
					color: #0a0;
				}
				.save:hover {
					color: #0f0;
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
			return {type: "range", id: this._id, min: this._min, max: this._max, name: this._title, unit: this._unit};
		}
		set value(v = false) {
			this._value = v;
		}
		get title() {
			return this._title;
		}
		set title(v = "") {
			this._title = v;
			this._nameInput.value = this._title;
		}
		get min() {
			return this._min;
		}
		set min(v = "") {
			this._min = v;
			this._minInput.value = this._min;
		}
		get max() {
			return this._title;
		}
		set max(v = "") {
			this._max = v;
			this._maxInput.value = this._max;
		}
		get id() {
			return this._id;
		}
		set id(v = "") {
			this._id = v;
		}
		get unit() {
			return this._unit;
		}
		set unit(v = "") {
			this._unit = v;
			this._unitInput.value = this._unit;
		}
		render() {
			if(this.shadowRoot.querySelector("input") === null) {
				this.shadowRoot.appendChild(this._save);
				this.shadowRoot.appendChild(this._delete);
				this.shadowRoot.appendChild(this._nameInput);
				this.shadowRoot.appendChild(this._unitInput);
				this.shadowRoot.appendChild(this._minInput);
				this.shadowRoot.appendChild(this._maxInput);
				this.shadowRoot.appendChild(this._style);
				this.shadowRoot.appendChild(this._style2);
				const check = () => {
					let ok = true;
					if(this._nameInput.value !== this._nameInput.dataset.original) ok = false;
					if(this._minInput.value !== this._minInput.dataset.original) ok = false;
					if(this._maxInput.value !== this._maxInput.dataset.original) ok = false;
					if(ok) {
						this.classList.remove("changed");
					} else {
						this.classList.add("changed");
					}
				};
				this._nameInput.dataset.original = this._title;
				this._minInput.dataset.original = this._min;
				this._maxInput.dataset.original = this._max;
				this._nameInput.addEventListener("input", check);
				this._minInput.addEventListener("input", check);
				this._maxInput.addEventListener("input", check);
				this._delete.addEventListener("click", e => {
					this.parentNode.removeChild(this);
				});
				this._save.addEventListener("click", async e => {
					const ok = await fetch("http://localhost:3000/admin/filters", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify(this.value)
					}).then(res => res.json());
					if(ok?.state === true) {
						this._nameInput.dataset.original = this._title;
						this._minInput.dataset.original = this._min;
						this._maxInput.dataset.original = this._max;
						check();
					} else {
						popup.open("Något gick fel");
					}
				});
			}
		}
	}
	customElements.define("filter-range", customElement3);
	class customElement4 extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._id = null;
			this._save = document.createElement("SPAN");
			this._save.textContent = "save";
			this._save.classList.add("material-symbols-outlined");
			this._save.classList.add("button");
			this._save.classList.add("save");
			this._delete = document.createElement("SPAN");
			this._delete.textContent = "delete";
			this._delete.classList.add("material-symbols-outlined");
			this._delete.classList.add("button");
			this._delete.classList.add("delete");
			this._newText = document.createElement("INPUT");
			this._newText.type = "text";
			this._newText.placeholder = "Alternativ";
			this.createAlt = txt => {
				const newAlt = document.createElement("SPAN");
				newAlt.textContent = txt;
				newAlt.addEventListener("click", e => {
					this._container.removeChild(newAlt);
				});
				this._container.appendChild(newAlt);
			}
			this._newText.addEventListener("keyup", e => {
				if(e.code === "Enter") {
					this.createAlt(this._newText.value);
					this._newText.value = "";
				}
			});
			this._container = document.createElement("SPAN");
			this._container.classList.add("alts");
			this._title = "";
			this._nameInput = document.createElement("INPUT");
			this._nameInput.placeholder = "Namn";
			this._nameInput.addEventListener("input", e => {
				this._title = this._nameInput.value;
			});
			this._style2 = document.createElement("LINK");
			this._style2.rel = "stylesheet";
			this._style2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
			this._style = document.createElement("STYLE");
			this._style.textContent = `
				:host {
					display: grid;
					grid-template-columns: 100px 100px;
					border: 1px solid var(--border);
					border-radius: 5px;
					background-color: var(--bg-secondary);
					padding: 5px;
					margin: 2px;
					transition: background-color 200ms;
				}
				:host(.changed) {
					background-color: #600;
				}
				:host > span {
					grid-column: 1/-1;
				}
				:host > span:nth-of-type(1), :host > span:nth-of-type(2) {
					grid-column: auto;
				}
				.button {
					text-align: center;
					cursor: pointer;
					transition: color 200ms;
				}
				.delete {
					color: #b00;
				}
				.delete:hover {
					color: #f00;
				}
				.save {
					color: #0a0;
				}
				.save:hover {
					color: #0f0;
				}
				.alts {
					display: flex;
					flex-wrap: wrap;
					gap: 3px;
					padding: 5px 0px;
				}
				.alts span {
					padding: 5px;
					background-color: var(--bg);
					border-radius: 5px;
					cursor: pointer;
					transition: background-color 200ms;
				}
				.alts span:hover {
					background-color: var(--bg-secondary-hover2);
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
			const alts = this.alts;
			return {type: "alts", id: this._id, alts: alts, name: this._title};
		}
		set value(v = false) {
			this._value = v;
		}
		get title() {
			return this._title;
		}
		set title(v = "") {
			this._title = v;
			this._nameInput.value = this._title;
		}
		get id() {
			return this._id;
		}
		set id(v = "") {
			this._id = v;
		}
		get alts() {
			let alts = this.shadowRoot.querySelectorAll(".alts > span");
			return [...alts].map(el => el.textContent);
		}
		set alts(v = "") {
			this._container.innerHTML = "";
			v.forEach(alt => this.createAlt(alt));
		}
		render() {
			if(this.shadowRoot.querySelector("input") === null) {
				this.shadowRoot.appendChild(this._save);
				this.shadowRoot.appendChild(this._delete);
				this.shadowRoot.appendChild(this._nameInput);
				this.shadowRoot.appendChild(this._newText);
				this.shadowRoot.appendChild(this._container);
				this.shadowRoot.appendChild(this._style);
				this.shadowRoot.appendChild(this._style2);
				this._prevValues = this.value;
				const check = () => {
					let ok = true;
					if(this.value !== this.prevValues) ok = false;
					if(ok) {
						this.classList.remove("changed");
					} else {
						this.classList.add("changed");
					}
				};
				this._nameInput.addEventListener("input", check);
				this._newText.addEventListener("input", check);
				this._delete.addEventListener("click", e => {
					this.parentNode.removeChild(this);
				});
				this._save.addEventListener("click", async e => {
					const ok = await fetch("http://localhost:3000/admin/filters", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify(this.value)
					}).then(res => res.json());
					if(ok?.state === true) {
						this._prevValues = this.value;
						admin.loadFilters();
					} else {
						popup.open("Något gick fel");
					}
				});
			}
		}
	}
	customElements.define("filter-alts", customElement4);
	class customElement5 extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this._id = null;
			this._inputContainer = document.createElement("SPAN");
			this._inputContainer.classList.add("inputContainer");
			this._newText = document.createElement("INPUT");
			this._newText.type = "text";
			this._newText.placeholder = "Sök filter";
			this._inputComplete = document.createElement("SPAN");
			this._inputComplete.classList.add("inputComplete");
			this._inputComplete.textContent = "";
			this._inputCompleteLink = false;
			this.createAlt = filter => {
				const newAlt = document.createElement("SPAN");
				const delButton = document.createElement("SPAN");
				delButton.classList.add("material-symbols-outlined");
				delButton.classList.add("button");
				delButton.classList.add("delete");
				delButton.textContent = "delete";
				delButton.addEventListener("click", e => {
					this._container.removeChild(newAlt);
				});
				newAlt.appendChild(delButton);
				const txt = document.createTextNode(filter.title);
				newAlt.appendChild(txt);
				// newAlt.textContent = filter.title;
				newAlt.dataset.id = filter.id;
				if(filter.filter_type === "values") {
					const selector = document.createElement("SELECT");
					const alts = filter.vals.split(",");
					alts.forEach(alt => {
						const altElement = document.createElement("OPTION");
						altElement.value = alt;
						altElement.textContent = alt;
						if(filter.value !== undefined) {
							if(filter.value == alt) {
								altElement.selected = true;
							}
						}
						selector.appendChild(altElement);
					});
					newAlt.appendChild(selector);
				} else if(filter.filter_type === "types") {
					const selector = document.createElement("INPUT");
					selector.placeholder = filter.title+":";
					selector.type = "number";
					selector.min = filter.min;
					selector.max = filter.max;
					if(filter.value !== undefined) {
						selector.value = filter.value;
					}
					selector.addEventListener("blur", e => {
						if(selector.value < filter.min) {
							selector.value = filter.min;
						} else if(selector.value > filter.max) {
							selector.value = filter.max;
						}
					})
					newAlt.appendChild(selector);
				}
				this._container.appendChild(newAlt);
				this._newText.value = "";
				this._inputComplete.innerHTML = "";
			}
			this._newText.addEventListener("keyup", e => {
				if(e.code === "Enter") {
					if(this._inputCompleteLink !== false) {
						this.createAlt(this._inputCompleteLink);
						this._inputCompleteLink = false;
						this._newText.value = "";
					}
				}
			});
			this._container = document.createElement("SPAN");
			this._container.classList.add("alts");
			this._style2 = document.createElement("LINK");
			this._style2.rel = "stylesheet";
			this._style2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";
			this._style = document.createElement("STYLE");
			this._style.textContent = `
				:host {
					display: grid;
					grid-template-columns: 100px 100px;
					border: 1px solid var(--border);
					border-radius: 5px;
					background-color: var(--bg-secondary);
					padding: 5px;
					margin: 2px;
					transition: background-color 200ms;
				}
				:host(.changed) {
					background-color: #600;
				}
				:host > span {
					grid-column: 1/-1;
				}
				.button {
					text-align: center;
					cursor: pointer;
					font-size: 10pt!important;
					transition: color 200ms;
				}
				.delete {
					color: #b00;
				}
				.delete:hover {
					color: #f00;
				}
				.save {
					color: #0a0;
				}
				.save:hover {
					color: #0f0;
				}
				.alts {
					display: flex;
					flex-wrap: wrap;
					gap: 3px;
					padding: 5px 0px;
				}
				.alts span {
					padding: 5px;
					background-color: var(--bg);
					border-radius: 5px;
					transition: background-color 200ms;
				}
				.alts span:hover {
					background-color: var(--bg-secondary-hover2);
				}
				.inputContainer {
					position: relative;
				}
				.inputComplete {
					position: absolute;
					left: 0px;
					top: 100%;
					padding: 5px;
					opacity: 0.8;
					background-color: var(--bg-secondary);
					border: 1px solid var(--border);
				}
				.inputComplete:empty {
					display: none;
				}
				.inputComplete .mark {
					color: #0f0;
					font-weight: bold;
				}
				.alts > span input, .alts > span select {
					margin-left: 5px;
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
			const filters = this.filters;
			return filters;
		}
		set value(v = false) {
			if(Array.isArray(v)) {
				this._setNewValues(v);
			} else if(v === "") {
				this._container.innerHTML = "";
			}
		}
		async _setNewValues(v) {
			await admin.loadFilterData();
			const filters = JSON.parse(admin.lastFilters);
			for(let newFilter of v) {
				filters.forEach(filter => {
					if(filter.id === Number(newFilter.id)) {
						filter.value = newFilter.value;
						this.createAlt(filter);
					}
				});
			}
		}
		get id() {
			return this._id;
		}
		set id(v = "") {
			this._id = v;
		}
		get filters() {
			let alts = this.shadowRoot.querySelectorAll(".alts > span");
			alts = [...alts].map(el => {
				if(el.querySelector("select") !== null) {
					return {id: el.dataset.id, value: el.querySelector("select").value, type: "str"};
				} else if(el.querySelector("input") !== null) {
					return {id: el.dataset.id, value: Number(el.querySelector("input").value), type: "int" };
				}
			});
			return alts;
		}
		set filters(v = "") {
			this._container.innerHTML = "";
			v.forEach(alt => this.createAlt(alt));
		}
		render() {
			if(this.shadowRoot.querySelector("input") === null) {
				this._inputContainer.appendChild(this._newText);
				this._inputContainer.appendChild(this._inputComplete);
				this.shadowRoot.appendChild(this._inputContainer);
				this.shadowRoot.appendChild(this._container);
				this.shadowRoot.appendChild(this._style);
				this.shadowRoot.appendChild(this._style2);
				this._prevValues = JSON.stringify(this.value);
				const check = () => {
					let ok = true;
					if(this.value !== this.prevValues) {
						this.classList.add("changed");
					} else {
						this.classList.remove("changed");
					}
				};
				this._newText.addEventListener("input", e => {
					let found = false;
					let foundPos = Infinity;
					const filters = JSON.parse(admin.lastFilters);
					filters.forEach(filter => {
						if(filter.title.toLowerCase().indexOf(this._newText.value.toLowerCase()) !== -1) {
							if(filter.title.toLowerCase().indexOf(this._newText.value.toLowerCase()) < foundPos) {
								found = filter;
								foundPos = filter.title.toLowerCase().indexOf(this._newText.value.toLowerCase());
							}
						}
					});
					let clickable = false;
					this._inputComplete.innerHTML = "";
					if(found !== false) {
						if(this._newText.value !== "") {
							const search = this._newText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
							const regex = new RegExp(search, "i");
							const highlighted = found.title.replace(regex, match =>
							`<span class="mark">${match}</span>`
							);
							this._inputComplete.innerHTML = highlighted;
							clickable = true;
							this._inputCompleteLink = found;
						}
					}
					if(clickable === false) {
						this._inputCompleteLink = false;
					}
				});
			}
		}
	}
	customElements.define("filters-select", customElement5);

	document.querySelector("#newProductForm").addEventListener("submit", async e => {
		e.preventDefault();
		const inps = [
			"newProductTitle",
			"newProductShortDesc",
			"newProductLongDesc",
			"newProductPrice",
			"newProductImage",
			"newProductStock",
			"newFilters",
			"newProductCat"
		];
		const data = inps.map(id => document.querySelector("#newProduct #"+id)?.value);
		const newProductStatus = await admin.loadResource("admin/products", "POST", {
			productTitle: data[0], 
			productShortDesc: data[1], 
			productLongDesc: data[2], 
			productPrice: Number(data[3]), 
			productImage: data[4], 
			productStock: Number(data[5]), 
			productFilters: (data[6]), 
			productCategories: data[7]
		});
		if(newProductStatus?.state === true) {
			document.querySelector("category-input")?.updCats(true);
			admin.updProducts();
			for(let inpID of inps) {
				document.querySelector("#newProduct #"+inpID).value = "";
			}
			popup.open("Produkten lades till.");
		} else {
			popup.open("Kunde inte skapa produkten.");
		}
	});

	admin.checkLogin();
	document.querySelector("#admin_login").addEventListener("submit", e => {
		admin.login();
		e.preventDefault();
	});
	document.querySelector("#admin_createUser").addEventListener("submit", async e => {
		e.preventDefault();
		const username = document.querySelector("#admin_createUser #newusername")?.value;
		const password = document.querySelector("#admin_createUser #newpassword")?.value;
		if(username.trim().length < 4 || password.trim().length < 4) {
			popup.open("Minst 4 tecken långt användarnamn och lösenord.");
			return false;
		}
		popup.open("Försöker skapa användaren \""+username+"\".");
		const data = await fetch("http://localhost:3000/admin/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				username: username,
				password: password
			})
		}).then(res => res.json());
		if(data.state !== undefined) {
			if(data.state === true) {
				popup.open("Användaren \""+username+"\" har skapats.");
				document.querySelector("#admin_createUser #newusername").value = "";
				document.querySelector("#admin_createUser #newpassword").value = "";
				admin.loadPanel();
			} else {
				popup.open("Användaren \""+username+"\" kunde inte skapas.");
			}
		}
	});
	document.querySelector("#admin_logout").addEventListener("click", async e => {
		admin.logout();
		e.preventDefault();
	});
	document.querySelector("#adminNewCat").addEventListener("keyup", async e => {
		if(e.key === "Enter") {
			e.target.disabled = true;
			const status = await fetch("http://localhost:3000/admin/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					cat: e.target.value
				})
			}).then(res => res.json());
			if(status?.state === true) {
				await document.querySelector("category-input").updCats(true);
				popup.open("Kategorin lades till");
				e.target.value = "";
				admin.updCats();
			} else {
				popup.open("Kunde inte lägga till kategorin. Försök igen.");
			}
			e.target.disabled = false;
		}
	});

	const expanders = document.querySelectorAll("[data-expander]");
	expanders.forEach(expander => {
		const button = document.createElement("SPAN");
		button.classList.add("toggle-input");
		if(!document.querySelector("#"+expander.dataset.expander).classList.contains("expanderOff")) {
			button.classList.add("on");
		}
		button.addEventListener("click", e => {
			if(button.classList.contains("on")) {
				if(!document.querySelector("#"+expander.dataset.expander).classList.contains("expanderOff")) {
					document.querySelector("#"+expander.dataset.expander).classList.add("expanderOff")
				}
				button.classList.remove("on");
			} else {
				if(document.querySelector("#"+expander.dataset.expander).classList.contains("expanderOff")) {
					document.querySelector("#"+expander.dataset.expander).classList.remove("expanderOff")
				}
				button.classList.add("on");
			}
		});
		expander.appendChild(button);
	});
	const productImageUploadForm = document.querySelector("#productImageUploadForm");
	productImageUploadForm.addEventListener("submit", async e => {
		e.preventDefault();
		const form = new FormData(productImageUploadForm);
		const state = await fetch("http://localhost:3000/admin/productImages", {
			method: "POST",
			credentials: "include",
			body: form
		}).then(res => res.json());
		if(state?.state === true) {
			popup.open("Bilden har laddats upp.");
			admin.loadImages();
		} else {
			popup.open("Kunde inte ladda upp bilden.");
		}
	});
	admin.loadImages();
	// Filter
	document.querySelector("#newFilterRange").addEventListener("click", e => {
		const newFilter = document.createElement("filter-range");
		document.querySelector("#filterList").appendChild(newFilter);
	});
	document.querySelector("#newFilterAlts").addEventListener("click", e => {
		const newFilter = document.createElement("filter-alts");
		document.querySelector("#filterList").appendChild(newFilter);
	});
	// LÄGG TILL ordrar!
});
