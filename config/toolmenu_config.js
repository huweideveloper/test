function marktool_config(type) {
    //type 为1的时候代表审核，为false的时候代表代表标注



    //每一个key值代表工具名称
    //t代表是互斥操作，还是独立操作，m代表是互斥操作。s代表是独立操作
    //c代表是否可以操作
    /*cobb颈椎病的特殊角,alignment脊椎顺列
     */
    let normal = {
        brush: { t: 'm', c: true },
        ellipticalRoi: { t: 'm', c: true },
        rectangleRoi: { t: 'm', c: true },
        length: { t: 'm', c: true },
        earse: { t: 'm', c: true },
        simpleAngle: { t: 'm', c: true },
        magicStickSingle: { t: 'm', c: true },
        polygon: { t: 'm', c: true },
        freehand: { t: 'm', c: true },
        quickselect: { t: 'm', c: true },
        regionpaint: { t: 'm', c: true },
        //copd: { t: 'm', c: true },
        screen: { t: 'm', c: true },
        mpr: { t: 'm', c: true },
        add: { t: 'm', c: false },
        sub: { t: 'm', c: false },
        cobb: { t: 'm', c: false },
        alignment: { t: 'm', c: false },
        //ct_text:{ t: 'm', c: true },
        upstep: { t: 's', c: true },
        nextstep: { t: 's', c: true },
        line: { t: 'm', c: true },
        zoom: { t: 'm', c: true },
        pan: { t: 'm', c: true },
        magnify: { t: 'm', c: true },
        rest: { t: 'm', c: true },
        proe: { t: 'm', c: true },
        rectangle_text: { t: 'm', c: true },
        light: { t: 'm', c: true },
        wl: { t: 'm', c: true },
        wl_text: { t: 's', c: true },
        del: { t: 's', c: true },
        layer_del: { t: 's', c: true },
        all_del: { t: 's', c: true },
        yinyang: { t: 's', c: true },
        next_task: { t: 's', c: true }
    }
    if (type == '1') {
        normal = {
            screen: { t: 'm', c: false },
            mpr: { t: 'm', c: false },
            add: { t: 'm', c: false },
            sub: { t: 'm', c: false },
            cobb: { t: 'm', c: false },
            //copd: { t: 'm', c: false},
            alignment: { t: 'm', c: false },
            brush: { t: 'm', c: false },
            ellipticalRoi: { t: 'm', c: false },
            rectangleRoi: { t: 'm', c: false },
            length: { t: 'm', c: false },
            earse: { t: 'm', c: false },
            simpleAngle: { t: 'm', c: false },
            magicStickSingle: { t: 'm', c: false },
            polygon: { t: 'm', c: false },
            freehand: { t: 'm', c: false },
            quickselect: { t: 'm', c: false },
            regionpaint: { t: 'm', c: false },
            //ct_text:{ t: 'm', c: false },
            upstep: { t: 's', c: true },
            nextstep: { t: 's', c: true },
            line: { t: 'm', c: true },
            zoom: { t: 'm', c: true },
            pan: { t: 'm', c: true },
            magnify: { t: 'm', c: true },
            rest: { t: 'm', c: true },
            proe: { t: 'm', c: true },
            rectangle_text: { t: 'm', c: true },
            light: { t: 'm', c: true },
            wl: { t: 'm', c: true },
            wl_text: { t: 's', c: true },
            del: { t: 's', c: true },
            layer_del: { t: 's', c: true },
            all_del: { t: 's', c: true },
            yinyang: { t: 's', c: true },
            next_task: { t: 's', c: true }
        }
    }
    return normal
}
module.exports = marktool_config;