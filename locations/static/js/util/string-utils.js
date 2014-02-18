String.prototype.convertNewlinesToBreaks = function() {
    return this.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br/>$2')
}