/**
 * generate random IDs with a length of 10
 * @return {String} a random ID
 */
module.exports = function() {

    var text     = '',
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 10; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};