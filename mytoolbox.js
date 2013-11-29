;(function($) {
/*
 * 顯示浮動視窗工具
 *  範例
 *  $('#test1').myPopUp({showId: "PopUpbox"});
 *  $('#test2').myPopUp({showId: "PopUpbox2", closeId: "closeBox2"});
 *  $('#debug').myPopUp({bind: "mouseover", closebind: "mouseout", showId: "PopUpbox", closeId: "debug", showType: "float"});
 *  說明
 * bind 為主物件綁定的事件 預設 click
 * showId 顯示容器的Id 預設 myPopUpbox
 * closeId 關閉容器的Id 預設 closeBox
 * closebind 關閉容易的事件  預設 click
 * showType 顯示類型 popUp & float 預設
 * showBox 顯示時所要執行的 call back 
 */
$.fn.myPopUp = function (settings) {
	
	var _defaultSettings = {
			
			bind: "click",
			showId: "myPopUpbox",
			closeId: "closeBox",
			closebind: "click",
			showType:"popUp",
			showBox: function () {}
	};
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _boxMethods = {
			initBox: function () {
				if (_settings.showType == "popUp")  {
					_popMethods.initPopUp();
				} else {
					
				}
			},
			showBox : 	function () {
				if (_settings.showType == "popUp")  {
					_popMethods.showPopUp();
				} else {
					_floatMethods.showFloat();
				}
			},
			closeBox : function () {
				if (_settings.showType == "popUp")  {
					_popMethods.closePopUp();
				} else {
					_floatMethods.closeFloat();
				}
			}
	};
	
	var _floatMethods = {
			
			showFloat : function () {
			    var myoffset = _settings.id_object.offset();
			    var width = _settings.id_object.width();
			    
			    _settings.showId_object.css({ "position":"absolute", 'left': myoffset.left + width + 15, 'top': myoffset.top, 'z-index':100 }); 
			    _settings.showId_object.show(1000, function () {
			    	$(this).stop();
			    });
			    
			},
			closeFloat : function () {
				_settings.showId_object.hide(1000, function () {
			    	$(this).stop();
			    });
			}
	};
	
	var _popMethods = {
			
			showPopUp : function () {
				var boxWidth = _settings.showId_object.width(); 
			    var boxheight = _settings.showId_object.height();
			    _settings.showId_object.css({"position":"absolute", "left": (_settings.window_object.width() - boxWidth) / 2, "top": (_settings.window_object.height() - boxheight) / 2, 'z-index': 100 }); 
			    _settings.box_id_object.css({"width": _settings.document_object.width(), "height": _settings.document_object.height() }); 
			    _settings.showId_object.show();
			    _settings.box_id_object.show();
			},
			resizePopUP : function () {			
				var boxWidth = _settings.showId_object.width(); 
			    var boxheight = _settings.showId_object.height();
			    _settings.showId_object.css({ "left": (_settings.window_object.width() - boxWidth) / 2, "top": (_settings.window_object.height() - boxheight) / 2, 'z-index': 100 }); 
			    _settings.box_id_object.css({ "width": _settings.document_object.width(), "height": _settings.document_object.height() }); 	
			},
			closePopUp : function () {
				_settings.showId_object.hide();
				_settings.box_id_object.hide();
			},
			initPopUp: function () {
				$("body").append('<div id="' + _settings.background_box_id + '" style="position:absolute;display:none;width:100%;height:100%;background-color:#999999;left:0px;top:0px;opacity: 0.50;filter: alpha(opacity=50);"></div>');
				_settings.box_id_object = $("#" + _settings.background_box_id);
				// 設定底圖關閉事件
				 _settings.box_id_object.click(function () {
					_boxMethods.closeBox();
				});
				// 設定視窗刷新大小
				$(window).resize(function(){ 
					_popMethods.resizePopUP();
				});
			}
			
	};
	
	var _handler = function () {
		
		// 初始化必要物件
		_settings.background_box_id = this.id +  "_background_box";
		_settings.id_object = $("#" + this.id);
		_settings.showId_object = $("#" + _settings.showId);
		_settings.window_object = $(window);
		_settings.document_object = $(document);
		_boxMethods.initBox();
		
		// 綁定事件
		var this_object = $(this);
		this_object.bind(_settings.bind, _settings.showBox);
		this_object.bind(_settings.bind, _boxMethods.showBox);
		
		if ((this.id == _settings.closeId && _settings.closebind != _settings.bind) || 
				this.id != _settings.closeId) {
			
			$("#" + _settings.closeId).bind(_settings.closebind, _boxMethods.closeBox);
		}
	};
	
	return this.each(_handler);
}
/*
 * clone 物件
 *  範例
 *  <input type="button" id="add" value="增加" />
 *  <div id="tempId" style="display:none">
 *			<div>
 *			<input type="text" id="text" value="新增" />
 *			<input type="button" id="delete" value="刪除" />
 *			</div>
 *  </div>
 *  <div id="cloneId">
 *  </div>
 *  
 *  	$('#add').myClone({cloneId:"tempId",insertId:"cloneId", deleteObject:function () {
 *  		$(this).prev().remove();
 *  		$(this).remove();
 *  	}});
 *
 * 	    $('#add2').myClone({cloneId:"tempId",insertId:"cloneId"}); 
 *  說明
 * bind 為主物件綁定的事件 預設 click
 * cloneId 要執行clone 的 id
 * insertId 要塞入的容器 id
 * deleteId 要執行刪除的 id
 * temp 計數器的起始數字
 * deleteObject 自訂刪除函數
 */
$.fn.myClone = function(settings) {
	// 預設屬性
	var _defaultSettings = {
			
			bind: "click",
			cloneId: "cloneId",
			insertId: "insertId",
			deleteId: "delete",
			temp:"0",
			deleteObject: function () {
				$(this).parent().remove();
			}
	};
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _cloneMethods = {
		cloneChildrenObject : function () {
			var temp_sum = parseInt($("#" + _settings.temp_id).val());
			temp_sum++;
			
			var clone_object = $("#" + _settings.cloneId).clone();
			
			// 檢查是否有要綁定刪除按鈕
			clone_object.find("#" + _settings.deleteId).bind("click", _cloneMethods.deleteObject);
			clone_object.find("#" + _settings.deleteId).bind("click", _cloneMethods.resizeObject);
			
			clone_object.find("[id]").each(function () {
				this.id = this.id + temp_sum;
				$(this).attr("id", this.id).attr("name", this.id);
			});
			$("#" + _settings.insertId).append(clone_object.children());
			$("#" + _settings.temp_id).val(temp_sum);
		},	
		
		resizeObject: function () {
			var temp_sum = parseInt($("#" + _settings.temp_id).val());
			temp_sum--;
			
			var clone_object = $("#" + _settings.cloneId).clone();
			var insert_object = $("#" + _settings.insertId).clone();
			
			var num = 0;
			
			clone_object.find("[id]").each(function () {
				var clone_id = this.id;
				var num = 0;
				
				insert_object.find("[id^='" + clone_id + "']").each(function () {
					num++;
					$("#" + this.id).attr("id", clone_id + num).attr("name", clone_id + num);
				});
			});
			
			$("#" + _settings.temp_id).val(temp_sum);
		},
		
		deleteObject:_settings.deleteObject
	};
	
	var _handler = function () {
		
		var temp_hidden_id = _settings.cloneId + "_clone_num";
		_settings.temp_id = temp_hidden_id;
		// 加入計數器
		if ($("#" + temp_hidden_id).length <= 0) {
			$("body").append('<input type="hidden" id="' + temp_hidden_id + '" value="' + _settings.temp + '" />');
		}
		
		$(this).bind(_settings.bind, _cloneMethods.cloneChildrenObject);
		
	}
	
	return this.each(_handler);
}

$.fn.myAjax = function(settings) {
	// 預設屬性
	var _defaultSettings = {
			
			bind: "click",
			url: "http://www.google.com",
			data: "text=one&test=two",
			type: "POST",
			dataType: "text",
			callback: function (data) {
				alert(data);
			}
	};
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _data = "";
	
	var _ajaxMethods = {
			requestFuction: function() {
				$.ajax({
		  			url: _settings.url,  
		  			type: _settings.type,
		  			data: _settings.data,
		  			dataType: _settings.dataType,
		  			success: function(data) {
		  				_data = data;
		  			}
				});
			}
	};
	
	var _handler = function () {
		$(this).bind(_settings.bind, _ajaxMethods.requestFuction);
	};
	
	return this.each(_handler);
}

/*
 * resize img 物件
 *  範例
 *  <img src="Winter.jpg" />
 *  
 *	$(function (){
 *		$("img").myReImgSize({
 *			reHeight:100,
 *			reWidth:100
 *		});
 *
 *		OR
 *
 *		$("img").myReImgSize();
 *	});
 *	
 *  說明
 * reHeight 壓縮範圍內的高
 * reWidth 壓縮範圍內的寬
 */
$.fn.myReImgSize = function (settings) {
	// 預設屬性
	var _defaultSettings = {
		reHeight: 200,
		reWidth: 200
	}
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _handler = function () {
		//取得影像實際的長寬
		var imgW = $(this).width();
	    var imgH = $(this).height();
	    
	    //計算縮放比例
	    var preW = _settings.reWidth / imgW;
	    var preH = _settings.reHeight / imgH;
	    
	    var pre = 1;
	    if (preW > preH) {
	      pre = preH;
	    } else {
	      pre = preW;
	    }
		
	    //設定目前的縮放比例
	    $(this).width(imgW * pre);
	    $(this).height(imgH * pre);
	};
	
	return this.each(_handler);
}

/*
 * 遮罩 img 物件
 *  範例
 *  <img src="Winter.jpg" />
 *  
 *	$(function (){
 * 		$("img").myRectImg({
 *			rectHeight: 300,
 *			rectWidth: 300,
 *			rectRadius: 30,
 *			callback: function(data) {
 *				data.css({"border-style" : "dashed", "border-width": 1});
 *			}
 *		});
 *	});
 *	
 *  說明
 * rectHeight 遮罩的高
 * rectWidth 遮罩的寬
 * isInlineBlock  display 是否設定為 inline-block
 * borderWidth 遮罩框線寬度
 * callback 回傳 data 為遮罩的物件, 可自行修改css
 */
$.fn.myRectImg = function (settings) {
	// 預設屬性
	var _defaultSettings = {
		rectHeight: 200,
		rectWidth: 200,
		isInlineBlock:true,
		rectRadius: 0,
		borderWidth: 0,
		callback: function(data){}
	}
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _handler = function () {
		// 計算浮動位置
		var imgW = $(this).width();
	    var imgH = $(this).height();
	    
	    var imgTop = (_settings.rectHeight - imgH) / 2;
	    var imgLeft = (_settings.rectWidth - imgW) / 2;
		
	    var rectDiv = $("<div></div>");
	    
		$(this).wrap(
			// 加入遮罩	
				rectDiv.css({
				"position" : "relative",
				"overflow" : "hidden",
				"width" : _settings.rectWidth,
				"height" : _settings.rectHeight,
				"display" : (_settings.isInlineBlock) ? "inline-block" : "block",
				"border-radius": _settings.rectRadius,
				"border-style" : "solid",
				"border-width" : _settings.borderWidth
			})
		
		).css({"top" : imgTop, "left" : imgLeft, "position" : "absolute"});
		
		_settings.callback($(this).parent("div"));
	}
	
	return this.each(_handler);
}

/*
 * 分頁 plugin
 *  範例
 *  
 *  <div id="page"></div>
 *  
 *	$("#page").myPageLink(
 *			{
 *				sumPages: 40,
 *				currentPage:6,
 *				pageSize:5,
 *				pageUrl: "plugin.html?",
 *				pageParamName: "p",
 *				firstDesc: "<<",
 *				lastDesc: ">>",
 *				preDesc: "<",
 *				nextDesc: ">",
 *				callback: function (data) {
 *					//alert(data.html())
 *				}
 *			}
 *	);
 *  說明
 *		sumPages: 30,	 總頁數
 *		currentPage: 5, 現在頁碼
 *		pageSize:5, 		每排頁碼數目
 *		pageUrl: "plugin.html?", 綁定網址
 *		pageParamName: "page", 分頁參數名稱
 *		firstDesc: "第一頁", 第一頁名稱
 *		lastDesc: "最末頁", 最末頁名稱
 *		preDesc: "上一頁", 上一頁名稱
 *		nextDesc: "下一頁", 下一頁名稱
 *		preAndNextDesc: "...",  尚有頁碼注解
 *		isSetFirst: true, 啟用否 第一頁
 *		isSetLast: true, 啟用否 最末頁
 *		isSetPre: true, 啟用否 上一頁
 *		isSetNext: true, 啟用否 下一頁
 *		isSetPreAndNextDesc: true, 啟用否 尚有頁碼注解
 *		callback: function (data) {} 回傳 分頁容器  物件
 */
$.fn.myPageLink = function (settings) {
	// 預設屬性
	var _defaultSettings = {
		sumPages: 30,
		currentPage: 5,
		pageSize:5,
		pageUrl: "plugin.html?",
		pageParamName: "page",
		firstDesc: "第一頁",
		lastDesc: "最末頁",
		preDesc: "上一頁",
		nextDesc: "下一頁",
		preAndNextDesc: "...",
		isSetFirst: true,
		isSetLast: true,
		isSetPre: true,
		isSetNext: true,
		isSetPreAndNextDesc: true,
		callback: function (data) {}
	}	
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _pageMethods = {
			bindFirstPage: function() {
				if (_settings.currentPage != 1 && _settings.isSetFirst == true) {
					_settings.pageContent += '<a id="1" href="' + _settings.pageUrl + 
								_settings.pageParamName + '=1">' + _settings.firstDesc + '</a>';
				}
			},
			bindLastPage: function() {
				if (_settings.currentPage != _settings.sumPages && _settings.isSetLast == true) {
					_settings.pageContent += '<a id="' + _settings.sumPages + '" href="' + _settings.pageUrl + 
								_settings.pageParamName + '=' + _settings.sumPages + '">' + _settings.lastDesc + '</a>';
				}
			},
			bindPrePage: function() {
				if (_settings.currentPage != 1 && _settings.isSetPre == true) {
					var pageNum = parseInt(_settings.currentPage) - 1;
					_settings.pageContent += '<a id="' + pageNum + '" href="' + _settings.pageUrl + 
							_settings.pageParamName + '=' + pageNum  + '">' + _settings.preDesc + '</a>';
				}
			},
			bindNextPage: function() {
				if (_settings.currentPage != _settings.sumPages && _settings.isSetNext == true) {
					var pageNum = parseInt(_settings.currentPage) + 1;
					_settings.pageContent += '<a id="' + pageNum + '" href="' + _settings.pageUrl + 
							_settings.pageParamName + '=' + pageNum  + '">' + _settings.nextDesc + '</a>';
				}
			},
			bindPreDesc: function() {
				if (_settings.startPage > 1 && _settings.isSetPreAndNextDesc == true) {
					_settings.pageContent += "<span>" + _settings.preAndNextDesc + "</span>";
				}
			},
			bindNextDesc: function() {
				if (_settings.endPage < _settings.sumPages && _settings.isSetPreAndNextDesc == true) {
					_settings.pageContent += "<span>" + _settings.preAndNextDesc + "</span>";
				}
			},
			countStartAndEndPage : function () {
				var startPage = 1;
				var endPage = 1;
				
				// 計算起始頁碼
				startPage = _settings.currentPage - parseInt(_settings.pageSize / 2);
				// 最末頁
				if (_settings.currentPage == _settings.sumPages) {
					startPage = _settings.sumPages - _settings.pageSize + 1;
				}
				// 第一頁
				if (_settings.currentPage == 1) {
					startPage = 1;
				}
				// 檢查是否為小於1
				if (startPage < 1) {
					startPage = 1;
				}
				
				// 計算終止頁碼
				var endPage = startPage + _settings.pageSize - 1;
				
				if (endPage > _settings.sumPages) {
					startPage -=  endPage - _settings.sumPages;
					endPage = _settings.sumPages;
				}
				
				// 檢查是否為小於1
				if (startPage < 1) {
					startPage = 1;
				}
				
				_settings.endPage = endPage;
				_settings.startPage = startPage;				
			},
			bindPages: function() {
				
				for (var pagenum = _settings.startPage; pagenum <= _settings.endPage; pagenum++) {
					if (pagenum == _settings.currentPage) {
						_settings.pageContent += "<span>" + pagenum + "</span>";
					} else {
						_settings.pageContent += '<a id="' + pagenum  + '" href="' + _settings.pageUrl + 
								_settings.pageParamName + '=' + pagenum  + '">' + pagenum + '</a>';
					}
				}
			}
	};
	
	var _handler = function () {
		_settings.pageContent = "";
		
		_pageMethods.countStartAndEndPage();
		
		_pageMethods.bindFirstPage();
		_pageMethods.bindPrePage();
		_pageMethods.bindPreDesc();
		_pageMethods.bindPages();
		_pageMethods.bindNextDesc();
		_pageMethods.bindNextPage();
		_pageMethods.bindLastPage();
		
		$(this).append(_settings.pageContent);
		
		_settings.callback($(this));
	}
	
	return this.each(_handler);
}
/*
 * Validate Plugin
 *  範例
 *  <ReqExp group="A" checkId="name" check="empty" error="請輸入姓名" />
 *  <ReqExp group="B" checkId="phone" check="compareTo" compareid="tel" error="手機電話不相同" />
 *  
 *  $("#btnA").myValidate();
 *  
 *	$("#btnB").myValidate({
 *		group: "B",
 *		// 自訂驗證函數 val 為 checkId 的值   reqExp 為 ReqExp 標籤物件
 *		checkNum:  function(val, reqExp) {
 *		    if(val == "") {
 *		        return true;
 *		    }
 *		    var regu = "[0-9]";
 *		    var re = new RegExp(regu);
 *		    return re.test(val);
 *		}
 *	});
 *	
 *  說明
 * submitForm 設定要 submit 的表單id
 * bind 綁定的事件
 * group 驗證群組
 * 預設的驗證函數  val 為 checkId 的值   reqExp 為 ReqExp 標籤物件
 * 可自訂加入驗證函數
 * 	compareTo: function(val, reqExp) {
 *			var compareValue = $("#" + reqExp.attr("compareid")).val();
 *		    compareValue = compareValue.replace(/\r\n|\r|\n/g, '');     
 *		     
 *		    if(val != compareValue) {
 *		        return false;
 *		    } else {
 *		        return true;
 *		    }
 *	},
 * alertDesc alert 警訊的事件 可自行覆蓋修改
 * mySubmit Submit 事件 可自行覆蓋修改
 * resultData 物件屬性
 * 	  resultData.alertErrorDesc 錯誤訊息
 * 	  resultData.checkResult  驗證結果 true or false
 * 	  resultData.submitForm submit 表單id
 */
$.fn.myValidate = function (settings) {
	// 預設屬性
	var _defaultSettings = {
		submitForm: "form1",
		bind: "click",
		group: "A",
		
		empty: function (val, reqExp) {
			if(val == "") {
		        return false;
		    }
		 
		    var regu = "^[ ]+$";
		    var re = new RegExp(regu);
		     
		    return !re.test(val);
		},
		
		compareTo: function(val, reqExp) {
			var compareValue = $("#" + reqExp.attr("compareid")).val();
		    compareValue = compareValue.replace(/\r\n|\r|\n/g, '');     
		     
		    if(val != compareValue) {
		        return false;
		    } else {
		        return true;
		    }
		},
		
		alertDesc: function (resultData) {
			alert(resultData.alertErrorDesc);
		},
		
		mySubmit: function (resultData) {
			$("#" + resultData.submitForm).submit();
		}
	}	
	
	var _settings = $.extend(_defaultSettings, settings);
	
	var _validateMethods = {
		eachReqExp : function() {
			
			$("ReqExp").each(function() { 
				
				if ($(this).attr("group") == _settings.group) {
					var checkValue = "";
				
					checkValue = $("#" + $(this).attr("checkid")).val();
					checkValue = checkValue.replace(/\r\n|\r|\n/g, '');
				
					var checkMethod = $(this).attr("check");
				
					if (!_settings[checkMethod](checkValue, $(this))) {
						_settings.alertErrorDesc += $(this).attr("error") + "\n";
					}
				}
			});
			
			if (_settings.alertErrorDesc != "") {
				_settings.checkResult = false;
			} else {
				_settings.checkResult = true;
			}
		}
	}
	
	var _handler = function () {
		// 綁定事件
		var this_object = $(this);
		this_object.bind(_settings.bind, function() {
			
			_settings.checkResult = true;
			_settings.alertErrorDesc = "";
			
			// 搜尋驗證物件
			_validateMethods.eachReqExp();
			// 建立結果
			var resultData = {};
			resultData.alertErrorDesc = _settings.alertErrorDesc;
			resultData.checkResult = _settings.checkResult;
			resultData.submitForm = _settings.submitForm;
			
			if (resultData.checkResult == false) {
				_settings.alertDesc(resultData);
			}
			
			if (resultData.checkResult == true) {
				_settings.mySubmit(resultData);
			}
		});
	}
	
	return this.each(_handler);
}

})(jQuery);
