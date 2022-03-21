class ellipticalRoi {
    constructor() {
        const external = cornerstoneTools.external
        const mouseButtonTool = cornerstoneTools.mouseButtonTool

        const toolStyle = cornerstoneTools.toolStyle
        const toolColors = cornerstoneTools.toolColors
        const drawHandles = cornerstoneTools.drawHandles
        const pointInEllipse = cornerstoneTools.pointInEllipse

        const calculateEllipseStatistics = cornerstoneTools.calculateEllipseStatistics
        const calculateSUV = cornerstoneTools.calculateSUV

        const drawTextBox = cornerstoneTools.drawTextBox
        const getToolState = cornerstoneTools.getToolState
        const drawEllipse = cornerstoneTools.drawing.drawEllipse

        const getNewContext = cornerstoneTools.drawing.getNewContext
        const draw = cornerstoneTools.drawing.draw
        const setShadow = cornerstoneTools.drawing.setShadow

        const toolType = 'ellipticalRoi';

        function createNewMeasurement(mouseEventData) {
            // Create the measurement data for this tool with the end handle activated
            const measurementData = {
                visible: true,
                active: true,
                invalidated: true,
                color: undefined,
                areaDisplayFlag: true,
                nameDisplayFlag: true,
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
            const config = ellipticalRoiend.getConfiguration();
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

        // /////// BEGIN IMAGE RENDERING ///////
        function pointNearEllipse(element, data, coords, distance) {
            if (data.visible === false) {
                return false;
            }

            const cornerstone = external.cornerstone;
            const startCanvas = cornerstone.pixelToCanvas(element, data.handles.start);
            const endCanvas = cornerstone.pixelToCanvas(element, data.handles.end);

            const minorEllipse = {
                left: Math.min(startCanvas.x, endCanvas.x) + distance / 2,
                top: Math.min(startCanvas.y, endCanvas.y) + distance / 2,
                width: Math.abs(startCanvas.x - endCanvas.x) - distance,
                height: Math.abs(startCanvas.y - endCanvas.y) - distance
            };

            const majorEllipse = {
                left: Math.min(startCanvas.x, endCanvas.x) - distance / 2,
                top: Math.min(startCanvas.y, endCanvas.y) - distance / 2,
                width: Math.abs(startCanvas.x - endCanvas.x) + distance,
                height: Math.abs(startCanvas.y - endCanvas.y) + distance
            };

            const pointInMinorEllipse = pointInEllipse(minorEllipse, coords);
            const pointInMajorEllipse = pointInEllipse(majorEllipse, coords);

            if (pointInMajorEllipse && !pointInMinorEllipse) {
                return true;
            }

            return false;
        }

        function pointNearTool(element, data, coords) {
            return pointNearEllipse(element, data, coords, 15);
        }

        function pointNearToolTouch(element, data, coords) {
            return pointNearEllipse(element, data, coords, 25);
        }

        function numberWithCommas(x) {
            // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            const parts = x.toString().split('.');

            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return parts.join('.');
        }

        function onImageRendered(e) {
            const eventData = e.detail;

            // If we have no toolData for this element, return immediately as there is nothing to do
            const toolData = getToolState(e.currentTarget, toolType);

            if (!toolData) {
                return;
            }

            const cornerstone = external.cornerstone;
            const image = eventData.image;
            const element = eventData.element;
            const lineWidth = toolStyle.getToolWidth();
            const config = ellipticalRoiend.getConfiguration();
            const seriesModule = cornerstone.metaData.get('generalSeriesModule', image.imageId);
            const imagePlane = cornerstone.metaData.get('imagePlaneModule', image.imageId);
            let modality;
            let rowPixelSpacing;
            let colPixelSpacing;

            if (imagePlane) {
                rowPixelSpacing = imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing;
                colPixelSpacing = imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing;
            } else {
                rowPixelSpacing = image.rowPixelSpacing;
                colPixelSpacing = image.columnPixelSpacing;
            }

            if (seriesModule) {
                modality = seriesModule.modality;
            }

            //const context = getNewContext(eventData.canvasContext.canvas);
            const context = eventData.canvasContext.canvas.getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);


            // If we have tool data for this element - iterate over each set and draw it
            for (let i = 0; i < toolData.data.length; i++) {
                const data = toolData.data[i];

                if (data.visible === false) {
                    continue;
                }
                //  draw (context, fn) {

                draw(context, (context) => {
                    const color = toolColors.getColorIfActive(data);

                    drawEllipse(context, element, data.handles.start, data.handles.end, { color });

                    // If the tool configuration specifies to only draw the handles on hover / active,
                    // Follow this logic
                    if (config && config.drawHandlesOnHover) {
                        // Draw the handles if the tool is active
                        if (data.active === true) {
                            drawHandles(context, eventData, data.handles, color);
                        } else {
                            // If the tool is inactive, draw the handles only if each specific handle is being
                            // Hovered over
                            const handleOptions = {
                                drawHandlesIfActive: true
                            };

                            drawHandles(context, eventData, data.handles, color, handleOptions);
                        }
                    } else {
                        // If the tool has no configuration settings, always draw the handles
                        drawHandles(context, eventData, data.handles, color);
                    }


                    let area,
                        meanStdDev,
                        meanStdDevSUV;


                    if (data.invalidated === false) {
                        // If the data is not invalidated, retrieve it from the toolData
                        meanStdDev = data.meanStdDev;
                        meanStdDevSUV = data.meanStdDevSUV;
                        area = data.area;
                    } else {
                        // If the data has been invalidated, we need to calculate it again

                        // Retrieve the bounds of the ellipse in image coordinates
                        const ellipse = {
                            left: Math.round(Math.min(data.handles.start.x, data.handles.end.x)),
                            top: Math.round(Math.min(data.handles.start.y, data.handles.end.y)),
                            width: Math.round(Math.abs(data.handles.start.x - data.handles.end.x)),
                            height: Math.round(Math.abs(data.handles.start.y - data.handles.end.y))
                        };

                        if (!image.color) {
                            // Retrieve the array of pixels that the ellipse bounds cover
                            const pixels = cornerstone.getPixels(element, ellipse.left, ellipse.top, ellipse.width, ellipse.height);

                            // Calculate the mean & standard deviation from the pixels and the ellipse details
                            meanStdDev = calculateEllipseStatistics(pixels, ellipse);

                            if (modality === 'PT') {

                                meanStdDevSUV = {
                                    mean: calculateSUV(image, (meanStdDev.mean - image.intercept) / image.slope),
                                    stdDev: calculateSUV(image, (meanStdDev.stdDev - image.intercept) / image.slope)
                                };
                            }

                            // If the mean and standard deviation values are sane, store them for later retrieval
                            if (meanStdDev && !isNaN(meanStdDev.mean)) {
                                data.meanStdDev = meanStdDev;
                                data.meanStdDevSUV = meanStdDevSUV;
                            }
                        }

                        // Calculate the image area from the ellipse dimensions and pixel spacing
                        area = Math.PI * (ellipse.width * (colPixelSpacing || 1) / 2) * (ellipse.height * (rowPixelSpacing || 1) / 2);

                        // If the area value is sane, store it for later retrieval
                        if (!isNaN(area)) {
                            data.area = area;
                        }

                        // Set the invalidated flag to false so that this data won't automatically be recalculated
                        data.invalidated = false;
                    }
                    // console.log(data.nameDisplayFlag)
                    if (data && data.nameDisplayFlag) {
                        const text = textBoxText(data);
                        if (!data.handles.textBox.hasMoved) {
                            data.handles.textBox.x = Math.max(data.handles.start.x, data.handles.end.x);
                            data.handles.textBox.y = (data.handles.start.y + data.handles.end.y) / 2;
                        }
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
                        data.handles, textBoxAnchorPoints, color, lineWidth, 0, true);*/
                });
            }
            // console.log('dsakjdksjd')
            function textBoxText(data) {
                const { meanStdDev, meanStdDevSUV, area } = data;

                // Define an array to store the rows of text for the textbox
                const textLines = [];

                // If the mean and standard deviation values are present, display them
                if (meanStdDev && meanStdDev.mean !== undefined) {
                    // If the modality is CT, add HU to denote Hounsfield Units
                    let moSuffix = '';

                    if (modality === 'CT') {
                        moSuffix = ' HU';
                    }

                    // Create a line of text to display the mean and any units that were specified (i.e. HU)
                    let meanText = `Mean: ${numberWithCommas(meanStdDev.mean.toFixed(2))}${moSuffix}`;
                    // Create a line of text to display the standard deviation and any units that were specified (i.e. HU)
                    let stdDevText = `StdDev: ${numberWithCommas(meanStdDev.stdDev.toFixed(2))}${moSuffix}`;

                    // If this image has SUV values to display, concatenate them to the text line
                    if (meanStdDevSUV && meanStdDevSUV.mean !== undefined) {
                        const SUVtext = ' SUV: ';

                        meanText += SUVtext + numberWithCommas(meanStdDevSUV.mean.toFixed(2));
                        stdDevText += SUVtext + numberWithCommas(meanStdDevSUV.stdDev.toFixed(2));
                    }

                    // Add these text lines to the array to be displayed in the textbox
                    textLines.push(meanText);
                    textLines.push(stdDevText);
                }

                // If the area is a sane value, display it
                if (area) {
                    let suffix = ` mm${String.fromCharCode(178)}`;

                    if (!rowPixelSpacing || !colPixelSpacing) {
                        suffix = ` pixels${String.fromCharCode(178)}`;
                    }

                    // Create a line of text to display the area and its units
                    const areaText = `Area: ${numberWithCommas(area.toFixed(2))}${suffix}`;

                    // Add this text line to the array to be displayed in the textbox
                    textLines.push(areaText);
                }

                return textLines;
            }

            function textBoxAnchorPoints(handles) {
                // Retrieve the bounds of the ellipse (left, top, width, and height)
                const left = Math.min(handles.start.x, handles.end.x);
                const top = Math.min(handles.start.y, handles.end.y);
                const width = Math.abs(handles.start.x - handles.end.x);
                const height = Math.abs(handles.start.y - handles.end.y);

                return [{
                    // Top middle point of ellipse
                    x: left + width / 2,
                    y: top
                }, {
                    // Left middle point of ellipse
                    x: left,
                    y: top + height / 2
                }, {
                    // Bottom middle point of ellipse
                    x: left + width / 2,
                    y: top + height
                }, {
                    // Right middle point of ellipse
                    x: left + width,
                    y: top + height / 2
                }];
            }
        }

        function getMeasurement(data) {
            return createNewMeasurement(data)
        }
        const ellipticalRoiend = mouseButtonTool({
            createNewMeasurement,
            onImageRendered,
            pointNearTool,
            toolType
        });
        for (var i in cornerstoneTools.ellipticalRoi) {
            //console.log('aaaa',i)
            if (cornerstoneTools.ellipticalRoi[i]) {
                //console.log('bbbbb')
                cornerstoneTools.ellipticalRoi[i] = ellipticalRoiend[i]
            }

        }
        cornerstoneTools.ellipticalRoi.getMeasurement = getMeasurement
    }
}
new ellipticalRoi();