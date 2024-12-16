#!/usr/bin/node
const crypto = require('crypto');
const key = crypto.randomBytes(32);  // AES-256 requires 32-byte key
const iv = crypto.randomBytes(16);   // AES block size is 16 bytes

console.log('Key:', key.toString('hex'));
console.log('IV:', iv.toString('hex'));

