import * as echarts from 'echarts'
var seriesData = [
    {
        value: 25,
        name: "不合格",
        itemStyle: {
            color: '#0096E8',
        },

    },
    {
        value: 75,
        name: "合格",
        itemStyle: {
            color: '#070D11'
        }
    }
]
var pieOption = {
    title: {
        text: "占比分析",
        subtext: "",
        x: 'center',
        y: 15,
        textStyle: {
            color: "white"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{b}: {d}%"
    },
    legend: {
        orient: 'horizontal',
        left: 'right',
        y: 18,
        textStyle: {
            color: '#ffffff'
        },
        data: ["合格", "不合格"]
    },
    color: ["yellowgreen", "#F1760F", "#20b1aa"],
    series: [{
        name: "占比分析",
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: seriesData,
        label: {
            position: "outer",
            formatter: "{d}%",
            color: '#999999'
        },
    }]
};

let barOption = {
    title: {
        text: "占比分析",
        subtext: "",
        x: 'center',
        y: 15,
        textStyle: {
            color: "white"
        }
    },
    xAxis: {
        type: 'category',
        data: [{ value: '前围', textStyle: { color: '#ffffff', fontSize:18, padding:12 } }, { value: '后围', textStyle: { color: '#ffffff',fontSize:18,padding:12 } }],
        axisLine: {
            show: false  // 去掉 x 轴轴线
        },
        axisTick: {
            show: false  // 去掉 x 轴刻度线
        }
    },
    yAxis: {
        type: 'value',
        max: 100,
        show: false  // 隐藏 y 轴
    },
    series: [{
        name: '前围',
        type: 'bar',
        stack: '总量',
        barWidth: 45,
        itemStyle: {
            color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                    { offset: 0, color: '#00a5ff' },
                    { offset: 1, color: '#008ad5' }
                ]
            )
        },
        label: {
            show: true,  // 显示数据标签
            position: 'left',  // 数据标签放在柱子中间
            formatter: '{c}%',  // 数据标签格式化为百分比
            color: '#999999'
        },
        data: [18.5, 30]
    }, 
    {
        name: '后围',
        type: 'bar',
        stack: '总量',
        barWidth: 45,
        itemStyle: {
            color: '#070D11'
        },
        emphasis: {
            focus: 'series'
        },
        label: {
            color: '#999999',
            show: true,  // 显示数据标签
            position: 'right',  // 数据标签放在柱子中间
            formatter: '{c}%'  // 数据标签格式化为百分比
        },
        data: [82.5, 70]
    }]
};
export { pieOption, barOption }