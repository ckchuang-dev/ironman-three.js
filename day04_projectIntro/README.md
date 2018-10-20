# 用 Three.js 來當個創世神 (04)：專案實作#1 - 專案規劃

> 今天開始專案實作第一天，先來聊聊接下來的這整個專案要做些什麼吧！

![project1](https://ithelp.ithome.com.tw/upload/images/20181020/20107572sXJq6nzqth.jpg)
Photo by [rawpixel](https://unsplash.com/@rawpixel) on [Unsplash](https://unsplash.com/photos/lRssALOk1fU)

---

這是本系列第 04 篇，如果還沒看過第 03 篇可以點以下連結前往：

[用 Three.js 來當個創世神 (03)：Hello Three.js!](https://ithelp.ithome.com.tw/articles/10199702)

---

## 遊戲專案介紹

在連續三天讀完這麼多的內容後，相信大家都已經具備了能在網頁上做 3D 的能力了，可以說 Three.js 不難入門，反而難在作品的構想上，所以今天先來聊聊接下來的這整個專案要做些什麼吧！

在開始介紹專案內容前直接先來個正在趕工中的「十分之一」成品：

![demo](https://i.imgur.com/6ubiZET.gif)

沒錯，這個專案是真的要來「[當個創世神](https://zh.wikipedia.org/wiki/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C)」，由於筆者是工程背景出身，為了避免作品沒有設計美感，選擇了最安全的 Minecraft 外觀來當做設計樣板，但當然不是將原作的玩法搬上 Three.js，為求新奇與簡單化，會先從簡單的射擊小遊戲出發。


### 玩法

遊戲採用「第一人稱視角」，鍵盤滑鼠操作跟一般射擊遊戲相同（W、A、S、D 移動與空白鍵跳躍），像是這個[範例](https://threejs.org/examples/?q=Controls#misc_controls_pointerlock)。透過點擊滑鼠左鍵射擊子彈，子彈命中 [Creeper（苦力怕）](https://www.youtube.com/watch?v=DWy8TlwfQF8)會爆炸。

進階一點可能會再做一些計分、血量的細節，甚至是鐵人賽結束後可以繼續試著做人物間連線對戰、合作打 [Enderman](https://minecraft-zh.gamepedia.com/index.php?title=%E6%9C%AB%E5%BD%B1%E4%BA%BA&variant=zh-tw)、[Ender Dragon](https://minecraft-zh.gamepedia.com/%E6%9C%AB%E5%BD%B1%E9%BE%99) 等等，或是撿武器、手榴彈、毒圈的玩法。（原來是披著 Minecraft 皮的絕地求生嗎！？）

雖然遊戲玩法的發想可以很天馬行空，但目前當然需要先把基本的內容完成。

### 實作規劃

稍微來分析一下光是要完成「第一人稱射擊到苦力怕會爆炸」要做哪些事。

專案會分三部份執行：

- 苦力怕的爆炸
    - 苦力怕模型
    - 材質與紋理貼圖
    - 光影效果
    - 動畫
    - 粒子系統
    - 遊戲場景貼圖
    - 爆炸效果
- 射擊的物理效果
    - 引入物理引擎函式庫
    - 碰撞偵測
- 專案整合
    - 加上背景音樂、爆炸與射擊音效
    - 第一人稱視角控制器
    - 血量分數資料計算
    - 遊戲流程

前期主要都是應用 Three.js 中內建的元素來應用，而 `Three.js` 本身只是渲染引擎，並不支援物理引擎，所以第二部分會考慮引入像是 `Cannon.js` 或 `Oimo.js` 等其他函式庫來支援射擊的效果；後期需要管理資料與遊戲流程時，會考慮將前面所做的模型與場景引入 `Vue.js` 中來整合。

## 今日小結

今天大致講解了整個專案的內容與規劃，老實說還是有點抖，光是爆炸與射擊都是可預見的難點，一個要用上粒子系統，另一個要引入物理引擎，只能邊學邊做囉。

明天就先從苦力怕模型開始做起，我們明天見！
