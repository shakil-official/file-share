const fs = require('fs');
const path = require('path');

class LocalFileUpload {

    upload = ({file, uploadPath}) => {
        let upload = true;

        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, function (err) {
            if (err) {
                upload = false;
            }
        });

        if (upload) {
            return {
                status: 200,
                message: "File uploaded successfully",
                data: uploadPath,
            }
        }

        return {
            status: 422,
            message: "File uploaded failed",
            data: null,
        }
    }

    download = (filePath, res) => {

        // Send the file to the client
        return res.sendFile(filePath);
    }

    deleteFile = (filePath) => {
        try {
            fs.unlinkSync(filePath)

            return {
                status: 200,
                message: "File remove successfully",
            }
        } catch (e) {
            return {
                status: 422,
                message: "File remove failed",
                data: null,
            }
        }
    }
}

module.exports = LocalFileUpload;