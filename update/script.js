document.getElementById('certificateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('nameFile').files[0];
    const templateSelect = document.getElementById('templateSelect').value;
  
    if (!fileInput) {
      alert("Please upload a CSV file with names.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(e) {
      const names = e.target.result.split('\n').map(row => row.trim()).filter(name => name);
  
      names.forEach((name, index) => {
        generateCertificate(name, templateSelect, index);
      });
    };
    reader.readAsText(fileInput);
  });
  
  function generateCertificate(name, template, index) {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
  
    const img = new Image();
    img.src = `./images/${template}.png`;  // Ensure the template images are in the "images" folder
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      // Set text properties
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
  
      // Add Name to Certificate
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
  
      // Generate Download Link
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `certificate_${name}.png`;
      link.textContent = `Download ${name}'s Certificate`;
      link.style.display = 'block';
  
      document.getElementById('certificateList').appendChild(link);
    };
  }

