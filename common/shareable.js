/**
 * Download Files
 */
exports.downloadFile = (req, res, next) => {
    var file = req.params.file;
    var fileLocation = './public/downloads/'+file;
    res.download(fileLocation, file);
}