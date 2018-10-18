# 用 Three.js 來當個創世神 (02)：Three.js 基本元素簡介

> 在開始動手寫 Three.js 之前，先來簡單了解一些 Three.js 中的基本元素的概念：Scene、Camera、Object、Geometry、Material、Light、Renderer，初步基礎的了解有助於一開始的範例程式碼解讀， 對於每一項元素的細節與應用將會在之後深入探討。

![攝影機](https://images.unsplash.com/photo-1490117874548-e35a2286fd89?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0d53f942a201ea88f8c3c01c74b756d4&auto=format&fit=crop&w=1050&q=80)
Photo by [Jakob Owens](https://unsplash.com/@jakobowens1) on [Unsplash](https://unsplash.com/photos/H6a1mbbXFis)

---

這是本系列第 02 篇，如果還沒看過第 01 篇可以點以下連結前往：

[用 Three.js 來當個創世神 (01)：Three.js 簡介](https://ithelp.ithome.com.tw/articles/10199690)

---

## 基本元素

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572Wzo4NlnmeF.png](https://ithelp.ithome.com.tw/upload/images/20181014/20107572Wzo4NlnmeF.png)

Photo by [Nahuel Coppero](https://medium.com/@necsoft) on [Medium](https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1)

要在螢幕上顯示 3D 圖形，在 Three.js 中需要以下的基本元素：

- 場景（Scene）：供其他元素設置的空間。
- 相機（Camera）：在場景中建立觀察點，並確定觀察方向、角度。
- 物體（Objects）：在場景中添加被觀察的物體。
- 光源（Light）：在場景中用來照亮物體的光。
- 渲染器（Renderer）：將所要呈現的場景渲染到畫面上。

以下就讓我們來看看這幾個元素的簡介。

## 場景（Scene）

場景就是一個容器，用來保存與追蹤所有要呈現到畫面上的內容，在後面的程式碼中會常看到`scene.add(...)`，意思是將元素加到場景中。

## 相機（Camera）

相機可以當作是一個觀察點，決定了我們從哪個位置、方向、角度來觀察場景中的畫面，在 Three.js 中主要有兩種比較常用的相機。

首先請直接體驗兩種相機的不同，點[連結](https://dezchuang.github.io/ironman-three.js/day02_threeBasic/bothCamera/index.html)看範例（參考自 [Jos Dirksen](https://github.com/josdirksen/learning-threejs/blob/master/chapter-02/07-both-cameras.html)），可以用右上角的`switchCamera`來切換相機體驗差異。

### 透視投影相機（PerspectiveCamera）

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572ExPqQjYjjd.png](https://ithelp.ithome.com.tw/upload/images/20181014/20107572ExPqQjYjjd.png)

相信各位可以明顯感受到，在透視投影相機中，越遠的物體會有比較小的尺寸，更接近真實世界的效果，所以一般在三維場景中，我們會使用這種相機來呈現，讓使用者更有臨場感。

從下圖可以看到，透視投影相機視景體是個四角錐，它透過視角（fov）、畫面長寬比（aspect）、遠近平面距離決定觀察結果。

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572tDgY4WpG3z.jpg](https://ithelp.ithome.com.tw/upload/images/20181014/20107572tDgY4WpG3z.jpg)

Photo on [https://www.itread01.com/articles/1476704140.html](https://www.itread01.com/articles/1476704140.html)

### 正交投影相機（OrthographicCamera）

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572wJtZbwsjhm.png](https://ithelp.ithome.com.tw/upload/images/20181014/20107572wJtZbwsjhm.png)

透過比較可以發現，正交投影相機中的物體不論遠近，看起來的尺寸都一樣，這樣的相機一般被用在二維場景中。

如下圖，正交投影相機的視景體是長方體，由於此種相機渲染出的物體大小皆相同，所以並不需要長寬比與視角，而是紀錄遠近平面距離、視景體的上下左右邊界。

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572FzebUauVIc.jpg](https://ithelp.ithome.com.tw/upload/images/20181014/20107572FzebUauVIc.jpg)

Photo on [https://www.itread01.com/articles/1476704140.html](https://www.itread01.com/articles/1476704140.html)


## 物體（Object）模型種類

物體很直觀，就是在場景中被觀察的物體，就像是上面範例中的一大堆立方體，以下來看幾個在 Three.js 中常見的種類。

#### 網格模型（Mesh）

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572TbrTvCtxq4.png](https://ithelp.ithome.com.tw/upload/images/20181014/20107572TbrTvCtxq4.png)

在 3D 世界的模型中，常以三角形網格為一個單位來組成一個物體，當三角形數量增加，一個物體的表面就越平滑，如上圖。

#### 粒子模型（Points）

![https://ithelp.ithome.com.tw/upload/images/20181014/201075725EchwpExRk.png](https://ithelp.ithome.com.tw/upload/images/20181014/201075725EchwpExRk.png)

上圖為粒子模型的[官方範例](https://threejs.org/examples/?q=points#webgl_points_sprites)。

粒子模型可以輕易地創建很多細小的物體，可以模擬雪花、雨滴、星空、煙、火焰、爆炸等效果，後面會在專案中作詳細介紹與實作。

附註：粒子模型在不同的 Three.js 中有不同的名字，之前原本被稱為 `Particlesystem（粒子系統）`，68 版更名為 `PointCloud` ,72 版才更名為 `Points` ，在網路上或許會看到不一樣的名字，但基本上概念都一樣。

## 物體（Object）組成

上面介紹了物體常見的模型種類，而每一種物體都各自具備兩種基本要素：幾何體與材質。

#### 幾何體（Geometry）

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572TSjeNFaprl.png](https://ithelp.ithome.com.tw/upload/images/20181014/20107572TSjeNFaprl.png)

幾何體簡單來說就是物體的形狀，通過儲存模型點之間關係來達到描述物體形狀的目的，從一般的平面、球體、正方體到各種扭曲體、多面體應有盡有。

#### 材質（Material）

![https://ithelp.ithome.com.tw/upload/images/20181014/20107572zeHwD9wMfF.png](https://ithelp.ithome.com.tw/upload/images/20181014/20107572zeHwD9wMfF.png)

材質簡單來說就是物體的外觀、皮膚，記錄了物體表面除了幾何體以外所有的資訊，像是顏色（color）、紋理（texture）、透明度（opacity）等等。而其中有些材質具有一些對光源產生反應的屬性像是發光度（shininess）、鏡面反射程度（specular）等等，會決定物體會像金屬或像塑膠。

## 光源（Light）

為了要讓畫面更逼近真實，光源是不可或缺的要素，透過光源與物體材質的調整能夠讓畫面更豐富。

不過在 Three.js 中有一些材質並不需要考慮光源即可被渲染在畫面上，例如 `MeshBasicMaterial` 、 `MeshNormalMaterial` ，能夠與光源互動的材質一般會用 `MeshLambertMaterial` 或 `MeshPhongMaterial` 。

在 Three.js 中提供了包括環境光（AmbientLight）、點光源（PointLight）、 聚光燈 （SpotLight）、方向光（DirectionalLight）、半球光（HemisphereLight）等多種光源。

## 渲染器（Renderer）

有了以上各種基本元素後，最後會透過渲染器使用電腦顯卡來渲染場景到瀏覽器上。

在 Three.js 中有不只一種渲染器，但一般而言都是使用 `WebGLRenderer` 這個渲染器，它能支援較多功能，像是材質、陰影等等，在後面的程式碼中會看到常透過渲染器來設定預設背景顏色、場景尺寸、陰影效果等。

## 今日小結

今天我們學習到了在 Three.js 中要展示 3D 物體需要的基本元素以及各元素的簡單概念，明天將利用今天學到的知識，開始進行 Three.js 的 coding 囉！

## 參考資料

- [官網範例](https://threejs.org/examples/)
- [Learning Three.js](https://github.com/josdirksen/learning-threejs)
- [Three.js 101 : Hello World! (Part 1)](https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1)
- [Three.js快速入門](https://www.itread01.com/articles/1476704140.html)

