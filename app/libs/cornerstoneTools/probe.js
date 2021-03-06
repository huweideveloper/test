class probe {
    constructor() {
        const external = cornerstoneTools.external
        const mouseButtonTool = cornerstoneTools.mouseButtonTool

        const textStyle=cornerstoneTools.textStyle
        const toolColors = cornerstoneTools.toolColors
        
        const drawHandles = cornerstoneTools.drawHandles
        const getRGBPixels=cornerstoneTools.getRGBPixels

        const calculateSUV = cornerstoneTools.calculateSUV

        const drawTextBox = cornerstoneTools.drawTextBox
        const getToolState = cornerstoneTools.getToolState
      

        const getNewContext = cornerstoneTools.drawing.getNewContext
        const draw = cornerstoneTools.drawing.draw

        const toolType = 'probe';

        // /////// BEGIN ACTIVE TOOL ///////
        function createNewMeasurement(mouseEventData) {
            // Create the measurement data for this tool with the end handle activated
            const measurementData = {
                visible: true,
                active: true,
                color: undefined,
                handles: {
                    end: {
                        x: mouseEventData.currentPoints.image.x,
                        y: mouseEventData.currentPoints.image.y,
                        highlight: true,
                        active: true
                    }
                }
            };


            return measurementData;
        }
        // /////// END ACTIVE TOOL ///////

        // /////// BEGIN IMAGE RENDERING ///////
        function pointNearTool(element, data, coords) {
            if (data.visible === false) {
                return false;
            }

            const endCanvas = external.cornerstone.pixelToCanvas(element, data.handles.end);


            return external.cornerstoneMath.point.distance(endCanvas, coords) < 5;
        }

        function onImageRendered(e) {
            const eventData = e.detail;

            // If we have no toolData for this element, return immediately as there is nothing to do
            const toolData = getToolState(e.currentTarget, toolType);

            if (!toolData) {
                return;
            }

            const cornerstone = external.cornerstone;
            // We have tool data for this element - iterate over each one and draw it
            const context = getNewContext(eventData.canvasContext.canvas);

            const fontHeight = textStyle.getFontSize();

            for (let i = 0; i < toolData.data.length; i++) {
                const data = toolData.data[i];

                if (data.visible === false) {
                    continue;
                }

                draw(context, (context) => {

                    const color = toolColors.getColorIfActive(data);

                    // Draw the handles
                    drawHandles(context, eventData, data.handles, color);

                    const x = Math.round(data.handles.end.x);
                    const y = Math.round(data.handles.end.y);
                    let storedPixels;

                    let text,
                        str;

                    if (x >= 0 && y >= 0 && x < eventData.image.columns && y < eventData.image.rows) {
                        if (eventData.image.color) {
                            text = `${x}, ${y}`;
                            storedPixels = getRGBPixels(eventData.element, x, y, 1, 1);
                            str = `R: ${storedPixels[0]} G: ${storedPixels[1]} B: ${storedPixels[2]}`;
                        } else {
                            storedPixels = cornerstone.getStoredPixels(eventData.element, x, y, 1, 1);
                            const sp = storedPixels[0];
                            const mo = sp * eventData.image.slope + eventData.image.intercept;
                            const suv = calculateSUV(eventData.image, sp);

                            // Draw text
                            text = `${x}, ${y}`;
                            str = `SP: ${sp} MO: ${parseFloat(mo.toFixed(3))}`;
                            if (suv) {
                                str += ` SUV: ${parseFloat(suv.toFixed(3))}`;
                            }
                        }

                        const coords = {
                            // Translate the x/y away from the cursor
                            x: data.handles.end.x + 3,
                            y: data.handles.end.y - 3
                        };
                        const textCoords = cornerstone.pixelToCanvas(eventData.element, coords);

                        drawTextBox(context, str, textCoords.x, textCoords.y + fontHeight + 5, color);
                        drawTextBox(context, text, textCoords.x, textCoords.y, color);
                    }
                });
            }
        }
        // /////// END IMAGE RENDERING ///////

        // Module exports
        const probeEnd = mouseButtonTool({
            createNewMeasurement,
            onImageRendered,
            pointNearTool,
            toolType
        });

        for (var i in cornerstoneTools.probe) {
            //console.log('aaaa',i)
            if (cornerstoneTools.probe[i]) {
                //console.log('bbbbb')
                cornerstoneTools.probe[i] = probeEnd[i]
            }

        }
    }
}
new probe();