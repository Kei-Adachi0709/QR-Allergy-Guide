const firebaseConfig = {
    apiKey: "AIzaSyCaaoJyYSuI5R0211Jj_VoftTyDaA3nT2I",
    authDomain: "it222293.firebaseapp.com",
    projectId: "it222293",
    storageBucket: "it222293.appspot.com",
    messagingSenderId: "307943257880",
    appId: "1:307943257880:web:9977434d41e9000b9cd06d",
    measurementId: "G-K8J4K585WF"
};
if (!firebase.apps.length) {
    //firestoreのインスタンスを初期化。前準備。
    firebase.initializeApp(firebaseConfig);
};
// Firestoreのインスタンスを取得
const firestore = firebase.firestore();
//userIDを取得
const userId = sessionStorage.getItem('userUid');


let itemName;
let userID = userId;

// メタデータを取得
const metadataRef = firestore.collection('users').doc(userId).collection("sampleGoods");

metadataRef.orderBy("timestamp", "desc").limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // forEach 内で itemName に値をセット
        itemName = doc.id;
        userID = userId;

        // ここで itemName と userID を使用できる
        console.log('userID',userID,itemName);
        console.log('itemName',itemName);

        //★★★★★★★★★★★★★★★★
        const product = document.getElementById("product");
        product.textContent = itemName;
        //★★★★★★★★★★★★★★★★

        //QRコード情報を追加
        // detailsPageURLに代入されるURLのHTMLが自分のPC内の正しい位置にないとNotFoundになる
        //デプロイする際はhttps://ip222295app.web.app/の数字の部分を自分の学籍番号にしないと動かないと思う。QRコードを読み取ることに関しては問題なし。
        const usersDetailsPageURL = `https://ip222295app.web.app/detail.html?userID=${encodeURIComponent(userId)}&documentName=${encodeURIComponent(itemName)}`;
        // QRコードを生成して表示
        generateQRCode(usersDetailsPageURL);

    });
}).catch((error) => {
    console.error("データ取得エラー:", error);
});




// QRコードを生成して表示する関数
function generateQRCode(url) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: url,
        width: 128,
        height: 128
    });
}

const menuBtn = document.getElementById('menu');
menuBtn.addEventListener('click', function () {
    window.location.href = './menu.html'
})