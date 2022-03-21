
// import component from "../../views/labelModule/labelTask.js";
// import exportScript from '../exportScript';
// module.exports = exportScript(component);


import { 
    createElement
} from 'react';
import {
    render
} from 'react-dom';

class Page extends Interstellar.pagesBase {
    complete() {
        function LabelTask(){
            return (
                <div className='labelTask'>
                    LabelTask
                </div>
            )
        }
        render(LabelTask, document.getElementById("right-content"));
    }
}

module.exports = Page;

