const { JSEncrypt } = require('jsencrypt');

const pub = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy0mUj74AVGSEGcpDKHEp
TG1DSOVzaPQktrO9zDeQaMnysqP5WFxM0hksiVVfcSUFZwegArUGtqSezlbfIjtQ
n9XHBCh6dIpERcBpSQfmBWnIkF/dqIArGtB/Lm+lW2tcYf7Ddf/4/I46ZxFE29gr
5ANPQ1s0jB9Oee3RG9JTMaLQSGhUj0YLYU0sfbOaDk6VMPio7N2fGrMhiVpofPhg
7PUPLNHs5TEPkykGgw+aeIpq9wIXNdmzWHHrk/UMp8yqo4RT5h57mnQIXItkTm9Y
kIabLHy/u2FGM21HWyX7nYOcMhXt2D9wTlkHaUIHLz48V0gExaM5l859hEzQbplz
uwIDAQAB
-----END PUBLIC KEY-----`;

const encrypt = new JSEncrypt();
encrypt.setPublicKey(pub);
const cipher = encrypt.encrypt("password123");
console.log(cipher);
