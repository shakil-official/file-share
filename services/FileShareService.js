const UploaderDao = require('../dao/UploaderDao')
const IpUseDao = require('../dao/IpUseDao')

class FileShareService {
    constructor() {
        this.uploaderDao = new UploaderDao();
        this.ipUseDao = new IpUseDao();
    }

    createUploadFile = async (data) => {
        return await this.uploaderDao.create(data)
    }


    resetUses = async () => {
        return await this.ipUseDao.updateWhere({
            download_limit: 0,
            upload_limit: 0,
        }, {})
    }

}

module.exports = FileShareService
