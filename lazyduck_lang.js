/**
 * Created by Administrator on 2016-11-22.
 *
 * To support multi language edit in js
 *
 * LDL : Lazyduck
 * LDLang : LDLanguage
 *
 * url_get, url_set, default_lang is mandatory
 * LDLang.refresh() to request ajax all data-lang and change its text()
 *
 * if you set edit : true, click event will work and you will be able to edit concurrently
 *
 * <h3 class="LDLang" data-lang="CONTACT.head1">Let's make something great</h3>
 *
 * 	$(function() {
		LDLang.invoke($('.LDLang') ,{
			url_get: "{{ url('personalanguage/api_get_lang') }}",
			url_set: "{{ url('personalanguage/api_set_lang') }}",
			edit: true,
			default_lang: 'KR'
		});

		LDLang.refresh();
	});
 */
	
var LDL = LD.createInstance();

var LDLanguageHTML = '\
<div id="areaLang" style="display: none; position: absolute; left: 0px; top: 0px; z-index: 10" class="LDL">\
	<form id="formLangSet" class="LDLForm" method="post" data-confirm="Save it?">\
	<input type="hidden" name="parent">\
	<input type="hidden" name="name">\
	<textarea name="data" style="width: 100%; height: 100px;"></textarea>\
	<br>\
	<label><input type="radio" name="lang" value="KR" checked="checked" style="-webkit-appearance: radio;">KR</label>\
	<label><input type="radio" name="lang" value="CN" class="LDLangRadio" style="-webkit-appearance: radio;">CN</label>\
	<label><input type="radio" name="lang" value="EN" class="LDLangRadio" style="-webkit-appearance: radio;">EN</label>\
	<input type="submit">\
	<div id="tlSet" class="LDLTL"></div>\
	</form>\
	<button id="btnLangClose">Close</button>\
\
	<form id="formLangGet" class="LDLForm" style="display:none" method="post">\
	<input type="hidden" name="lang">\
	<input type="hidden" name="key">\
	</form>\
</div>\
';
		
var LDLanguage = function() {
	this.MIN_HEIGHT = 400;
	this.JQObj = null;
	this.options = {
		url_get: null,
		url_set: null,
		edit: true,
		default_lang: 'KR'
	};
};

LDLanguage.prototype.invoke = function(JQObj, options) {
	var me = this;
	this.JQObj = JQObj;
	this.options = options;

	if(true === this.options.edit) {
		// -- ClickEvent
		this.JQObj.click(function() {
			me.onClickEdit(this);
		});

		// -- Right Click
		this.JQObj.contextmenu(function() {
			me.onClickEdit(this);
		});
	}

	// -- Append
	$('body').append(LDLanguageHTML);
	LDL.invoke({
		prefix: 'LDL'
	});

	LDL.areaLang.hide();

	// -- Form Set
	LDL.formLangSet.obj.attr('action', this.options.url_set);
	LDL.formLangSet.obj.submitAjaxTL(function(success, data) {
		if(success) {
			me.hide();
			alert('Success');

			// -- Refresh
			LDL.lastObj.html(LDL.formLangSet.data);
		} else {
			if('undefined' == typeof data) {
				alert('Error while Setting with api, check you api permission.');
			} else {
				alert(data.resultMessage);
			}
		}
	}, false, LDL.tlSet);

	// -- Form Get
	LDL.formLangGet.obj.attr('action', this.options.url_get);
	LDL.formLangGet.obj.submitAjaxTL(function(success, data) {
		if(success) {
			var lang = {};
			_.each(data.data.list, function(d) {
				var key = d.parent + '.' + d.name;
				var found = me.JQObj.filter("[data-lang='" + key + "']");
				found.html(d.data);

				lang[key] = d;
			});

			LDL.dataSource = lang;
		}
	},false, LDL.tlSet);

	// -- Btn Close
	LDL.areaLang.find('#btnLangClose').off('click').click(function() {
		me.hide();
	});

	// -- TextArea - ESC
	LDL.formLangSet.obj.find('textarea').keyup(function(e) {
		// -- ESC
		if(27 == e.keyCode)
			me.hide();

		// -- Ctrl + enter
		if(13 == e.keyCode && true == e.ctrlKey) {
			LDL.formLangSet.submit();
		}
	});
};

// -- Create Text Edit
LDLanguage.prototype.onClickEdit = function(obj) {
	var me = this;
	var self = $(obj);
	LDL.lastObj = self;

	// -- data.lang="parent.name"
	var lang = self.attr('data-lang');
	var key = this.assertKey(lang);

	var pos = self.offset();
	pos.width = self.width();
	pos.height = self.height();
	var area = LDL.areaLang;
	area.css('left', pos.left);
	area.css('top', pos.top);
	area.css('width', pos.width);
	area.css('height', me.MIN_HEIGHT);

	LDL.formLangSet.data = self.html();
	LDL.formLangSet.lang = me.options.default_lang;
	LDL.formLangSet.parent = key.parent;
	LDL.formLangSet.name = key.name;


	area.show();
	LDL.formLangSet.dataObj.focus();
	LDL.formLangSet.dataObj[0].selectionStart = 0;

	// -- Get
	LDL.formLangGet.lang = me.options.default_lang;
};

LDLanguage.prototype.refresh = function() {
	var me = this;

	LDL.formLangGet.lang = this.options.default_lang;

	var keys = [];
	this.JQObj.each(function() {
		var langs = $(this).attr('data-lang');
		me.assertKey(langs); // -- Just throw if error
		keys.push(langs);
	});

	var keyAll = keys.join(',');

	LDL.formLangGet.key = keyAll;

	LDL.formLangGet.submit();
};

LDLanguage.prototype.assertKey = function(str) {
	var key = str.split('.');
	LDAssert.assert(2 == key.length, 'Invalid ' + str);
	var parent = key[0];
	var name = key[1];
	LDAssert.notEmpty(parent, 'Invalid parent ' + str);
	LDAssert.notEmpty(name, 'Invalid name ' + str);

	return {
		parent: parent,
		name: name
	}
};

LDLanguage.prototype.hide = function() {
	LDL.areaLang.hide();
};

var LDLang = new LDLanguage();