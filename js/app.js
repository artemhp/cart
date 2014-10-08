function getElementsByClassName(node, classname) {
	if (node.getElementsByClassName) { // use native implementation if available
		return node.getElementsByClassName(classname);
	} else {
		return (function getElementsByClass(searchClass, node) {
			if (node == null)
				node = document;
			var classElements = [],
							els = node.getElementsByTagName("*"),
							elsLen = els.length,
							pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)"), i, j;
			for (i = 0, j = 0; i < elsLen; i++) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		})(classname, node);
	}
}

var findId = function (elem) {
	return elem.id.match(/\d+/)[0];
};

function Cart(name) {

	this.data = {
		"items": {}
	};

	this.recalculate = function () {
		var targetQty = getElementsByClassName(document, "priceQty");
		for (var ii = 0; ii < targetQty.length; ii++) {
			var getId = findId(targetQty[ii].parentNode.parentNode);
			cart.calculateCart(getId, targetQty[ii].value);
		}
	};

	this.calculateCart = function (current, qtyVal) {
		var cost = Math.ceil(parseFloat(document.getElementById("item-" + current).childNodes[1].innerHTML) * parseInt(qtyVal) * 100) / 100; // Chrome 3
		var priceSubTotal = 0;
		var priceTax = 0;
		var priceTotal = 0;
		document.getElementById("item-" + current).childNodes[3].innerHTML = cost; // Chrome - 7
		this.data.items[String(current)] = {
			"total": cost,
			"amount": qtyVal
		};

		for (var ii in this.data.items) {
			priceSubTotal = priceSubTotal + parseFloat(this.data.items[ii].total);
		}
		priceTax = priceSubTotal * 0.2;
		priceTotal = priceTax + priceSubTotal;

		document.getElementById("subtotal").innerHTML = String(Math.ceil(priceSubTotal * 100) / 100);
		document.getElementById("tax").innerHTML = String(Math.ceil(priceTax * 100) / 100);
		document.getElementById("total").innerHTML = String(Math.ceil(priceTotal * 100) / 100);
	};

	this.controlValue = function (elem, action) {
		var current = elem.parentNode.childNodes[0]; // Chrome - 1
		var qtyVal = parseInt(current.value);
		var getId = current.parentNode.parentNode;
		if (action == "minus") {
			if (qtyVal > 1) {
				current.value = --qtyVal;
			} else {
				alert("You can't set value to 0. \n But you can remove your product by pressing trash icon");
			}
		} else {
			current.value = ++qtyVal;
		}
		this.calculateCart(findId(getId), qtyVal);
	};

	this.deleteItem = function (target) {
		var getItem = target.parentNode.parentNode;
		getItem.setAttribute("class", "pseudoTr item remove");
		delete this.data.items[findId(getItem)];
		setTimeout(function () {
			getItem.parentNode.removeChild(getItem);
		}, 1000);
		this.recalculate();
	};
}

var cart = new Cart();

var targetPlus = getElementsByClassName(document, "qtyUp");
var targetMinus = getElementsByClassName(document, "qtyDown");
var targetQty = getElementsByClassName(document, "priceQty");
var targetTrash = getElementsByClassName(document, "trash");

for (var plusIteration = 0; plusIteration < targetPlus.length; plusIteration++) {
	if (targetPlus[plusIteration].addEventListener) {
		targetPlus[plusIteration].addEventListener('click', function (elem) {
			cart.controlValue(elem.target, "plus");
		}, false);
	} else {
		function handlePlus(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			cart.controlValue(target, "plus");
		}

		targetPlus[plusIteration].attachEvent("onclick", handlePlus);
	}
}

for (var minusIteration = 0; minusIteration < targetMinus.length; minusIteration++) {
	if (targetMinus[minusIteration].addEventListener) {
		targetMinus[minusIteration].addEventListener('click', function (elem) {
			cart.controlValue(elem.target, "minus");
		}, false);
	} else {
		function handleMinus(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			cart.controlValue(target, "minus");
		}

		targetMinus[minusIteration].attachEvent("onclick", handleMinus);
	}
}

for (var onChangeIteration = 0; onChangeIteration < targetQty.length; onChangeIteration++) {
	var getId = findId(targetQty[onChangeIteration].parentNode.parentNode);
	cart.calculateCart(getId, targetQty[onChangeIteration].value);
	if (targetQty[onChangeIteration].addEventListener) {
		targetQty[onChangeIteration].addEventListener('change', function (elem) {
			cart.calculateCart(findId(targetQty[onChangeIteration].parentNode.parentNode), elem.target.value);
		}, false);
	} else {
		function handleChangeValue(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			cart.calculateCart(findId(target.parentNode.parentNode), target.value);
		}

		targetQty[onChangeIteration].attachEvent("onkeyup", handleChangeValue);
	}
}

for (var trashIteration = 0; trashIteration < targetTrash.length; trashIteration++) {
	if (targetTrash[trashIteration].addEventListener) {
		targetTrash[trashIteration].addEventListener('click', function (elem) {
			cart.deleteItem(elem.target);
		}, false);
	} else {

		function handleDeleteItem(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			cart.deleteItem(target);
		}

		targetTrash[trashIteration].attachEvent("onclick", handleDeleteItem);
	}
}

if (document.getElementById("cartForm").addEventListener) {
	document.getElementById("cartForm").addEventListener('submit', function (elem) {
		elem.preventDefault();

		alert(JSON.stringify(cart.data));

		var request= new XMLHttpRequest();
		request.open("POST", "index.php", true);
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify(cart.data));

	}, false);
} else {
	document.getElementById("cartForm").attachEvent("onclick", handleBtnClick);
	function handleBtnClick(event) {

		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}

		alert(JSON.stringify(cart.data));

		var request= new XMLHttpRequest();
		request.open("POST", "index.php", true);
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify(cart.data));

	}

}

//document.getElementById("cartForm");