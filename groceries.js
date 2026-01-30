
var products = [
	{
		name: "Organic Bananas",
		vegetarian: true,
		glutenFree: true,
		organic: true,
		price: 2.99
	},
	{
		name: "Whole Wheat Bread",
		vegetarian: true,
		glutenFree: false,
		organic: false,
		price: 3.49
	},
	{
		name: "Chicken Breast",
		vegetarian: false,
		glutenFree: true,
		organic: false,
		price: 8.99
	},
	{
		name: "Organic Milk",
		vegetarian: true,
		glutenFree: true,
		organic: true,
		price: 4.99
	},
	{
		name: "Gluten-Free Pasta",
		vegetarian: true,
		glutenFree: true,
		organic: false,
		price: 5.49
	},
	{
		name: "Organic Apples",
		vegetarian: true,
		glutenFree: true,
		organic: true,
		price: 3.99
	},
	{
		name: "Salmon Fillet",
		vegetarian: false,
		glutenFree: true,
		organic: false,
		price: 12.99
	},
	{
		name: "Brown Rice",
		vegetarian: true,
		glutenFree: true,
		organic: true,
		price: 2.49
	},
	{
		name: "Beef Steak",
		vegetarian: false,
		glutenFree: true,
		organic: true,
		price: 15.99
	},
	{
		name: "Regular Pasta",
		vegetarian: true,
		glutenFree: false,
		organic: false,
		price: 1.99
	}
];

// Filter products based on dietary restrictions
// Returns a new array with only matching products
function applyRestrictions(prods, restrictions) {
	var filtered = [];
	
	for (var i = 0; i < prods.length; i++) {
		var product = prods[i];
		var include = true;
		
		// Check vegetarian restriction
		if (restrictions.vegetarian && !product.vegetarian) {
			include = false;
		}
		
		// Check gluten-free restriction
		if (restrictions.glutenFree && !product.glutenFree) {
			include = false;
		}
		
		// Check organic preference
		if (restrictions.organic === "organicOnly" && !product.organic) {
			include = false;
		}
		if (restrictions.organic === "nonOrganicOnly" && product.organic) {
			include = false;
		}
		
		if (include) {
			filtered.push(product);
		}
	}
	
	return filtered;
}

// Sort products by price in ascending order
function sortByPrice(prods) {
	var sorted = prods.slice(); // Create a copy
	
	for (var i = 0; i < sorted.length; i++) {
		for (var j = i + 1; j < sorted.length; j++) {
			if (sorted[i].price > sorted[j].price) {
				// Swap elements
				var temp = sorted[i];
				sorted[i] = sorted[j];
				sorted[j] = temp;
			}
		}
	}
	
	return sorted;
}

// Calculate total price from a list of product names
function calculateTotal(productNames) {
	var total = 0;
	
	for (var i = 0; i < products.length; i++) {
		for (var j = 0; j < productNames.length; j++) {
			if (products[i].name === productNames[j]) {
				total += products[i].price;
				break;
			}
		}
	}
	
	return total;
}

// Find a product by name
function findProduct(productName) {
	for (var i = 0; i < products.length; i++) {
		if (products[i].name === productName) {
			return products[i];
		}
	}
	return null;
}