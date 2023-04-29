import * as echarts from 'echarts'
import { StreamCopyUsage } from 'three';
const overall_option = {
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
    title: {
        // text: '近6月的平台趋势分析',
        textStyle: {
            align: 'center',
            color: '#CAFFFD',
            fontSize: 12,
        },
        top: '0%',
        left: 'center',
    },
    backgroundColor: '',
    tooltip: {
        trigger: 'axis',
    },
    // legend: {
    //     data: ['流入'],
    //     top: '0%',
    //     left: '5%',
    //     textStyle: {
    //         align: 'center',
    //         color: '#fff',
    //         fontSize: 12,
    //     },
    // },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 30,
        containLabel: true
    },
    //	    toolbox: {
    //	        feature: {
    //	            saveAsImage: {}
    //	        }
    //	    },
    xAxis: {
        type: 'category',
        boundaryGap: false, //坐标轴两边留白
        data: ['530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969', '530B-969'],
        axisLabel: { //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            //	margin:15,
            color: '#eeeeee',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
            formatter: function (params) {
                var newParamsName = "";
                var paramsNameNumber = params.length;
                var provideNumber = 4; //一行显示几个字
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                    for (var p = 0; p < rowNumber; p++) {
                        var tempStr = "";
                        var start = p * provideNumber;
                        var end = start + provideNumber;
                        if (p == rowNumber - 1) {
                            tempStr = params.substring(start, paramsNameNumber);
                        } else {
                            tempStr = params.substring(start, end) + "\n";
                        }
                        newParamsName += tempStr;
                    }

                } else {
                    newParamsName = params;
                }
                return newParamsName
            },
        },
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
    yAxis: [{
        type: 'value',
        min: 0,
        max: 1,
        splitNumber: 3,
        axisLabel: {
            color: '#EEEEEE',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#CAFFFD',
                opacity: 0.3
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                color: 'rgba(202, 255, 253, 0.2)',
                // 	opacity:0.1
            }
        }

    }],
    series: [{
        name: '合格率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        label: {
            show: true,
            position: 'top',
            color: '#FFFFFF',
            formatter: function (v) {
                return (v.value * 100).toFixed(1) + '%'
            }
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(7,107,149,1)'
            }, {
                offset: 1,
                color: 'rgba(7, 48, 65, 1)'
            }]),
        },
        itemStyle: {
            color: 'rgba(0, 164, 255, 1)', // 曲线上点颜色
            shadowColor: '#fff',
            shadowBlur: 20,
            lineStyle: {
                color: "rgba(0, 164, 255, 1)",
                width: 1
            },


        },
        data: [0.89, 0.92, 0.93, 0.92, 0.82, 0.92, 0.88, 0.88, 0.78, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96]
    },]
};

export { overall_option }