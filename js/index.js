const firebaseConfig = {
    apiKey: "AIzaSyCaaoJyYSuI5R0211Jj_VoftTyDaA3nT2I",
    authDomain: "it222293.firebaseapp.com",
    projectId: "it222293",
    storageBucket: "it222293.appspot.com",
    messagingSenderId: "307943257880",
    appId: "1:307943257880:web:9977434d41e9000b9cd06d",
    measurementId: "G-K8J4K585WF"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const firestore = firebase.firestore();

const mail = document.getElementById("txtmail");
const pass = document.getElementById("txtpass");
const pass2 = document.getElementById("txtpass2");
const cre = document.getElementById("crebtn");
const login = document.getElementById("inbtn");
const logout = document.getElementById("outbtn");
const sta = document.getElementById("sta");
const google = document.getElementById("googlesignin");
const username = document.getElementById("name");
let mailv;
let passv;
let pass2v;
let errorCode;
let errorMessage;

const googlecliantid = "934424017746-u6c25ictdb3mb11dnp757nf1m060fg0i.apps.googleusercontent.com";
const provider = new firebase.auth.GoogleAuthProvider();


provider.setCustomParameters({
    client_id: googlecliantid,
});


// firebase.auth().onAuthStateChanged(function (user) { //ログイン状態確認
//     /*配列の中にある値とuserの値を比較し、違う場合はログイン。一致する場合はログインさせない。
//      そして、一回ログインしたuserの値を配列に入れ、ループを防ぎたい*/
//     const userArray = ["nameSample"];
//     if (userArray.includes(user)) {
//         console.log('user と userArray は同じ値です。');
//         console.log("ログインなし");
//     } else {
//         console.log('user と userArray は異なる値です。');
//         console.log("ログイン中");
//         // 現在のウィンドウを遷移先のURLに変更する
//         // window.location.href = "./compnyMenu.html";
//         //配列userArrayにuserの値を入れる
//         userArray.push(user);
//     }
// });


logout.addEventListener("click", function () { //ログアウト
    firebase.auth().signOut().then(function () {
        //ログアウトできた時
        username.innerHTML = "";
        console.log("ログインなし");
        // ログアウト後にトップページに遷移

    }).catch(function (error) {
        //ログアウトできなかった時
        console.error("ログアウトできませんでした", error);
        window.location.href = "./index.html";
    });
});


google.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log('Google Sign-In User:', user);
            console.log(user.displayName);
            console.log(user.email);
            console.log(user.photoURL);
            console.log(user.uid);

            //変更点
            const usersRef = firestore.collection('users');
            const userDocRef = usersRef.doc(user.uid);

            // usersコレクションが存在するか確認
            userDocRef.get().then((querySnapshot) => {
                if (!querySnapshot.exists) {
                    // usersコレクションが存在しない場合、新しく作成
                    usersRef.doc(user.uid).set({}).then(() => {
                        console.log('usersコレクションが作成されました');
                    }).catch((error) => {
                        console.error('usersコレクションの作成エラー:', error);
                    });
                } else {
                    console.error('usersコレクションは既に存在します');
                };
            }).catch((error) => {
                console.error('usersコレクションの存在確認エラー:', error);
            });

            sessionStorage.setItem('userUid', user.uid);
            window.location.href = "./menu.html";

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Google Sign-In Error:', errorCode, errorMessage);
        });
});