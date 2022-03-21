class length {
    constructor() {
        const external = cornerstoneTools.external
        const mouseButtonTool = cornerstoneTools.mouseButtonTool

        const toolStyle = cornerstoneTools.toolStyle
        const toolColors = cornerstoneTools.toolColors
        const drawHandles = cornerstoneTools.drawHandles


        const drawTextBox = cornerstoneTools.drawTextBox
        const getToolState = cornerstoneTools.getToolState
        const drawLine = cornerstoneTools.drawing.drawLine
        const setShadow = cornerstoneTools.drawing.setShadow
        const getNewContext = cornerstoneTools.drawing.getNewContext
        const draw = cornerstoneTools.drawing.draw
        const toolType = 'length';

        function lineSegDistance(element, start, end, coords) {
            const lineSegment = {
                start: cornerstone.pixelToCanvas(element, start),
                end: cornerstone.pixelToCanvas(element, end)
            };

            return external.cornerstoneMath.lineSegment.distanceToPoint(lineSegment, coords);
        }
        // /////// BEGIN ACTIVE TOOL ///////
        function createNewMeasurement(mouseEventData) {
            // Create the measurement data for this tool with the end handle activated
            const measurementData = {
                visible: true,
                active: true,
                color: undefined,
                uuid: mouseEventData.uuid ? mouseEventData.uuid : null,
                handles: {
                    start: {
                        x: mouseEventData.currentPoints.image.x,
                        y: mouseEventData.currentPoints.image.y,
                        highlight: true,
                        active: false
                    },
                    end: {
                        x: mouseEventData.currentPoints.image.x,
                        y: mouseEventData.currentPoints.image.y,
                        highlight: true,
                        active: true
                    },
                    textBox: {
                        active: false,
                        hasMoved: false,
                        movesIndependently: false,
                        drawnIndependently: true,
                        allowedOutsideImage: true,
                        hasBoundingBox: true
                    }
                }
            };
            const config = lengthend.getConfiguration();
            if (config) {
                {
                    if (config.nameDisplayFlag != undefined && config.nameDisplayFlag != null) {
                        measurementData.nameDisplayFlag = config.nameDisplayFlag;
                    }
                    if (config.areaDisplayFlag != undefined && config.areaDisplayFlag) {
                        measurementData.areaDisplayFlag = config.areaDisplayFlag;
                    }
                }
            }
            return measurementData;
        }
        // /////// END ACTIVE TOOL ///////

        function pointNearTool(element, data, coords) {
            if (data.visible === false) {
                return false;
            }

            return lineSegDistance(element, data.handles.start, data.handles.end, coords) < 25;
        }

        // /////// BEGIN IMAGE RENDERING ///////
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
            const { image, element } = eventData;

            const lineWidth = toolStyle.getToolWidth();
            const config = lengthend.getConfiguration();
            const imagePlane = cornerstone.metaData.get('imagePlaneModule', image.imageId);
            let rowPixelSpacing;
            let colPixelSpacing;

            if (imagePlane) {
                rowPixelSpacing = imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing;
                colPixelSpacing = imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing;
            } else {
                rowPixelSpacing = image.rowPixelSpacing;
                colPixelSpacing = image.columnPixelSpacing;
            }

            for (let i = 0; i < toolData.data.length; i++) {
                const data = toolData.data[i];

                if (data.visible === false) {
                    continue;
                }

                draw(context, (context) => {
                    // Configurable shadow
                    setShadow(context, config);

                    const color = toolColors.getColorIfActive(data);

                    // Draw the measurement line
                    drawLine(context, element, data.handles.start, data.handles.end, { color });

                    // Draw the handles
                    const handleOptions = {
                        drawHandlesIfActive: (config && config.drawHandlesOnHover)
                    };

                    drawHandles(context, eventData, data.handles, color, handleOptions);

                    // Set rowPixelSpacing and columnPixelSpacing to 1 if they are undefined (or zero)
                    const dx = (data.handles.end.x - data.handles.start.x) * (colPixelSpacing || 1);
                    const dy = (data.handles.end.y - data.handles.start.y) * (rowPixelSpacing || 1);

                    // Calculate the length, and create the text variable with the millimeters or pixels suffix
                    const length = Math.sqrt(dx * dx + dy * dy);

                    // Store the length inside the tool for outside access
                    data.length = length;

                    if (!data.handles.textBox.hasMoved) {
                        const coords = {
                            x: Math.max(data.handles.start.x, data.handles.end.x)
                        };

                        // Depending on which handle has the largest x-value,
                        // Set the y-value for the text box
                        if (coords.x === data.handles.start.x) {
                            coords.y = data.handles.start.y;
                        } else {
                            coords.y = data.handles.end.y;
                        }

                        data.handles.textBox.x = coords.x;
                        data.handles.textBox.y = coords.y;
                    }

                    // Move the textbox slightly to the right and upwards
                    // So that it sits beside the length tool handle
                    const xOffset = 10;
                    if (data && data.nameDisplayFlag) {
                        const text = textBoxText(data, rowPixelSpacing, colPixelSpacing);
                        const textCoords = cornerstone.pixelToCanvas(element, data.handles.textBox);
                        const options = {
                            centering: {
                                x: false,
                                y: true
                            }
                        };
                        drawTextBox(context, text, textCoords.x, textCoords.y, color, options);
                    }

                    /*drawLinkedTextBox(context, element, data.handles.textBox, text,
                        data.handles, textBoxAnchorPoints, color, lineWidth, xOffset, true);*/
                });
            }

            function textBoxText(data, rowPixelSpacing, colPixelSpacing) {
                // Set the length text suffix depending on whether or not pixelSpacing is available
                let suffix = ' mm';

                if (!rowPixelSpacing || !colPixelSpacing) {
                    suffix = ' pixels';
                }

                return `${data.length.toFixed(2)}${suffix}`;
            }

            function textBoxAnchorPoints(handles) {
                const midpoint = {
                    x: (handles.start.x + handles.end.x) / 2,
                    y: (handles.start.y + handles.end.y) / 2
                };

                return [handles.start, midpoint, handles.end];
            }
        }

        function getMeasurement(data) {
            return createNewMeasurement(data)
        }
        const lengthend = mouseButtonTool({
            createNewMeasurement,
            onImageRendered,
            pointNearTool,
            toolType
        });
        for (var i in cornerstoneTools.length) {
            cornerstoneTools.length[i] = lengthend[i]
        }
        cornerstoneTools.length.getMeasurement = getMeasurement
    }
}
new length();