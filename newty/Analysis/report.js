document.getElementById('reportForm').addEventListener('submit', function(event) {
    const fileInput = document.getElementById('fileAttachment');
    const file = fileInput.files[0];
    const maxFileSize = 2 * 1024 * 1024; 
    // the maxmum file that can be uploadedis 2mbs




    if (file && file.size > maxFileSize) {
        //  more than 2mbs it will not upload and tell you to upload a smaller file 
        alert('The selected file exceeds the maximum size of 2MB. Please choose a smaller file.');
        event.preventDefault(); 
    }

    

        // if you fill the fields and forget the mandatory files which represented by (*)   it will ask you to fill it 
    const requiredFields = document.querySelectorAll('[required]');
    let allFieldsFilled = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allFieldsFilled = false;
        }
    });

    if (!allFieldsFilled) {
        alert('Please fill out all mandatory fields.');
        event.preventDefault();
    }
});