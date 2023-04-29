import Mock from "mockjs";

let xdata = [];
let s1 = [];
let s2 = [];
let s3 = [];
for (let i = 0; i < 15; i++) {
    const int = Mock.Random.natural(900, 999)
    xdata.push(`530B-${int}`);
    s1.push(Mock.Random.float(-0.3, 0.2, 1, 2));
    s2.push(Mock.Random.float(-0.5, 0.5, 1, 2));
    s3.push(Mock.Random.float(-0.8, 0.3, 1, 2));
}
let color = ['#00A5FF', '#00E693', '#82ccdd'];

const hexToRgba = (hex, opacity) => {
    let rgbaColor = '';
    let reg = /^#[\da-f]{6}$/i;
    if (reg.test(hex)) {
        rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt(
            '0x' + hex.slice(5, 7)
        )},${opacity})`;
    }
    return rgbaColor;
};

const single_option = {
    backgroundColor: '',
    graphic: {

        type: "text",
        left: "center",
        top: "47%",
        z: 2,
        zlevel: 100,
        style: {
            text: ` 暂查无数据 `,
            x: 100,
            y: 100,
            textAlign: "center",
            fill: "#fff",
            fontSize: "0",
        },
    },
    dataZoom: [
        {
            type: 'inside',
            realtime: true,
            start: 90,
            end: 100,
            showDetail: true,
            zoomOnMouseWheel: true,
            brushSelect: false,
        }
    ],
    series: [
        {
            type: "line",
            name: "x轴",
            smooth: false,
            symbol: 'circle',
            symbolSize: 7,
            customInfo: {
                obV: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber: [] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            lineStyle: {
                width: 2,
                color: color[0],
                shadowBlur: 15,
                shadowColor: '#fff',
                shadowOffsetY: 4,
            },
            itemStyle: {
                color: 'rgba(0, 164, 255, 1)', // 曲线上点颜色
                label: { show: true, color: '#fff' },// 曲线上显示数值
                shadowColor: '#fff',
                shadowBlur: 20,
                lineStyle: {
                    color: "rgba(0, 164, 255, 1)",
                    width: 2
                },


            },
            data: s1,
        },
        {
            type: "line",
            name: "y轴",
            smooth: false,
            symbol: 'circle',
            symbolSize: 7,
            customInfo: {
                obV: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber: [] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            lineStyle: {
                width: 2,
                color: color[1],
                shadowBlur: 15,
                shadowColor: '#fff',
                shadowOffsetY: 4,
            },
            itemStyle: {
                color: 'rgba(0, 230, 147, 1)', // 曲线上点颜色
                label: { show: true, color: '#fff' },// 曲线上显示数值
                shadowColor: '#fff',
                shadowBlur: 20,
                lineStyle: {
                    color: "rgba(0, 230, 147, 1)",
                    width: 2
                },
            },
            data: s2,
        },
        {
            type: "line",
            name: "z轴",
            smooth: false,
            symbol: 'circle',
            symbolSize: 7,
            customInfo: {
                obV: [] as any,
                pointName: '',
                stationName: '',
                pointId: 0,
                model: '',
                bodyNumber: [] as any,
                statusX:[] as any,
                statusY:[] as any,
                statusZ:[] as any
            },
            lineStyle: {
                width: 2,
                color: color[2],
                shadowBlur: 15,
                shadowColor: '#fff',
                shadowOffsetY: 4,
            },
            itemStyle: {
                color: color[2], // 曲线上点颜色
                label: { show: true, color: '#fff' },// 曲线上显示数值
                shadowColor: '#fff',
                shadowBlur: 20,
                lineStyle: {
                    color: color[2],
                    width: 2
                },
            },
            data: s3,
        },
    ],
    grid: {
        top: 30,
        left: 40,
        right: 10,
        bottom: 30,
    },
    legend: { data: ["x轴", "y轴", "z轴"], textStyle: { color: '#fff' } },
    tooltip: {
        trigger: "axis", order: "valueAsc", enterable: true,
        showContent: true,
        className: 'setSingleDataBg',
        triggerOn: 'mousemove',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#1a2995'
            }
        },
        formatter: function (param) {
            console.log(params)
        }
    },
    xAxis: {
        type: "category",
        data: xdata,
        axisLabel: {
            formatter: '{value}',

            fontSize: 11,
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: '#00FFFF',

            axisTick: { //坐标轴刻度相关设置。
                show: false,
            },
            axisLine: { //坐标轴轴线相关设置
                lineStyle: {
                    color: '#CAFFFD',
                    opacity: 0.3
                }
            },
            splitLine: { //坐标轴在 grid 区域中的分隔线。
                show: false,
                lineStyle: {
                    color: '#E5E9ED',
                    // 	opacity:0.1
                }
            }
        },
    },
    yAxis: {
        type: "value",
        axisLabel: {
            color: '#fff'
        },
        axisTick: {
            show: true
        },
        scale: true,
        max: 2,
        min: -2,
        interval:.5,
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                color: 'rgba(202, 255, 253, 0.2)',
                // 	opacity:0.1
            }
        }
    },
};

export { single_option };
