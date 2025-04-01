const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Data{
    constructor(name, street, city, country, idCard, gender, birthdate, nationality, email, phoneNumber) {
        this.name = name;
        this.street = street;
        this.city = city;
        this.country = country;
        this.idCard = idCard;
        this.gender = gender;
        this.birthdate = birthdate;
        this.nationality = nationality;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    calculateHash() {
        return SHA256(
            this.name +
            this.street +
            this.city +
            this.country +
            this.idCard +
            this.gender +
            this.birthdate +
            this.nationality +
            this.email +
            this.phoneNumber
        ).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transaction for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');

    }

    isValid(){
        if(this.fromAddress === null) return true;                              // a pendingTransaction értéke null kell hogy legyen

        if(!this.signature || this.signature.length === 0){                     //ha nincs signature, vagy annak a hossza 0
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');            
        return publicKey.verify(this.calculateHash(), this.signature);

    }
}


class Block {
    constructor(timestamp, data, hash, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, 'Genesis Block', '');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock.data); // Hozzáadjuk a block-ot csak a data mezőjével
    }
    

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}


module.exports.Blockchain = Blockchain;
module.exports.Transaction = Data;
module.exports.Block = Block;
