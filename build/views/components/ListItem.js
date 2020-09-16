"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ListItem = ({ title, item }) => {
    const [isClient, setIsClient] = react_1.default.useState(false);
    react_1.useEffect(() => {
        setIsClient(window !== undefined);
    });
    return isClient && item ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h2", null, title),
        renderReactJson(item))) : null;
};
const renderReactJson = (item) => {
    const ReactJson = require('react-json-view').default;
    return react_1.default.createElement(ReactJson, { src: item, collapsed: true });
};
exports.default = ListItem;
//# sourceMappingURL=ListItem.js.map