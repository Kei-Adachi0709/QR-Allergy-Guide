// Firebaseの初期化
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
    firebase.initializeApp(firebaseConfig);
};
//userIDを取得
const userId = sessionStorage.getItem('userUid');
console.log('userID:', userId);

// Firestoreへの参照準備
const firestorePath = firebase.firestore();
const collectionRef = firestorePath.collection('users').doc(userId).collection('sampleGoods');
// storageへの参照準備
const storagePath = firebase.storage();

const backBtn = document.getElementById('back');//戻るボタン


const inputgoodsName = document.getElementById('goodsName');
let inputGoodsFile = document.getElementById('file-input1'); //商品画像
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
let inputGraphFile = document.getElementById('file-input2');//グラフ画像
const inputCost = document.getElementById('cost'); //金額
const updateButton = document.getElementById('update'); //更新ボタン
const deleteButton = document.getElementById('delete'); //削除ボタン

let imageRef;
let imageRef2;

backBtn.addEventListener('click', function () {
    // ブラウザの履歴を1つ前に戻る
    window.history.back();
})

// URLからパラメータを取得する関数(←よくわからん。後で調べる)
function getParameterByName(name, url) {

    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// URLからgoodsNameパラメータを取得する関数を呼び出し
const goodsName = getParameterByName('documentName');

// ドキュメント名が存在するかチェック
if (goodsName) {
    console.log("ドキュメント名:", goodsName);

    collectionRef.doc(goodsName).get().then((doc) => {

        if (doc.exists) {
            // ドキュメントが存在する場合、フィールドを表示
            console.log('Document ID: ', doc.id);
            console.log('Fields: ', doc.data());
            const data = doc.data();
            inputgoodsName.value = doc.id;
            inputDescription.value = data.商品の説明;
            inputComponent.value = data.栄養成分表示;
            inputNotes.value = data.注意書き;
            inputMinutes.value = data.レンジ温め時間.分;
            inputSecond.value = data.レンジ温め時間.秒;
            inputSeller.value = data.販売元;
            inputCategory.value =
                inputMaterial.value = data.原材料ごとの産地.原材料名;
            inputArea.value = data.原材料ごとの産地.産地;
            inputAllergy.value = data.アレルゲン;
            inputCost.value = data.値段;

            for (let i = 0; i < inputCategory.options.length; i++) {
                console.log("length:", inputCategory.options.length);
                if (inputCategory.options[i].value === data.カテゴリ) {
                    console.log("value:", inputCategory.options[i].value);
                    inputCategory.selectedIndex = i;
                }
            }

            // 配列をループして、一致したcheckboxをtrueにする処理
            data.アレルゲン.forEach(function (word) {
                var checkbox = document.querySelector('input[value="' + word + '"]');
                if (checkbox) {
                    checkbox.checked = true;
                }
            });

            //画像をロードする関数を呼び出し
            loadImage(data, '商品画像', 'goodsPreview');
            loadImage(data, 'グラフ画像', 'graphPreview');

        } else {
            console.log('ドキュメント（商品）内の詳細データがないか、取得できていません');
        }

    }).catch((error) => {
        if (error && error.message.includes('Cannot read properties of undefined')) {
            console.log('まだ設定されていない為、表示されない画像データがあります。');
        } else {
            console.error("前ページから受け取ったドキュメント名に合致する商品名が取得できません。エラー:", error);
        }

    })
} else {
    // goodsNameパラメータが存在しない場合の処理
    console.error("goodsNameパラメータが存在しません。");
}


//更新ボタンを押したとき
updateButton.addEventListener('click', function () {
    console.log('更新ボタンが押されました');
    //テキストボックスに記入された値を取得
    // const textToGoodsName = inputGoodsName.value; //商品名
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
    const graphFile = inputGraphFile.files[0]; //グラフ画像

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

    //商品画像データがnullではない場合
    if (goodsFile != "") {
        // 商品画像をアップロード
        uploadImageToFirestore('goods', goodsFile, goodsName, imageRef);


    }

    //グラフ画像データがnullではない場合
    console.log(goodsName);
    if (graphFile != "") {
        console.log(goodsName);
        // グラフ画像をアップロード
        uploadImageToFirestore('graph', graphFile, goodsName, imageRef2);
    }
    //商品情報をfirestoreから取得	
    collectionRef.doc(goodsName).get().then((doc) => {
        let updateDate = {};
        //更新データがあるかそれぞれ比較	
        if (doc.data().アレルゲン != allergyValue) {
            updateDate.アレルゲン = allergyValue
        }
        if (doc.data().商品の説明 != textToDescription) {
            updateDate.商品の説明 = textToDescription
        }
        if (doc.data().栄養成分表示 != textToComponent) {
            updateDate.栄養成分表示 = textToComponent
        }
        if (doc.data().注意書き != textToNotes) {
            updateDate.注意書き = textToNotes
        }
        if (doc.data().レンジ温め時間.分 != textToMinutes) {
            updateDate.レンジ温め時間 = {
                ...updateDate.レンジ温め時間,
                分: textToMinutes
            };
        }
        if (doc.data().レンジ温め時間.秒 != textToSecond) {
            updateDate.レンジ温め時間 = {
                ...updateDate.レンジ温め時間,
                秒: textToSecond
            };
        }
        if (doc.data().販売元 != textToSeller) {
            updateDate.販売元 = textToSeller
        }
        if (doc.data().カテゴリ != textToCategory) {
            updateDate.カテゴリ = textToCategory
        }
        if (doc.data().原材料ごとの産地.原材料名 != textToMaterial) {
            updateDate.原材料ごとの産地 = {
                ...updateDate.原材料ごとの産地,
                原材料名: textToMaterial
            };
        }
        if (doc.data().原材料ごとの産地.産地 != textToArea) {
            updateDate.原材料ごとの産地 = {
                ...updateDate.原材料ごとの産地,
                産地: textToArea
            };
        }
        if (doc.data().値段 != textToCost) {
            updateDate.値段 = textToCost
        }
        updateDate.timestamp = firebase.firestore.FieldValue.serverTimestamp()



        //更新するデータがあった場合
        if (Object.keys(updateDate).length > 0) {
            console.log("更新するデータがありました。");

            //データを更新
            collectionRef.doc(goodsName).update(updateDate).then(() => {
                console.log("データが更新されました。");
                //アラート（後でやる）
                alert('商品情報を更新しました。');
                //メニュー画面に遷移
                window.location.href = './menu.html';

            }).catch(function (error) {
                console.error("更新中にエラーが発生しました: ", error);
            });
        } else {
            console.log("更新するデータはありません。");
        }
    }).catch((error) => {
        console.error("ドキュメントが取得できません。エラー:", error);
    })

});

//削除ボタンを押したとき
deleteButton.addEventListener('click', function () {
    //画像を削除
    deleteImage(imageRef);
    deleteImage(imageRef2);

    // ドキュメントを削除
    collectionRef.doc(goodsName).delete().then(function () {
        console.log("ドキュメントが削除されました。");

        //アラート
        alert('商品情報を削除しました。');
        //メニュー画面に遷移
        window.location.href = './menu.html';

    }).catch(function (error) {
        console.error("削除中にエラーが発生しました: ", error);
    });

});

//uploadImageToFirestore関数(画像データをアップロードする処理)
function uploadImageToFirestore(imageType, imageFile, goodsName, imageRef) {
    console.log(goodsName);
    console.log(imageRef);

    // imageFile が undefined の場合は処理をスキップ
    if (!imageFile) {
        console.log('更新画像データが無い為、画像をアップロードする処理はスキップします。');
        return;
    }

    //imageTypeが'goods'である場合 
    //  →　true: folderName(フォルダ名)に'goodsFiles'を代入, false: folderName(フォルダ名)に'graphFile'を代入
    const folderName = (imageType === 'goods') ? 'goodsFolder' : 'graphFolder';
    console.log('folderName:', folderName);
    //  →　true: itemName(項目名)に'商品画像'を代入, false: itemName(項目名)に'グラフ画像'を代入
    const itemName = (imageType === 'goods') ? '商品画像' : 'グラフ画像';
    console.log('itemName:', itemName);
    //storageの格納する場所を設定
    //商品画像:   images/goodsFolder/(格納する画像名.拡張子)
    //グラフ画像: images/graphFolder/(格納する画像名.拡張子)
    const storageRef = storagePath.ref(`${userId}/images/${goodsName}/${folderName}/${imageFile.name}`);


    // 画像削除後に画像をアップロードする処理
    deleteImage(imageRef)
        .then(() => {
            // Storageに画像データをアップロード
            return storageRef.put(imageFile);
        })
        .then((snapshot) => {
            console.log(`storageへ${itemName}をアップロード完了`);
            // Storageにある画像データをFirestoreドキュメントに関連付けるための情報を取得
            const fileName = snapshot.metadata.name; // 画像ファイル名
            const filePath = snapshot.metadata.fullPath; // 画像ファイルのパス

            //firestoreに追加するデータ構造を作成
            const updateData = {
                [`imgs.${itemName}`]: {
                    ファイル名: fileName,
                    ファイルパス: filePath
                }
            };
            console.log('updateData:', updateData);


            // firestoreに画像メタデータをアップロード
            return collectionRef.doc(goodsName).update(updateData);
        })
        .then(() => {
            console.log(`${itemName}のメタデータの更新アップロード完了`);
        })
        .catch((error) => {
            console.error('エラーが発生しました:', error);
        });
}

// 画像を削除する関数
function deleteImage(imageRef) {
    return new Promise((resolve, reject) => {
        if (imageRef) {
            imageRef.delete().then(() => {
                console.log('元ある画像の削除完了');
                resolve();
            }).catch((error) => {
                console.log('元ある画像の削除でエラー発生。エラー:', error);
                reject(error);
            });
        } else {
            console.log('元の画像は設定されていません。');
            resolve();
        }
    });
}


//画像をロードする処理
function loadImage(data, imageType, previewId) {
    if (data && data.imgs && data.imgs[imageType] && data.imgs[imageType].ファイル名 && data.imgs[imageType].ファイルパス) {

        const fileName = data.imgs[imageType].ファイル名;
        const downloadURL = data.imgs[imageType].ファイルパス;
        console.log(`${imageType}は、登録されています。`)
        console.log('ファイル名:', fileName);
        console.log('ファイルパス:', downloadURL)

        if (fileName && downloadURL) {
            const imageRef = storagePath.ref(downloadURL);

            imageRef.getDownloadURL().then(function (url) {
                let preview = document.getElementById(previewId);
                preview.src = url;
                preview.alt = fileName;
            }).catch((error) => {
                console.error(`${imageType}を取得できませんでした。`, error);
            });
        }
    } else {
        console.log(`${imageType}は、まだ設定されていないようです。`)
    }

}

//画像が切り替わったときに実行する処理

//商品画像のセットアップ(setupFileInput関数呼出)
setupFileInput(inputGoodsFile, 'goodsPreview');
//グラフ画像のセットアップ(setupFileInput関数呼出)
setupFileInput(inputGraphFile, 'graphPreview');

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