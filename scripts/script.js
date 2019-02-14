/**
 * Created by user on 2/12/2019.
 */
/** /
 INPUT-BLOCK IDS
 #select-cipher = <select> tag ID
 #caesar-key
 #rail-key
 #vigenere-key
 #substitution-key
 /**/

/** /
 KEY IDS
 #num-shifts = Caesar
 #num-rails = Rail-Fence
 #keyword = Vigenere
 #key = Substitution
 /**/
function load() {
    var selected = $('#select-cipher option:selected').text();
    $('#caesar-key').hide();
    $('#rail-key').hide();
    $('#vigenere-key').hide();
    $('#substitution-key').hide();
    switch (selected) {
        case "Caesar Cipher":
            $('#caesar-key').show();
            break;
        case "Rail-Fence Cipher":
            $('#rail-key').show();
            break;
        case "Vigenère Cipher":
            $('#vigenere-key').show();
            break;
        case "Substitution Cipher":
            $('#substitution-key').show();
            break;
        default:
            $('#caesar-key').show();
    }
}
function bruteForce(cipher) {}

/* Decrypt */
function decryptCaesar(shiftedBy) {}
function decryptRail(numRails) {}
function decryptVigenere(keyword) {}
function decryptSubstitution(key) {}

/* Encrypt */
function encryptCaesar() {}
function encryptRail() {}
function encryptVigenere() {}
function encryptSubstitution() {}

/* Summary Section Functions */
function toggleSummary(id, icon) {
    if($(id).is(":visible")) {
        $(id).slideUp();
        $(icon).removeClass("fas fa-sort-up");
        $(icon).addClass("fas fa-sort-down");
    } else {
        $(id).slideDown();
        $(icon).removeClass("fas fa-sort-down");
        $(icon).addClass("fas fa-sort-up");
    }
}