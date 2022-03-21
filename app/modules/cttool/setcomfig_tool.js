class setoolconfig {
    constructor() {}
    setconfig(type, now_config) {
        let oldConfig
        switch (type) {
            case 'rectangleRoiFan':
                let oldConfig1 = cornerstoneTools.rectangleRoi.getConfiguration();
                if (oldConfig1) {
                    now_config = Object.assign(oldConfig1, now_config);
                }
                cornerstoneTools.rectangleRoi.setConfiguration(now_config);
                break
            case "lengthFan":
                let lineMeanConfig = cornerstoneTools.length.getConfiguration();
                if (lineMeanConfig) {
                    now_config = Object.assign(lineMeanConfig, now_config);
                }
                cornerstoneTools.length.setConfiguration(now_config);
                break
            case "brushFan":
                let configuration = cornerstoneTools.brush.getConfiguration();
                if (configuration) {
                    now_config = Object.assign(configuration, now_config);
                }
                cornerstoneTools.brush.setConfiguration(now_config);
                break
            case 'ellipticalRoiFan':
                let oldConfig11 = cornerstoneTools.ellipticalRoi.getConfiguration();
                if (oldConfig11) {
                    now_config = Object.assign(oldConfig11, now_config);
                }
                cornerstoneTools.ellipticalRoi.setConfiguration(now_config);
                break
            case "polygonFan":
                oldConfig = cornerstoneTools.brush.getConfiguration();
                if (oldConfig) {
                    now_config = Object.assign(oldConfig, now_config);
                }
                cornerstoneTools.brush.setConfiguration(now_config);
                break
            case "freehandFan":
                oldConfig = cornerstoneTools.brush.getConfiguration();
                if (oldConfig) {
                    now_config = Object.assign(oldConfig, now_config);
                }
                cornerstoneTools.brush.setConfiguration(now_config);
                break
            case "regionpaintFan":
                oldConfig = cornerstoneTools.brush.getConfiguration();
                if (oldConfig) {
                    now_config = Object.assign(oldConfig, now_config);
                }
                cornerstoneTools.brush.setConfiguration(now_config);
                break
        }
    }



}

//原型链一定要有的
module.exports = new setoolconfig();