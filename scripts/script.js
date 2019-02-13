/**
 * Created by user on 2/12/2019.
 */

function load() {}
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