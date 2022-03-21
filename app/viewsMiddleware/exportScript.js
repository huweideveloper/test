

function exportScript(component) {
    class Page extends Interstellar.pagesBase {
        complete() {
            new Vue({
                el: "#content",
                components: {
                    "middleware-component": component,
                }
            });
        }
    }
    return Page;
}

module.exports = exportScript;
