document.addEventListener('DOMContentLoaded', function() {
    const incomeGoalSlider = document.getElementById('income-goal-slider');
    const incomeGoalInput = document.getElementById('income-goal-input');
    const productPriceSlider = document.getElementById('product-price-slider');
    const productPriceInput = document.getElementById('product-price-input');
    const customerCountSlider = document.getElementById('customer-count-slider');
    const customerCountInput = document.getElementById('customer-count-input');
    const resultDisplay = document.getElementById('result-display');
    const differenceDisplay = document.getElementById('difference-display');

    // Update maximum values
    incomeGoalSlider.max = 10000;
    incomeGoalInput.max = 10000;
    productPriceSlider.max = 500;
    productPriceInput.max = 500;
    customerCountSlider.max = 1000;
    customerCountInput.max = 1000;

    function updateCalculation() {
        const incomeGoal = Math.round(parseFloat(incomeGoalInput.value));
        const productPrice = parseFloat(productPriceInput.value);
        const customerCount = Math.round(parseFloat(customerCountInput.value));

        const currentProfit = productPrice * customerCount;
        const difference = currentProfit - incomeGoal;

        resultDisplay.textContent = `$${currentProfit.toFixed(2)}`;
        
        if (difference >= 0) {
            differenceDisplay.textContent = `Goal exceeded by $${difference.toFixed(2)}`;
            differenceDisplay.classList.remove('text-red-500');
            differenceDisplay.classList.add('text-green-500');
        } else {
            differenceDisplay.textContent = `Goal fallen short by $${Math.abs(difference).toFixed(2)}`;
            differenceDisplay.classList.remove('text-green-500');
            differenceDisplay.classList.add('text-red-500');
        }
    }

    function updateLinkedValue(sourceInput, targetInput, targetSlider) {
        const incomeGoal = parseFloat(incomeGoalInput.value);
        const sourceValue = parseFloat(sourceInput.value);

        if (sourceValue > 0 && incomeGoal > 0) {
            let calculatedValue;
            if (sourceInput === productPriceInput) {
                calculatedValue = Math.round(incomeGoal / sourceValue);
                targetInput.value = Math.min(Math.round(calculatedValue), 1000); // Max Customer Count
            } else {
                calculatedValue = incomeGoal / sourceValue;
                targetInput.value = Math.min(calculatedValue.toFixed(2), 500); // Max Product Price
            }
            targetSlider.value = targetInput.value;
            updateCalculation();
        }
    }

    function updateSliderAndInput(slider, input) {
        const value = Math.max(0, Math.min(parseFloat(slider.value), parseFloat(slider.max)));
        input.value = (slider.id === 'customer-count-slider' || slider.id === 'income-goal-slider') ? Math.round(value) : value.toFixed(2);
        slider.value = value;
        updateCalculation();
    }

    function updateInputAndSlider(input, slider) {
        const value = Math.max(0, Math.min(parseFloat(input.value), parseFloat(slider.max)));
        input.value = (input.id === 'customer-count-input' || input.id === 'income-goal-input') ? Math.round(value) : value.toFixed(2);
        slider.value = value;
        updateCalculation();
    }

    incomeGoalSlider.addEventListener('input', () => {
        updateSliderAndInput(incomeGoalSlider, incomeGoalInput);
        updateLinkedValue(productPriceInput, customerCountInput, customerCountSlider);
    });

    productPriceSlider.addEventListener('input', () => {
        updateSliderAndInput(productPriceSlider, productPriceInput);
        updateLinkedValue(productPriceInput, customerCountInput, customerCountSlider);
    });

    customerCountSlider.addEventListener('input', () => {
        updateSliderAndInput(customerCountSlider, customerCountInput);
        updateLinkedValue(customerCountInput, productPriceInput, productPriceSlider);
    });

    incomeGoalInput.addEventListener('input', () => {
        updateInputAndSlider(incomeGoalInput, incomeGoalSlider);
        updateLinkedValue(productPriceInput, customerCountInput, customerCountSlider);
    });

    productPriceInput.addEventListener('input', () => {
        let value = productPriceInput.value;
        // Remove any non-digit characters except for the decimal point
        value = value.replace(/[^\d.]/g, '');
        // Ensure only one decimal point
        const decimalIndex = value.indexOf('.');
        if (decimalIndex !== -1) {
            value = value.slice(0, decimalIndex + 1) + value.slice(decimalIndex + 1).replace(/\./g, '');
        }
        // Convert to float and limit to max value
        value = Math.min(parseFloat(value) || 0, 500);
        productPriceInput.value = value;
        productPriceSlider.value = value;
        updateLinkedValue(productPriceInput, customerCountInput, customerCountSlider);
        updateCalculation();
    });

    customerCountInput.addEventListener('input', () => {
        updateInputAndSlider(customerCountInput, customerCountSlider);
        updateLinkedValue(customerCountInput, productPriceInput, productPriceSlider);
    });

    updateCalculation();
});
