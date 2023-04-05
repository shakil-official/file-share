const AWS = require('aws-sdk');
const {Storage} = require('@google-cloud/storage');
const LocalFileUpload = require('./LocalFileUpload');


class CustomStorage {
    constructor(service, credentials) {
        this.service = service;
        this.credentials = credentials;

        switch (service) {
            case 'aws':
                this.client = new AWS.S3({credentials});
                break;
            case 'gcp': // google-cloud-storage
                this.client = new Storage({credentials});
                break;
            default:
                this.client = new LocalFileUpload();
        }
    }

    async uploadFile(container, filename, data) {

        if (this.service === 'aws') {
            return await this.client.upload({Bucket: container, Key: filename, Body: data}).promise();
        }
        if (this.service === 'gcp') {
            return await this.client.bucket(container).file(filename).save(data);
        }
        if (this.service === 'local') {
            return await this.client.upload({file: data, uploadPath: filename})
        }


    }


    async downloadFile(container, filename, req = null) {

        if (this.service === 'aws') {
            const response = await this.client.getObject({Bucket: container, Key: filename}).promise();
            return response.Body;
        }
        if (this.service === 'gcp') {
            const [file] = await this.client.bucket(container).file(filename).download();
            return file;
        }
        if (this.service === 'local') {
            return await this.client.download(filename, req)
        }
    }

    async deleteFile(container, filename) {

        if (this.service === 'aws') {
            return await this.client.deleteObject({Bucket: container, Key: filename}).promise();
        }
        if (this.service === 'gcp') {
            return await this.client.bucket(container).file(filename).delete();
        }
        if (this.service === 'local') {
            return await this.client.deleteFile(filename)
        }
    }
}

module.exports = CustomStorage;


