import * as echarts from 'echarts'
// b_dom.getZr().on('click', (param: any) => {
//     const pointInPixel = [param.offsetX, param.offsetY]
//     // console.log('pointInPixel', pointInPixel)
//     // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引值，借助于索引值的获取到其它的信息
//     // 转换X轴坐标
//     let pointInGrid = b_dom.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
//     // seriesIndex 这里是option中的 series:[{},{}]中的 索引！！！
//     // 所点击点的X轴坐标点所在X轴data的下标
//     let xIndex = pointInGrid[0];
//     // 所点击点的Y轴坐标点数值

//     // 使用getOption() 获取图表的option
//     let op = b_dom.getOption();
//     //获取到x轴的索引值和option之后，我们就可以获取我们需要的任意数据。
//     // 点击点的X轴对应坐标的名称
//     var xVal = op.xAxis[0].data[xIndex];
//     //  获取到的 x轴的data
//     var temp = {
//       value: 0,
//       itemStyle: {
//         color: new proxy.$echart.graphic.LinearGradient(0, 0, 0, 1, [
//           { offset: 0, color: '#00a5fe' },
//           { offset: 0.5, color: '#0191D1' },
//           { offset: 1, color: '#043857' }
//         ])
//       },
//     };
//     const initColor = new proxy.$echart.graphic.LinearGradient(0, 0, 0, 1, [
//       { offset: 0, color: '#416c25' },
//       { offset: 0.5, color: '#416c25' },
//       { offset: 1, color: '#416c25' }
//     ])
//     // 首先格式化bar 颜色
//     op.series[0].data = op.series[0].data.map((v: { value: any; itemStyle: { color: any; }; }, i: number) => {
//       if (i < op.series[0].data.length - 1) {
//         if (typeof v == 'object') {
//           return v = v.value;
//         } else {
//           return v
//         }
//       } else {
//         // 最后一项颜色初始initcolor
//         v.itemStyle.color = initColor;
//         return v
//       }
//     })
//     // 点击点的series -- data对应的值
//     // console.log(op.series[0].data);
//     var yData = op.series[0].data[xIndex];
//     temp.value = typeof yData == 'object' ? yData.value : yData
//     op.series[0].data[xIndex] = temp;
//     b_dom.setOption(op)
//     model_3d.value.barClicked(param, xVal, yData)
//   })
const error_option = {
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
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 30,
        right: 30,
        left: 30,
        bottom: 30
    },
    xAxis: [{
        type: 'category',
        triggerEvent: true,
        data: ['优良', '合格', '警戒', '超差'],
        axisLine: {
            show: false,
            lineStyle: {
                color: '#7e9fb6'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            margin: 10,
            color: '#7e9fb6',
            fontSize: 14
        },
    }],
    yAxis: [{
        show: false,
        name: '个',
        axisLabel: {
            color: '#7e9fb6',
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#7e9fb6'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(126,159,182,0.12)'
            }
        }
    }],
    series: [{
        type: 'bar',
        data: [
            {
                value: 6,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#00a5fe' },
                        { offset: 0.5, color: '#0191D1' },
                        { offset: 1, color: '#043857' }
                    ])
                },
            }, 12, 10, {
                value: 4,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#d07b70' },
                        { offset: 1, color: '#d07b70' }
                    ])
                },
            }],
        barWidth: '20px',
        itemStyle: {
            color: '#6EC3C9'
        },
    }]
};

export { error_option }