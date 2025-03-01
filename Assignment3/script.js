document.addEventListener('DOMContentLoaded', () => {
    const functionForm = document.getElementById('functionForm');
    const outputDiv = document.getElementById('output');
    const functionChartCanvas = document.getElementById('functionChart');
    let functionChart = null;
  
    /**
     * Evaluates the user-defined function safely.
     * @param {string} funcStr - The function string (e.g., "x*x").
     * @param {number} x - The input value for x.
     * @returns {number} - Evaluated function result.
     */
    function evaluateFunction(funcStr, x) {
      try {
        with (Math) {  // Allow usage of sin(x), cos(x), PI, etc.
          return eval(funcStr);
        }
      } catch (error) {
        return NaN;  // Return NaN if the function is invalid.
      }
    }
  
    /**
     * Handles form submission, computes function values, and updates the chart.
     * @param {Event} event - The form submission event.
     */
    function handleSubmit(event) {
      event.preventDefault();
  
      const funcStr = document.getElementById('functionInput').value;
      const startX = parseFloat(document.getElementById('startX').value);
      const endX = parseFloat(document.getElementById('endX').value);
      const stepX = parseFloat(document.getElementById('stepX').value);
      const yScale = parseFloat(document.getElementById('yScale').value);
  
      // Validate user input
      if (isNaN(startX) || isNaN(endX) || isNaN(stepX) || stepX <= 0) {
        outputDiv.innerHTML = '<p class="text-danger">Invalid input. Ensure valid numbers and step > 0.</p>';
        return;
      }
      if (startX > endX) {
        outputDiv.innerHTML = '<p class="text-danger">Start of x must be less than or equal to end of x.</p>';
        return;
      }
  
      const xValues = [];
      const yValues = [];
      let resultText = '<h4>Computed Function Values</h4><ul>';
  
      // Compute function values
      for (let x = startX; x <= endX; x += stepX) {
        const y = evaluateFunction(funcStr, x);
        if (!isNaN(y)) {
          xValues.push(x);
          yValues.push(y * yScale);
          resultText += `<li>f(${x}) = ${y.toFixed(5)}</li>`;
        }
      }
  
      resultText += '</ul>';
      outputDiv.innerHTML = resultText;
  
      // Plot function using Chart.js
      updateChart(xValues, yValues);
    }
  
    /**
     * Updates the Chart.js graph with new data.
     * @param {Array<number>} xValues - Array of x values.
     * @param {Array<number>} yValues - Array of y values.
     */
    function updateChart(xValues, yValues) {
      if (functionChart) {
        functionChart.destroy(); // Clear previous chart
      }
  
      functionChart = new Chart(functionChartCanvas, {
        type: 'line',
        data: {
          labels: xValues.map((x) => x.toFixed(2)),
          datasets: [{
            label: 'Function Plot',
            data: yValues,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'x' } },
            y: { title: { display: true, text: 'f(x)' } },
          },
        },
      });
    }
  
    // Attach event listener to the form
    functionForm.addEventListener('submit', handleSubmit);
  });
  