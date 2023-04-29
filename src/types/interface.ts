interface tableHeader {
    DD: string,
    GW: string,
    type?: string,
    cType?: string,
    date?: string,
    VIN?: string,
    mpName?: string | number,
    X?: string | number,
    Z?: string | number,
    Y?: string | number,
    DX?: string | number,
    DY?: string | number,
    DZ?: string | number,
}

interface productInfo {
    key?: string,
    val?: string
}
interface T {
    time?: string,
    bodyNumber: string,
    "perfectCount": number | Array<number>,
    "wellCount": number | Array<number>,
    "dataList": Array<any>,
    "warnCount": number | Array<number>,
    "passRate": number,
    "errorCount": number | Array<number>
}

interface indexDataSource {
    status: number,
    data: T
}

interface searchByParams {
    ddistance: string,
    eventTime: string,
    bodyNumber: string,
    pointMeasureName: string,
    pointName: string,
    productPrototypeFeature: number,
    productPrototypeModel: string,
    productPrototypeSubModel: string,
    stationName: string,
    txObserDevia: number | string,
    txObserValue: number | string,
    tyObserDevia: number | string,
    tyObserValue: number | string,
    tzObserDevia: number | string,
    tzObserValue: number | string
}

interface pointWithXYZ {
    id:number,
    "pointId": number,
    "productPrototypeModel": string,
    "productPrototypeSubModel": string,
    "name": string,
    "measureName": string
    "tu": number,
    "ti": number,
    "positionX": number,
    "positionY": number,
    "positionZ": number,
    "imgPath": string,
    "zwarnUp": number,
    "zwarnDown": number,
    "zwellUp": number,
    "zwellDown": number,
    "zperUp": number,
    "zperDown": number,
    "ywarnUp": number,
    "ywarnDown": number,
    "ywellUp": number,
    "ywellDown": number,
    "yperUp": number,
    "yperDown": number,
    "xwarnUp": number,
    "xwarnDown": number,
    "xwellUp": number,
    "xwellDown": number,
    "xperUp": number,
    "xperDown": number
}

interface MPSet {
    "id": number,
    "pointId": number,
    "productPrototypeModel": string,
    "productPrototypeSubModel": string,
    "name": string,
    "measureName": string,
    "positionX": number,
    "positionY": number,
    "positionZ": number,
    "belongTo": string,
    "multiple": string,
    "imgPath": string

}

export { tableHeader,productInfo, indexDataSource, searchByParams, MPSet,pointWithXYZ }