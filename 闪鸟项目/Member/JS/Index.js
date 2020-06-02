//==========以下是Hash页面路由器=======================================
var jQuery;
var $;
; !function () {
    $ = layui.$;
    jQuery = layui.$;

    //根据Hash路由信息加载页面
    function JimmyRouter_LoadPage(ResetMenu) {
        var url = "";
        if (location.hash != "") {
            url = location.hash.substring(1);
        } else {
            url = "StartPage";
        }
        $.get(url, {}, function (str) {
            $("#SNDataX_APPBody").find("*").remove();
            $("#SNDataX_APPBody").html("<div id='SNDataX_APPContent'>" + str + "</div>");
            layui.element.init(); //重绘页面元素，比如面包屑

            //页面刷新时，状态处理
            if (ResetMenu) {
                SNDataX_MenuItemReActived();//恢复菜单选中状态

                //恢复菜单菜单的展开/收缩状态              
                if (window.localStorage.MenuExpandState != undefined && window.localStorage.MenuExpandState == "false") {
                    SNDataX_SwitchLeftMenu(true);
                }                
            }
        });

    }

    //加载页面	
    $(document).ready(function () {
        JimmyRouter_LoadPage(true);
    });

    //路由变化
    window.addEventListener('hashchange', function () {
        JimmyRouter_LoadPage();
        SNDataX_MenuItemReActived();
    })

}();
//=====================================================================end


//==========以下是主菜单相关方法=======================================
var SNDataX_MenuExpand = true;
var SNDataX_oldExpandItem = null;
//主菜单展开/收缩
function SNDataX_SwitchLeftMenu(ReloadStatus) {
    if (SNDataX_MenuExpand) {// 收缩
        $("#SNDataX_Left").css("width", "60px");
        $("#SNDataX_Header .left").css("padding-left", "70px");
        $("#SNDataX_APPBody").css("left", "60px");
        $("#SNDataX_Left_Menu .layui-icon").css("padding-right", "25px");
        $("#SNDataX_Left_Menu li dd a").css("width", "50px");
        $("#SNDataX_Left_Menu li dd a").css("padding", "0 10px");
        $("#SNDataX_Logo1").hide();
        $("#SNDataX_Logo2").show();
        $("#SNDataX_btnSwitchMenu").find("i").removeClass("layui-icon-shrink-right");
        $("#SNDataX_btnSwitchMenu").find("i").addClass("layui-icon-spread-left");
        SNDataX_oldExpandItem = $("#SNDataX_Left_Menu li.layui-nav-itemed a:first");
        SNDataX_oldExpandItem.click();
    } else {//展开
        $("#SNDataX_Left").css("width", "200px");
        $("#SNDataX_Header .left").css("padding-left", "210px");
        $("#SNDataX_APPBody").css("left", "200px");
        $("#SNDataX_Left_Menu .layui-icon").css("padding-right", "");
        $("#SNDataX_Left_Menu li dd a").css("width", "");
        $("#SNDataX_Left_Menu li dd a").css("padding", "");
        $("#SNDataX_Logo1").show();
        $("#SNDataX_Logo2").hide();
        $("#SNDataX_btnSwitchMenu").find("i").removeClass("layui-icon-spread-left");
        $("#SNDataX_btnSwitchMenu").find("i").addClass("layui-icon-shrink-right");
        if (SNDataX_oldExpandItem!=null){
            SNDataX_oldExpandItem.click();
        }
    }
    SNDataX_MenuExpand = !SNDataX_MenuExpand;

    if (ReloadStatus == undefined) { //只有在用户手动展开/收缩菜单时，才对状态进行记录
        window.localStorage.setItem("MenuExpandState", SNDataX_MenuExpand);
    }
    if ($("#grid1").length > 0) {
        layui.table.resize('grid1');
    }
}

//主菜单收缩状态下，鼠标移动显示tips
$("#SNDataX_Left_Menu li.layui-nav-item").bind("mouseenter", function () {
    if (SNDataX_MenuExpand == false) {
        layui.layer.tips($(this).find("cite").text(), $(this).find("i"));
    }
})
$("#SNDataX_Left_Menu li dl dd a").bind("mouseenter", function () {
    if (SNDataX_MenuExpand == false) {
        layui.layer.tips($(this).text(), $(this));
    }
})

//主菜单收缩状态下，鼠标离开左侧菜单时，关闭所有tips
$("#SNDataX_Left_Menu").bind("mouseleave ", function () {
    if (SNDataX_MenuExpand == false) {
        layer.closeAll('tips');
    }
})

//根据页面hash重新恢复主菜单项目选中
function SNDataX_MenuItemReActived() {
    var strHash = location.hash.split('?')[0];
    $("#SNDataX_Left_Menu li").removeClass("layui-nav-itemed");
    $("#SNDataX_Left_Menu dd").removeClass("layui-this");
    $("#SNDataX_Left_Menu dd a[hrefData='" + strHash + "']").parent().addClass("layui-this");
    $("#SNDataX_Left_Menu dd a[hrefData='" + strHash + "']").closest("li").addClass("layui-nav-itemed");

    newHref = location.hash.split('?')[0] + '?' + new Date().getTime();
    $("#SNDataX_Left_Menu dd a[hrefData='" + strHash + "']").attr("href", newHref)
}
//=====================================================================end


//==========以下是列表类页面公共方法=======================================
//获取某个表格的已选中ID值序列
function GetCheckIDs(GridID) {
    var chkIDs = layui.table.checkStatus(GridID).data.reduce(function (IDs, item) {
        IDs += item.ID + ",";
        return IDs;
    }, "");
    chkIDs = chkIDs.substr(0, chkIDs.length - 1);
    return chkIDs;
}

//将表单数据转换为请求字符串后返回，搜索按钮要调用
function GetFormJSON(formID) {
    var data = $('#' + formID).serializeArray();

    //对checkbox做特殊处理
    var $radio = $('input[type=radio],input[type=checkbox]', $('#' + formID));
    $.each($radio, function () {        
        if ($("input[name='" + this.name + "']:checked").length == 0) {
            data.push({ name: this.name, value: "" });
        }
    });

    var obj = {};
    $.each(data, function (i, v) {
        obj[v.name] = v.value;
    })
    return obj;
}

//获取hash参数的值，如果hash中没有相应的参数，则返回null
function HashRequest(name) {
    var arr = (location.hash || "")
      .substr(location.hash.indexOf("?") + 1)
      .replace(/^\#/, "")
      .split("&");
    var params = {};
    for (var i = 0; i < arr.length; i++) {
        var data = arr[i].split("=");
        if (data.length == 2 && data[0] == name) {
            return data[1];
        }
    }
    return null;
}

//=====================================================================end


//============================================动态加载CSS文件开始=====================================================
//filePath：样式文件的路径
function SNDataX_AddCSS(filePath) {
    var node = document.createElement('link');
    node.rel = 'stylesheet';
    node.href = filePath;
    document.getElementsByTagName('head')[0].appendChild(node);
}
//============================================动态加载CSS文件结束=====================================================

//==========以下是AJAX全局设置=======================================
//所有的AJAX都不缓存
layui.$.ajaxSetup({ cache: false });

//AJAX请求发送前显示进度条
layui.$(document).ajaxSend(function (evt, xhr, settings) {
    if (settings.beforeSend == undefined && settings.ShowLoading != false && !(settings.url.indexOf("?page=") != -1 && settings.url.indexOf("&limit=") != -1)) {
        $("body").ShowLoading("加载中，请稍候... ...");
    }
});

//AJAX请求完成时隐藏进度条，无论请求成功或失败都会执行此代码
layui.$(document).ajaxComplete(function (event, xhr, settings) {
    if (settings.complete == undefined && settings.ShowLoading != false && !(settings.url.indexOf("?page=") != -1 && settings.url.indexOf("&limit=") != -1)) {
        $("body").HideLoading(false);
    }
});

//AJAX请求失败时显示系统提示
layui.$(document).ajaxError(function (event, xhr, settings) {
    if (settings.error == undefined) {
        layui.layer.msg('内部服务器错误（001）!', { time: 2000 });
    }
});

//AJAX请求成功后，错误信息及登录超时的处理
layui.$(document).ajaxSuccess(function (evt, xhr, settings) {
    if (xhr.responseText && xhr.responseText.charAt(0) == "{" && xhr.responseText.charAt(xhr.responseText.length - 1) == "}") {
        if (xhr.responseJSON.LoginStatus != undefined && xhr.responseJSON.LoginStatus == false) { //未登录，自动进行页面处理
            layer.alert("您尚未登录或者登录信息已经超时，请重新登录！", function (index) {
                location = "Login";
            });
            return;
        }

        if (xhr.responseJSON.ErrorInfo != undefined && xhr.responseJSON.ErrorInfo != "") {//有JSON类型的错误信息，自动弹出显示
            layer.alert(xhr.responseJSON.ErrorInfo);
            return;
        }
    }
    else {
        //如果返回的内容是登录页，提示后跳转到登录页
        if (xhr.responseText.indexOf("<!--LoginPage marks") > 0) {
            layui.layer.alert("您尚未登录或者登录信息已经超时，请重新登录！", function (index) {
                location = "Login";
            });
            return;
        }

        //显示服务器返回的错误提示信息
        if (xhr.responseText.substring(0, 6) == "Failed") {
            layui.layer.alert(xhr.responseText.substring(6));
            return;
        }
    }

});
//=====================================================================end


//============================================Layui 合计行设置开始=====================================================
//设置合计行
//调用示例：SetTotalRow("grid1",{"col1": "合计","col2":"￥2000.00", "col3":"8200"});

//tableid:表格名参数
//options：字符串
//isDelete:是否覆盖最后一行
function SetTotalRow(tableid, options,isDelete) {
    //获取表格对象
    var table = $("div[lay-id='" + tableid + "'] .layui-table-main .layui-table");

    //获取行数
    var rowCount = table.find("tbody tr").length;
    if (rowCount == 0) return;//没有数据，不用合计

    //克隆最后一行，并清空td里面的内容
    var newTR = table.find("tbody tr:last").clone();
    //如果isDelete为true则删除最后一行
    if (isDelete == true) {
        table.find("tbody tr:last").remove();
    }
    var colCount = newTR.find(">td").length;
    for (var i = 0; i < colCount; i++) {
        newTR.find(">td:eq(" + i + ") div").html("");
    }
    table.find("tbody tr:last").after(newTR.prop("outerHTML"));

    //合计行赋值
    $.each(options, function (name, value) {
        table.find("tbody tr:last td:eq(" + (Number(name.substring(3)) - 1) + ") div").html(value);
    })
}

//============================================Layui 合计行设置结束=====================================================

//============================================Layui table header滚动固定===============================================
$('#SNDataX_APPBody').on('scroll', function () {
    //grid1 添加 usefixed = "true" 可以完成table header滚动固定
    //判定table 锚点grid1是否存在,且自定义属性usefixed 且 锚点grid1在页面上可见 时
    if ($('#grid1').length > 0 && $('#grid1').attr('usefixed') == 'true' && $('#grid1').is(":visible") == true) {
        var scrollTop = $("#SNDataX_APPBody").scrollTop();
        var top = $(".layui-table-header").offset().top;
        if (scrollTop >= top + 43) {
            $(".layui-table-header").addClass("theadfixed");
        } else {
            $(".layui-table-header").removeClass("theadfixed");
        }
        //console.log('执行')
    } else {
        //onsole.log('未执行')
    }
 });
//============================================Layui table header滚动固定===============================================