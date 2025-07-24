  const form = document.getElementById('form');
    const clearBtn = document.getElementById('clearBtn');
    const resultDiv = document.getElementById('result');
    const predictionText = document.getElementById('prediction-text');
    const inputs = form.querySelectorAll('input');

    const limits = {
      coffee_intake: { min: 0, max: 20 },
      hours_of_meetings: { min: 0, max: 24 },
      bugs_assigned: { min: 0, max: 100 },
      lines_of_code_written: { min: 0, max: 5000 },
      hours_of_sleep: { min: 0, max: 24 },
      browsing_time: { min: 0, max: 24 }
    };

    function validateInput(input) {
      const name = input.name;
      const value = parseFloat(input.value.trim());
      const small = input.nextElementSibling;

      if (isNaN(value)) {
        input.classList.add('border-red-400');
        small.textContent = 'This field is required';
        small.classList.remove('hidden');
        return false;
      }

      const { min, max } = limits[name];
      if (value < min || value > max) {
        input.classList.add('border-red-400');
        small.textContent = `Must be between ${min} and ${max}`;
        small.classList.remove('hidden');
        return false;
      }

      if (name === "coffee_intake" && !Number.isInteger(value)) {
        input.classList.add('border-red-400');
        small.textContent = 'Coffee intake must be an integer';
        small.classList.remove('hidden');
        return false;
      }

      input.classList.remove('border-red-400');
      small.classList.add('hidden');
      return true;
    }

    inputs.forEach(input => {
      input.addEventListener('input', () => validateInput(input));
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      resultDiv.classList.add('hidden');
      let valid = true;
      inputs.forEach(input => {
        if (!validateInput(input)) valid = false;
      });
      if (!valid) return;

      const formData = Object.fromEntries(new FormData(form).entries());

      try {
        const response = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (response.ok) {
          predictionText.textContent = result.prediction_text;
        } else {
          predictionText.textContent = `Error: ${result.error}`;
        }

        resultDiv.classList.remove('hidden');
      } catch (err) {
        predictionText.textContent = 'Request failed. Please try again later.';
        resultDiv.classList.remove('hidden');
      }
    });

    clearBtn.addEventListener('click', () => {
      inputs.forEach(input => {
        input.value = '';
        input.classList.remove('border-red-400');
        input.nextElementSibling.classList.add('hidden');
      });
      resultDiv.classList.add('hidden');
    });