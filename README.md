# SimpleCiphers
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/TheWolfBadger/SimpleCiphers/blob/master/LICENSE)

SimpleCiphers was a site designed to show how a few ciphers work in encrypting messages and decrypting encrypted messages.
The site was made for Sister Jane Fritz's COM 260 Computer & Info Security class.
# Site
https://thewolfbadger.github.io/SimpleCiphers/
# Features
## Bruteforce
TBD
## Cipher Encrypting
TBD
## Cipher Decrypting
TBD
# Included Ciphers
## Caesar Cipher
The Caesar cipher is one of the simplest and most widely known encryption techniques. It is a cipher in which uses a shift to encrypt its messages. For instance, a right shift of 3 would make any "A"s in the message a "D". The Caesar cipher was used by Julius Caesar (whom it is also named after) in his private correspondence. The Caesar cipher in modern practice is easily broken and offers no communications security. The key to this cipher is to know how much to shift. There is only 25 possible shifts, therefore it's quite simple for a modern day computer to figure out in milliseconds...
## Rail-Fence Cipher
The Rail-Fence cipher (sometimes referred to as the zigzag cipher) is a form of a transposition cipher. The name comes from the way in which the encryption of it's messages are encoded. The letters of the messages are written in zigzags up and down an X amount of rows and each row is part of the final encryption scheme. The key to figuring out the encrypted message is by knowing how many rails (rows) there are. The amount of rails will always be higher than 2, but no more than the number of letters in the encrypted text. This cipher is therefore not very strong and can be solved by hand...
## Vigenère Cipher
The Vigenère cipher is a technique of encrypting messages by using a series of interwoven Caesar ciphers, based on the letters of a keyword. This cipher is easy to understand and implement, but it also resisted all attempts to break it for three centuries...The cipher stood strong until 1863 when a man by the name of Friedrich Kasiski was the first to publish a successful attack on it. Kasiski had noticed that he could take advantage of the fact that repeated words are, by chance, sometimes encrypted using the same key letters, thus leading to repeated groups in the encrypted messages. By counting the distance between the repetitions of a group of encrypted message, Kasiski realized that this could imply the key length that the encryption had used. The Vigenère cipher, with normal alphabets, essentially uses modulo arithmetic, which is commutative. Therefore, if the key length is known (or guessed), subtracting the cipher text from itself, offset by the key length, will produce the plain text encrypted with itself. If any "probable word" in the plain text is known or can be guessed, its self-encryption can be recognized, which allows recovery of the key by subtracting the known plaintext from the cipher text. Key elimination is especially useful against short messages.
## Substitution Cipher
A Substitution cipher is a technique of encrypting messages by substituting the letters of a message with a different value. We will be focusing on the simple substitution cipher in which the letters of a message are replaced by a single different letter. For instance, setting A to Z, B to F, G to I, etc. These are completely random and have no "shift" and/or 1 single key. Instead, this cipher requires a full-out key to be correctly solved in which you need the key to each single letter to decipher the message encrypted. This cipher is still not very strong and is easily broken in modern day practice. The most common deduction to this problem is analyzing the frequency distribution of the encrypted message. This allows formation of partial words and therefore can in-turn gain the hacker more words by using the somewhat filled key.