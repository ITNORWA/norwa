document.addEventListener('DOMContentLoaded', () => {
    const pdfLinks = document.querySelectorAll('.pdf-link');
    const pdfViewer = document.getElementById('pdf-viewer');

    if (pdfLinks.length > 0) {
        // 1. Automatically load the first PDF into the viewer on page load
        const firstPdfPath = pdfLinks[0].getAttribute('href');
        pdfViewer.src = firstPdfPath;
        pdfLinks[0].classList.add('active'); // Highlight the first PDF

        // 2. Add click event listeners to all PDF links
        pdfLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the link from navigating away

                // Get the path of the clicked PDF
                const pdfPath = this.getAttribute('href');

                // Load the new PDF into the iframe
                pdfViewer.src = pdfPath;

                // 3. Manage the 'active' class for styling
                // Remove 'active' from all links
                pdfLinks.forEach(l => l.classList.remove('active'));
                // Add 'active' to the clicked link
                this.classList.add('active');
            });
        });
    }
});