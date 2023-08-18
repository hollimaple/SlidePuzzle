"use strict";

var tiles = []; //タイルの配列

//画面読み込み時に実行
window.addEventListener('DOMContentLoaded', function(){
    let table = $("#table").get(0);
    for(let i=0;i<4;i++){
        let tr = document.createElement("tr");
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
    for(let i=0;i<100;i++){
        click(Math.floor(Math.random()*16));
    }
});

//参考:https://dianxnao.com/javascript%E7%AB%AF%E6%9C%AB%E3%81%AE%E5%82%BE%E3%81%8D%E3%81%AB%E5%BF%9C%E3%81%98%E3%81%A6%E3%83%9C%E3%83%BC%E3%83%AB%E3%82%92%E5%8B%95%E3%81%8B%E3%81%99/
//加速度センサーの値を取得
window.addEventListener("deviceorientation", function(e){
    let vec = {x: 0, y: 0}; //加速度センサー値格納用
    vec.x = e.gamma; //x方向の移動量
    vec.y = e.beta; //y方向の移動量
    //加速度センサーのイベントが発火したら
    //移動量から入れ替え要不要、入れ替え方向を判断
    move(vec.x,vec.y);
}, false);

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
    if(Math.abs(x)>=2 || Math.abs(y)>=2){
        //xが大きい時
        if(Math.abs(x)>Math.abs(y)){
            //正の数の時
            if(x>0){
                swap(index,index+1);
            }else{
                //負の数の時
                swap(index,index-1);
            }

        }else{
            //yが大きい時
            //正の数の時
            if(y>0){
                swap(index,index+4);
            }else{
                //負の数の時
                swap(index,index-4);
            }
        }
    }
}

//動かせるか確認
function check(){

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
    let tmp = tiles[i].value;
    tiles[i].textContent = tiles[j].textContent;
    tiles[i].value = tiles[j].value;
    tiles[j].textContent = tmp;
    tiles[j].value = tmp;
    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(2000);
}
