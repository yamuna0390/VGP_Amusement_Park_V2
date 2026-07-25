const mealRepository = require("../../repositories/mealRepository");

const calculateMealPricing = async (meals = []) => {
    if (!meals.length) {
        return {
            subtotal: 0,
            items: [],
        };
    }

    // Remove duplicate meal codes
    const codes = [...new Set(meals.map(meal => meal.mealType))];

    // Fetch all meals in one query
    const mealRows = await mealRepository.getMealsByCodes(codes);

    // Create lookup map
    const mealMap = {};

    mealRows.forEach(meal => {
        mealMap[meal.code] = meal;
    });

    let subtotal = 0;
    const items = [];

    for (const meal of meals) {

        const mealInfo = mealMap[meal.mealType];

        if (!mealInfo) {
            throw new Error(`Invalid meal type: ${meal.mealType}`);
        }

        const quantity = Number(meal.quantity);
        const unitPrice = Number(mealInfo.price);

        const totalPrice = Number((quantity * unitPrice).toFixed(2));

        subtotal += totalPrice;

        items.push({
            mealType: mealInfo.code,
            mealName: mealInfo.name,
            quantity,
            unitPrice,
            totalPrice,
        });
    }

    subtotal = Number(subtotal.toFixed(2));

    return {
        subtotal,
        items,
    };
};

module.exports = {
    calculateMealPricing,
};