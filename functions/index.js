"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { tmpdir } = require("os");
const { join, dirname } = require("path");
const sharp = require("sharp");
const fs = require("fs-extra");
const UUID = require("uuid-v4");
const _ = require("lodash");
const cors = require("cors")({ origin: true });

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://uim3-8b4ac.firebaseio.com"
});

exports.imageToWebP = functions.region("europe-west1").storage.object().onFinalize(async object => {
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split("/").pop();
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), "temp");
  const tmpFilePath = join(workingDir, fileName);

  if (object.contentType.startsWith("image/webp")) {
    console.log("Image already a WebP");
    return false;
  }

  if (!object.contentType.includes("image")) {
    console.log("File not an image");
    return false;
  }

  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(workingDir);

  // 2. Download Source File
  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  // 3. Convert the image
  const convertPath = join(workingDir, fileName.split(".").shift() + ".webp");

  // Resize source image
  await sharp(tmpFilePath)
    .resize(256, 256)
    .webp()
    .toFile(convertPath);

  // Upload to Cloud Storage
  let newFileName = fileName.split(".").shift();
  let uuid = UUID();
  fileName.split(".").length !== 0
  bucket.upload(convertPath, {
    destination: join(bucketDir, newFileName + ".webp"),
    uploadType: "media",
    metadata: {
      contentType: 'image/webp',
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    }
  }).then((data) => {
    bucket.file(filePath).delete().then(() => {
      let file = data[0];
      let itemDownloadURL = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
      if (filePath.split("/")[0] === "profileImages") {
        admin.database().ref("users/").child(newFileName).once("value", snapshot => {
          if (!snapshot.val())
            return
          let data = snapshot.val();
          admin.database().ref("users/").child(newFileName).set({
            admin: data.admin,
            displayName: data.displayName,
            imageURL: itemDownloadURL,
            joined: data.joined
          }).then(() => console.log("Item uploaded, converted, and saved in database successfully"));
        });
      } else if (filePath.split("/")[0] === "itemImages") {
        admin.database().ref("items/").child(newFileName).once("value", snapshot => {
          if (!snapshot.val())
            return
          let data = snapshot.val();
          admin.database().ref("items/").child(newFileName).set({
            QRCodeURL: data.QRCodeURL,
            added_by: data.added_by,
            added_by_uid: data.added_by_uid,
            added_on: data.added_on,
            imageURL: itemDownloadURL,
            itemID: data.itemID,
            location: data.location,
            searchQuery: data.searchQuery,
            title: data.title,
            category: data.category,
            desc: data.desc
          }).then(() => console.log("Item uploaded, converted, and saved in database successfully"));
        });
      }
    }).catch(error => console.error(error));
  });

  // 5. Cleanup remove the tmp/thumbs from the filesystem
  return fs.remove(workingDir).then(() => {
    return fs.remove(bucketDir);
  });
});

exports.deleteUser = functions.region("europe-west1").https.onCall((data, context) => {
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

exports.getUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) return {status: "error", code: 401, message: "Not signed in"}

  return await new Promise((resolve, reject) => {
    // verify user"s rights
    admin.database().ref("users/").child(context.auth.uid).once("value", snapshot => {
      if (snapshot.val().admin === 1) {
      // query user data
        admin.auth().getUser(data.uid)
          .then(userRecord => {
            resolve(userRecord.toJSON());
          })
          .catch(error => {
            console.error("Error fetching user data:", error)
            reject({status: "error", code: 500, error})
          })
      } else {
        reject({status: "error", code: 403, message: "Forbidden"})
      }
    })
  });
})