# 用 Three.js 來當個創世神 (03)：Hello Three.js!

> 在程式語言的學習過程中，第一步當然就是先寫個「Hello world」了！本篇文章將手把手的透過簡單的範例，逐行分析程式碼，建立本系列的第一個 3D 場景及物體並讓它在瀏覽器上活起來!

![hello](https://images.unsplash.com/photo-1531220847861-69e336daffa0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=61c1089e5994112208b80382716c4b69&auto=format&fit=crop&w=1050&q=80)
Photo by [Malcolm Lightbody](https://unsplash.com/@mlightbody) on [Unsplash](https://unsplash.com/photos/mfKdQMDSUSU)

---

這是本系列第 03 篇，如果還沒看過第 02 篇可以點以下連結前往：

[用 Three.js 來當個創世神 (02)：Three.js 基本元素介紹](https://ithelp.ithome.com.tw/articles/10199699)

---

## 今日目標

在了解 3D 場景中的基本元素後，今天我們要來完成以下的範例：

![final](https://ithelp.ithome.com.tw/upload/images/20181014/20107572MOCnmyTzSo.png)

可以點此看[完整原始碼](https://github.com/DezChuang/ironman-three.js/blob/master/day03_helloThree/index.js)及[成果展示](https://dezchuang.github.io/ironman-three.js/day03_helloThree/index.html)。

相信你可能會覺得這很不炫砲，滿心期待地想做官網上看到的那些範例。但千里之行始於足下，看似簡單的畫面，將是我們踏入 Three.js 的起點，也是適合拿來當 3D 小專案的 boilerplate（樣板），因為在每次要開始做一個新的 3D 場景時，這些基本建設都是差不多的樣子，就讓我們先從這個 Three.js 的 Hello World 開始學起吧！

&nbsp;

## 右手座標定位

在開始 coding 前還有一個關於坐標的基本觀念，少了這個的話在三維場景中將很難理解各項元素的位置。

![rightHand](https://upload.wikimedia.org/wikipedia/commons/b/b2/3D_Cartesian_Coodinate_Handedness.jpg)

Photo by Primalshell on [Wikimedia](https://commons.wikimedia.org/wiki/File:3D_Cartesian_Coodinate_Handedness.jpg)

在 Three.js 中採用「右手座標定位」，也就是當你伸出右手來看時，大拇指代表 X 軸、食指為 Y 軸、中指代表 Z 軸，可以試著比出一個如圖右兩兩互相垂直的手勢，而這三隻手指的指向即為座標軸正向的方向。

一開始不熟的時候常常都要用右手比半天也是很正常的，也可以搭配 [`THREE.AxesHelper`](https://threejs.org/docs/#api/en/helpers/AxesHelper) 來輔助。

&nbsp;

## Hello Three.js!

程式碼的連結在[這裡](https://github.com/DezChuang/ironman-three.js/blob/master/day03_helloThree/index.js)，不管是用什麼樣的編輯器，一開始都要記得引入 Three.js 的 library（本系列文使用目前最新的 96 版）：

```html
https://cdnjs.cloudflare.com/ajax/libs/three.js/96/three.min.js
```

以下開始來深入分析今天要實作的程式碼。

#### 1. 建立場景

```javascript
scene = new THREE.Scene()
```

毫無疑問，就是建立場景。

&nbsp;

#### 2. 建立渲染器

```javascript
renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight) // 場景大小
renderer.setClearColor(0xeeeeee, 1.0) // 預設背景顏色
renderer.shadowMap.enable = true // 陰影效果
```

前面提過可以在渲染器中設定場景大小、預設背景顏色、陰影效果，預設背景顏色不設的話預設就是黑色（0x000000）；而將其中的 `shadowMap.enable` 設成 `true` ，之後在物體與光源的互動才有辦法產生影子。

&nbsp;

#### 3. 建立相機

```javascript
camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(10, 10, 10) // 相機位置
camera.lookAt(scene.position) // 相機焦點
```

在這之後的相機會一律採用透視投影相機（PerspectiveCamera），讓畫面中的遠近更符合真實世界，而其中的每一個參數依序代表：

- 視角（fov, field of view）：又稱為視野、視場，指的是我們能從畫面上看到的視野範圍，一般在遊戲中會設定在 60 ~ 90 度。
- 畫面寬高比（aspect）：渲染結果的畫面比例，一般都是使用 `window.innerWidth / window.innerHeight` 。
- 近面距離（near）：從距離相機多近的地方開始渲染，一般推薦使用 `0.1`。
- 遠面距離（far）：相機能看得多遠，一般推薦使用 `1000`，可視需求調整，設置過大會影響效能。

特別提一下 `camera.lookAt` ，這個屬性是指相機會盯著何處，一般靜止觀察的相機都是設定為 `camera.lookAt(scene.position)`，就是觀察場景固定的位置。但若今天你要讓相機動態追蹤某個物體，那你可以在渲染時改變 `camera.lookeAt` 中的參數為特定物體的某個基準座標，可以參考[官網範例](https://threejs.org/examples/?q=lookat#misc_lookat)。

&nbsp;

#### 4. 建立光源

```javascript
let pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 10, -10)
scene.add(pointLight)
```

這邊建立了一個點光源，簡單地設定了顏色與光源位置，可以自己試著將 `scene.add(pointLight)` 註解掉觀察差異。

&nbsp;

#### 5. 建立物體

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1) // 幾何體
const material = new THREE.MeshPhongMaterial({
	color: 0x0000ff
}) // 材質
cube = new THREE.Mesh(geometry, material) // 建立網格物件
cube.position.set(0, 0, 0)
scene.add(cube)
```

這邊幾何體使用四方體的 `THREE.BoxGeometry`、材質設定為馮氏材質，此種材質會受光源影響它的表面，因此若讀者試著自己將點光源拿掉，便會發現物體並不會呈現它應有的藍色。

一般建立物體的 SOP 就是宣告形狀（geometry）、材質（material），然後用這兩個要素建立一個網格物件（mesh），並設定其位置加到場景中便可完成。

&nbsp;

#### 6. 建立動畫

```javascript
function animate() {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
}
```

再加入簡單的旋轉動畫，讓畫面更有趣一些。

&nbsp;

#### 7. 渲染場景

```javascript
function render() {
  animate()
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
```

最後就是呼叫渲染器將剛才場景中的設定都渲染到畫面上。

而若是要讓場景中的物體動起來，就需要處理「每隔一段時間重新渲染場景」的工作，而這就是`requestAnimationFrame` 所負責的部分。

`requestAnimationFrame` 是 HTML5 中瀏覽器提供的一個為動畫而生的接口，它能讓畫面盡可能平滑、高效地進行重新渲染，還有效節省 CPU、GPU 資源，所以一般在 Three.js 會透過它來幫忙重新渲染場景。

用法可以從以上程式碼了解，在 `requestAnimationFrame` 中，我們放入了 `render` 當作它的 callback function，讓場景能不斷的被重新渲染，使得動畫能持續地進行下去。

&nbsp;

#### 8. 其他設定

```javascript
// 監聽螢幕寬高變化來做簡單 RWD 設定
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

最後針對每次瀏覽器視窗寬高有變化時，要能有 RWD 的效果，就需要在監聽螢幕尺寸有變化時，須告訴相機與場景新的寬高比，如此一來，不管怎麼調整視窗寬高，都能讓這個正方體一直維持在畫面中旋轉。

&nbsp;

## 今日小結

將以上的每一塊程式碼組合起來，再搭配上 Three.js 的函式庫，就能順利在瀏覽器上看到一個在旋轉的 3D 正方體囉！

恭喜你完成了 Three.js 中的第一個作品，雖然只是個很不起眼的正方體，但今日的一小步，是後面做出各種炫砲 3D 畫面的一大步。但如果在過程中有遇到任何 bug 導致無法看見預期結果，也歡迎在以下留言區提出問題。

基本上如果能了解昨天的基本概念，再加上一些 Javascript 的基礎，其實 Three.js 就只是不斷的在呼叫 API 將各種元件加到畫面上的動作而已，而有關每一個 API 其實都還有更多的屬性與參數可以設定，建議是不需要硬記，因為實在太多了，在開發過程中有需要用到再到[官方文件](https://threejs.org/docs/)查就可以了。

完成了今天的 Hello Three.js 小試身手後，後面開始會直接來實作遊戲專案，一路上邊實作需要的功能邊補上介紹，我們明天見！

最後再附上[完整原始碼](https://github.com/DezChuang/ironman-three.js/blob/master/day03_helloThree/index.js)及[成果展示](https://dezchuang.github.io/ironman-three.js/day03_helloThree/index.html)連結。
