const firebaseConfig = {
    apiKey: "AIzaSyCaaoJyYSuI5R0211Jj_VoftTyDaA3nT2I",
    authDomain: "it222293.firebaseapp.com",
    projectId: "it222293",
    storageBucket: "it222293.appspot.com",
    messagingSenderId: "307943257880",
    appId: "1:307943257880:web:9977434d41e9000b9cd06d",
    measurementId: "G-K8J4K585WF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// storageへの参照準備
const storagePath = firebase.storage();
//userIDを取得
const userId = sessionStorage.getItem('userUid');
console.log('userID:', userId);
// Create a Firestore reference
const db = firebase.firestore();

// // Get reference to the document in Firestore (replace 'テスト①' and 'samplesGoods' with your actual document and collection names)
// var collectionRef = firestore.collection('samplesGoods').doc('テスト①');

// Get document name from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const docName = urlParams.get('documentName');

// Check if docName is present in the query string
if (docName) { //   追加行
    // Reference to the specific document in the "samplesGoods" collection 追加行
    console.log('docName:', docName);
    const collectionRef = db.collection('users').doc(userId).collection("sampleGoods");
    // Retrieve data from Firestore
    
    collectionRef.doc(docName).get().then(function (doc) {
        console.log('doc:', doc);
        if (doc.exists) {
            // Access the data fields
            var data = doc.data();

            // Display data in the HTML elements
            document.getElementById('description').innerText = data.商品の説明 || '';
            document.getElementById('component').innerText = data.栄養成分表示 || '';
            document.getElementById('notes').innerText = data.注意書き || '';
            document.getElementById('cost').innerText = data.値段 + '円' || '';
            document.getElementById('seller').innerText = data.販売元 || '';

            // Display range warm time
            var warmMinutes = data.レンジの温め時間 ? data.レンジの温め時間.分 || '' : '';
            var warmSeconds = data.レンジの温め時間 ? data.レンジの温め時間.秒 || '' : '';
            document.getElementById('warm').innerText = warmMinutes + '分' + warmSeconds + '秒' || '';

            // Display allergy information
            var allergyList = Object.values(data.アレルゲン || {}).filter(Boolean);
            document.getElementById('allergy').innerText = allergyList.join(', ');
            console.log("allergyList:", allergyList);
            // カテゴリ名
            const category = data.カテゴリ名 || '';
            if (category instanceof Object) {
                // カテゴリがオブジェクトの場合、nullでないフィールドのみを表示
                document.getElementById("category").innerText = Object.values(category).filter(value => value !== null).join('');
            } else {
                document.getElementById("category").innerText = category;
            }

            // Display material and production area
            var materialList = Object.values(data.原材料ごとの産地 || {}).filter(Boolean);
            document.getElementById('material').innerText = materialList[0] || '';
            console.log("materialList[0]:", materialList[0]);
            document.getElementById('productionArea').innerText = materialList[1] || '';
            console.log("materialList[1]:", materialList[1]);

            // // Display QR code
            // var qrcode = new QRCode(document.getElementById("outputQRcode"), {
            //     text: "Your QR Code Data Here",
            //     width: 128,
            //     height: 128
            // });
        } else {
            console.log("No such document!");
            console.log("docName:", docName);
            // console.log('doc:', doc);
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
} else {
    console.log("No document name specified in the URL.");
}
const backButton = document.getElementById('back'); //戻るボタン
document.addEventListener('DOMContentLoaded', function () {

    backButton.addEventListener('click', function () {
        // ブラウザの履歴を1つ前に戻る
        window.history.back();
    })
});

