# 用 Three.js 來當個創世神 (00)：關於此系列文

> 此系列文將從 Three.js 基本觀念切入，前面幾篇會簡單介紹如何用 Three.js 的基本元素在網頁上畫出 3D 場景與物體，之後直接透過實作遊戲專案，在過程中一邊完成專案所需要的內容，一邊說明 Three.js 中各種基本元素的應用細節，讓後期的專案能以漸進完成的方式呈現，做出一款網頁 3D 遊戲。

![photo](https://images.unsplash.com/photo-1504257365157-1496a50d48f2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cd9045b6436e90624f908f6ede529f97&auto=format&fit=crop&w=1050&q=80)
Photo by [Samuel Zeller](https://unsplash.com/@samuelzeller) on [Unsplash](https://unsplash.com/photos/rk_Zz3b7G2Y)

---

## 系列文大綱

以下是這一系列 30 天的大綱安排：

- Three.js 基礎
  - Three.js 簡介
  - 3D 基本元素簡介
  - Hello Three.js!
- 遊戲專案實作
  - 建立人物基本模型
  - 輔助小工具
  - 材質與紋理貼圖
  - 光影效果
  - 基礎動畫
  - 遊戲場景
  - 粒子系統與爆炸
  - 透過 loader 載入外部資源
  - 加入遊戲音效及背景音樂
- 物理引擎介紹與應用
  - 物理引擎介紹
  - 碰撞偵測介紹
  - 將物理引擎加入專案
- 整合 3D 遊戲專案其他功能
- 總結

大方向的規劃如上，此系列文將從 Three.js 基本觀念切入，前面幾篇會簡單介紹如何用 Three.js 的基本元素在網頁上畫出 3D 場景與物體，之後直接透過實作遊戲專案，在過程中一邊完成專案所需要的內容，一邊說明 Three.js 中各種基本元素的應用細節，讓後期的專案能以漸進完成的方式呈現，做出一款網頁 3D 遊戲。

## 閱讀建議

由於 Three.js 是使用 `Javascript` 的應用，為了讓各位讀者能有較佳的閱讀體驗，建議能對 `Javascript` 語法有基本的了解，在理解程式碼上會更容易些。

## 筆者介紹

Hi，我 Dez，目前在一零四資訊科技擔任網頁前端工程師，由於轉職前端資歷並不長，希望透過鐵人賽刺激自己多多學習，第一次接觸 3D 的領域，不敢稱此系列為教學文，但仍會力求資訊的正確性，所以如果後面有哪個地方解釋有誤，歡迎讀者不吝指正。

另外如果讀者對於文章內容有任何疑問或是建議，也可以直接在留言區留言或透過以下方式與我聯絡：

- E-mail: [dissaivent@gmail.com](mailto:dissaivent@gmail.com)
- Linkdin: [http://www.linkedin.com/in/dezchuang/](http://www.linkedin.com/in/dezchuang/)
- Medium: [https://medium.com/dezchuang](https://medium.com/dezchuang)


## 團隊成員友情連結

好不容易組團參賽，還有一個好不容易想出來的團名，第一天的最後來分享一下各位隊友的系列文連結，歡迎各位讀者對有興趣的主題也可以訂閱關注囉：

- [Vue.js 手牽手，一起嗑光全家桶](https://ithelp.ithome.com.tw/users/20111576/ironman/1787)
- [JavaScript 音樂漫遊 - 30 天探索 Web Audio！](https://ithelp.ithome.com.tw/users/20111380/ironman/1783)
- [網頁設計靠 Vue.js 轉前端](https://ithelp.ithome.com.tw/users/20111956/ironman/1784)
- [30 天讓設計師搞定 CSS/SVG 動畫](https://ithelp.ithome.com.tw/users/20111500/ironman/1788)
- [30 天 Pixi 帶你飛上天](https://ithelp.ithome.com.tw/users/20111962/ironman/1789)
- [python 入門到分析股市](https://ithelp.ithome.com.tw/users/20111390/ironman/1791)
- [Phaser 幫我撐個 30 天](https://ithelp.ithome.com.tw/users/20111617/ironman/1794)
- [AWS 高手同事離職後不止 30 天](https://ithelp.ithome.com.tw/users/20112115/ironman/1910)

也歡迎對 Three.js 這個主題有興趣的朋友持續追蹤，希望三十天後大家都可以順利完賽！Go！Go！Go！