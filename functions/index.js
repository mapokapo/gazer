'use strict';

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const gcs = new Storage();
const { tmpdir } = require("os");
const { join, dirname } = require("path");
const sharp = require("sharp");
const fs = require("fs-extra");

admin.initializeApp();

exports.imageToWebP = functions.storage.object().onFinalize(async object => {
  const bucket = gcs.bucket(object.bucket); //const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), 'thumbs');
  const tmpFilePath = join(workingDir, fileName);

  if (object.contentType.startsWith("image/webp") || !object.contentType.includes('image')) {
    console.log('exiting function');
    return false;
  }

  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(workingDir);

  // 2. Download Source File
  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  // 3. Resize the images and define an array of upload promises
  const thumbPath = join(workingDir, fileName);

  // Resize source image
  await sharp(tmpFilePath)
    .resize(256, 256)
    .webp()
    .toFile(thumbPath);

  // Upload to GCS
  bucket.upload(thumbPath, {
    destination: join(bucketDir, thumbName)
  });

  // 4. Run the upload operations
  await Promise.all(uploadPromises);

  // 5. Cleanup remove the tmp/thumbs from the filesystem
  return fs.remove(workingDir).then(() => {
    return fs.remove(bucketDir);
  });
});

exports.deleteUser = functions.https.onCall((data, context) => {
  if (!context.auth) return {status: "error", code: 401, message: "Not signed in"}

  return new Promise((resolve, reject) => {
    admin.database().ref("users/").child(context.auth.uid).once("value", snapshot => {
      if (snapshot.val() && snapshot.val().admin === 1) {
        admin.auth().deleteUser(data.uid)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject({status: "error", code: 500, error})
          })
      } else {
        reject({status: "error", code: 403, message: "Forbidden"})
      }
    })
  })
});

exports.getUser = functions.https.onCall((data, context) => {
  if (!context.auth) return {status: "error", code: 401, message: "Not signed in"}

  return new Promise((resolve, reject) => {
    // verify user"s rights
    admin.database().ref("users/").child(context.auth.uid).once("value", snapshot => {
      // query user data
      admin.auth().getUser(data.uid)
        .then(userRecord => {
          let obj = userRecord;
          delete obj.passwordHash;
          resolve(obj.toJSON());
        })
        .catch(error => {
          console.error("Error fetching user data:", error)
          reject({status: "error", code: 500, error})
        })
    })
  })
})