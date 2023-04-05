const express = require('express')
require('dotenv').config()
const fileUpload = require('express-fileupload');
const mime = require('mime')
const CustomStorage = require('./services/CustomStorage');
const FileShareService = require('./services/FileShareService');
const SettingMiddleware = require('./middleware/SettingMiddleware');
const IpUseDao = require("./dao/IpUseDao");
const {v4: uuidv4} = require('uuid');
const path = require("path");
require('./cronJobs');


// express app initialization
const app = express();
app.use(fileUpload());

const fileShareService = new FileShareService();
const ipUseDao = new IpUseDao();

// File upload folder
const UPLOADS_FOLDER = process.env.FOLDER;


app.post('/files', SettingMiddleware.checkUploadLimit, async (req, res) => {

    let file;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Generate a unique filename using UUID
    const uniqueFilename = uuidv4();
    const publicKey = uuidv4();
    const privateKey = uuidv4();

    // file mimeType
    const mimeType = req.files.mimeType;

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    file = req.files.file;
    // console.log(file.data)


    // Get the file extension from the original filename
    const fileExtension = file.name.split('.').pop();

    // Set the new filename with the original file extension
    const subPath = UPLOADS_FOLDER + `${uniqueFilename}.${fileExtension}`;
    uploadPath = __dirname + subPath;

    const localStorage = new CustomStorage('local', {});

    // I did not test below
    // aws storage api or gcp storage api
    // for credentials.
    // Just put example show in here

    // const awsStorage = new CustomStorage('aws', {
    //     accessKeyId: 'YOUR_AWS_ACCESS_KEY',
    //     secretAccessKey: 'YOUR_AWS_SECRET_KEY'
    // });

    // const gcpStorage = new CustomStorage('gcp', {
    //     projectId: 'YOUR_GCP_PROJECT_ID',
    //     keyFilename: 'PATH_TO_YOUR_GCP_CREDENTIALS_FILE'
    // });

    // Upload a file to localStorage
    const response = await localStorage.uploadFile('no-container-name-need', uploadPath, file);

    // Upload a file to AWS S3
    //await awsStorage.uploadFile('bucket-name', file.data, 'Hello, AWS!');

    // Download a file from GCP Storage
    // const fileData = await gcpStorage.downloadFile('bucket-name', file.data);

    if (response.status === 200) {
        await fileShareService.createUploadFile({
            url: subPath,
            public_key: publicKey,
            private_key: privateKey,
        })

        await ipUseDao.incrementCountInFieldByWhere('upload_limit', {'ip_address': req.ip_address}, 1);

        return res.status(200).send({
            message: "File upload successfully",
            publicKey: publicKey,
            privateKey: privateKey,
        });
    }
});


app.get('/files/:publicKey', SettingMiddleware.checkDownloadLimit, SettingMiddleware.checkPublicKey, async (req, res) => {

    // Determine the MIME type of the file
    const filepath = path.join(__dirname + req.file_url);

    const mimeType = mime.getType(filepath)

    // Set the appropriate Content-Type header
    res.setHeader('Content-Type', mimeType);

    const localStorage = new CustomStorage('local', {});

    await ipUseDao.incrementCountInFieldByWhere('download_limit', {'ip_address': req.ip_address}, 1);

    return await localStorage.downloadFile('', filepath, res)

});


app.delete('/files/:privateKey', SettingMiddleware.checkPrivateKey, async (req, res) => {

    const filepath = path.join(__dirname + req.file_url);

    const localStorage = new CustomStorage('local', {});

    const response = await localStorage.deleteFile('no-container-name-need', filepath)

    res.status(response.status).send({
        message: response.message
    });
});


app.listen(process.env.PORT, () => {
    console.log("app listening at port", process.env.PORT);
});
