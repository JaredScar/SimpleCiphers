"use strict";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ENGLISH = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.15, 0.8, 4.0, 2.4, 6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.15, 2.0, 0.07];

const genTable = {
    a: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    b: "BCDEFGHIJKLMNOPQRSTUVWXYZA",
    c: "CDEFGHIJKLMNOPQRSTUVWXYZAB",
    d: "DEFGHIJKLMNOPQRSTUVWXYZABC",
    e: "EFGHIJKLMNOPQRSTUVWXYZABCD",
    f: "FGHIJKLMNOPQRSTUVWXYZABCDE",
    g: "GHIJKLMNOPQRSTUVWXYZABCDEF",
    h: "HIJKLMNOPQRSTUVWXYZABCDEFG",
    i: "IJKLMNOPQRSTUVWXYZABCDEFGH",
    j: "JKLMNOPQRSTUVWXYZABCDEFGHI",
    k: "KLMNOPQRSTUVWXYZABCDEFGHIJ",
    l: "LMNOPQRSTUVWXYZABCDEFGHIJK",
    m: "MNOPQRSTUVWXYZABCDEFGHIJKL",
    n: "NOPQRSTUVWXYZABCDEFGHIJKLM",
    o: "OPQRSTUVWXYZABCDEFGHIJKLMN",
    p: "PQRSTUVWXYZABCDEFGHIJKLMNO",
    q: "QRSTUVWXYZABCDEFGHIJKLMNOP",
    r: "RSTUVWXYZABCDEFGHIJKLMNOPQ",
    s: "STUVWXYZABCDEFGHIJKLMNOPQR",
    t: "TUVWXYZABCDEFGHIJKLMNOPQRS",
    u: "UVWXYZABCDEFGHIJKLMNOPQRST",
    v: "VWXYZABCDEFGHIJKLMNOPQRSTU",
    w: "WXYZABCDEFGHIJKLMNOPQRSTUV",
    x: "XYZABCDEFGHIJKLMNOPQRSTUVW",
    y: "YZABCDEFGHIJKLMNOPQRSTUVWX",
    z: "ZABCDEFGHIJKLMNOPQRSTUVWXY"
};

const hints = {
    "Caesar Cipher": "Shift each letter by a fixed number. There are only 25 useful shifts, so brute force is instant.",
    "Rail-Fence Cipher": "Write the letters in a zigzag, then read each rail. Brute force tries every rail count.",
    "Vigenère Cipher": "A repeating keyword picks a different shift per letter. Brute force needs that keyword.",
    "Substitution Cipher": "Each letter maps to one other letter. Brute force needs the 26-letter key. Use the frequency chart to guess."
};

const examples = {
    "Caesar Cipher": { text: "MEET ME AT THE FORUM", shift: "3" },
    "Rail-Fence Cipher": { text: "WE ARE DISCOVERED FLEE AT ONCE", rails: "3" },
    "Vigenère Cipher": { text: "ATTACK AT DAWN", keyword: "LEMON" },
    "Substitution Cipher": { text: "MEET AT THE OLD BRIDGE", key: "QWERTYUIOPASDFGHJKLZXCVBNM" }
};

const els = {};
const freq = { cols: [], bars: [], ticks: [], counts: [] };
let lastResult = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
    els.form = document.getElementById("cipher-form");
    els.select = document.getElementById("select-cipher");
    els.hint = document.getElementById("cipher-hint");
    els.shift = document.getElementById("num-shifts");
    els.rails = document.getElementById("num-rails");
    els.keyword = document.getElementById("keyword");
    els.key = document.getElementById("key");
    els.text = document.getElementById("text-input");
    els.count = document.getElementById("letter-count");
    els.preview = document.getElementById("preview");
    els.notice = document.getElementById("notice");
    els.banner = document.getElementById("result-banner");
    els.kicker = document.getElementById("result-kicker");
    els.result = document.getElementById("result-text");
    els.actions = document.getElementById("result-actions");
    els.caption = document.getElementById("table-caption");
    els.wrap = document.getElementById("table-wrap");
    els.tbody = document.querySelector("#solutions tbody");
    els.empty = document.getElementById("empty-solutions");
    els.chart = document.getElementById("freq-chart");
    els.freqMeta = document.getElementById("freq-meta");
    els.keys = {
        "Caesar Cipher": document.getElementById("caesar-key"),
        "Rail-Fence Cipher": document.getElementById("rail-key"),
        "Vigenère Cipher": document.getElementById("vigenere-key"),
        "Substitution Cipher": document.getElementById("substitution-key")
    };

    buildFrequencyChart();
    els.form.addEventListener("submit", (event) => {
        event.preventDefault();
        onEncrypt();
    });
    document.getElementById("decrypt-btn").addEventListener("click", onDecrypt);
    document.getElementById("brute-btn").addEventListener("click", onBrute);
    document.getElementById("example-btn").addEventListener("click", useExample);
    document.getElementById("clear-btn").addEventListener("click", clearMessage);
    document.getElementById("copy-btn").addEventListener("click", copyResult);
    document.getElementById("use-btn").addEventListener("click", useResult);
    els.select.addEventListener("change", () => {
        setNotice("");
        clearOutput();
        applyCipher();
        renderPreview();
    });
    [els.shift, els.rails, els.keyword, els.key].forEach((input) => {
        input.addEventListener("input", () => {
            setNotice("");
            clearOutput();
            renderPreview();
        });
    });
    els.text.addEventListener("input", () => {
        setNotice("");
        refreshFromMessage();
    });

    applyCipher();
    refreshFromMessage();
}

function selectedCipher() {
    return els.select.options[els.select.selectedIndex].text;
}

function applyCipher() {
    const name = selectedCipher();
    Object.entries(els.keys).forEach(([cipher, node]) => {
        node.hidden = cipher !== name;
    });
    els.hint.textContent = hints[name];
}

function lettersOnly(value) {
    return value.toUpperCase().split("").filter((ch) => alphabet.includes(ch)).join("");
}

function letterCount(value) {
    return lettersOnly(value).length;
}

function setNotice(message, kind) {
    if (!message) {
        els.notice.hidden = true;
        els.notice.textContent = "";
        els.notice.classList.remove("warn");
        return;
    }
    els.notice.hidden = false;
    els.notice.textContent = message;
    els.notice.classList.toggle("warn", kind === "warn");
}

function clearOutput() {
    lastResult = "";
    els.banner.hidden = true;
    els.kicker.textContent = "";
    els.result.textContent = "";
    els.tbody.replaceChildren();
    els.wrap.hidden = true;
    els.empty.hidden = false;
    els.caption.textContent = "Waiting for a run";
}

function refreshFromMessage() {
    clearOutput();
    updateLetterCount();
    updateFrequency();
    renderPreview();
}

function updateLetterCount() {
    const count = letterCount(els.text.value);
    els.count.textContent = count === 0 ? "No letters yet" : count + (count === 1 ? " letter" : " letters");
}

function showRows(pairs, caption) {
    const fragment = document.createDocumentFragment();
    pairs.forEach(([key, value]) => {
        const row = document.createElement("tr");
        const keyCell = document.createElement("td");
        const valueCell = document.createElement("td");
        keyCell.textContent = key;
        valueCell.textContent = value;
        row.append(keyCell, valueCell);
        fragment.append(row);
    });
    els.tbody.replaceChildren(fragment);
    const hasRows = pairs.length > 0;
    els.wrap.hidden = !hasRows;
    els.empty.hidden = hasRows;
    els.caption.textContent = caption;
}

function showResult(kicker, text, withActions) {
    els.banner.hidden = false;
    els.kicker.textContent = kicker;
    els.result.textContent = text;
    els.actions.hidden = !withActions;
    lastResult = withActions ? text : "";
    try {
        els.banner.scrollIntoView({ block: "nearest", behavior: "instant" });
    } catch (error) {
        els.banner.scrollIntoView({ block: "nearest" });
    }
}

function requireMessage() {
    if (letterCount(els.text.value) === 0) {
        setNotice("Enter a message with at least one letter.", "warn");
        els.text.focus();
        return false;
    }
    return true;
}

function onEncrypt() {
    const name = selectedCipher();
    const text = els.text.value;
    if (!requireMessage()) return;

    if (name === "Caesar Cipher") {
        let shift = readShift(false);
        if (shift === null) {
            shift = randomInt(1, 25);
            els.shift.value = String(shift);
        }
        const result = caesar(text, shift, false);
        publish("Encrypted · shift " + shift, result, [[String(shift), result]]);
        return;
    }

    if (name === "Rail-Fence Cipher") {
        const count = letterCount(text);
        let rails = readRails(false);
        if (rails === null) {
            if (count < 3) {
                setNotice("Use at least 3 letters before picking rails at random.", "warn");
                return;
            }
            rails = randomInt(2, Math.min(6, count - 1));
            els.rails.value = String(rails);
        }
        if (!validRails(rails, count)) return;
        const result = rail(text, rails, false);
        publish("Encrypted · " + rails + " rails", result, [[String(rails), result]]);
        return;
    }

    if (name === "Vigenère Cipher") {
        const keyword = cleanKeyword(els.keyword.value);
        if (!keyword) {
            setNotice("Enter a keyword made of letters.", "warn");
            els.keyword.focus();
            return;
        }
        if (keyword !== els.keyword.value.toUpperCase().replace(/\s+/g, "")) {
            setNotice("Use letters only in the keyword.", "warn");
            return;
        }
        els.keyword.value = keyword;
        const result = vigenere(text, keyword, false);
        const note = keyword.length === 1 ? " A one-letter keyword is a Caesar cipher." : "";
        publish("Encrypted · keyword " + keyword, result, [[keyword, result]]);
        if (note) setNotice(note.trim());
        return;
    }

    let key = cleanKeyword(els.key.value);
    let generated = false;
    if (!key) {
        key = randomAlphabet();
        generated = true;
    } else if (!isPermutation(key)) {
        setNotice("The key needs 26 unique letters, A through Z, each used once.", "warn");
        els.key.focus();
        return;
    }
    els.key.value = key;
    const result = substitution(text, key, false);
    publish("Encrypted · substitution key", result, [[key, result]]);
    if (generated) {
        setNotice("Filled in a random 26-letter key so the substitution stays reversible.");
    }
}

function onDecrypt() {
    const name = selectedCipher();
    const text = els.text.value;
    if (!requireMessage()) return;

    if (name === "Caesar Cipher") {
        const shift = readShift(true);
        if (shift === null) {
            setNotice("Enter a shift from 0 to 25, or run a brute-force attack.", "warn");
            els.shift.focus();
            return;
        }
        const result = caesar(text, shift, true);
        publish("Decrypted · shift " + shift, result, [[String(shift), result]]);
        return;
    }

    if (name === "Rail-Fence Cipher") {
        const rails = readRails(true);
        const count = letterCount(text);
        if (rails === null || !validRails(rails, count)) {
            if (rails === null) setNotice("Enter at least 2 rails.", "warn");
            return;
        }
        const result = rail(text, rails, true);
        publish("Decrypted · " + rails + " rails", result, [[String(rails), result]]);
        return;
    }

    if (name === "Vigenère Cipher") {
        const keyword = cleanKeyword(els.keyword.value);
        if (!keyword || keyword !== els.keyword.value.toUpperCase().replace(/\s+/g, "")) {
            setNotice("Enter a keyword made of letters.", "warn");
            els.keyword.focus();
            return;
        }
        const result = vigenere(text, keyword, true);
        publish("Decrypted · keyword " + keyword, result, [[keyword, result]]);
        return;
    }

    const key = cleanKeyword(els.key.value);
    if (!isPermutation(key)) {
        setNotice("Decryption needs the same 26-letter key that encrypted the message.", "warn");
        els.key.focus();
        return;
    }
    const result = substitution(text, key, true);
    publish("Decrypted · substitution key", result, [[key, result]]);
}

function onBrute() {
    const name = selectedCipher();
    const text = els.text.value;
    if (!requireMessage()) return;

    if (name === "Caesar Cipher") {
        const pairs = [];
        for (let shift = 1; shift <= 25; shift++) {
            pairs.push([String(shift), caesar(text, shift, true)]);
        }
        showRows(pairs, "25 shifts");
        showResult("Caesar brute force", "25 shifts. Read down the table for English.", false);
        renderPreview();
        return;
    }

    if (name === "Rail-Fence Cipher") {
        const count = letterCount(text);
        if (count < 3) {
            setNotice("Add a longer message. Rail brute force starts at 2 rails.", "warn");
            return;
        }
        const maxRails = Math.min(count - 1, 24);
        const pairs = [];
        for (let rails = 2; rails <= maxRails; rails++) {
            pairs.push([String(rails), rail(text, rails, true)]);
        }
        showRows(pairs, maxRails - 1 + " rail counts");
        const extra = count - 1 > 24 ? " Stopped at 24 rails so the page stays responsive." : "";
        showResult("Rail-fence brute force", "Rails 2 through " + maxRails + ". The readable row is the plaintext." + extra, false);
        renderPreview();
        return;
    }

    if (name === "Vigenère Cipher") {
        const keyword = cleanKeyword(els.keyword.value);
        if (!keyword) {
            setNotice("Vigenère is too large to search without the keyword. The frequency chart is the place to start if you do not have it.", "warn");
            return;
        }
        const result = vigenere(text, keyword, true);
        publish("Decrypted with the keyword you already have", result, [[keyword, result]]);
        setNotice("The keyword is required. This is a decrypt, not a search over every possible word.");
        return;
    }

    const key = cleanKeyword(els.key.value);
    if (!isPermutation(key)) {
        setNotice("A substitution alphabet is far too large to brute-force here. Compare the chart below with typical English and guess the common letters.", "warn");
        return;
    }
    const result = substitution(text, key, true);
    publish("Decrypted with the alphabet you supplied", result, [[key, result]]);
    setNotice("There are 26 factorial possible alphabets. This run only applies the key in the box.");
}

function publish(kicker, result, pairs) {
    setNotice("");
    showRows(pairs, pairs.length === 1 ? "1 result" : pairs.length + " results");
    showResult(kicker, result, true);
    renderPreview();
}

function useExample() {
    const example = examples[selectedCipher()];
    els.text.value = example.text;
    if (example.shift) els.shift.value = example.shift;
    if (example.rails) els.rails.value = example.rails;
    if (example.keyword) els.keyword.value = example.keyword;
    if (example.key) els.key.value = example.key;
    setNotice("Example loaded. Encrypt it, or edit it first.");
    refreshFromMessage();
    setNotice("Example loaded. Encrypt it, or edit it first.");
}

function clearMessage() {
    els.text.value = "";
    setNotice("");
    refreshFromMessage();
}

async function copyResult() {
    if (!lastResult) return;
    try {
        await navigator.clipboard.writeText(lastResult);
        setNotice("Copied the result.");
    } catch (error) {
        setNotice("Clipboard blocked. Select the result and copy it from there.", "warn");
    }
}

function useResult() {
    if (!lastResult) return;
    els.text.value = lastResult;
    refreshFromMessage();
    setNotice("The result is now the message. Decrypt it with the key, or brute-force it.");
}

function readShift(required) {
    const raw = els.shift.value.trim();
    if (raw === "") return required ? null : null;
    const parsed = Number(raw);
    if (!Number.isInteger(parsed)) return null;
    return ((parsed % 26) + 26) % 26;
}

function readRails(required) {
    const raw = els.rails.value.trim();
    if (raw === "") return null;
    const parsed = Number(raw);
    if (!Number.isInteger(parsed)) return null;
    return parsed;
}

function validRails(rails, count) {
    if (rails < 2) {
        setNotice("Use at least 2 rails.", "warn");
        return false;
    }
    if (rails >= count) {
        setNotice("Use fewer rails than there are letters.", "warn");
        return false;
    }
    return true;
}

function cleanKeyword(value) {
    return value.toUpperCase().split("").filter((ch) => alphabet.includes(ch)).join("");
}

function isPermutation(key) {
    if (key.length !== 26) return false;
    const seen = new Set(key);
    return seen.size === 26 && key.split("").every((ch) => alphabet.includes(ch));
}

function randomAlphabet() {
    const chars = alphabet.split("");
    for (let i = chars.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        const swap = chars[i];
        chars[i] = chars[j];
        chars[j] = swap;
    }
    return chars.join("");
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function caesar(text, shift, decrypt) {
    const amount = decrypt ? -shift : shift;
    let message = "";
    for (const ch of text.toUpperCase()) {
        const index = alphabet.indexOf(ch);
        if (index === -1) {
            message += ch;
        } else {
            message += alphabet[(index + amount + 26) % 26];
        }
    }
    return message;
}

function railPattern(length, rails) {
    const pattern = [];
    let row = 0;
    let goingUp = false;
    for (let i = 0; i < length; i++) {
        pattern.push(row);
        if (row === rails - 1 || goingUp) {
            row -= 1;
            goingUp = true;
            if (row === -1) {
                row = 1;
                goingUp = false;
            }
        } else {
            row += 1;
        }
    }
    return pattern;
}

function rail(text, rails, decrypt) {
    const letters = lettersOnly(text);
    const pattern = railPattern(letters.length, rails);
    const rows = Array.from({ length: rails }, () => []);
    if (!decrypt) {
        for (let i = 0; i < letters.length; i++) rows[pattern[i]].push(letters[i]);
        return rows.map((row) => row.join("")).join(" ");
    }
    const counts = Array(rails).fill(0);
    pattern.forEach((row) => {
        counts[row] += 1;
    });
    let cursor = 0;
    for (let row = 0; row < rails; row++) {
        rows[row] = letters.slice(cursor, cursor + counts[row]).split("");
        cursor += counts[row];
    }
    const pointers = Array(rails).fill(0);
    let message = "";
    pattern.forEach((row) => {
        message += rows[row][pointers[row]];
        pointers[row] += 1;
    });
    return message;
}

function vigenere(text, keyword, decrypt) {
    let keyIndex = 0;
    let message = "";
    for (const ch of text.toUpperCase()) {
        if (!alphabet.includes(ch)) {
            message += ch;
            continue;
        }
        const row = genTable[keyword[keyIndex].toLowerCase()];
        if (decrypt) {
            message += alphabet[row.indexOf(ch)];
        } else {
            message += row[alphabet.indexOf(ch)];
        }
        keyIndex = (keyIndex + 1) % keyword.length;
    }
    return message;
}

function substitution(text, key, decrypt) {
    const map = new Map();
    for (let i = 0; i < 26; i++) {
        if (decrypt) map.set(key[i], alphabet[i]);
        else map.set(alphabet[i], key[i]);
    }
    let message = "";
    for (const ch of text.toUpperCase()) {
        message += map.has(ch) ? map.get(ch) : ch;
    }
    return message;
}

function renderPreview() {
    const name = selectedCipher();
    els.preview.replaceChildren();
    if (name === "Caesar Cipher") renderCaesarPreview();
    else if (name === "Rail-Fence Cipher") renderRailPreview();
    else if (name === "Vigenère Cipher") renderVigenerePreview();
    else renderSubstitutionPreview();
}

function renderCaesarPreview() {
    const shift = readShift(true);
    const amount = shift === null ? 0 : shift;
    const cipherAlphabet = alphabet.slice(amount) + alphabet.slice(0, amount);
    els.preview.append(
        mapLine("Plain", alphabet),
        mapLine("Shift " + amount, cipherAlphabet)
    );
    const sample = els.text.value.toUpperCase().slice(0, 42);
    if (letterCount(sample) > 0 && shift !== null) {
        els.preview.append(mapLine("Encrypt", caesar(sample, shift, false), true));
        els.preview.append(mapLine("Decrypt", caesar(sample, shift, true)));
    } else if (shift === null) {
        els.preview.append(note("Enter a shift to slide the bottom alphabet. Blank encrypt chooses one."));
    }
}

function renderRailPreview() {
    const railsValue = readRails(true);
    const letters = lettersOnly(els.text.value).slice(0, 36);
    const rails = railsValue && railsValue >= 2 ? railsValue : 3;
    if (letters.length === 0) {
        els.preview.append(note("Type a message to see the zigzag. Showing 3 rails until you set one."));
        return;
    }
    if (rails >= letters.length) {
        els.preview.append(note("Use fewer rails than there are letters."));
        return;
    }
    const pattern = railPattern(letters.length, rails);
    const grid = document.createElement("div");
    grid.className = "zigzag";
    grid.style.gridTemplateRows = "repeat(" + rails + ", 22px)";
    grid.style.gridTemplateColumns = "repeat(" + letters.length + ", 22px)";
    for (let i = 0; i < letters.length; i++) {
        const cell = document.createElement("i");
        cell.className = "on";
        cell.textContent = letters[i];
        cell.style.gridRow = String(pattern[i] + 1);
        cell.style.gridColumn = String(i + 1);
        grid.append(cell);
    }
    const scroller = document.createElement("div");
    scroller.className = "zigzag-scroll";
    scroller.append(grid);
    els.preview.append(scroller, resultLine(rail(letters, rails, false)));
    if (lettersOnly(els.text.value).length > letters.length) {
        els.preview.append(note("Preview shows the first 36 letters."));
    }
}

function renderVigenerePreview() {
    const keyword = cleanKeyword(els.keyword.value);
    const source = els.text.value.toUpperCase();
    if (!keyword) {
        els.preview.append(note("Type a keyword to line it up under the message."));
        return;
    }
    let plain = "";
    let keyLine = "";
    let cipher = "";
    let keyIndex = 0;
    let shown = 0;
    for (const ch of source) {
        if (shown >= 28) break;
        if (!alphabet.includes(ch)) {
            plain += ch;
            keyLine += ch;
            cipher += ch;
            continue;
        }
        const row = genTable[keyword[keyIndex].toLowerCase()];
        plain += ch;
        keyLine += keyword[keyIndex];
        cipher += row[alphabet.indexOf(ch)];
        keyIndex = (keyIndex + 1) % keyword.length;
        shown += 1;
    }
    if (!plain) {
        els.preview.append(note("Keyword " + keyword + " is ready. Type a message to see it repeat underneath."));
        return;
    }
    els.preview.append(mapLine("Plain", plain), mapLine("Key", keyLine), mapLine("Cipher", cipher, true));
}

function renderSubstitutionPreview() {
    const key = cleanKeyword(els.key.value);
    if (!isPermutation(key)) {
        els.preview.append(note("Enter 26 unique letters, or leave the key blank and encrypt to generate one."));
        return;
    }
    const pairs = document.createElement("div");
    pairs.className = "pairs";
    for (let i = 0; i < 26; i++) {
        const pair = document.createElement("div");
        pair.className = "pair";
        const from = document.createElement("span");
        const arrow = document.createElement("b");
        const to = document.createElement("span");
        from.textContent = alphabet[i];
        arrow.textContent = "↓";
        to.textContent = key[i];
        to.className = "out";
        pair.append(from, arrow, to);
        pairs.append(pair);
    }
    els.preview.append(pairs);
}

function mapLine(label, value, isOut) {
    const line = document.createElement("div");
    line.className = "map-line";
    const name = document.createElement("span");
    const code = document.createElement("code");
    name.textContent = label;
    code.textContent = value;
    if (isOut) code.className = "out";
    line.append(name, code);
    return line;
}

function resultLine(value) {
    const code = document.createElement("p");
    code.className = "preview-result";
    code.textContent = value;
    return code;
}

function note(value) {
    const paragraph = document.createElement("p");
    paragraph.className = "preview-note";
    paragraph.textContent = value;
    return paragraph;
}

function buildFrequencyChart() {
    alphabet.split("").forEach((letter, index) => {
        const col = document.createElement("div");
        col.className = "freq-col";
        const track = document.createElement("div");
        track.className = "freq-track";
        const tick = document.createElement("span");
        tick.className = "freq-tick";
        const bar = document.createElement("span");
        bar.className = "freq-bar";
        const count = document.createElement("span");
        count.className = "freq-count";
        count.textContent = "0";
        const label = document.createElement("span");
        label.className = "freq-letter";
        label.textContent = letter;
        track.append(tick, bar);
        col.append(track, count, label);
        els.chart.append(col);
        freq.cols[index] = col;
        freq.bars[index] = bar;
        freq.ticks[index] = tick;
        freq.counts[index] = count;
    });
}

function updateFrequency() {
    const counts = Array(26).fill(0);
    let total = 0;
    for (const ch of els.text.value.toUpperCase()) {
        const index = alphabet.indexOf(ch);
        if (index >= 0) {
            counts[index] += 1;
            total += 1;
        }
    }
    const percents = counts.map((count) => (total ? (count / total) * 100 : 0));
    const scale = Math.max(16, ...percents);
    percents.forEach((percent, index) => {
        freq.bars[index].style.height = (percent / scale) * 100 + "%";
        freq.ticks[index].style.bottom = (ENGLISH[index] / scale) * 100 + "%";
        freq.counts[index].textContent = String(counts[index]);
        const letter = alphabet[index];
        freq.cols[index].title = letter + ": " + counts[index] + " (" + percent.toFixed(1) + "%). Typical English is " + ENGLISH[index] + "%.";
    });
    els.freqMeta.textContent = total === 0 ? "No letters yet" : total + (total === 1 ? " letter" : " letters");
}
