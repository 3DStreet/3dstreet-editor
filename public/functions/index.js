const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getScene = functions.https.onRequest(async (req, res) => {
  // Extract scene id from the path, remove the .json part
  const documentId = req.path
    .split('/')
    .filter(Boolean)[0]
    .replace('.json', '');
  if (!documentId) {
    res.status(400).send({ error: 'Scene ID is required' });
    return;
  }

  try {
    const doc = await admin
      .firestore()
      .collection('scenes')
      .doc(documentId)
      .get();
    if (!doc.exists) {
      res.status(404).send({ error: 'Scene not found' });
    } else {
      res.send(doc.data());
    }
  } catch (err) {
    res.status(500).send({ error: 'Error retrieving scene' });
  }
});
