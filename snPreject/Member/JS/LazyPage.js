//======================================================================
//LazyPage鼠标滚动懒加载插件
//功能：鼠标滚动到底部后，加载下一页的数据
//使用方法：
//	1、初始化$.LazyPage(options)
//		1-1、options参数说明
//			TargetID：目标容器的ID，即要开启鼠标滚动懒加载功能的容器ID
//			Url：数据请求地址
//			DataFormID：请求数据所附加参数的表单ID
//			DataBoxID：存放列表数据的容器
//			MemberLevel：会员的等级
//			MemberDataLimit：会员等级所对应的数据上限
//	2、刷新$.LazyPage_Refresh(TargetID)
//		2-1、options参数说明
//			TargetID：目标容器的ID，即要开启鼠标滚动懒加载功能的容器ID
//		2-2、注意：调用此方法前，请确认已经调用过$.LazyPage(options)方法进行了初始化
//DOM结构：
//<div id="ListContent"></div>
//<div LazyPage_Loading></div>
//<div LazyPage_NoMore></div>
//<div LazyPage_Message1></div><div LazyPage_Message2></div><div LazyPage_Message3></div>
//======================================================================
(function($) {
	$.LazyPage = function(options) {
		var defaults = {
			TargetID: "", //目标容器的ID
			Url: "", //数据请求地址
			DataFormID: "", //请求数据所附加参数的表单ID
			DataBoxID: "", //存放列表数据的容器
			MemberLevel: 1, //会员的等级
			MemberDataLimit: 500 //会员等级所对应的数据上限
		}; 
		var Options = $.extend(defaults, options); 

		if ($("#" + Options.TargetID).find("*:first").data("LazyPage_Inited") == true) return; //已初始化过，阻止多次初始化

		//把参数和初始化状态保存在SNDataX_APPBody的第一个子级元素上
		$("#" + Options.TargetID).find("*:first").data("LazyPage_Inited", true);
		$("#" + Options.TargetID).find("*:first").data("Options", Options);
		$("#" + Options.TargetID).find("*:first").data("LoadFinished", false);
		$("#" + Options.TargetID).find("*:first").data("LastID", 999999999);

		//初始化后，自动加载第一页的数据
		$.LazyPage_LoadData(Options.TargetID);

		//监听目标容器的滚动事件
		$("#" + Options.TargetID).on("scroll", function () {
			if ($("#" + Options.TargetID).find("*:first").data("LoadFinished") == true) return; //没有更多数据了，或者已到达会员数据上限

			var ScrollTop = $("#" + Options.TargetID).scrollTop(); //元素被卷去的高度
			var ClientHeight = $("#" + Options.TargetID)[0].clientHeight; //元素可见区域的高度
			var Height = $("#" + Options.TargetID).children(":first").height(); //元素高度
			var Pager_PrevScrollTop = $("#" + Options.TargetID).find("*:first").data("Pager_PrevScrollTop") == undefined ? 0 : $("#" + Options.TargetID).find("*:first").data("Pager_PrevScrollTop");

			//判断是否已滚动到底部，同时防止重复请求同一页的数据
			if ((ScrollTop + ClientHeight) > Height) {
				if ((ScrollTop - Pager_PrevScrollTop) > 100) {
					$("#" + Options.TargetID).find("*:first").data("Pager_PrevScrollTop", ScrollTop);

					$.LazyPage_LoadData(Options.TargetID);
				}
			}
		});
	};

	//请求数据并做业务处理
	$.LazyPage_LoadData = function (TargetID) {

		//取出参数
		var Options = $("#" + TargetID).find("*:first").data("Options");

		$.ajax({
			url: Options.Url,
			type: "get",
			ShowLoading: false,
			headers: {
				LastID: $("#" + Options.TargetID).find("*:first").data("LastID")
			},
			data: $("#" + Options.DataFormID).serializeArray(),
			beforeSend: function (xhr) {
				$("#" + Options.TargetID).find("[LazyPage_Loading]").show();
			},
			success: function (data, textStatus, xhr) {
				if ($.trim(data) == "") {
					$("#" + Options.TargetID).find("*:first").data("LoadFinished", true);
					$("#" + Options.TargetID).find("[LazyPage_NoMore]").show();
				} else {
					$("#" + Options.DataBoxID).append(data);
					$("#" + Options.TargetID).find("*:first").data("LastID", xhr.getResponseHeader('LastID'));
				}
				if ($("#" + Options.DataBoxID).children().length >= Options.MemberDataLimit) {
					$("#" + Options.TargetID).find("*:first").data("LoadFinished", true);
					$("#" + Options.TargetID).find("[LazyPage_Message" + Options.MemberLevel + "]").show();
				}
			},
			complete: function () {
				$("#" + Options.TargetID).find("[LazyPage_Loading]").hide();
			}

		});
	}

	$.LazyPage_Refresh = function (TargetID) {
		//取出参数
		var Options = $("#" + TargetID).find("*:first").data("Options");

		//设置初始化状态
		$("#" + Options.TargetID).find("*:first").data("LoadFinished", false);
		$("#" + Options.TargetID).find("*:first").data("LastID", 999999999);

		//移除列表数据
		$("#" + Options.DataBoxID).empty();

		//重新加载数据
		$.LazyPage_LoadData(Options.TargetID);
	};
	
})(jQuery);
