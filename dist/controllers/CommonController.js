"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
class CommonController {
    route(app) {
        app.all('*', function (req, res) {
            res.status(404)
                .send({ error: true, message: 'handler not found' })
                .end();
        });
    }
}
exports.CommonController = CommonController;
//# sourceMappingURL=CommonController.js.map