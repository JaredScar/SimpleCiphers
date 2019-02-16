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
            $('#encrypt-btn').attr('onclick', 'encryptCaesar();');
            $('#decrypt-btn').attr('onclick', 'decryptCaesar();');
            break;
        case "Rail-Fence Cipher":
            $('#rail-key').show();
            $('#encrypt-btn').attr('onclick', 'encryptRail();');
            $('#decrypt-btn').attr('onclick', 'decryptRail();');
            break;
        case "Vigenère Cipher":
            $('#vigenere-key').show();
            $('#encrypt-btn').attr('onclick', 'encryptVigenere();');
            $('#decrypt-btn').attr('onclick', 'decryptVigenere();');
            break;
        case "Substitution Cipher":
            $('#substitution-key').show();
            $('#encrypt-btn').attr('onclick', 'encryptSubstitution();');
            $('#decrypt-btn').attr('onclick', 'decryptSubstitution();');
            break;
        default:
            $('#caesar-key').show();
            $('#encrypt-btn').attr('onclick', 'encryptCaesar();');
            $('#decrypt-btn').attr('onclick', 'decryptCaesar();');
    }
}

/* Useful Variables */
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var genTable = {
    a: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    b: 'BCDEFGHIJKLMNOPQRSTUVWXYZA',
    c: 'CDEFGHIJKLMNOPQRSTUVWXYZAB',
    d: 'DEFGHIJKLMNOPQRSTUVWXYZABC',
    e: 'EFGHIJKLMNOPQRSTUVWXYZABCD',
    f: 'FGHIJKLMNOPQRSTUVWXYZABCDE',
    g: 'GHIJKLMNOPQRSTUVWXYZABCDEF',
    h: 'HIJKLMNOPQRSTUVWXYZABCDEFG',
    i: 'IJKLMNOPQRSTUVWXYZABCDEFGH',
    j: 'JKLMNOPQRSTUVWXYZABCDEFGHI',
    k: 'KLMNOPQRSTUVWXYZABCDEFGHIJ',
    l: 'LMNOPQRSTUVWXYZABCDEFGHIJK',
    m: 'MNOPQRSTUVWXYZABCDEFGHIJKL',
    n: 'NOPQRSTUVWXYZABCDEFGHIJKLM',
    o: 'OPQRSTUVWXYZABCDEFGHIJKLMN',
    p: 'PQRSTUVWXYZABCDEFGHIJKLMNO',
    q: 'QRSTUVWXYZABCDEFGHIJKLMNOP',
    r: 'RSTUVWXYZABCDEFGHIJKLMNOPQ',
    s: 'STUVWXYZABCDEFGHIJKLMNOPQR',
    t: 'TUVWXYZABCDEFGHIJKLMNOPQRS',
    u: 'UVWXYZABCDEFGHIJKLMNOPQRST',
    v: 'VWXYZABCDEFGHIJKLMNOPQRSTU',
    w: 'WXYZABCDEFGHIJKLMNOPQRSTUV',
    x: 'XYZABCDEFGHIJKLMNOPQRSTUVW',
    y: 'YZABCDEFGHIJKLMNOPQRSTUVWX',
    z: 'ZABCDEFGHIJKLMNOPQRSTUVWXY'
};
var map = new Map();

/* BruteForce */
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
// Vigenere --
function getValueFromLetter(letter) {
    var letterInd = getIndexOfLetter(letter);
    for(var key in genTable) {
        if(genTable[key][0] === alphabet[letterInd]) {
            return genTable[key];
        }
    }
    return "";
}
function getColLetterFromRowLetter(row, letter) {
    for(var i=0; i < row.length; i++) {
        if(row[i] === letter) {
            return alphabet[i];
        }
    }
    return null;
}

/* Decrypt */
function decryptCaesar() {
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var shift = $('#num-shifts').val();
    if(shift === "") {
        // Alert them they need to use a shift or could bruteforce it
    } else {
        // Solve it with shift
        shift = parseInt(shift) - 1;
        var message = "";
        for(var i=0; i < text.length; i++) {
            if(alphabet.includes(text[i])) {
                var newLetterIn = getIndexOfLetter(text[i]) - shift;
                while (newLetterIn < 0) {
                    newLetterIn += 25;
                }
                message += alphabet[newLetterIn];
            } else {
                message += text[i];
            }
        }
        textBox.val(message);
    }
}
function decryptRail() {}
function decryptVigenere() {
    var keyword = $('#keyword').val().toUpperCase();
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var key = keyword;
    var keywordIndex = 0;
    while(key.length < 25) {
        if(keywordIndex >= keyword.length)
            keywordIndex = 0;
        key += keyword[keywordIndex];
        keywordIndex++;
    }
    var rowInd = 0;
    var msg = "";
    for(var i=0; i < text.length; i++) {
        if(alphabet.includes(text[i])) {
            var row = getValueFromLetter(key[rowInd]);
            var letter = text[i];
            var colLetter = getColLetterFromRowLetter(row, letter);
            msg += colLetter;
            if (rowInd >= key.length)
                rowInd = 0;
            else
                rowInd++;
        } else {
            msg += text[i];
        }
    }
    textBox.val(msg);
}
function decryptSubstitution() {
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var keyAlpha = $('#substitution-key').val().toUpperCase();
    // TODO
}

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
        shift = parseInt($('#num-shifts').val()) - 1;
    }
    var message = "";
    for(var i=0; i < text.length; i++) {
        if(alphabet.includes(text[i])) {
            var letterIndex = getIndexOfLetter(text[i]);
            var newLetter = letterIndex + shift;
            while(newLetter > 25) {
                newLetter -= 25;
            }
            message += alphabet[newLetter];
        } else {
            message += " ";
        }
    }
    $('#num-shifts').val(shift + 1);
    textBox.val(message);
}
function encryptRail() {}
function encryptVigenere() {
    var keyword = $('#keyword').val().toUpperCase();
    if(keyword.length <= 2) {
        // This is too low, we select a keyword for them TODO
    }
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var key = keyword;
    var keywordIndex = 0;
    while(key.length < 25) {
        if(keywordIndex >= keyword.length)
            keywordIndex = 0;
        key += keyword[keywordIndex];
        keywordIndex++;
    }
    var message = "";
    var rowInd = 0;
    for(var i = 0; i < text.length; i++) {
        if(alphabet.includes(text[i])) {
            var rowString = getValueFromLetter(key[rowInd]); // Need to get text letter and use here
            var colInd = getIndexOfLetter(text[i]);
            var letter = rowString[colInd];
            message += letter;
            if (rowInd >= key.length)
                rowInd = 0;
            else
                rowInd++;
        } else {
            message += text[i];
        }
    }
    textBox.val(message);
}
function encryptSubstitution() {
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var keyAlpha = $('#key').val().toUpperCase();
    if(keyAlpha.length !== 25) {
        // Random alphabet generate:
        var ind = 0;
        while(ind < 26) {
            var randNum = getRandomInt(0, 25);
            var used = false;
            for(var [key] of map.entries()) {
                if(map.get(key) === alphabet[randNum]) {
                    used = true;
                    break;
                }
            }
            if(!used && !map.has(alphabet[ind])) {
                map.set(alphabet[ind], alphabet[randNum]);
                ind++;
            }
        }
        keyAlpha = "";
        for(var [key] of map.entries()) {
            keyAlpha += map.get(key);
        }
        $('#key').val(keyAlpha);
    }
    // Encrypt via substutition below:
    var msg = "";
    for(var i=0; i<25; i++) {
        var letterVal = keyAlpha[i];
        var letterKey = alphabet[i];
        map.set(letterKey, letterVal);
    }
    for(var i=0; i < text.length; i++) {
        if(alphabet.includes(text[i])) {
            var letter = text[i];
            var newLetter = map.get(letter);
            msg += newLetter;
        } else {
            msg += text[i];
        }
    }
    textBox.val(msg);
}

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