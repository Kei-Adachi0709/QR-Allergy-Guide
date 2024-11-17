//※cloud FirestoreとStorageのルール設定も忘れずに！
//※cloud Firestoreには"samplesGoods"コレクション、Storageには"images"フォルダのなかに"goodsFolder"フォルダと"graphFolder"フォルダをあらかじめ用意しといてください

//使用するfirebase情報(プロジェクトの設定からコピペする)
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
console.log('userID:', userId);

//firestoreの格納する場所("samplesGoods")を設定
const firestorePath = firebase.firestore().collection('users').doc(userId).collection("sampleGoods");
//storageを定義
const storageRef = firebase.storage();

//要素の結び付け
const backButton = document.getElementById('back'); //戻るボタン
const inputGoodsName = document.getElementById('goodsName'); //商品名
const inputGoodsFile = document.getElementById('file-input1'); //商品画像
const inputDescription = document.getElementById('description'); //商品説明
const inputComponent = document.getElementById('component'); //成分表示
const inputNotes = document.getElementById('notes'); //注意書き
const inputMinutes = document.getElementById('warmMinutes'); //温め時間(分)
const inputSecond = document.getElementById('warmSecond'); //温め時間(秒)
const inputSeller = document.getElementById('seller'); //販売元
const inputCategory = document.getElementById('category'); //カテゴリ
const inputMaterial = document.getElementById('material'); //原材料
const inputArea = document.getElementById('productionArea'); //産地
const inputAllergy = document.getElementsByName('allergy'); //アレルゲン
// const inputGraphFile = document.getElementById('file-input2');//グラフ画像
const inputCost = document.getElementById('cost'); //金額
const saveButton = document.getElementById('save'); //登録ボタン
const clearButton = document.getElementById('clear'); //クリアボタン
document.addEventListener('DOMContentLoaded', function () {

  backButton.addEventListener('click', function () {
    // ブラウザの履歴を1つ前に戻る
    window.history.back();
  })
})

//商品画像のセットアップ(setupFileInput関数呼出)
setupFileInput(inputGoodsFile, 'goodsPreview');
//グラフ画像のセットアップ(setupFileInput関数呼出)
// setupFileInput(inputGraphFile, 'graphPreview');

//setupFileInput関数(画像がセットされたら実行する処理)
function setupFileInput(inputElement, previewElementId) {
  inputElement.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById(previewElementId);
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.onload = function () {
        URL.revokeObjectURL(preview.src);
      };
    }
  });
}


// const app = Vue.createApp({
//   data() {
//     return {
//       file: null, // 選択されたファイルやドロップされたファイルを保持するデータ
//     };
//   },
//   methods: {
//     handleFileChange(event) {
//       // ファイルが選択されたときの処理
//       const selectedFile = event.target.files[0];
//       // const preview = document.getElementById('preview');
//       // preview.src = URL.createObjectURL(selectedFile);
//       // preview.onload = function () {
//       //   URL.revokeObjectURL(preview.src);
//       // };
//       this.file = selectedFile; // 選択されたファイルをデータにセット
//       console.log(selectedFile);
//     },
//     handleDrop(event) {
//       event.preventDefault();
//       // ドロップされたときの処理
//       const droppedFile = event.dataTransfer.files[0];
//       this.file = droppedFile; // ドロップされたファイルをデータにセット
//     },
//     formatSize(bytes) {
//       const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
//       if (bytes === 0) return "0 Byte";
//       // ファイルサイズを適切な単位に変換する処理
//       const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
//       return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
//     },
//   },
// });

// app.mount("#app");


// saveButton(登録)ボタンが押されたら実行する処理
saveButton.addEventListener("click", function () {
  console.log('登録ボタンが押されました');
  //テキストボックスに記入された値を取得
  const textToGoodsName = inputGoodsName.value; //商品名
  const textToDescription = inputDescription.value; //商品説明
  const textToComponent = inputComponent.value; //成分表示
  const textToNotes = inputNotes.value; //注意
  const textToMinutes = inputMinutes.value; //温め時間(分)
  const textToSecond = inputSecond.value; //温め時間(秒)
  const textToSeller = inputSeller.value; //販売元
  const textToCategory = inputCategory.value; //カテゴリ名
  const textToMaterial = inputMaterial.value; //原材料
  const textToArea = inputArea.value; //産地
  const textToCost = inputCost.value; //金額
  //セットされた画像ファイルを取得
  const goodsFile = inputGoodsFile.files[0]; //商品画像
  // const graphFile = inputGraphFile.files[0]; //グラフ画像
  //チェックボックスの値を取得
  //配列"allergyValue"を宣言（選択されたアレルゲン品目の格納用）
  var allergyValue = new Array();
  //（どのアレルゲン品目にチェックが入ったか）チェックボックスの真偽値を一つずつ確認する
  for (let i = 0; i < inputAllergy.length; i++) {
    if (inputAllergy[i].checked == true) {
      //配列"allergyValue"にチェックされた値（アレルゲン品目）を格納
      allergyValue.push(inputAllergy[i].value);
    }
  }

  //商品名がnullの場合は処理を中断(登録不可)
  if (!textToGoodsName) {
    let errorElement = document.getElementById('error');
    errorElement.textContent = "※この項目は必須です。";
    console.log('商品名が空の為、処理を中断しました。')
    return;

    //商品名がnullではない場合
  } else {
    console.log('商品名が空ではないため、処理を続行します。');

    //firestoreにアップロードするデータ構造を作成
    const dataToUpload = {
      商品の説明: textToDescription,
      栄養成分表示: textToComponent,
      注意書き: textToNotes,
      レンジ温め時間: {
        分: textToMinutes,
        秒: textToSecond,
      },
      販売元: textToSeller,
      カテゴリ: textToCategory,
      原材料ごとの産地: {
        原材料名: textToMaterial,
        産地: textToArea
      },
      アレルゲン: allergyValue, //アレルゲン品目（配列）
      値段: textToCost, // 原材料
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
      // imgs: {
      //   商品画像: {
      //     ファイル名: "",
      //     ファイルパス: ""
      //   },
      //   グラフ画像: {
      //     ファイル名: "",
      //     ファイルパス: ""
      //   }
      // }
    };

    //firestoreに商品詳細データをアップロード
    firestorePath.doc(textToGoodsName).set(dataToUpload)
      .then(function () {
        console.log("firestoreへアップロードできました");
      }).catch(function (error) {
        console.log("firestoreへのアップロードでエラー発生。エラー内容:", error);
      });
  }

  //商品画像データがnullではない場合
  if (goodsFile != "") {
    // 商品画像をアップロード
    uploadImageToFirestore('goods', goodsFile, textToGoodsName);
  }

  // //グラフ画像データがnullではない場合
  // if (graphFile != "") {
  //   // グラフ画像をアップロード
  //   uploadImageToFirestore('graph', graphFile, textToGoodsName);
  // }


  alert('商品情報を登録しました。')

  //登録完了後、記入欄をクリア
  clearInputFields();
  console.log('アップロード処理が終了したため、全ての記入欄をクリアにしました。');

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
          console.log(itemName, userID);
  
         
          // QRコードを表示する画面に遷移
          window.location.href = `./qrCode.html?userID=${encodeURIComponent(userId)}&documentName=${encodeURIComponent(itemName)}`;
        });
      }).catch((error) => {
          console.error("データ取得エラー:", error);
      });
  
});


clearButton.addEventListener("click", function () {
  console.log('クリアボタンが押されました');
  clearInputFields();
  //アラート表示
  alert('入力欄をクリアにしました。');
});

//uploadImageToFirestore関数(画像データをアップロードする処理)
function uploadImageToFirestore(imageType, imageFile, goodsName) {


  //imageTypeが'goods'である場合 
  //  →　true: folderName(フォルダ名)に'goodsFiles'を代入, false: folderName(フォルダ名)に'graphFile'を代入
  const folderName = (imageType === 'goods') ? 'goodsFolder' : 'graphFolder';
  //  →　true: itemName(項目名)に'商品画像'を代入, false: itemName(項目名)に'グラフ画像'を代入
  const itemName = (imageType === 'goods') ? '商品画像' : 'グラフ画像';

  // imageFile が undefined の場合は処理をスキップ
  if (!imageFile) {
    console.log(`画像データが無い為、${itemName}をアップロードする処理はスキップします。`);
    return;
  }


  //❕storageの格納する場所を設定❕(※管理しやすいようにちょっと変更済)
  //商品画像:   images/goodsName/goodsFolder/(格納する画像名.拡張子)
  //グラフ画像: images/goodsName/graphFolder/(格納する画像名.拡張子)
  // const storagePath = storageRef.ref('images/'+ goodsName + '/' + folderName + '/' + imageFile.name);
  const storagePath = storageRef.ref(`${userId}/images/${goodsName}/${folderName}/${imageFile.name}`);


  //storageに画像データをアップロード
  storagePath.put(imageFile).then((snapshot) => {
    console.log(`storageへ${itemName}をアップロード完了`);

    // Storageにある画像データをFirestoreドキュメントに関連付けるための情報を取得
    const fileName = snapshot.metadata.name; // 画像ファイル名
    const filePath = snapshot.metadata.fullPath; // 画像ファイルのパス

    //firestoreに追加するデータ構造を作成
    const updateData = {
      // imgs: {
      //   [itemName]: {
      [`imgs.${itemName}`]: {
        ファイル名: fileName,
        ファイルパス: filePath
      }
      // }
    };

    //firestoreに画像メタデータをアップロード
    // firestorePath.doc(goodsName).set(updateData, { merge: true })
    firestorePath.doc(goodsName).update(updateData)
      .then(() => {
        console.log(`${itemName}のメタデータのアップロード完了`);
      }).catch((error) => {
        console.log(`${itemName}のメタデータのアップロード失敗。エラー:`, error);
      });

  });
}

//clearInputFields関数(記入欄をすべてクリアする処理)
function clearInputFields() {

  // 各要素の値をクリア
  inputGoodsName.value = "";
  inputDescription.value = "";
  inputComponent.value = "";
  inputNotes.value = "";
  inputMinutes.value = "";
  inputSecond.value = "";
  inputSeller.value = "";
  inputCategory.value = "惣菜"; // カテゴリの初期値を設定
  inputMaterial.value = "";
  inputArea.value = "";
  inputCost.value = "";

  // チェックボックスの状態をクリア
  inputAllergy.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // 画像プレビューをクリア
  document.getElementById('goodsPreview').src = "";
  // document.getElementById('graphPreview').src = "";

  // エラーメッセージをクリア
  document.getElementById('error').textContent = "";


}


//プラスボタンを押すと、タグ要素を増やす処理（時間があれば後で追加）
// document.getElementById('plusButton').addEventListener('click', function(){

//   // 新しい <ol> 要素を作成
//   const newOl = document.createElement('ol');

//   // 新しい <ul> 要素を作成
//   const newUl = document.createElement('ul');

//   // 原材料名の input 要素を作成
//   const materialInput = document.createElement('input');
//   materialInput.type = 'text';
//   materialInput.classList.add('material');

//   // 産地の input 要素を作成
//   const productionAreaInput = document.createElement('input');
//   productionAreaInput.type = 'text';
//   productionAreaInput.classList.add('productionArea');

//   // <li> 要素に input 要素を追加
//   const materialLi = document.createElement('li');
//   materialLi.innerHTML = '・原材料名<br>';
//   materialLi.appendChild(materialInput);

//   const productionAreaLi = document.createElement('li');
//   productionAreaLi.innerHTML = '・産地<br>';
//   productionAreaLi.appendChild(productionAreaInput);

//   // <ul> 要素に <li> 要素を追加
//   newUl.appendChild(materialLi);
//   newUl.appendChild(productionAreaLi);

//   // <ol> 要素に <ul> 要素を追加
//   newOl.appendChild(newUl);

//   // 既存の <ol> 要素に新しい <ol> 要素を追加
//   document.getElementById('materialsList').appendChild(newOl);
// });