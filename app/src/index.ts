import { region }  from "firebase-functions";


export const hello_world = region('europe-west1').https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
