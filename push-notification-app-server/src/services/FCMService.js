const admin = require('firebase-admin')
const path = require('node:path')

// to obtain the service account private key i have followed the below steps
// 1. goto firebase console
// 2. select the project
// 3. on left side menu at the top there is "Project Overview". click the gear icon and choose the "Project Settings" option
// 4. goto the "Service Account" tab and select the "Firebase Admin SDK"
// 5. scroll below and click "Generate Private Key" button and click again the "Generate Key" button in dialog
// 6. download the josn file and save it securely
const serviceAccount = require(path.resolve(__dirname,'..','..','fcm-key.json'))

const projectId = serviceAccount.project_id

const FCM_URL = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

const cert = admin.credential.cert(serviceAccount)

admin.initializeApp({
    credential: cert
})

/**
 * all the field values of msgContent must be string type or null. no other type is accepted
 */
async function sendPushNotification(destinationToken, msgContent) {

    const message = {
        // send a specific client by it token. this is the same token client receives from FCM server
        // for example: in android, registration token received in onNewToken in FirebaseMessagingSerivce
        token: destinationToken,

        // to send multiple client, upto 500, simultenously use tokens property. it is useful when multiple
        // clients of an user are connected and i need to send message to each of the clients
        // tokens: [ token1, token2, ...]

        // notifcation is handled by default by google play service
        // notification object requires atleast a title and and body
        // other properties may be platform specific
        //
        // notification: { 
        // title: "this is title",
        // body: "this is the body of the notification"
        // }

        // data is handled inside onMessageReceived(RemoteMessage) of FirebaseMessagingService of android sdk
        // it's better to push data to client to notify that something has changed rather than what actually changed
        // when client receives client send a new request to fetch the actual chages. thus the push notification will be lightweight
        // and there will be no or less chance being dropped. 
        data: msgContent
    }

    console.log('message ', message)

    // on successful a string is returned as response. the response is in the format
    // projects/{fcm_project_id_in_firebase_or_google_console}/messages/{message_id}
    const response = await admin.messaging().send(message)

    console.log('response from fcm server ', response)
}

module.exports = { 
    sendPushNotification,
}