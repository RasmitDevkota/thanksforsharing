import * as functions from 'firebase-functions';

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const addNumbers = functions.https.onRequest((request, response) => {
    response.send(Number(request.query.a) + Number(request.query.b));
});