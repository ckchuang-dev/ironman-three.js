# 用 Three.js 來當個創世神 (01)：Three.js 簡介

> Three.js 是一套基於 WebGL 開發出的 Javascript 函式庫，它提供了比 WebGL 更簡單的 Javascript API，讓開發者能夠輕易在瀏覽器做 3D 繪圖。

![Three.js 作品範例示意圖](https://dl.dropboxusercontent.com/s/297oeyjmlf5vy4l/day02_ThreeExample.png)

---

這是本系列第 01 篇，如果還沒看過第 00 篇可以點以下連結前往：

[用 Three.js 來當個創世神 (00)：關於此系列文](https://ithelp.ithome.com.tw/articles/10199657)

---

## 應用場景

在開始介紹什麼是 Three.js 之前，先稍微來看幾個範例吧！

Three.js 可以應用在許多網頁上需要 3D 的場景，諸如小遊戲、品牌網站、視覺藝術 ... 等等：

#### 小遊戲範例

網址：[https://tympanus.net/Tutorials/TheAviator/](https://tympanus.net/Tutorials/TheAviator/)

![ex1](https://dl.dropboxusercontent.com/s/i4bto9vvidke5tk/day02_ExampleGame2.png)

#### 品牌網站範例

網址：[http://campoallecomete.it](http://campoallecomete.it)

![ex2](https://dl.dropboxusercontent.com/s/sto00kii9bec1bk/day02_ExampleCollection2.png)

#### 視覺藝術範例

網址：[http://lab.samsy.ninja/](http://lab.samsy.ninja/)

![ex3](https://dl.dropboxusercontent.com/s/8206ctma94hy5rv/day02_ExampleArt.png)

以上簡單列出幾個，更多範例可以參考官網上的[作品集](https://threejs.org/)，當初筆者也是在看了一大堆厲害的作品後，深深被 Three.js 吸引，就這樣選擇了這個題目來研究。

## 什麼是 Three.js

簡單的說，Three.js 是一套基於 WebGL 開發出的 Javascript 函式庫，它提供了比 WebGL 更簡單的 Javascript API，讓開發者能夠輕易在瀏覽器做 3D 繪圖。

而此時你可能會充滿疑惑，那什麼是 WebGL？常聽到人家說的 OpenGL 又是什麼？他們與 Three.js 又是什麼關係？

如果更深入的探討 Three.js 的發展的話，可以稍微畫圖介紹一下：

![](https://dl.dropboxusercontent.com/s/upadx6ncun6mv8l/day02_ThreeHistory.png)

從上圖可以看見 Three.js 是基於 WebGL 發展而來、WebGL 是基於 OpenGL ES 2.0 發展而來、而 OpenGL ES（OpenGL for Embedded Systems） 是 OpenGL 為嵌入式系統特製的版本。

基本上越往 OpenGL 的方向靠近，就會有更多一些底層與硬體加速相關的 API，也會需要了解更多的圖學與數學知識。而 WebGL 可以想成是瀏覽器提供我們 Javascript API 接口，透過這些接口我們可以直接享用 OpenGL 的功能，在瀏覽器上實現強大的 3D 繪圖效果。

![](https://dl.dropboxusercontent.com/s/4w0pvvwm657a5tf/day02_CanIUse.png)

從上圖可以看見現今大部分瀏覽器都支援 WebGL，而雖然 WebGL 提供的接口非常豐富與強大，但使用起來仍稍嫌復雜，這就是為什麼我們需要 Three.js。

## 為什麼需要 Three.js

由於 WebGL 對於初學者而言仍需要了解它的底層細節、複雜的著色語言（GLSL），所以想要短時間上手 WebGL 是相對困難的，在幾年前的鐵人賽中 Kalan 大大曾寫過關於 WebGL 的介紹，想體驗一下的朋友可以參考他的[系列文](https://ithelp.ithome.com.tw/users/20103565/ironman/1188)。

而 Three.js 最大的優點就是它對 WebGL 進行了良好的封裝，大大的降低了前端工程師們的學習成本，可以說 Three.js 蠻像 3D 網頁中的 jQuery。

另外一點就是 Three.js 具備輕量函式庫的特性，相當適合拿來在 Web 做中小型專案，像是小遊戲或品牌網頁等。

## 開發環境

其實做 Three.js 相關的專案，不需要複雜的環境安裝，只需要以下三樣：

- 一套你慣用的編輯器

  - 不管是 [VSCode](https://code.visualstudio.com/)、[Sublime](https://www.sublimetext.com/)、[Notepad++](https://notepad-plus-plus.org/download/v7.5.8.html)，或是線上的 [jsFiddle](https://jsfiddle.net/)、[Codepen](https://codepen.io/) ... 等等，只要簡單的 HTML、CSS、Javascript 三個檔案就能完成 Three.js 的程式編寫，甚至你要全部寫在一個 HTML 檔也是沒問題的。

- 一個能支援 WebGL 的瀏覽器
  - 基本上現今大部分瀏覽器都可以支援 WebGL，也可以[點此](https://get.webgl.org/)測試你的瀏覽器是否支援 WebGL，能看到下圖代表可以正常使用：

![](https://dl.dropboxusercontent.com/s/s1su5k8x8r8athp/day02_WebGLTest.png)

- 還有最重要的是一顆好奇的心，準備好一起探索 3D 世界吧！

## 今日小結

以上用幾個範例介紹了 Three.js 的可以應用的場景，Three.js 的 **What** and **Why**，以及開發環境檢查，一切準備就緒之後，明天我們即將進入 3D 世界開始學習 Three.js 中的基本元素，敬請期待！
