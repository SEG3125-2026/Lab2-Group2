// ============================================
// MAIN.JS - UI Interaction & Event Handlers
// ============================================

// Store user preferences
var userPrefs = {
	vegetarian: false,
	glutenFree: false,
	organic: "any"
};

// Store shopping cart items
var shoppingCart = [];

// Wait for page to load before running code
window.onload = function() {
	// Set up tab navigation
	setupTabs();
	
	// Set up preference form
	setupPreferences();
	
	// Set up product panel
	setupProducts();
	
	// Set up cart panel
	setupCart();
};

// Function to handle tab switching
function setupTabs() {
	var tabs = document.getElementsByClassName("tab");
	
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].onclick = function(event) {
			switchTab(event, this.getAttribute("data-target"));
		};
	}
}

// Switch to a specific tab
function switchTab(evt, panelId) {
	// Hide all panels
	var panels = document.getElementsByClassName("panel");
	for (var i = 0; i < panels.length; i++) {
		panels[i].classList.remove("active");
	}
	
	// Remove active class from all tabs
	var tabs = document.getElementsByClassName("tab");
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].classList.remove("active");
	}
	
	// Show selected panel
	document.getElementById(panelId).classList.add("active");
	
	// Mark tab as active
	evt.currentTarget.classList.add("active");
}

// Set up the preferences form
function setupPreferences() {
	var applyBtn = document.getElementById("applyPrefsBtn");
	
	applyBtn.onclick = function() {
		savePreferences();
	};
}

// Save user preferences from form
function savePreferences() {
	// Read checkbox values
	userPrefs.vegetarian = document.getElementById("isVegetarian").checked;
	userPrefs.glutenFree = document.getElementById("isGlutenFree").checked;
	
	// Read radio button value
	var organicRadios = document.getElementsByName("organicPref");
	for (var i = 0; i < organicRadios.length; i++) {
		if (organicRadios[i].checked) {
			userPrefs.organic = organicRadios[i].value;
			break;
		}
	}
	
	// Display products with new filters
	displayFilteredProducts();
}

// Set up the products panel
function setupProducts() {
	// Display initial product list
	displayFilteredProducts();
	
	// Clear selections button
	var resetBtn = document.getElementById("resetSelectionsBtn");
	resetBtn.onclick = function() {
		clearProductSelections();
	};
	
	// Add to cart button
	var addBtn = document.getElementById("addToCartBtn");
	addBtn.onclick = function() {
		addSelectedToCart();
	};
}

// Display products based on current filters
function displayFilteredProducts() {
	// Get filtered and sorted products
	var restrictions = {
		vegetarian: userPrefs.vegetarian,
		glutenFree: userPrefs.glutenFree,
		organic: userPrefs.organic
	};
	
	var filtered = applyRestrictions(products, restrictions);
	var sorted = sortByPrice(filtered);
	
	// Build the product list HTML
	var productList = document.getElementById("productList");
	productList.innerHTML = "";
	
	if (sorted.length === 0) {
		productList.innerHTML = '<p class="empty">No products match your preferences.</p>';
		updateActiveFilters();
		return;
	}
	
	// Create checkboxes for each product
	for (var i = 0; i < sorted.length; i++) {
		var product = sorted[i];
		
		// Create container div
		var div = document.createElement("div");
		div.className = "product-item";
		
		// Create label
		var label = document.createElement("label");
		
		// Create checkbox
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = product.name;
		checkbox.name = "product";
		
		// Create product name span
		var nameSpan = document.createElement("span");
		nameSpan.className = "product-name";
		nameSpan.textContent = product.name;
		
		// Create price span
		var priceSpan = document.createElement("span");
		priceSpan.className = "product-price";
		priceSpan.textContent = "$" + product.price.toFixed(2);
		
		// Assemble elements
		label.appendChild(checkbox);
		label.appendChild(nameSpan);
		label.appendChild(priceSpan);
		div.appendChild(label);
		productList.appendChild(div);
	}
	
	updateActiveFilters();
}

// Update the active filters display
function updateActiveFilters() {
	var filterDiv = document.getElementById("activeFilters");
	var filterList = [];
	
	if (userPrefs.vegetarian) {
		filterList.push("Vegetarian");
	}
	if (userPrefs.glutenFree) {
		filterList.push("Gluten-free");
	}
	if (userPrefs.organic === "organicOnly") {
		filterList.push("Organic only");
	} else if (userPrefs.organic === "nonOrganicOnly") {
		filterList.push("Non-organic only");
	}
	
	if (filterList.length > 0) {
		filterDiv.textContent = "Filters: " + filterList.join(", ");
	} else {
		filterDiv.textContent = "Filters: none";
	}
}

// Clear all product checkbox selections
function clearProductSelections() {
	var checkboxes = document.getElementsByName("product");
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
	}
}

// Add selected products to shopping cart
function addSelectedToCart() {
	var checkboxes = document.getElementsByName("product");
	var selectedItems = [];
	
	// Collect checked items
	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			selectedItems.push(checkboxes[i].value);
			checkboxes[i].checked = false;
		}
	}
	

	// Add items to cart (avoid duplicates)
	var addedCount = 0;
	for (var i = 0; i < selectedItems.length; i++) {
		var itemName = selectedItems[i];
		var alreadyInCart = false;
		
		for (var j = 0; j < shoppingCart.length; j++) {
			if (shoppingCart[j] === itemName) {
				alreadyInCart = true;
				break;
			}
		}
		
		if (!alreadyInCart) {
			shoppingCart.push(itemName);
			addedCount++;
		}
	}

	
	// Update cart display
	refreshCart();
}

// Set up the cart panel
function setupCart() {
	var clearBtn = document.getElementById("clearCartBtn");
	
	clearBtn.onclick = function() {
		emptyCart();
	};
	
	// Initial display
	refreshCart();
}

// Update the cart display
function refreshCart() {
	var cartDiv = document.getElementById("cartContents");
	var totalSpan = document.getElementById("cartTotal");
	
	// Empty cart message
	if (shoppingCart.length === 0) {
		cartDiv.innerHTML = '<p class="empty">Your cart is empty.</p>';
		totalSpan.textContent = "$0.00";
		return;
	}
	
	// Build cart items HTML
	cartDiv.innerHTML = "";
	
	for (var i = 0; i < shoppingCart.length; i++) {
		var itemName = shoppingCart[i];
		var product = findProduct(itemName);
		
		if (product) {
			// Create cart item div
			var itemDiv = document.createElement("div");
			itemDiv.className = "cart-item";
			
			// Item name
			var nameSpan = document.createElement("span");
			nameSpan.className = "item-name";
			nameSpan.textContent = product.name;
			
			// Item price
			var priceSpan = document.createElement("span");
			priceSpan.className = "item-price";
			priceSpan.textContent = "$" + product.price.toFixed(2);
			
			// Remove button
			var removeBtn = document.createElement("button");
			removeBtn.className = "remove-btn";
			removeBtn.textContent = "Remove";
			removeBtn.setAttribute("data-name", itemName);
			removeBtn.onclick = function() {
				removeFromCart(this.getAttribute("data-name"));
			};
			
			// Assemble item
			itemDiv.appendChild(nameSpan);
			itemDiv.appendChild(priceSpan);
			itemDiv.appendChild(removeBtn);
			cartDiv.appendChild(itemDiv);
		}
	}
	
	// Calculate and display total
	var total = calculateTotal(shoppingCart);
	totalSpan.textContent = "$" + total.toFixed(2);
}

// Remove a specific item from cart
function removeFromCart(productName) {
	// Find and remove the item
	for (var i = 0; i < shoppingCart.length; i++) {
		if (shoppingCart[i] === productName) {
			shoppingCart.splice(i, 1);
			break;
		}
	}
	
	// Update display
	refreshCart();
}

// Empty the entire cart
function emptyCart() {
	shoppingCart = [];
	refreshCart();
}