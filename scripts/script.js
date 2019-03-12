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
var alt = 1;
function addToTable(key, value) {
    if(alt === 1) {
        alt = 0;
        $('#solutions tbody tr:last').after('<tr><td>' + key + '</td><td>' + value + '</td></tr>');
    } else {
        alt = 1;
        $('#solutions tbody tr:last').after('<tr class="alt"><td>' + key + '</td><td>' + value + '</td></tr>');
    }
    if($('#solutions tbody').children().length == 0) {
        alt = 0;
        $('#solutions tbody').append('<tr><td>' + key + '</td><td>' + value + '</td></tr>');
    }
}
function clearTable() {
    $('#solutions tbody').empty();
    alt = 1;
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
function bruteForce() {
    var selected = $('#select-cipher option:selected').text();
    var text = $('#text-input').toUpperCase();
    switch (selected) {
        case "Caesar Cipher":
            var shiftStr = $('#num-shifts');
            break;
        case "Rail-Fence Cipher":
            var railsStr = $('#num-rails');
            break;
        case "Vigenère Cipher":
            var keyword = $('#keyword').toUpperCase();
            break;
        case "Substitution Cipher":
            var key = $('#key').toUpperCase();
            break;
    }
}
/* Frequency Count */
function freqCount() {
    var counts = $('#counts').children(); // .eq(num) to get nth child
    var text = $('#text-input').val().toUpperCase();
    for(var i=0; i<text.length; i++) {
        if(alphabet.includes(text[i])) {
            var ind = getIndexOfLetter(text[i]);
            var currentVal = parseInt(counts.eq(ind).text());
            counts.eq(ind).text(currentVal + 1);
        }
    }
}
function freqReset() {
    var counts = $('#counts').children(); // .eq(num) to get nth child
    var text = $('#text-input').val().toUpperCase();
    for(var i=0; i<25; i++) {
        counts.eq(i).text(0);
    }
}

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
// Rail-Fence --
function getLengthNoSpaces(string) {
    var msg = "";
    for(var i=0; i < string.length; i++) {
        if(alphabet.includes(string[i])) {
            msg += string[i];
        }
    }
    return msg.length;
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
        shift = parseInt(shift);
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
        clearTable();
        addToTable(shift, message);
        // Frequency
        freqReset();
        freqCount();
    }
}
function decryptRail() {
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var railCount = parseInt($('#num-rails').val());
    var multiD = new Array(railCount);
    var spacedBy = 0;
    var textLength = getLengthNoSpaces(text);
    for(var i=0; i<multiD.length; i++) {
        multiD[i] = new Array(textLength);
    }
    switch (railCount) {
        case 2:
            spacedBy = 1;
            break;
        case 3:
            spacedBy = 3;
            break;
        default:
            spacedBy = railCount + 1;
    }
    // Place the letters in the array spots:
    var textInd = 0;
    var currentRow = 0;
    var currentCol = 0;
    var goingUp = false;
    // [row][col]
    while(textInd < text.length) {
        if(alphabet.includes(text[textInd])) {
            multiD[currentRow][currentCol] = 0;
            currentCol++;
            textInd++;
            if (currentRow === railCount - 1 || goingUp) {
                currentRow -= 1;
                goingUp = true;
                if (currentRow === -1) {
                    currentRow = 1;
                    goingUp = false;
                }
            } else {
                currentRow++;
            }
        } else {
            textInd++;
        }
    }
    textInd = 0;
    for(var i=0; i<multiD.length; i++) {
        if(!alphabet.includes(text[textInd])) {
            textInd++;
        }
        for(var j=0; j<multiD[i].length; j++) {
            if(multiD[i][j] === 0) {
                multiD[i][j] = text[textInd];
                textInd++;
            }
        }
    }
    textInd = 0;
    currentCol = 0;
    currentRow = 0;
    goingUp = false;
    var msg = "";
    while(textInd < text.length) {
        if(alphabet.includes(text[textInd])) {
            if(alphabet.includes(multiD[currentRow][currentCol]))
                msg += multiD[currentRow][currentCol];
            currentCol++;
            textInd++;
            if (currentRow === railCount - 1 || goingUp) {
                currentRow -= 1;
                goingUp = true;
                if (currentRow === -1) {
                    currentRow = 1;
                    goingUp = false;
                }
            } else {
                currentRow++;
            }
        } else {
            textInd++;
        }
    }
    clearTable();
    addToTable(railCount, msg);
    // Frequency
    freqReset();
    freqCount();
}
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
    clearTable();
    addToTable(keyword, msg);
    // Frequency
    freqReset();
    freqCount();
}
function decryptSubstitution() {
    map = new Map();
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var keyAlpha = $('#key').val().toUpperCase();

    for(var i=0; i < 26; i++) {
        map.set(keyAlpha[i], alphabet[i]);
    }
    var msg = "";
    for(var i=0; i<text.length; i++) {
        if(alphabet.includes(text[i])) {
            var letter = map.get(text[i]);
            msg += letter;
        } else {
            msg += text[i];
        }
    }
    clearTable();
    addToTable(keyAlpha, msg);
    // Frequency
    freqReset();
    freqCount();
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
        shift = parseInt($('#num-shifts').val());
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
    $('#num-shifts').val(shift);
    textBox.val(message);
}
function encryptRail() {
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var railCount = $('#num-rails').val();
    if(railCount.length <= 0) {
        railCount = getRandomInt(0, text.length);
    } else {
        railCount = parseInt(railCount);
    }
    var currentRow = 0;
    var textInd = 0;
    var multiD = new Array(railCount);
    for(var i=0; i<multiD.length; i++) {
        multiD[i] = new Array(text.length);
    }

    var currentCol = 0;
    var goingUp = false;
    // [row][col]
    while(textInd < text.length) {
        if(alphabet.includes(text[textInd])) {
            multiD[currentRow][currentCol] = text[textInd];
            currentCol++;
            textInd++;
            if (currentRow === railCount - 1 || goingUp) {
                currentRow -= 1;
                goingUp = true;
                if (currentRow === -1) {
                    currentRow = 1;
                    goingUp = false;
                }
            } else {
                currentRow++;
            }
        } else {
            textInd++;
        }
    }

    var msg = "";
    for(var i=0; i < multiD.length; i++) {
        for(var j=0; j < multiD[i].length; j++) {
            if(alphabet.includes(multiD[i][j])) {
                msg += multiD[i][j];
            }
        }
        msg += " ";
    }
    $('#num-rails').val(railCount);
    textBox.val(msg);
}
function encryptVigenere() {
    var keyword = $('#keyword').val().toUpperCase();
    if(keyword.length <= 2) {
        // This is too low, we select a keyword for them TODO
    }
    var textBox = $('#text-input');
    var text = textBox.val().toUpperCase();
    var key = keyword;
    var keywordIndex = 0;
    while(key.length < 26) {
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
    if(keyAlpha.length !== 26) {
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
    for(var i=0; i<26; i++) {
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