// Initialize an empty array to store generated certificate data URLs
let certificateLinks = [];

// Modify the form submit event to track the number of certificates
document.getElementById('certificateForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const fileInput = document.getElementById('nameFile').files[0];
  const templateSelect = document.getElementById('templateSelect').value;

  if (!fileInput) {
    alert("Please upload a CSV file with names.");
    return;
  }

  // Clear previous certificates and hide batch download button
  document.getElementById('certificateList').innerHTML = '';
  certificateLinks = [];
  document.getElementById('batchDownloadBtn').style.display = 'none';

  const reader = new FileReader();
  reader.onload = function(e) {
    const names = e.target.result.split('\n').map(row => row.trim()).filter(name => name);

    // Generate certificates for each name
    names.forEach((name, index) => {
      generateCertificate(name, templateSelect, index);
    });

    // Show Batch Download button if there are multiple certificates
    if (names.length > 1) {
      document.getElementById('batchDownloadBtn').style.display = 'block';
    }
  };
  reader.readAsText(fileInput);
});

function generateCertificate(name, template, index) {
  const canvas = document.getElementById('certificateCanvas');
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = `./images/${template}.png`;
  img.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Customize text properties for the name
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    const namePositionY = canvas.height / 2 + 50;
    ctx.fillText(name, canvas.width / 2, namePositionY);

    // Generate a download link for each certificate
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `certificate_${name}.png`;
    link.textContent = `Download ${name}'s Certificate`;
    link.style.display = 'block';
    document.getElementById('certificateList').appendChild(link);

    // Store each certificate data URL in an array for batch download
    certificateLinks.push({ name: name, dataURL: dataURL });
  };
}

// Add an event listener for the Batch Download button to zip all certificates
document.getElementById('batchDownloadBtn').addEventListener('click', function() {
  if (certificateLinks.length > 1) {
    downloadAllCertificates(certificateLinks);
  }
});

// Batch download function using JSZip
function downloadAllCertificates(certificateLinks) {
  const zip = new JSZip();
  const imgFolder = zip.folder("certificates");

  certificateLinks.forEach(cert => {
    const imgData = cert.dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    imgFolder.file(`certificate_${cert.name}.png`, imgData, { base64: true });
  });

  // Generate the zip file and trigger download
  zip.generateAsync({ type: "blob" }).then(function(content) {
    const zipLink = document.createElement('a');
    zipLink.href = URL.createObjectURL(content);
    zipLink.download = "Certificates.zip";
    zipLink.click();
  });
}