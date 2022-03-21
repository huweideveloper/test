function cornerstoneTool_config() {
    //每一个key值代表工具名称
    //t代表是互斥操作，还是独立操作，m代表是互斥操作。s代表是独立操作
    //c代表是否可以操作
    //radius代表画笔的粗细
    //deviation代表色差
    //distance代表搜索范围
    return {
        rectangleRoi_config: {
            areaDisplayFlag: false,
            nameDisplayFlag: false,
            drawHandlesOnHover: true
        },
        rectangle_text_config: {
            areaDisplayFlag: true,
            nameDisplayFlag: true,
            drawHandlesOnHover: true
        },
        length_config: {
            flag: false,
            nameDisplayFlag: false,
            displayMean: true,
            displayText: false,
            drawHandlesOnHover: true
        },
        line_config: {
            flag: false,
            nameDisplayFlag: true,
            displayMean: true,
            displayText: true,
            drawHandlesOnHover: true
        },
        ellipticalRoi_config: {
            areaDisplayFlag: false,
            nameDisplayFlag: false,
            drawHandlesOnHover: true
        },
        magnify_config: {
            magnifySize: 225,
            magnificationLevel: 2
        },
        brush_config: {
            draw: 1,
            radius: 5,
            hoverColor: 'rgba(230, 25, 75, 1.0)',
            dragColor: 'rgba(230, 25, 75, 0.8)'
        },
        earse_config: {
            draw: 0,
            radius: 3,
            hoverColor: 'rgba(230, 25, 75, 1.0)',
            dragColor: 'rgba(230, 25, 75, 0.8)'
        },
        polygon_config: {
            distance: 5,
            radius: 1,
            lineWidth:1,
            deviation: 5,
            hoverColor: 'rgba(230, 25, 75, 0.5)',
            dragColor: 'rgba(230, 25, 75, 0.4)'
        },
        freehand_config: {
            distance: 2,
            lineWidth: 2,
            hoverColor: 'rgba(230, 25, 75, 0.5)',
            dragColor: 'rgba(230, 25, 75, 0.4)'
        },
        quickselect_config: {
            deviation: 50,
            distance: 20
        },
        regionpaint_config: {
            draw: 1,
            radius: 4,
            hoverColor: 'rgba(230, 25, 75, 1.0)',
            dragColor: 'rgba(230, 25, 75, 0.8)'
        }
    }
}
module.exports = new cornerstoneTool_config();