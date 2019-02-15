/**
 * Created by user on 2/12/2019.
 */
/** /
 INPUT-BLOCK IDS
 #select-cipher = <select> tag ID
 #text-input = Text to Encrypt/Decrypt

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
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function bruteForce() {}

/* Useful Functions */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Caesar --
function getIndexOfLetter(letter) {
    for(var i=0; i < alphabet.length; i++) {
        if(alphabet[i] === letter) {
            return i;
        }
    }
    return -1;
}

/* Decrypt */
function decryptCaesar() {}
function decryptRail() {}
function decryptVigenere() {}
function decryptSubstitution() {}

/* Encrypt */
function encryptCaesar() {
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var shift = $('#num-shifts').val();
    if(shift === "") {
        // We use a random from 1-25
        shift = getRandomInt(0, 25);
    } else {
        // We use what they specified
        shift = parseInt($('#num-shifts').val());
    }
    var message = "";
    for(var i=0; i < text.length; i++) {
        if(alphabet.includes(text[i])) {
            var letterIndex = getIndexOfLetter(text[i]);
            var newLetter = letterIndex + shift;
            if (newLetter > 25)
                newLetter -= 25;
            message += alphabet[newLetter];
        } else {
            message += " ";
        }
    }
    $('#num-shifts').val(shift);
    textBox.val(message);
}
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