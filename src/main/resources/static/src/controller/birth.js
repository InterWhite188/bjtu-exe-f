/**

 @Name：按出生年份查询
 @Author：dangshk
 @Date：2020-08-07
 */

// 定义 birth 模块
layui.define(function (exports) {
    // 表单个数限制
    let limitNum = 10;
    // 当前表单个数
    let currentNum = 1;
    // 表单编号
    let index = 2;
    // 表单是否初始化
    let isChartInited = 0;

    // 表格初始化
    layui.use('table', function () {
        let table = layui.table;
        table.render({
            elem: '#table'
            , url: 'http://127.0.0.1/search/birthYearInterval' //数据接口
            , page: true //开启分页
            , limit: 10
            , limits: [20, 50, 100, 500]
            , cols: [[ //表头
                {field: 'id', title: 'ID', sort: true}
                , {field: 'gender', title: '性别'}
                , {field: 'birthYear', title: '出生年份', sort: true}
                , {field: 'totalMileage', title: '总旅行里程', sort: true}
                , {field: 'totalTime', title: '总旅行时间', sort: true}
            ]]
            , parseData: function (res) {
                let resList = res.data.list;
                for (let i = 0; i < resList.length; i++) {
                    if (resList[i].gender == '0') {
                        resList[i].gender = '女';
                    } else {
                        resList[i].gender = '男';
                    }
                }
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.total, //解析数据长度
                    "data": resList //解析数据列表
                };
            }
        });
    });

    // 重载表格
    exports('reloadTable', function () {
        layui.use(['table', 'form'], function () {
            let table = layui.table;
            let form = layui.form;

            let data = form.val("form");
            table.reload('table', {
                where: {
                    start: data.start,
                    end: data.end
                }, page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        });
    });

    // 添加表单
    exports('addForm', function () {
        // 表单个数限制
        if (currentNum >= limitNum) {
            return;
        }
        layui.use('jquery', function () {
            let $ = layui.$
            $("#chart-form").append('<div class="layui-inline" id="chart-form-line-' + index + '">\n' +
                '                        <div class="layui-input-inline" style="width: 20%;">\n' +
                '                          <input type="text" name="start-' + index + '" autocomplete="off" class="layui-input" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="1900">\n' +
                '                        </div>\n' +
                '                        <div class="layui-form-mid">-</div>\n' +
                '                        <div class="layui-input-inline" style="width: 20%;">\n' +
                '                          <input type="text" name="end-' + index + '" autocomplete="off" class="layui-input" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="2020">\n' +
                '                        </div>\n' +
                '                        <button type="button" class="layui-btn layui-btn-danger" onclick="delForm(' + index + ')">\n' +
                '                          <i class="layui-icon">&#xe67e;</i>\n' +
                '                        </button>' +
                '                      </div>');
        });
        currentNum++;
        index++;
    });

    // 删除表单
    exports('delForm', function (num) {
        layui.use('jquery', function () {
            let $ = layui.$
            $("#chart-form-line-" + num).remove();
        });
        currentNum--;
    });

    // 图表查询
    exports('searchChart', function () {
        layui.use(['jquery', 'form', 'echarts'], function () {
            let $ = layui.jquery;
            let form = layui.form;
            let echarts = layui.echarts;

            let formData = form.val("chart-form");
            let arr = [];
            let dataArr = [];
            let d;
            let j = 0;
            let k = 0;
            // 表单内容解析，调换大小顺序。保证先小后大
            for (let i in formData) {
                let curData = formData[i];
                if (curData === '') {
                    curData = 0;
                }
                if (k++ % 2 === 0) {
                    arr[0] = curData;
                } else {
                    if (curData < arr[0]) {
                        arr[1] = arr[0];
                        arr[0] = curData;
                    } else {
                        arr[1] = curData;
                    }
                    d = {};
                    d.start = arr[0];
                    d.end = arr[1];
                    dataArr[j++] = d;
                }
            }

            // 请求数据
            var resData = [];
            $.ajax({
                url: "http://127.0.0.1/search/birthChart",
                type: "post",
                async: false,
                contentType: "application/json",
                data: JSON.stringify(dataArr),
                dataType: "json",
                success: function (data) {
                    resData = data.data;
                }
            });

            // 构建图表
            let xAxisData = [];
            let yAxisData = [];
            let barDataArr = [];
            for (let i in resData) {
                xAxisData[i] = resData[i].start + " - " + resData[i].end;
                yAxisData[i] = resData[i].num;
                let obj = {};
                obj.name = xAxisData[i];
                obj.value = yAxisData[i];
                barDataArr.push(obj);
            }

            // 柱状图
            let barOption = {
                title: {
                    text: '按出生年份统计柱状图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                },
                legend: {
                    data:['人数'],
                    left: 'left'
                },
                xAxis: {
                    data: xAxisData
                },
                yAxis: {},
                series: [
                    {
                        data: yAxisData,
                        name: '人数',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                label: {
                                    show: true,
                                    position: 'inside'
                                }
                            }
                        }
                    }
                ]
            };

            // 饼图
            let pieOption = {
                title: {
                    text: '按出生年份统计饼图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: xAxisData
                },
                series: [
                    {
                        data: barDataArr,
                        name: '人数',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var colorList = [
                                        '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            };

            let barChart = echarts.init(document.getElementById('bar-chart'));
            let pieChart = echarts.init(document.getElementById('pie-chart'));
            barChart.setOption(barOption);
            pieChart.setOption(pieOption);
        });
    });

    // tab 监听事件
    layui.use('element', function(){
        var element = layui.element;

        // 当 tab 切换到图表时，自动构建图表
        element.on('tab(search-tab)', function(data){
            let tabIndex = data.index;
            if (tabIndex == 1 && isChartInited == 0) {
                layui.searchChart();
                isChartInited = 1;
            }
        });
    });

    exports('birth', {})
});