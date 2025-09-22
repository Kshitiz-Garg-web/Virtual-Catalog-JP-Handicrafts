// Range Slider Functionality
  const rangeInput = document.getElementById('customRange4');
  const rangeOutput = document.getElementById('rangeValue');

  // Check if elements exist
  if (rangeInput && rangeOutput) {
    // Set initial value
    rangeOutput.textContent = rangeInput.value || '0';

    // Add event listener with error handling
    rangeInput.addEventListener('input', function (event) {
      try {
        const value = event.target.value;
        rangeOutput.textContent = value !== null ? value : '0';
      } catch (error) {
        console.error('Error updating range value:', error);
      }
    });

    console.log('Range slider initialized successfully');
  } else {
    console.log('Range input or output element not found');
  }