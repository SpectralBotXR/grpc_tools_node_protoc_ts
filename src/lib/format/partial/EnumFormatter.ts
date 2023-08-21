import {EnumDescriptorProto, EnumOptions, FileDescriptorProto, SourceCodeInfo} from "google-protobuf/google/protobuf/descriptor_pb";
import { Utility } from "../../Utility";

export namespace EnumFormatter {

    export interface IEnumModel {
        indent: string;
        enumName: string;
        values: { [key: string]: number };
        enumIndex: string;
        translation: { [key: string]: string };
        importName: string;
    }

     function findCommentByPath(locations: Array<SourceCodeInfo.Location.AsObject>, path: number[], fallbackValue: string): string {
        const location = locations.find(loc => JSON.stringify(loc.pathList) == JSON.stringify(path));
        if (location && location.leadingComments) {
            const match = location.leadingComments?.match(/@Translate:\s*(.+)/);
            if (match) {
                return `"${match[1]?.trim()}"`;
            } return `"${fallbackValue}"`
        }
        return `"${fallbackValue}"`;
    }

    export function format(enumDescriptor: EnumDescriptorProto, fileDescriptor: FileDescriptorProto, indent: string): IEnumModel {
        const locations = fileDescriptor.getSourceCodeInfo().getLocationList().map(loc => loc.toObject());
        const enumName = enumDescriptor.getName();
        const importName = fileDescriptor.getName().split("/").pop().replace(".proto", "_pb");
        const values: { [key: string]: number } = {};
        let enumIndex: string = "";
        const translation: { [key: string]: string } = {};
        enumIndex = fileDescriptor.getEnumTypeList().indexOf(enumDescriptor).toString();
        

        enumDescriptor.getValueList().forEach((value) => {
            values[value.getName().toUpperCase()] = value.getNumber();

            const enumIndex = fileDescriptor.getEnumTypeList().indexOf(enumDescriptor);
            const enumPath = [
                5, // Indicates enum
                enumIndex, // Indicated this enumIndex
                2, // Indicates the valuesList
                value.getNumber(), // Indicates the ValueIndex
            ];
            translation[`${enumName}.${value.getName().toUpperCase()}`] = findCommentByPath(locations, enumPath, Utility.uppercaseFirst(value.getName().toLowerCase()));
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

}
