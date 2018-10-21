# 用 Three.js 來當個創世神 (05)：專案實作#2 - 基本人物模型

> 昨天了解了整個專案的架構，首先就從基本的人物模型開始動手吧！

![open_05](https://images.unsplash.com/photo-1458501534264-7d326fa0ca04?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e08e11ec8d46b504d41ca0e7777fb787&auto=format&fit=crop&w=1050&q=80)
Photo by [Jeremy Thomas](https://unsplash.com/@jeremythomasphoto) on [Unsplash](https://unsplash.com/photos/FO7bKvgETgQ)

---

這是本系列第 05 篇，如果還沒看過第 04 篇可以點以下連結前往：

[用 Three.js 來當個創世神 (04)：專案實作#1 - 專案規劃](https://ithelp.ithome.com.tw/articles/10199744)

---

## 今日目標

今天要來完成 Creeper（苦力怕）模型：

![demo](https://ithelp.ithome.com.tw/upload/images/20181014/20107572pSaGFgxfgX.png)

可以點此看[完整原始碼](https://github.com/DezChuang/ironman-three.js/blob/master/day05_creeperModel/index.js)及[成果展示](https://dezchuang.github.io/ironman-three.js/day05_creeperModel/index.html)。

## 專案實作

程式碼部分跟前天的概念差不多，直觀地從成果圖來看，可以發現就是用六個不同大小及位置的長方體就可以組成一隻苦力怕，非常的簡單，就像是小時候在玩樂高積木一樣，以下我們針對其中比較不一樣的細節做解說。

### 苦力怕物件

```javascript
class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

    // 馮氏材質設為綠色
    const creeperMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 })

    // 頭
    this.head = new THREE.Mesh(headGeo, creeperMat)
    this.head.position.set(0, 6, 0)

    // 身體
    this.body = new THREE.Mesh(bodyGeo, creeperMat)
    this.body.position.set(0, 0, 0)

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, creeperMat)
    this.foot1.position.set(-1, -5.5, 2)
    this.foot2 = this.foot1.clone() // 剩下三隻腳都複製第一隻的 Mesh
    this.foot2.position.set(-1, -5.5, -2)
    this.foot3 = this.foot1.clone()
    this.foot3.position.set(1, -5.5, 2)
    this.foot4 = this.foot1.clone()
    this.foot4.position.set(1, -5.5, -2)

    // 將四隻腳組合為一個 group
    this.feet = new THREE.Group()
    this.feet.add(this.foot1)
    this.feet.add(this.foot2)
    this.feet.add(this.foot3)
    this.feet.add(this.foot4)

    // 將頭、身體、腳組合為一個 group
    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.feet)
  }
}
```

從完成圖來看可以發現，一隻苦力怕包含了一個大頭、一個長身體、四隻短腳，而這邊試著將整隻苦力怕的組件寫成一個 `class` 物件，在其中將四隻腳與整個身體用  `THREE.Group()` 層層組合起來，這樣在後續針對每一個物件下的屬性做操作會更方便。

材質的部分這裡暫時先使用基本的馮氏材質，並套上最基本的綠色做為皮膚。

### 創建苦力怕

```javascript
// 生成苦力怕並加到場景
function createCreeper() {
  const creeperObj = new Creeper()
  scene.add(creeperObj.creeper)
}

function init(){
	...
	// 產生苦力怕
	createCreeper()
	...
}
```

這邊承接上述的苦力怕物件，做成一個只要一在 `init()` 中呼叫就能產生一隻苦力怕的 function，這樣之後若要產生很多隻苦力怕就很方便了！

### 加入地板

```javascript
// 簡單的地板
const planeGeometry = new THREE.PlaneGeometry(60, 60)
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
plane.position.set(0, -7, 0)
scene.add(plane)
```

這邊加入一個簡單的平面物體當作地板，目前就只是一個看起來可以立足的地方，但實際上的用途在之後的光影效果會看到。

這邊其中有一行 `plane.rotation.x = -0.5 * Math.PI`，是指將平面「沿著 x 軸正方向逆時針轉 90 度」。

原因是 `PlaneGeometry` 預設是在 `z = 0` 的 `x-y 平面`上，又在材質屬性中的 `side` 預設是 `THREE.FrontSide` 時只有平面體的前側會反射光線，也就是朝向 z 軸正向的方向，因此為了達到預期的讓此平面呈現為 `y = 0` 的 `x-z 平面`且可以反射光線，需要將平面體「沿著 x 軸正方向逆時針旋轉 90 度」。

### THREE.AxesHelper

```javascript
let axes = new THREE.AxesHelper(20) // 參數為座標軸長度
scene.add(axes)
```

最後提一下，一個簡單好用的輔助小幫手，就是在之前有提過的 `THREE.AxesHelper`，有了這個就不怕分不清楚每一項元素的三軸座標該怎麼設。

## 今日小結

今天先完成了一個苦力怕的模型，相信大家好像也開始覺得自己又往遊戲工程師的路上前進了一些（握拳），程式碼跟前天的概念沒差太多，場景、渲染器、燈光等等都一樣，所以只做了新東西的分析，若有任何不懂的地方歡迎在下面留言區發文。

目前只先完成了形狀的部分，明天會先來幫這個場景加上一些小工具，方便後面修改材質及光影效果，我們明天見！

最後再附上本日的[完整原始碼](https://github.com/DezChuang/ironman-three.js/blob/master/day05_creeperModel/index.js)及[成果展示](https://dezchuang.github.io/ironman-three.js/day05_creeperModel/index.html)連結。