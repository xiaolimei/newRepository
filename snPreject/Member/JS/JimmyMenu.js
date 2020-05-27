//菜单点击事件
$("#JimmyMenu>.MainMenuItem, #JimmyMenu>.SubMenu>.SubMenuItem").on("click", function() {
	ActiveMenu($(this).attr("hrefdata"));
})

//菜单点击响应
function ActiveMenu(hrefdata) {
	//定位菜单项
	var objMenuItem = $("#JimmyMenu a[hrefdata='" + hrefdata + "']");

	//判断菜单级别
	var MenuLevel = 0;
	if (objMenuItem.parent().attr("id") == "JimmyMenu") {
		MenuLevel = 1;
	} else {
		MenuLevel = 2;
	}

	//判断有无下级菜单 
	var hasSubMenu = false;
	if (objMenuItem.find("+div.SubMenu").length > 0) {
		hasSubMenu = true;
	}

	//如果是一级菜单且无下级菜单
	if (MenuLevel == 1 && hasSubMenu == false) {
		JimmyMenu_SelecteMainMenu(hrefdata);
	}

	//如果是一级菜单但有下级菜单，则展开/收缩当前菜单，如果是展开操作，操作前要把已展开的菜单关闭
	if (MenuLevel == 1 && hasSubMenu == true) {
		JimmyMenu_ToggleSubMenu(hrefdata);
	}

	//如果是二级菜单，取消所有级别的选中状态，将上级菜单展开选中，并选中当前菜单，改变href随机字符
	if (MenuLevel == 2) {
		JimmyMenu_SelecteSubMenu(hrefdata);
	}

	if (objMenuItem.attr("hrefdata") != undefined && objMenuItem.attr("href") != undefined) {
		objMenuItem.attr("href", objMenuItem.attr("hrefdata") + '?' + new Date().getTime());
	}
}

//选中一级菜单
//逻辑：取消一级菜单选中状态，取消二级菜单选中状态，设置当前菜单为选中状态
function JimmyMenu_SelecteMainMenu(hrefdata) {
	var objMenuItem = $("#JimmyMenu a[hrefdata='" + hrefdata + "']");

	$("#JimmyMenu .MainMenuActived").removeClass("MainMenuActived");
	$("#JimmyMenu .SubMenuActived").removeClass("SubMenuActived");
	objMenuItem.addClass("MainMenuActived");
	$("#Jimmy_PageTitle").text(objMenuItem.find("span.title").text());
}

//选中二级菜单
//逻辑：取消一级菜单选中状态，取消二级菜单选中状态，设置当前菜单的相邻上一个元素（即该二级菜单对应的主菜单）为选中状态，设置当前菜单为选中状态。如果当前菜单对应的子菜单组没有展开，则展开它
function JimmyMenu_SelecteSubMenu(hrefdata) {
	var objMenuItem = $("#JimmyMenu a[hrefdata='" + hrefdata + "']");

	$("#JimmyMenu .MainMenuActived").removeClass("MainMenuActived");
	$("#JimmyMenu .SubMenuActived").removeClass("SubMenuActived");
	objMenuItem.parent().prev().addClass("MainMenuActived");
	objMenuItem.addClass("SubMenuActived");
	$("#Jimmy_PageTitle").text(objMenuItem.find("span").text());

	if (!objMenuItem.parent().is(':visible')) {
		JimmyMenu_ToggleSubMenu(objMenuItem.parent().prev().attr("hrefdata"), true);
	}
}

//展开、关闭菜单组
//status为true时展开，false时关闭，如果未传入status，则进行Toggle操作
//进行展开操作时，如果有其它已展开的菜单组，要先关闭，保证任何时候都只有一个菜单组处于展开状态
function JimmyMenu_ToggleSubMenu(hrefdata, status) {
	if ($("#SNDataX_Left").width()!=200) return;
	
	var objMenuItem = $("#JimmyMenu a[hrefdata='" + hrefdata + "']");
	if (objMenuItem.find("+div.SubMenu").is(':visible') || status == false) { //关闭
		objMenuItem.find("+div.SubMenu").slideUp(100);
		$("#JimmyMenu .MainMenuExpend").removeClass("MainMenuExpend");		
	}

	if (!objMenuItem.find("+div.SubMenu").is(':visible') || status == true) { //展开
		$("#JimmyMenu").find("div.SubMenu:visible").slideUp(100);
		objMenuItem.find("+div.SubMenu").slideDown(100);
		$("#JimmyMenu .MainMenuExpend").removeClass("MainMenuExpend");
		objMenuItem.addClass("MainMenuExpend");
	}

}

//主菜单展开、收缩
function ToogleJimmyMenu(){
	if ($("#SNDataX_Left").width()==200){
		//关闭所有已展开的子菜单组
		var temphref = $("#JimmyMenu").find("div.SubMenu:visible").prev().attr("hrefdata");
		if (temphref!=undefined){
			$("#JimmyMenu").attr("HistoryVisibleSubMenu",temphref);
			JimmyMenu_ToggleSubMenu(temphref, false);
		}else{
			$("#JimmyMenu").attr("HistoryVisibleSubMenu","");
		}
		
		//调整宽度，隐藏元素，调整位置
		$("#btnToogleJimmyMenu").html("&#xe68b;");
		$("#SNDataX_Left").css("width", "80px");
		$("#SNDataX_Right").css("margin-left", "83px");
		$("#JimmyMenu .MainMenuItem .title, #JimmyMenu .MainMenuItem .arrow").hide();
		$("#JimmyMenu .MainMenuItem .icon").css("margin-left", "28px");
		$("#JimmyLogo_L").hide()
		$("#JimmyLogo_S").show();
	}else{
		//调整宽度，隐藏元素，调整位置
		$("#btnToogleJimmyMenu").html("&#xe602;");
		$("#SNDataX_Left").css("width", "");
		$("#SNDataX_Right").css("margin-left", "");
		$("#JimmyMenu .MainMenuItem .title, #JimmyMenu .MainMenuItem .arrow").show();
		$("#JimmyMenu .MainMenuItem .icon").css("margin-left", "");
		$("#JimmyLogo_L").show()
		$("#JimmyLogo_S").hide();
		
		//恢复展开
		var temphref = $("#JimmyMenu").attr("HistoryVisibleSubMenu");
		JimmyMenu_ToggleSubMenu(temphref, true);
	}	
}


//首次进入或刷新时恢复状态
if (location.hash != "") {
	ActiveMenu(location.hash.split("?")[0]);
} else {
	JimmyMenu_SelecteMainMenu("#StartPage");
	ActiveMenu("#SubMenuGroup1")
}

//ToogleJimmyMenu();
