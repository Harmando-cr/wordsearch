const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const firebaseHelper = require('firebase-functions-helper');
const app = express();

app.use(express.json())
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

app.post("/mutant/", (req, res) => {
    isMutant(req.body.dna)
        .then(result => {
            firebaseHelper.firestore
                .createNewDocument(db, 'noMutants', req.body);
            return res.status(403).send(false)
        })
        .catch(e => {
            firebaseHelper.firestore
                .createNewDocument(db, 'mutants', req.body);
            return res.status(200).send(true)
        });
    ;
});

app.get("/stats", (req, res) => {
    let mutants;
    let noMutants;
    firebaseHelper.firestore
        .backup(db, 'mutants')
        .then(data => {
            mutants = Object.keys(data.mutants).length;
            firebaseHelper.firestore
                .backup(db, 'noMutants')
                .then(data => { 
                    noMutants = Object.keys(data.noMutants).length;
                    return res.status(200).send({"count_mutant_dna": mutants, "count_human_dna": noMutants, "ratio": mutants/noMutants})
                })
            })
});

const api = functions.https.onRequest(app)

module.exports = {
    api
}

const isMutant = (dna) => {
    return new Promise((resolve, reject) => {
        let re = /([ATCG])\1{3}/;
        let matches = 0;

        const isMutantH = (dna) => {
            return new Promise((resolve, reject) => {
                dna.forEach(sequence => {
                    if (re.exec(sequence) !== null) {
                        matches++;
                        if (matches > 1) {
                            reject(true)
                        }
                    }
                });
                resolve(false)
            });
        }

        const isMutantV = (dna) => {
            return new Promise((resolve, reject) => {
                for (let i = 0; i < dna.length; i++) {
                    let sequence = '';
                    for (let j = 0; j < dna.length; j++) {
                        sequence = sequence + dna[j][i];
                    }
                    if (re.exec(sequence) !== null) {
                        matches++;
                        if (matches > 1) {
                            reject(true)
                        }
                    }
                }
                resolve(false);
            })
        }

        const isMutantO = (dna) => {
            return new Promise((resolve, reject) => {

                //left to right, top to bottom, upper half
                const lrtbuh = () => {
                    return new Promise((resolve, reject) => {
                        for (let i = 0; i < dna.length; i++) {
                            let sequence = '';
                            for (let j = i, k = 0; j >= 0; j-- && k++) {
                                sequence += dna[j][k];
                            }
                            if (sequence.length > 0 && re.exec(sequence) !== null) {
                                matches++;
                                if (matches > 1) {
                                    reject(true)
                                }
                            }
                        }
                        resolve(false);
                    })
                }

                //left to right, top to bottom, lower half
                const lrtplh = () => {
                    return new Promise((resolve, reject) => {
                        for (var i = 1; i < dna.length; i++) {
                            let sequence = '';
                            for (let j = dna.length - 1, k = i; k < dna.length; j-- && k++) {
                                sequence += dna[j][k];
                            }
                            if (sequence.length > 0 && re.exec(sequence) !== null) {
                                matches++;
                                if (matches > 1) {

                                    reject(true)
                                }
                            }
                        }
                        resolve(false);
                    })
                }

                //right to left,bottom to top, upper half
                const rlbtuh = () => {
                    return new Promise((resolve, reject) => {
                        for (let i = 0; i < dna.length; i++) {
                            let sequence = '';
                            for (let j = i, k = dna.length - 1; j >= 0 && k >= 0; j-- && k--) {
                                sequence += dna[j][k];
                            }
                            if (sequence.length > 0 && re.exec(sequence) !== null) {
                                matches++;
                                if (matches > 1) {

                                    reject(true)
                                }
                            }
                        }
                        resolve(false);
                    })
                }

                //right to left,bottom to top, lower half
                const rlbtlh = () => {
                    return new Promise((resolve, reject) => {
                        for (let i = dna.length - 2; i >= 0; i--) {
                            let sequence = '';
                            for (let j = dna.length - 1, k = i; k >= 0; j-- && k--) {
                                sequence += dna[j][k];
                            }
                            if (sequence.length > 0 && re.exec(sequence) !== null) {
                                matches++;
                                if (matches > 1) {
                                    reject(true)
                                }
                            }
                        }
                        resolve(false);
                    });
                }

                Promise.all([lrtbuh(), lrtplh(), rlbtuh(), rlbtlh()])
                    .then(result => {
                        resolve(false);
                    })
                    .catch(e => {
                        reject(true);
                    })
            })
        }

        Promise.all([isMutantH(dna), isMutantV(dna), isMutantO(dna)])
            .then(result => {
                resolve(false);
            })
            .catch(e => {
                reject(true);
            });
    })
}


//function to generate a random DNA sequence 
const generateDNA = (length) => {
    let DNA = []
    const generateSequence = (length) => {
        var result = '';
        var characters = 'ATCG';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
    for (let i = 0; i < length; i++) {
        DNA.push(generateSequence(length));
    }

    return DNA;
}
