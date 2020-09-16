"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const App_1 = __importDefault(require("../components/App"));
const updateApp = (data) => data;
const mapStateToProps = (state) => ({
    data: updateApp(state.data)
});
exports.default = react_redux_1.connect(mapStateToProps)(App_1.default);
//# sourceMappingURL=App.js.map