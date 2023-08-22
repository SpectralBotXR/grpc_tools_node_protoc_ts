"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumFormatter = void 0;
const Utility_1 = require("../../Utility");
var EnumFormatter;
(function (EnumFormatter) {
    function findCommentByPath(locations, path, fallbackValue) {
        var _a, _b;
        const location = locations.find(loc => JSON.stringify(loc.pathList) == JSON.stringify(path));
        if (location && location.leadingComments) {
            const match = (_a = location.leadingComments) === null || _a === void 0 ? void 0 : _a.match(/@Translate:\s*(.+)/);
            if (match) {
                return `"${(_b = match[1]) === null || _b === void 0 ? void 0 : _b.trim()}"`;
            }
            return `"${fallbackValue}"`;
        }
        return `"${fallbackValue}"`;
    }
    function format(enumDescriptor, fileDescriptor, indent) {
        const locations = fileDescriptor.getSourceCodeInfo().getLocationList().map(loc => loc.toObject());
        const enumName = enumDescriptor.getName();
        const importName = fileDescriptor.getName().split("/").pop().replace(".proto", "_pb");
        const values = {};
        let enumIndex = "";
        const translation = {};
        enumIndex = fileDescriptor.getEnumTypeList().indexOf(enumDescriptor).toString();
        enumDescriptor.getValueList().forEach((value) => {
            values[value.getName().toUpperCase()] = value.getNumber();
            const enumIndex = fileDescriptor.getEnumTypeList().indexOf(enumDescriptor);
            const enumPath = [
                5,
                enumIndex,
                2,
                value.getNumber(),
            ];
            translation[`${enumName}.${value.getName().toUpperCase()}`] = findCommentByPath(locations, enumPath, Utility_1.Utility.uppercaseFirst(value.getName().toLowerCase()));
        });
        return {
            indent,
            enumName,
            values,
            enumIndex,
            translation,
            importName
        };
    }
    EnumFormatter.format = format;
})(EnumFormatter = exports.EnumFormatter || (exports.EnumFormatter = {}));
//# sourceMappingURL=EnumFormatter.js.map