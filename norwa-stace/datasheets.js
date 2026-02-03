document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('.folder');
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const pdfList = document.getElementById('pdf-list');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfViewerContainer = document.getElementById('pdf-viewer-container');
    const closeBtn = document.querySelector('.close-btn');

    // Open the modal and populate it with content from the clicked folder
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            // Get title from the clicked folder
            const folderName = folder.querySelector('.folder-name').textContent;
            modalTitle.textContent = folderName;

            // Get the HTML content of the hidden links
            const linksHtml = folder.querySelector('.datasheet-links').innerHTML;
            pdfList.innerHTML = linksHtml;

            // Show the modal
            modal.style.display = 'block';
        });
    });

    // Handle clicks inside the PDF list (for viewing PDFs)
    pdfList.addEventListener('click', (event) => {
        // Check if a view link was clicked
        if (event.target.classList.contains('pdf-view-link')) {
            event.preventDefault(); // Prevent opening in a new tab
            const pdfPath = event.target.getAttribute('href');
            pdfViewer.src = pdfPath;
            pdfViewerContainer.style.display = 'block'; // Show the viewer
        }
    });

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
        pdfList.innerHTML = ''; // Clear the list
        pdfViewer.src = '';     // Clear the iframe
        pdfViewerContainer.style.display = 'none'; // Hide the viewer
    };

    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});