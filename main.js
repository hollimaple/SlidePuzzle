"use strict";

var tiles = []; //タイルの配列
//ユーザーエージェント判定
const is_iOS = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
//移動フラグ
//1個づつスライドするようにする
var moveTo = {
    x: 0,
    y: 0
}; //前回移動方向 x:1右 -1左 y:1上 -1下

//差し替え可能なところはJQueryの記述に書き直しを行った
//画面読み込み時に実行
window.addEventListener('DOMContentLoaded', function(e){
    let table = $("#table").get(0);
    for(let i=0;i<4;i++){
        let tr = $("<tr>").get(0);
        for(let j=0;j<4;j++){
            //表の列作成
            let index = i*4 + j;
            let td = $("<td>").prop({
                className: "tile",
                index: index,
                value: index,
                //空のタイルはゼロ
                textContent: index==0 ? "" : index,
            });
            tr.append(td.get(0));
            tiles.push(td.get(0));
        }
        table.append(tr);
    }
    //盤面の初期化(クリックを呼び出すことで解ける問題とする)
    for(let i=0;i<3;i++){
        click(Math.floor(Math.random()*16));
    }

    //iOS対応（中止）
    //ダイアログが出ないため、ユーザーエージェント判定だけを行う
    //参考:https://zenn.dev/homing/articles/705ac9c0cd1006
    if (is_iOS){
        DeviceOrientationEvent.requestPermission().then(response => {
            if (response === "granted") {
                window.addEventListener("deviceorientation", deviceOrientation, false);
            }
        }).catch((e) => {
            console.error(e);
        })
    }else{
        window.addEventListener("deviceorientation", deviceOrientation, false);
    }

});

//参考:https://kkblab.com/make/javascript/acc.html
//参考:https://dianxnao.com/javascript%E7%AB%AF%E6%9C%AB%E3%81%AE%E5%82%BE%E3%81%8D%E3%81%AB%E5%BF%9C%E3%81%98%E3%81%A6%E3%83%9C%E3%83%BC%E3%83%AB%E3%82%92%E5%8B%95%E3%81%8B%E3%81%99/
//加速度センサーの値を取得
function deviceOrientation(e){
    const coefficient = is_iOS ? -1 : 1;
    let vec = {x: 0, y: 0}; //加速度センサー値格納用
    vec.x = e.gamma * coefficient; //x方向の移動量
    vec.y = e.beta * coefficient; //y方向の移動量
    //加速度センサーのイベントが発火したら
    //移動量から入れ替え要不要、入れ替え方向を判断
    move(vec.x,vec.y);
}

//スマートフォン端末を動かすことでタイルを動かす
function move(x,y){
    //tiles[i].value == 0　を探す
    let n = tiles.length;
    let index;
    for(let i=0;i<n;i++){
        if(tiles[i].value == 0){
            index = i;
        }
    }

    //絶対値が閾値以上傾いている時にタイルの入れ替えを実行する
    if(Math.abs(x)>=25 || Math.abs(y)>=25){
        //xが大きい時
        if(Math.abs(x)>Math.abs(y)){
            //正の数の時
            if(x>0){
                //Right
                //空いているタイルindexが
                //4の倍数の時はこれ以上swapする必要がない(衝突判定)
                //(4の倍数の時以外はswap)
                if(moveTo.x != 1){
                    if((index%4) != 0){
                        swap(index,index-1);
                    }
                    moveTo.x = 1;
                    moveTo.y = 0;
                }
                
            }else{
                //負の数の時
                //Left
                //4の倍数-1の時はこれ以上swapする必要がない
                if(moveTo.x != -1){
                    if((index%4) != 3){
                        swap(index,index+1);
                    }
                    moveTo.x = -1;
                    moveTo.y = 0;
                }
            }
        }else{
            //yが大きい時
            //正の数の時
            if(y>0){
                //Down
                //下に要素がない時はこれ以上swapする必要がない
                if(moveTo.y != -1){
                    if((index-4) >= 0){
                        swap(index,index-4);
                    }
                    moveTo.x = 0;
                    moveTo.y = -1;
                }
            }else{
                //負の数の時
                //Up
                //上に要素がない時はこれ以上swapする必要がない
                if(moveTo.y != 1){
                    if((index+4) < 16){
                        swap(index,index+4);
                    }
                }
                moveTo.x = 0;
                moveTo.y = 1;
            }
        }
    }else{
        moveTo.x = 0;
        moveTo.y = 0;
    }
}

//盤面の初期化は内部的にはクリックで実装
function click(index){
    let i = index;
    if(i-4>=0 && tiles[i-4].value==0){
        swap(i,i-4);
    }else if(i+4<16 && tiles[i+4].value==0){
        swap(i,i+4);
    }else if(i%4!=0 && tiles[i-1].value==0){
        swap(i,i-1);
    }else if(i%4!=3 && tiles[i+1].value==0){
        swap(i,i+1);
    }
    
}

//タイルの入れ替え
function swap(i,j){
    let tmp = {
        content: tiles[i].textContent,
        val: tiles[i].value
    }
    tiles[i].textContent = tiles[j].textContent;
    tiles[i].value = tiles[j].value;
    tiles[j].textContent = tmp.content;
    tiles[j].value = tmp.val;
    //swap後にパズルが完成していればダイアログを出す
    let n = tiles.length;
    let count = 0;
    for(let k=0;k<n;k++){
        if(tiles[k].value == k){
            count++;
        }
    }
    if(n == count){
        alert("パズルが完成しました!");
    }
}
