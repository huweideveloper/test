 //计算公式 获取cornerstone.getViewport(element)里面的translation和scale计算
 /*
 1.当前的dicom文件距离canvas的0的位置 translation*scale+(外面的canvas的宽度-512*scale）/2
 2.cornerstone.pixelToCanvas(element, splitHandle)这个里面的x，y是针对外部cavans的0,0为标准
 3.上面2-1就是为当前元素和dicom文件基于现在比例的差值
 4.随后拿3/scale,这样就可以有元素相对于dicom的512的相对距离

 5.半径也是用widthCanvas/scale,换算出相对于512的半径
 */
 class Cornerstone_Class {
     constructor(initData) {
         let that = this

         this.colwDefault = this.colcDefault = null;

         this.removeId = "";

         this.thickness;
         this.distanceStart;

         this.newImgOrender = "";
         this.spsec;
         this.calculationCars = new Array();

         this.event = new Interstellar.event()
         this.stepPage = initData.stepPage || 5
         this.scroll = (initData.scroll != undefined || initData.scroll != null) ? initData.scroll : true
         this.imgType = initData.type || 'png'

         this.moveAllElementData = {}
         this.modifyCount1 = new Object();
         this.modifyCount2 = new Object();
         this.modifyDate1 = new Object();
         this.element = initData.element;

         this.nodeArray = []

         this.imageAddress = initData.imageAddress

         this.axialStack1 = {
             currentImageIdIndex: initData.index || 0,
             imageIds: this.imageAddress,
             preventCache: true
         }
         this.nowloadNum = 0
         this.perload = (initData.perload != undefined || initData.perload != null) ? initData.perload : true
         this.burshChoose = false
         this.movelist = false
         this.init()
     }
     init() {
         let that = this
             //让多屏可以同时滚动的
             //let synchronizer1 = new cornerstoneTools.Synchronizer("CornerstoneNewImage", cornerstoneTools.stackImageIndexSynchronizer);
         let dom = cornerstone.getEnabledElements()

         let nnowE = false
         for (var i = 0; i < dom.length; i++) {
             let temp = dom[i]
             if (temp.element.id == ES.selctorDoc(this.element).attr('id')) {
                 nnowE = true
             }
         }
         //console.log(nnowE,this.element)
         if (!nnowE) {
             this.loadAndViewImage(this.axialStack1.currentImageIdIndex, true, true);
         } else {
             var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
             this.loadImage(url, this.element, true);
         }
         if (this.perload) {
             setTimeout(() => {
                 //this.beforehandCacheLoad(true, 1, this.imageAddress, this.imageAddress.length)
             }, 0);
         }
     }

     beforehandCacheLoad(flag, loadCurrentCount, baseUrl, maxCount) {
         if (flag) {
             for (var i = 1; i < this.stepPage; i++) {
                 this.loadCache(i, baseUrl);
             }
         } else {
             if (null == this.calculationCars[loadCurrentCount + 1] && loadCurrentCount < maxCount) {
                 this.loadCache(loadCurrentCount + 1, baseUrl);
             }
             if (null == this.calculationCars[loadCurrentCount - 1] && loadCurrentCount > 1) {
                 this.loadCache(loadCurrentCount - 1, baseUrl);
             }
         }
     }
     funcNodiuCacheLoad(loadCurrentCount, baseUrl, maxCount) {
         let after = this.imageAddress.length - loadCurrentCount;
         if (after != 0) {
             let loadAfterCount;
             if (after < this.stepPage)
                 loadAfterCount = after;
             else {
                 loadAfterCount = this.stepPage;
             }
             let afterMax = loadCurrentCount * 1 + loadAfterCount * 1;
             for (var i = loadCurrentCount; i < afterMax; i++) {
                 if (null == this.calculationCars[i] && loadCurrentCount < maxCount) {
                     this.loadCache(i, baseUrl);
                 }
             }
         }
         if (loadCurrentCount > this.stepPage) {
             let befor = loadCurrentCount - this.stepPage;
             for (var i = befor; i < loadCurrentCount; i++) {
                 if (null == this.calculationCars[i] && loadCurrentCount > 1) {
                     this.loadCache(i, baseUrl);
                 }
             }
         }

     }
     funcNodule(layerCount, noduleId) {
         let that = this
         this.axialStack1.currentImageIdIndex = layerCount - 1

         var url = this.buildUrl(layerCount - 1);
         //console.log(url, layerCount)
         //cornerstoneTools.scrollToIndex(this.element,this.axialStack1.currentImageIdIndex)
         this.loadImage(url, this.element);
         //this.loadAndViewImage(layerCount*1 - 1, false, false);
         //this.deleteOtherCanv('dicomImage')
         setTimeout(function() {
             // that.funcNodiuCacheLoad(layerCount, that.imageAddress, that.imageAddress.length);
         }, 0);
     }
     loadCache(page, baseUrl) {
             let url = this.buildUrlLoad(page, baseUrl)
                 //cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(url);
                 //this.calculationCars[page] = true;
         }
         //处理url
     buildUrl(index) {
         // console.log(index, 'indexindexindex')
         if (typeof this.imageAddress == "object") {
             if (this.imageAddress[0].lastIndexOf('glayImage') != -1 || this.imageAddress[0].lastIndexOf('pixImage') != -1) {
                 this.axialStack1.currentImageIdIndex = index
                 return this.imageAddress[index]
             }
             for (let i = 0; i < this.imageAddress.length; i++) {
                 //console.log(this.imageAddress[i])
                 let name = this.imageAddress[i].split('?')[0]
                 let num = '/' + ("000000" + (index * 1 + 1)).slice(-6) + '.'
                     // console.log(num,'numnumnumnumnumnumnumnum',name)
                 if (name.lastIndexOf(num) != -1) {
                     this.axialStack1.currentImageIdIndex = i
                     return this.imageAddress[i]
                 }
             }
             return null
         }
     }
     getIndex(layer) {
         for (let i = 0; i < this.imageAddress.length; i++) {
             //console.log(this.imageAddress[i])
             let name = this.imageAddress[i].split('?')[0]
             let num = '/' + ("000000" + (layer * 1)).slice(-6) + '.'
                 // console.log(num,'numnumnumnumnumnumnumnum',name)
             if (name.lastIndexOf(num) != -1) {
                 //this.axialStack1.currentImageIdIndex = i
                 return i
             }
         }
     }
     getLayerNum(index) {
         let tempA = this.imageAddress[index].split('?')[0].split('/')
         return tempA[tempA.length - 1].split('.')[0] * 1
     }
     buildUrlLoad(index, baseUrl) {
         if (typeof this.imageAddress == "object") {
             return this.imageAddress[index]
         }
         //alert($("#imageAddress").text());
         if (this.imgType == "dcm") {
             return baseUrl + '/' + this.getLenStr(6, index) + '.dcm';
         } else {
             return baseUrl + '/' + this.getLenStr(6, index) + '.png';
         }
     }
     getLenStr(n, s) {
             if ((s + '').length < n) {
                 return (String(Math.pow(10, n)) + s).slice(-n)
             }
             return s;
         }
         //-------------
         //添加测量事件
     GenNonDuplicateID(randomLength) {
         return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
     }
     cornerstonetoolsmeasurementadded(e) {
         e.detail.measurementData.id = this.GenNonDuplicateID(12);
         this.event._dispatch('Cornerstone_Class.MeasurementAdded')
     }
     cornerstonetoolsmouseup(e) {
         //console.log(e)
         //console.log(this.moveAllElementData, 'moveAllElementDatamoveAllElementDatamoveAllElementData')
         if (this.moveAllElementData && this.removeId) {
             if (this.removeId == this.moveAllElementData.id) {
                 this.moveAllElementData = null
                 this.removeId = null
             }
         }
         this.event._dispatch('Cornerstone_Class.MeasurementEnd', this.moveAllElementData)
     }
     cornerstonetoolsmousedown(e) {
         this.event._dispatch('Cornerstone_Class.mousedown', {
             e: e
         })
     }
     cornerstonetoolsmouseclick(e) {
         this.event._dispatch('Cornerstone_Class.click', {
             e: e
         })
     }
     cornerstonemeasurementremoved(e) {
         //console.log(e)
         var id = e.detail.measurementData.uuid;
         this.removeId = id;
         this.event._dispatch('Cornerstone_Class.MeasurementRemove', {
             id: id,
             layerNumber: this.getLayerNum(this.axialStack1.currentImageIdIndex) //this.axialStack1.currentImageIdIndex + 1
         })
     }
     cornerstonetoolsmeasurementmodified(e) {
         var id = e.detail.measurementData.id;
         if (this.removeId == id) {
             return
         }
         // console.log(e.detail.measurementData)
         //var definitionStartX = Math.min(e.detail.measurementData.handles.start.x, e.detail.measurementData.handles.end.x)
         //var definitionStartY = Math.min(e.detail.measurementData.handles.start.y, e.detail.measurementData.handles.end.y)
         /*var splitHandle = {
             "x": definitionStartX,
             "y": definitionStartY,
             "highlight": true,
             "active": false
         };*/
         let splitHandle = e.detail.measurementData
         this.event._dispatch('Cornerstone_Class.ModifiedFinsh', {
             element: this.element,
             e: e,
             splitHandle: splitHandle,
             spsec: this.spsec
         })
     }
     cornerstonetoolsmousedrag(e) {
         this.event._dispatch('Cornerstone_Class.MouseDrag', {
             element: this.element,
             e: e,
             layerNumber: this.getLayerNum(this.axialStack1.currentImageIdIndex) // this.axialStack1.currentImageIdIndex + 1
         })
     }
     // 鼠标滚动事件
     cornerstonetoolsmousewheel(e) {
        this.event._dispatch('Cornerstone_Class.cornerstonetoolsmousewheel', e)
              //let nowUrl = this.buildUrl(this.axialStack1.currentImageIdIndex);
              //this.loadImage(nowUrl, this.element)
      }
         //--------------------
         //图片加载
     loadImage(url, elementT, changewindow) {
         if( !url ) return;
        let that = this

        cornerstone.loadImage(url).then(function(image) {
             //console.log('---------------------')
             //cornerstone.loadAndCacheImage(url).then(function(image) {
             // console.log('aaaaa', that.axialStack1.currentImageIdIndex)
             if (cornerstoneTools.getToolState(that.element, 'stack')) {
                 cornerstoneTools.getToolState(that.element, 'stack').data[0].currentImageIdIndex = that.axialStack1.currentImageIdIndex
             }
             if (changewindow) {
                 that.zoomFan()
             }
             cornerstone.displayImage(elementT, image);
             setTimeout(function() {
                 that.event._dispatch('Cornerstone_Class.LoadFinish', {
                     el: that.element
                 })
             }, 0)
         }, function(err) {
             alert(err);
         });
     }
     loadAndViewImage(imageId, isLoad, isInit) {
         let offsets = new Map();
         this.axialStack1.currentImageIdIndex = imageId;
         cornerstone.enable(this.element);
         cornerstoneTools.mouseInput.enable(this.element);
         cornerstoneTools.mouseWheelInput.enable(this.element);
         //cornerstoneTools.keyboardInput.enable(this.element);
         let url = this.buildUrl(imageId);
         console.log(url, imageId)
         let that = this
         this.element.addEventListener('cornerstonenewimage', function(e) {
             that.onNewImage(e)
         });
         this.element.addEventListener('cornerstoneimagerendered', function(e) {
             that.onImageRendered(e)
         });
         this.element.addEventListener('cornerstonetoolsmeasurementmodified', function(e) {
             //console.log('aaaaa',e)
             that.cornerstonetoolsmeasurementmodified(e)
         })
         this.element.addEventListener('cornerstonetoolsmeasurementadded', function(e) {
             that.cornerstonetoolsmeasurementadded(e)
         });
         this.element.addEventListener('cornerstonemeasurementremoved', function(e) {
             ///console.log('aaa',e)
             if (that.onlyClose) {
                 return
             }
             that.cornerstonemeasurementremoved(e)
         })
         this.element.addEventListener('cornerstonetoolsmousewheel', function(e) {
             that.cornerstonetoolsmousewheel(e)
         })
         this.element.addEventListener('cornerstonetoolsmouseclick', function(e) {
             that.cornerstonetoolsmouseclick(e)
                 // console.log('aaaaaaaa',e)
         })
         this.element.addEventListener('cornerstonetoolsmousedownactivate', function(e) {
             that.cornerstonetoolsmousedownactivate(e)
         })
         this.element.addEventListener('cornerstoneimageloadfailed', function(e) {

         })
         this.element.addEventListener('cornerstonetoolsmousemove', function(e) {
                 that.cornerstonetoolsmousemove(e)
             })
             //for brush
         this.element.addEventListener('cornerstonetoolsmousedrag', function(e) {
             //console.log('cornerstonetoolsmousemove', e.detail)
             that.cornerstonetoolsmousedrag(e)
         })
         this.element.addEventListener('cornerstonetoolsmousedown', function(e) {
             //console.log('cornerstonetoolsmouseup')
             that.cornerstonetoolsmousedown(e)
         })
         this.element.addEventListener('cornerstonetoolsmouseup', function(e) {
             //console.log('cornerstonetoolsmouseup')
             that.cornerstonetoolsmouseup(e)
         })
         this.element.addEventListener('cornerstoneactivelayerchanged', function(e) {
             // console.log('cornerstoneactivelayerchanged', e)
             that.cornerstoneactivelayerchanged(e)
                 // that.cornerstonetoolsmouseup(e)
         })
         this.element.addEventListener('cornerstonelayeradded', function(e) {
                 that.cornerstonelayeradded(e)
             })
             //console.log(url)
         cornerstone.loadImage(url).then(function(image) {
             //cornerstone.loadAndCacheImage(url).then(function(image) {
             //console.log('initinitinitinitinitinit')
             var viewport = cornerstone.getDefaultViewportForImage(that.element, image);
             if (!isLoad) {
                 if (null != that.colcDefault && null != that.colwDefault) {
                     viewport.voi.windowWidth = that.colwDefault;
                     viewport.voi.windowCenter = that.colcDefault;
                 }
             } else {
                 that.colcDefault = viewport.voi.windowCenter;
                 that.colwDefault = viewport.voi.windowWidth;
             }
             // Unset any existing VOI LUT
             viewport.voiLUT = undefined; // 解决DR片子打开窗宽床位显示不对, 且无法调整
             cornerstone.displayImage(that.element, image, viewport);
             cornerstoneTools.addStackStateManager(that.element, ['stack']);
             cornerstoneTools.addToolState(that.element, 'stack', that.axialStack1);
             if (isInit) {
                 //cornerstoneTools.zoom.activate(that.element, 1);
                 cornerstoneTools.ellipticalRoi.deactivate(that.element, 1);
                 cornerstoneTools.pan.activate(that.element, 4);
                 // console.log(that.scroll, 'scrollscrollscrollscroll', that.axialStack1)
                 if (that.scroll) {
                     cornerstoneTools.stackScrollWheel.activate(that.element);
                 }
             }
             setTimeout(function() {
                 that.event._dispatch('Cornerstone_Class.LoadFinish', {
                     el: that.element
                 })
             }, 0)
         }, function(err) {
             alert(err);
         });
     }
     cornerstonetoolsmousemove(e) {
         this.event._dispatch('Cornerstone_Class.cornerstonetoolsmousemove', e)
     }
     cornerstoneactivelayerchanged(e) {
         this.event._dispatch('Cornerstone_Class.ActiveLayerChanged', e)
     }
     cornerstonelayeradded(e) {
         this.event._dispatch('Cornerstone_Class.LayerAdded', e)
     }
     cornerstonetoolsmousedownactivate(e) {
         this.event._dispatch('Cornerstone_Class.brushDown', e)
     }
     onImageRendered(e) {
         this.removePartData()
             //console.log('onImageRendered', e.detail)

         let measurementData = e.detail.measurementData;
         //console.log(e.detail.image.imageId,this.element)
         let image = e.detail.image;
         console.log(image.imageId, '============',this.axialStack1.currentImageIdIndex)
         for (let i = 0; i < this.imageAddress.length; i++) {
             //console.log(this.imageAddress[i])

             // console.log(num,'numnumnumnumnumnumnumnum',name)
             if (this.imageAddress[i] == image.imageId) {
                console.log(i)
                 this.axialStack1.currentImageIdIndex = i
             }
         }
         let eventData = e.detail;
         //let str=new RegExp("(\\/0*\\d."+this.imgType+"$){1,}","g")
         //let layerNumber=this.imageAddress[this.axialStack1.currentImageIdIndex].split('?')[0].match(str)
         //console.log(layerNumber,'layerNumberlayerNumber',this.imageAddress[this.axialStack1.currentImageIdIndex].split('?')[0],str)
         //let ymd = String(image.data.string('x00080022'))
         //let hms = String(image.data.string('x00080030')) //image.data.string('x00080022')+image.data.string('x00080030') * 1000;
         //  let xDate = ymd.substr(0, 4) + '-' + ymd.substr(4, 2) + '-' + ymd.substr(6) + ' ' + hms.substr(0, 2) + ':' + hms.substr(2, 2) + ':' + hms.substr(4, 2)
         let data = {
             //ABDCMENA: image.data.string('x00180015'),
             //slicethickness: image.data.string('x00180050'),
             //convolutionKernel: image.data.string('x00181210'),
             //KVP: image.data.string('x00180060'),
             //rayTubeCurrent: image.data.string('x00181151'),
             //seriesNumber: image.data.string('x00200011'),
             // pixelSpacing: parseFloat(image.data.string('x00280030')),
             viewport: cornerstone.getViewport(this.element).voi,
             //xDate: xDate,
             e: e,
             canvasContext: eventData.canvasContext,
             element: this.element,
             image: image,
             currentCount: this.axialStack1.currentImageIdIndex
         }
         this.spsec = image.rowPixelSpacing //parseFloat(image.data.string('x00280030'));
         this.event._dispatch('Cornerstone_Class.ImageRendered', data)

         // 更新标注图层的数据
         this.event._dispatch('Cornerstone_Class.updateImageTagComponentData', this.getLayerNum(this.axialStack1.currentImageIdIndex))

     }
     onNewImage(e) {
         let v = this.axialStack1.currentImageIdIndex + 1;
         if (this.perload) {
             this.beforehandCacheLoad(false, v, this.imageAddress, this.imageAddress.length);
         }
     }

     //----------------
     //获取视窗
     getViewport() {
         var viewport = cornerstone.getViewport(this.element);
         return viewport
     }
     setViewport(value) {
         cornerstone.setViewport(this.element, value);
     }

     /*getState() {
         return cornerstoneTools.getToolState(this.element, 'ellipticalRoi')
     }*/
     getAllState() {
         let rectangleRoi = cornerstoneTools.getToolState(this.element, 'rectangleRoi')
         let simpleAngle = cornerstoneTools.getToolState(this.element, 'simpleAngle')
         let ellipticalRoi = cornerstoneTools.getToolState(this.element, 'ellipticalRoi')
         let length = cornerstoneTools.getToolState(this.element, 'length')
         let arr = []
         if (rectangleRoi) {
             this.setUUidData(rectangleRoi, arr, 'rectangleRoi')
         }
         if (simpleAngle) {
             this.setUUidData(simpleAngle, arr, 'simpleAngle')
         }
         if (ellipticalRoi) {
             this.setUUidData(ellipticalRoi, arr, 'ellipticalRoi')
         }
         if (length) {
             this.setUUidData(length, arr, 'length')
         }
         return arr
     }
     setUUidData(value, arr, type) {
         value.data.map(function(item) {
             if (item.uuid) {
                 item.tooltype = type
                 arr.push(item)
             }
         })
     }
     geSiglneState(name) {
             return cornerstoneTools.getToolState(this.element, name)
         }
         //--------------
         //所有的工具
     resetAfter() {

     }
     disableAllTools(isdis) {
         //console.log(this.element)
         if (isdis) {
             cornerstoneTools.zoom.disable(this.element, 1);
             // cornerstoneTools.pan.disable(this.element, 1);
             cornerstoneTools.wwwc.disable(this.element, 1);
             cornerstoneTools.magnify.disable(this.element, 1);
             cornerstoneTools.probe.disable(this.element, 1);
             cornerstoneTools.brush.disable(this.element, 1);
         }
         //console.log(this.burshChoose,'this.burshChoose')
         if (this.burshChoose) {
             cornerstoneTools.brush.deactivate(this.element, 1);
         }
         this.burshChoose = false
         cornerstoneTools.length.deactivate(this.element, 1);
         cornerstoneTools.simpleAngle.deactivate(this.element, 1);
         cornerstoneTools.ellipticalRoi.deactivate(this.element, 1);
         cornerstoneTools.rectangleRoi.deactivate(this.element, 1);
         //  this.resetAfter();
     }
     removePartData() {
         cornerstone.imageCache.cachedImages.map(function(item) {
             if (item.image) {
                 if (item.image.data) {
                     item.image.data = {}
                 }
             }
         })
     }
     resizeCon() {
         ///console.log(this)
         if (this.element) {
             cornerstone.resize(this.element, true)
         }
     }
     lungWindown(c, w, id) {
         var viewport = cornerstone.getViewport(this.element);
         viewport.voi.windowWidth = w;
         viewport.voi.windowCenter = c;
         cornerstone.setViewport(this.element, viewport);
         //this.event._dispatch('Cornerstone_Class.wlChange')
     }
     ellipticalRoiFan() {
         this.disableAllTools(true);
         cornerstoneTools.ellipticalRoi.activate(this.element, 1);
         //cornerstoneTools.ellipticalRoiTouch.activate(this.element);
     }
     rectangleRoiFan() {
         this.disableAllTools(true);
         cornerstoneTools.rectangleRoi.activate(this.element, 1);
         //cornerstoneTools.rectangleRoiTouch.activate(this.element);
     }
     magicStickSingleFan() {
         this.disableAllTools(true);
         // cornerstoneTools.rectangleRoi.activate(this.element, 1);
     }
     probeFan() {
         this.disableAllTools(true);
         cornerstoneTools.probe.activate(this.element, 1);
         //cornerstoneTools.ellipticalRoiTouch.activate(this.element);
     }
     setcolDefault(c, w) {
         this.colwDefault = w
         this.colcDefault = c
     }
     restFan() {
         console.log('restFanrestFanrestFan')
             //cornerstone.reset(this.element);
         cornerstone.resize(this.element, true)
         var viewport = cornerstone.getViewport(this.element);
         //console.log(viewport, this.colcDefault)
         viewport.voi.windowWidth = this.colwDefault;
         viewport.voi.windowCenter = this.colcDefault;
         cornerstone.setViewport(this.element, viewport);
         //this.resizeCon()
     }
     wlFan() {
         this.disableAllTools(true);
         cornerstoneTools.wwwc.activate(this.element, 1);
     }
     panFan() {
         this.disableAllTools(true);
         cornerstoneTools.pan.activate(this.element, 1);
     }
     lengthFan() {
         // console.log('bbbbbb')
         this.disableAllTools(true);
         cornerstoneTools.length.activate(this.element, 1);
         //cornerstoneTools.lengthTouch.activate(this.element);
         // console.log('cccc')
     }
     simpleAngleFan() {
         this.disableAllTools(true);
         cornerstoneTools.simpleAngle.activate(this.element, 1);
         //cornerstoneTools.simpleAngleTouch.activate(this.element);
     }

     //POLYGON
     polygonFan() {
         this.disableAllTools(true);
         console.log(this.element)
         this.burshChoose = false
             //var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
             //this.burshImageLoad(url, this.element)
             //cornerstoneTools.freehand.activate(this.element, 1);
             //cornerstoneTools.simpleAngleTouch.activate(this.element);
     }

     //quickselect
     quickselectFan() {
         this.disableAllTools(true);
         console.log(this.element)
         this.burshChoose = false
             //var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
             //this.burshImageLoad(url, this.element)
             //cornerstoneTools.freehand.activate(this.element, 1);
             //cornerstoneTools.simpleAngleTouch.activate(this.element);
     }

     //regionpaint
     regionpaintFan() {
         this.disableAllTools(true);
         console.log(this.element)
         this.burshChoose = false
             //var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
             //this.burshImageLoad(url, this.element)
             //cornerstoneTools.freehand.activate(this.element, 1);
             //cornerstoneTools.simpleAngleTouch.activate(this.element);
     }
     freehandFan() {
         this.disableAllTools(true);
         console.log(this.element)
         this.burshChoose = false
             //var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
             //this.burshImageLoad(url, this.element)

         //cornerstoneTools.freehand.activate(this.element, 1);
         //cornerstoneTools.simpleAngleTouch.activate(this.element);
     }

     magnifyFan() {
         this.disableAllTools(true);
         cornerstoneTools.magnify.activate(this.element, 1);
     }

     brushFan() {
         this.disableAllTools(true);
         var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
         //cornerstoneTools.brush.activate(this.element, 1);
         //this.burshChoose = true
         //this.burshImageLoad(url, this.element)

     }
     brushFanTe() {
         console.log('brushFanTebrushFanTebrushFanTebrushFanTe')
         this.disableAllTools(true);
         var url = this.buildUrl(this.axialStack1.currentImageIdIndex);
         cornerstone.updateImage(this.element);
         //cornerstoneTools.brush.activate(this.element, 1);
         //this.disableAllTools(true);
         // this.restFan()
         //this.burshChoose = true
         //this.burshImageLoad(url, this.element)

     }
     burshImageLoad(url, elementT) {
         let that = this
         cornerstone.loadImage(url).then(function(image) {
             if (cornerstoneTools.getToolState(that.element, 'stack')) {
                 cornerstoneTools.getToolState(that.element, 'stack').data[0].currentImageIdIndex = that.axialStack1.currentImageIdIndex
             }
             cornerstone.displayImage(elementT, image);
             //cornerstoneTools.brush.activate(elementT, 1);
             setTimeout(function() {
                 that.event._dispatch('Cornerstone_Class.LoadFinish', {
                     el: that.element
                 })
             }, 0)
         }, function(err) {
             alert(err);
         });
     }
     clearSigleFan(name) {
         cornerstoneTools.clearToolState(this.element, name);
         cornerstone.updateImage(this.element);
     }

     //name为工具类型，data为画图数据，可以通过getToolState方法获取
     clearSigleData(name, data, onlyClose) {
         this.onlyClose = onlyClose
         cornerstoneTools.removeToolState(this.element, name, data);
         cornerstone.updateImage(this.element);
     }
     clearFan() {
         cornerstoneTools.clearToolState(this.element, "length");
         cornerstoneTools.clearToolState(this.element, "simpleAngle");
         cornerstoneTools.clearToolState(this.element, "ellipticalRoi");
         cornerstoneTools.clearToolState(this.element, "rectangleRoi");
         cornerstoneTools.clearToolState(this.element, "probe");
         cornerstone.updateImage(this.element);
     }
     cobbFan() {
         this.disableAllTools(true);
         cornerstoneTools.length.activate(this.element, 1);
     }
     alignmentFan() {
         this.disableAllTools(true);
         //cornerstoneTools.probe.activate(this.element, 1);
     }
     zoomFan() {
         this.disableAllTools(true);
         cornerstoneTools.zoom.activate(this.element, 1);
         //this.resetAfter();
     }
     setNode(value) {
         this.nodeArray = value
     }
     deleteOtherCanv(id) {
         ES.selctorDoc("#" + id).remove()
     }
     close() {
             //this.disableAllTools(true)
             //cornerstoneTools.brush.clear()
         cornerstoneTools.clearToolState(this.element, "brush");
         cornerstoneTools.clearToolState(this.element, "length");
         cornerstoneTools.clearToolState(this.element, "simpleAngle");
         cornerstoneTools.clearToolState(this.element, "ellipticalRoi");
         cornerstoneTools.clearToolState(this.element, "rectangleRoi");
         cornerstone.disable(this.element)
     }

 }
 module.exports = Cornerstone_Class;
