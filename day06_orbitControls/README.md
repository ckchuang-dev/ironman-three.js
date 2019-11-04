# 用 Three.js 來當個創世神 (06)：專案實作#3 - OrbitControls、stats.js

> 今天主要是設定方面的內容，要加上的工具包含 OrbitControls 與 stats.js。一個是軌道控制器，透過拖移及縮放調整相機位置；另一個是畫面刷新頻率（FPS）性能監控 UI。

![front](https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b4da6b29141c3acee36f4fea461fa211&auto=format&fit=crop&w=1052&q=80)

Photo by [Glenn Carstens-Peters](https://unsplash.com/@glenncarstenspeters) on [Unsplash](https://unsplash.com/photos/0woyPEJQ7jc)

---

這是本系列第 06 篇，如果還沒看過第 05 篇可以點以下連結前往：

[用 Three.js 來當個創世神 (05)：專案實作#2 - 基本人物模型](https://ithelp.ithome.com.tw/articles/10200287)

---

 

## 今日目標

今天主要是設定方面的內容，主要是為了之後調整材質與光影效果時能開發的更順暢。要加上的工具包含以下：

- OrbitControls：軌道控制器，透過拖移及縮放調整相機位置。
- stats.js：畫面刷新頻率（FPS）性能監控。

![06_demo](https://i.imgur.com/pIdxxTs.gif)

可以點此看[完整原始碼](https://github.com/DezChuang/ironman-three.js/blob/master/day06_orbitControls/index.js)及[成果展示](https://dezchuang.github.io/ironman-three.js/day06_orbitControls/index.html)。

最後的成果圖如上，會出現左上角的小工具，以及可以透過滑鼠移動畫面，以下就讓我們開始吧！

 

## 前置作業

由於這兩個工具都是額外的函式庫，需要引入以下函式庫：

```html
https://threejs.org/examples/js/controls/OrbitControls.js
https://cdnjs.cloudflare.com/ajax/libs/stats.js/r16/Stats.min.js
```

## OrbitControls（軌道控制器）

如果你玩過一些 3D 遊戲，相信「調整畫面視角」是個不可或缺的功能，`OrbitControls` 透過簡單的幾行程式設定，就能在 Three.js 中透過滑鼠對畫面進行`旋轉`、`平移`、`縮放`的功能，如此一來在開發時可以更快地掌握整個場景每一個角度的內容及需要如何設定座標等等。

使用方法如下，可以在 Demo 中試著操作看看：

- 旋轉：`滑鼠左鍵`按住拖移至欲旋轉的方向。
- 平移：`滑鼠右鍵`按住拖移至欲平移的方向，或者也可以使用鍵盤方向鍵。
- 縮放：`滑鼠滾輪`滾動。

程式碼設定如下：

```javascript
function init() {
	...
	// 相機設定
	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)
	camera.position.set(30, 30, 30)
	camera.lookAt(scene.position)

	// 建立 OrbitControls
	let cameraControl = new THREE.OrbitControls(camera, renderer.domElement)
	...
}
```

其實它的原理很簡單，就是透過滑鼠改變相機位置而已，但其實這元件還有許多屬性可以設定：

```javascript
cameraControl.enableDamping = true // 啟用阻尼效果
cameraControl.dampingFactor = 0.25 // 阻尼系數
cameraControl.autoRotate = true    // 啟用自動旋轉
```

`enableDamping` 與 `dampingFactor` 效果可以理解為在拖移旋轉時的「滑鼠靈敏度」；而 `autoRotate` 很直觀就是相機會繞著指定位置旋轉，類似展示的功能，需要注意的是，設定這兩個參數時，需要在 `render()` 處做 update 才會有效果：

```javascript
function render() {
	requestAnimationFrame(render)
	cameraControl.update() // 需設定 update
	renderer.render(scene, camera)
}
```

以上挑幾個比較重要的屬性示範，有興趣深入可以參考 [OrbitControls 官方文件](https://threejs.org/docs/#examples/controls/OrbitControls)。

另外後來才發現其實 Three.js 中提供了不止 `OrbitControls` 這種控制相機的工具，其他的還包含了`第一人稱視角控制器（FirstPersonControls）`、`飛行控制器（FlyControls）`、`翻滾控制器（RollControls）`、`軌跡球控制器（TrackBallControls）` 等等，如果是射擊遊戲的話，看來之後可以考慮使用第一人稱視角的控制器會更有臨場感。

## stats.js 與 FPS 介紹

讀者可以在 Demo 的左上角看到一個 UI 寫著 `60 FPS`，這就是 `stats.js` 的功能，它是一個監控性能的工具，用來觀察畫面刷新頻率是否維持在正常值。

那怎麼樣是不正常呢？這裡要先理解[畫面刷新頻率（FPS, Frame per Second）](https://zh.wikipedia.org/wiki/%E5%B8%A7%E7%8E%87)是什麼，簡單說就是「每一秒畫面會重新渲染幾次（幀）」，你可能有聽過，當動畫低於每秒 24 幀，人眼就會感覺有停頓，而一般而言，瀏覽器為了搭配顯示器的 FPS，兩者都會是  `60 FPS`。

而在前面文章中有提過 Three.js 中透過 `requestAnimationFrame` 來重新渲染畫面，它就是採用與瀏覽器同步的 FPS 來達到流暢且高效的動畫。

這邊找了一個 3D 遊戲實測[影片](https://www.youtube.com/watch?v=rx704_XjGRM)，各位可以實際體驗一下 FPS 高低的差異。

回到主題，一般而言這個監測器都會顯示在大約 `60 FPS` 上下，但當它開始低於這個數值持續一段時間，那就是需要考慮性能優化的時候了。

講了這麼多，其實程式碼的設定也很簡單：

```javascript
let statsUI

// 建立監測器
function initStats() {
  const stats = new Stats()
  stats.setMode(0) // FPS mode
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

function init() {
	...
	statsUI = initStats() // 初始化
	...
}

function render() {
	requestAnimationFrame(render)
	statsUI.update() // 需設定 update 才會持續更新
	renderer.render(scene, camera)
}
```

跟前面 OrbitControls 設定很像，建立 `stats` 物件後記得在 `render()` 裡做 update；其中有一個 `stats.setMode(0)`，這裡如果設成 `0` ，會顯示「畫面刷新頻率（FPS）」，設成 `1` 的話，就會轉換為「畫面渲染時間」。

而另外要注意的是在 `initStats()` 的地方將這個監測器 append 到 DOM 上，記得在 HTML 與 CSS 加上相關元件與樣式：

- index.html

```html
<div id="stats"></div>
```

- index.css

```
#stats {
  position: absolute;
  left: 0;
  top: 0;
}
```

 

## 今日小結

今天介紹了兩個小工具，有了 `OrbitControls` 協助觀察場景，建立物體座標不需要再考驗自己的空間感；有了 `stats.js`，可以監控渲染的效能是否過差需要調整。

其實原本還想順便講 `dat.GUI` 的，就是之前切換相機那個小面板，但突然心血來潮想深入理解一下 `FPS` 與 `requestAnimationFrame`，不小心花了很多篇幅，其實兩個工具本身的設定都沒有太複雜的內容，`dat.GUI` 就之後了解更多基本元素再來寫可能也比較適合。

雖然今天畫面上沒什麼進展，但耐住性子先理解及完成這些方便的開發工具或許也是工程師的美德吧，明天會來處理苦力怕的材質，我們明天見！

最後再附上今天的[程式碼](https://github.com/DezChuang/ironman-three.js/blob/master/day06_orbitControls/index.js)及[成果展示](https://dezchuang.github.io/ironman-three.js/day06_orbitControls/index.html)。