export const ITEM = "item";
export const SEPARATOR = "separator";

const dom = function (elem = "") {
	return document.querySelector(".basicContext " + elem);
};

const valid = function (item = {}) {
	let emptyItem = Object.keys(item).length === 0 ? true : false;

	if (emptyItem === true) item.type = SEPARATOR;
	if (item.type == null) item.type = ITEM;
	if (item.class == null) item.class = "";
	if (item.visible !== false) item.visible = true;
	if (item.icon == null) item.icon = null;
	if (item.title == null) item.title = "Undefined";

	// Add disabled class when item disabled
	if (item.disabled !== true) item.disabled = false;
	if (item.disabled === true) item.class += " basicContext__item--disabled";

	// Item requires a function when
	// it's not a separator and not disabled
	if (item.fn == null && item.type !== SEPARATOR && item.disabled === false) {
		console.warn(`Missing fn for item '${item.title}'`);
		return false;
	}

	return true;
};

const buildItem = function (item, num) {
	let html = "",
		icon = "";

	// Parse and validate item
	if (valid(item) === false) return "";

	// Skip when invisible
	if (item.visible === false) return "";

	// Give item a unique number
	item.num = num;

	// Generate span/icon-element
	if (item.icon !== null)
		icon = `<span class='basicContext__icon'>${item.icon}</span>`;

	// Generate item
	if (item.type === ITEM) {
		html = `
			<tr class='basicContext__item ${item.class}'>
				<td class='basicContext__data' data-num='${item.num}'>
					${icon}
					<span class='basicContext__title'>${item.title}</span>
				</td>
			</tr>
				 `;
	} else if (item.type === SEPARATOR) {
		html = `
			<tr class='basicContext__item basicContext__item--separator'></tr>
		`;
	}

	return html;
};

const build = function (items) {
	let html = "";

	html += `
		<div class='basicContextContainer'>
			<div class='basicContext'>
				<table>
					<tbody>
	`;

	items.forEach((item, i) => (html += buildItem(item, i)));

	html += `
					</tbody>
				</table>
			</div>
		</div>
	`;

	return html;
};

const bind = function (item = {}) {
	if (item.fn == null) return false;
	if (item.visible === false) return false;
	if (item.disabled === true) return false;

	dom(`td[data-num='${item.num}']`).onclick = item.fn;
	dom(`td[data-num='${item.num}']`).oncontextmenu = item.fn;

	return true;
};

export const show = function (items, e, fnClose, fnCallback) {
	// Build context
	let html = build(items);

	// Add context to the body
	document.body.insertAdjacentHTML("beforeend", html);

	// Cache the context
	let context = dom();

	// Close fn fallback
	if (fnClose == null) fnClose = close;

	// Bind click on background
	context.parentElement.onclick = fnClose;
	context.parentElement.oncontextmenu = fnClose;

	// Bind click on items
	items.forEach(bind);

	// Do not trigger default event or further propagation
	if (typeof e.preventDefault === "function") e.preventDefault();
	if (typeof e.stopPropagation === "function") e.stopPropagation();

	// Call callback when a function
	if (typeof fnCallback === "function") fnCallback();

	return true;
};

export const visible = function () {
	let elem = dom();

	return !(elem == null || elem.length === 0);
};

export const close = function () {
	if (visible() === false) return false;

	let container = document.querySelector(".basicContextContainer");

	container.parentElement.removeChild(container);

	return true;
};
