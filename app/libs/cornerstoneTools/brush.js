class newbrush {
    constructor() {
        const external = cornerstoneTools.external
        const getToolState = cornerstoneTools.getToolState
        const draw = cornerstoneTools.drawing.draw
        const fillBox = cornerstoneTools.drawing.fillBox
        const brushTool = require('./brushTool.js')



        function getCircle(radius, rows, columns, xCoord = 0, yCoord = 0) {
            const x0 = Math.round(xCoord);
            const y0 = Math.round(yCoord);

            if (radius === 1) {
                return [
                    [x0, y0]
                ];
            }

            const circleArray = [];
            let index = 0;

            for (let y = -radius; y <= radius; y++) {
                const yCoord = y0 + y;

                if (yCoord > rows || yCoord < 0) {
                    continue;
                }

                for (let x = -radius; x <= radius; x++) {
                    const xCoord = x0 + x;

                    if (xCoord > columns || xCoord < 0) {
                        continue;
                    }

                    if (x * x + y * y < radius * radius) {
                        circleArray[index++] = [x0 + x, y0 + y];
                    }
                }
            }

            return circleArray;
        }

        function drawBrushPixels(pointerArray, storedPixels, brushPixelValue, columns) {
            const getPixelIndex = (x, y) => (y * columns) + x;

            pointerArray.forEach((point) => {
                const spIndex = getPixelIndex(point[0], point[1]);

                storedPixels[spIndex] = brushPixelValue;
            });
        }

        function drawBrushOnCanvas(pointerArray, context, color, element) {
            const canvasPtTL = external.cornerstone.pixelToCanvas(element, {
                x: 0,
                y: 0
            });
            const canvasPtBR = external.cornerstone.pixelToCanvas(element, {
                x: 1,
                y: 1
            });
            const sizeX = canvasPtBR.x - canvasPtTL.x;
            const sizeY = canvasPtBR.y - canvasPtTL.y;

            draw(context, (context) => {
                pointerArray.forEach((point) => {
                    const canvasPt = external.cornerstone.pixelToCanvas(element, {
                        x: point[0],
                        y: point[1]
                    });
                    const boundingBox = {
                        left: canvasPt.x,
                        top: canvasPt.y,
                        width: sizeX,
                        height: sizeY
                    };

                    fillBox(context, boundingBox, color);
                });
            });
        }


        //const toolType = 'rectangleRoi';

        // /////// BEGIN ACTIVE TOOL ///////
        const TOOL_STATE_TOOL_TYPE = 'brush';
        const toolType = 'brush';
        const configuration = {
            draw: 1,
            radius: 5,
            minRadius: 1,
            maxRadius: 20,
            hoverColor: 'rgba(230, 25, 75, 1.0)',
            dragColor: 'rgba(230, 25, 75, 0.8)',
            active: false
        };

        let lastImageCoords;
        let dragging = false;

        function autoplay(data) {
            const eventData = data;

            paint(eventData);
            lastImageCoords = eventData.currentPoints.image
            dragging = true
        }

        function paint(eventData) {
            const configuration = brush.getConfiguration();
            const element = eventData.element;
            const layer = external.cornerstone.getLayer(element, configuration.brushLayerId);
            const { rows, columns } = layer.image;
            // console.log(layer.image,configuration.brushLayerId)
            const { x, y } = eventData.currentPoints.image;
            const toolData = getToolState(element, TOOL_STATE_TOOL_TYPE);
            //console.log(eventData.currentPoints.image)
            const pixelData = toolData.data[0].pixelData;
            const brushPixelValue = configuration.draw;
            const radius = configuration.radius;
            if (x < 0 || x > columns ||
                y < 0 || y > rows) {
                return;
            }
            //console.log(radius)
            const pointerArray = getCircle(radius, rows, columns, x, y);
            //console.log(pointerArray)

            drawBrushPixels(pointerArray, pixelData, brushPixelValue, columns);

            layer.invalid = true;

            external.cornerstone.updateImage(element);
        }

        function onMouseUp(e) {
            const eventData = e.detail;

            lastImageCoords = eventData.currentPoints.image;
            dragging = false;
        }

        function onMouseDown(e) {
            const eventData = e.detail;
            //console.log(eventData,'eventDataeventData')
            //paint(eventData);
            dragging = true;
            lastImageCoords = eventData.currentPoints.image;
        }

        function onMouseMove(e) {
            const eventData = e.detail;

            lastImageCoords = eventData.currentPoints.image;
            external.cornerstone.updateImage(eventData.element);
        }

        function onDrag(e) {
            const eventData = e.detail;
            //paint(eventData);
            dragging = true;
            lastImageCoords = eventData.currentPoints.image;
        }

        function onImageRendered(e) {
            const eventData = e.detail;

            if (!lastImageCoords) {
                return;
            }

            const { rows, columns } = eventData.image;
            const { x, y } = lastImageCoords;

            if (x < 0 || x > columns ||
                y < 0 || y > rows) {
                return;
            }

            // Draw the hover overlay on top of the pixel data
            const configuration = brush.getConfiguration();
            const radius = configuration.radius;
            const context = eventData.canvasContext;
            const color = dragging ? configuration.dragColor : configuration.hoverColor;
            const element = eventData.element;

            context.setTransform(1, 0, 0, 1, 0, 0);

            if (configuration.active) {
                const pointerArray = getCircle(radius, rows, columns, x, y);

                drawBrushOnCanvas(pointerArray, context, color, element);
            }
        }

        const brush = new brushTool({
            onMouseMove,
            onMouseDown,
            onMouseUp,
            onDrag,
            toolType,
            onImageRendered
        });
        for (var i in cornerstoneTools.brush) {
            cornerstoneTools.brush[i] = brush[i]
        }
        cornerstoneTools.brush.clear = brush.clear
        cornerstoneTools.brush.getAllId = brush.getAllId
        cornerstoneTools.brush.autoplay = autoplay
        brush.setConfiguration(configuration);
    }

}
new newbrush();