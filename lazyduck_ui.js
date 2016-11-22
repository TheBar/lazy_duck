/**
 * Created by Administrator on 2016-11-22.
 */

/**
 * Check Toggle
 * var toggle = new LDCheckToggle($("#input[name='abcd']"), 'ALL');
 * $("#input[name='abcd']").LDCheckToggle('ALL');
 *
 * in that object, find the value, which toggles all!!
 * @param JQObj
 * @param value
 * @constructor
 */
var LDCheckToggle = function(JQObj, value) {
	this.obj = null;
	this.value = value;

	this.invoke(JQObj);
};

LDCheckToggle.prototype.invoke = function(JQObj) {
	this.obj = JQObj;

	var changer = this.obj.filter("[value='" +this.value + "']");
	if(0 == changer.length) {
		console.error('LDCheckToggle.invoke has failed JQObject is invalid');
		return false;
	}

	changer.change(function() {
		var checked = this.checked;

		JQObj.prop('checked', checked);
	});
};

$.fn.LDCheckToggle = function(value) {
	var toggle = new LDCheckToggle(this, value);
	return toggle;
};


/**
 * Order clicking object
 var order = new LDOrder();
 order.invoke({
		selector: '.LDOrderList',
		asc: '<i class="glyphicon glyphicon-chevron-up"></i>',
		desc: '<i class="glyphicon glyphicon-chevron-down"></i>',
		onChange: function(name, order) {
			console.log('onChange', name, order);
		}
	});

 order.setOrder('followers', 'desc');
 * @constructor
 */
var LDOrder = function() {
	this.ATTR_ORDER = 'data-order';
	this.ATTR_NAME = 'data-name';
	this.BASE_ORDER = 'asc';

	this.selector = null;
	this.objOrder = null;
	this.onChangeListener = null;
};

LDOrder.prototype.invoke = function (obj) {
	var me = this;

	if(!obj.selector) {
		console.error('LDOrder.invoke selector not exist');
		return false;
	}

	if(!obj.asc) {
		console.error('LDOrder.invoke asc not exist');
		return false;
	}

	if(!obj.desc) {
		console.error('LDOrder.invoke desc not exist');
		return false;
	}

	// -- Set to this
	me.selector = obj.selector;
	me.asc = obj.asc;
	me.desc = obj.desc;
	me.onChangeListener = obj.onChange;

	// -- Click
	$(obj.selector).each(function() {
		var self = $(this);

		// -- Click
		self.click(function() {
			var clickSelf = $(this);
			me.onClick(me, clickSelf);
		});

		// -- Cursor
		self.attr('style', 'cursor: pointer');
	});

	// -- Default
	if(obj.default) {
		var def = obj.default.split('.');
		me.setOrder(def[0], def[1]);
	}
};

LDOrder.prototype.onClick = function(me, self) {
	var myPrevOrder = self.attr(me.ATTR_ORDER);

	// -- I got that
	if(myPrevOrder) {
		var myNewOrder = myPrevOrder == 'asc' ? 'desc' : 'asc';
		self.attr(me.ATTR_ORDER, myNewOrder);
	} else {
		// -- Others got that
		if(me.objOrder) {
			me.objOrder.removeAttr(me.ATTR_ORDER);
		}

		// -- And Set ME!
		self.attr(me.ATTR_ORDER, me.BASE_ORDER);
	}

	// -- new object
	me.objOrder = self;

	// -- RefreshView
	me.refreshView();

	// -- Notify
	if(me.onChangeListener) {
		me.onChangeListener(self.attr(me.ATTR_NAME), me.objOrder.attr(me.ATTR_ORDER));
	}
};

// -- Just update the view
LDOrder.prototype.refreshView = function() {
	var me = this;

	// -- Remove child
	$(this.selector).find('.LDOrderAsc').remove();
	$(this.selector).find('.LDOrderDesc').remove();

	if(me.objOrder) {
		var order = me.objOrder.attr(me.ATTR_ORDER);

		// -- Default order - asc
		if(!order) {
			order = me.BASE_ORDER
		}
		var html = me[order];
		var obj = $(html);

		if('asc' == order)
			obj.addClass('LDOrderAsc');
		else
			obj.addClass("LDOrderDesc");

		// -- Append child
		me.objOrder.append(obj);
	}
};

LDOrder.prototype.setOrder = function(name, order) {
	// -- One param 'name.order' in name
	if(_.isUndefined(order)) {
		var params = name.split('.');
		if(2 != params.length) {
			console.error('LDOrder setOrder Invalid name type');
			return false;
		}

		name = params[0];
		order = params[1];
	}

	var selectorByName = '[' + this.ATTR_NAME + '=\'' + name + '\']';
	var found = $(this.selector).siblings(selectorByName);

	if(0 == found.length) {
		console.error('LDOrder setOrder could not find such name', name);
		return false;
	}

	// -- Set
	this.objOrder = found;
	this.objOrder.attr(this.ATTR_ORDER, order);

	// -- RefreshView
	this.refreshView();
};

/**
 * TAG 입력등을 위해 만듬
 * 특정 input의 enter 이벤트를 이용해서 대상에 template을 보여주고
 * 클릭시 이를 지움
 * 데이터는 sibling으로 append 됨
 * class onClickTags 는 중요함!! 이녀석에게 click 이벤트를 검
 * data-value도 꼭 넣어줘야함
 *
 1.
 <div id="areaTags"></div>
 <input name="tagsInput" type="text" placeholder="TAGS) Any words..." data-template="#templateTags" data-name="tags" data-view="#areaTags"/>

 2.
 <script type="text/html" id="templateTags">
 <p class="onClickTags" style="cursor: pointer" data-value="<%= input %>"><%= input %></p>
 </script>

 3.
 var tags = new LDTags();
 tags.invoke($("input[name='tagsInput']"));

 * @constructor
 */
// -- Just like tag input, press certain key and make it separated items and put it into a hidden with delimiter
// -- Press Enter then trim it
var LDTags = function() {
	this.delimiter = '|';
	this.value = {}; // -- hold values as object but its like array
	// -- All jq Objects
	this.obj = null;
	this.template = null;
	this.view = null;
	this.result = null;
};

LDTags.prototype.invoke = function(JQObject) {
	var me = this;
	this.obj = JQObject;
	this.obj.off('keypress').on('keypress', function(e) {
		if(13 == e.keyCode) {
			e.preventDefault();
			me.eventInvoked();
			return false;
		}
	});

	// -- data-template - JQ
	var template = this.obj.attr('data-template');
	if(template && 0 < template.length) {
		this.template = _.template($(template).html());
	} else {
		console.error('Invalid data-template');
	}

	// -- data-view - JQ
	var view = this.obj.attr('data-view');
	if(view && 0 < view.length) {
		this.view = $(view);
	} else {
		console.error('Invalid data-view');
	}

	// -- data-name - just name
	var name = this.obj.attr('data-name');
	if(name && 0 < name.length) {
		this.obj.parent().append('<input type="hidden" name="' + name + '" />');
		this.result = this.obj.parent().find('input[name="' + name + '"]');
	} else {
		console.error('Invalid data-name');
	}

	// -- Default value
};

LDTags.prototype.eventInvoked = function() {
	var me = this;
	var val = $.trim(this.obj.val());
	if(0 == val.length)
		return;

	// -- Add value
	me.addValue(val);

	// -- Clean it
	this.obj.val('');
};

LDTags.prototype.addValue = function(val) {
	var me = this;

	// -- Has?
	if(_.has(this.value, val)) {
		return false;
	}

	this.value[val] = true;

	var data = _.keys(this.value).join(this.delimiter);
	me.result.val(data);

	// -- add View
	var result = me.template({ input: val, k: val, v: val });
	me.view.append(result);
	me.view.find('.onClickTags').off('click').click(function() {
		var self = $(this);
		var val = self.attr('data-value');
		me.removeValue(val);
	});

};

LDTags.prototype.removeValue = function(val) {
	var me = this;
	if(!_.has(this.value, val)) {
		return false;
	}

	// -- Remove from the value
	delete this.value[val];

	// -- Update value
	var data = _.keys(this.value).join(this.delimiter);
	me.result.val(data);

	// -- Remove view
	me.view.find('.onClickTags').each(function() {
		var self = $(this);
		if(val == self.attr('data-value'))
			self.remove();
	});
};

$.fn.LDTags = function() {
	var tags = new LDTags();
	tags.invoke(this);
	return tags;
};

/**
 * 카테고리 입력용
 * Checkbox 혹은 custom 기능의 click 이벤트로 대상의 value를 넣었다 뺏다 하는 기능
 * data-custom 은 옵션
 * checkbox 형태로 쓸때는 custom이 필요 없음
 *
 * .LDCategoriesCustom 의 클릭 이벤트
 * .LDCategories 의 onchange 이벤트
 * 위 두 이벤트에 반응하게 되어있다
 * off 이벤트는 하지 않음
 *
 * array 형태로 넣지 않고 delimiter를 사용한다
 *

 * html
 <input type="text" name="categories" data-template="#templateCategories" data-kv='["fashion", "beauty", "hello", "austin"]' data-view="#areaCategories" data-custom="pilarCheck"/>
 <div id="areaCategories"></div>

 * Template
 <script type="text/html" id="templateCategories">
 <a class="btn mb--1 LDCategoriesCustom" href="javascript:;" data-value="<%= k %>">
 <span class="btn__text"><%= v %></span>
 </a>
 </script>

 * Custom object
 var pilarCheck = {
		isChecked: function(JQObj) {
			return JQObj.hasClass('btn--primary');
		},

		setChecked: function(JQObj, checked) {
			if(checked)
				JQObj.addClass('btn--primary');
			else
				JQObj.removeClass('btn--primary');
		},

		// -- you may set check if its necessary
		onClick: function(JQObj) {
			this.setChecked(JQObj, !this.isChecked(JQObj));
		},

		// -- onchange event when status already changed
		onChange: function(JQObj) {

		}
	};

 * category object and function
 var categories = $("input[name='categories']").LDCategories();
 categories.setChecked(['fashion', 'hello']);
 categories.setChecked(['fashion'], false);

 * @constructor
 */
var LDCategories = function(options) {
	this.CLASS_CHECKBOX = 'LDCategories';
	this.CLASS_CUSTOM = 'LDCategoriesCustom';
	this.DELIMITER = '|';

	this.options = options;
	this.obj = null;

	this.template = null; // -- underscore template
	this.source = null; // -- array []
	this.view = null; // -- JQObj
	this.result = null; // -- JQObj where result input.val will be
	this.custom = null; // -- object name

	this.mapSelected = {};
};

// -- Init
LDCategories.prototype.invoke = function(JQObj) {
	this.obj = JQObj;

	this.template = this.obj.attr('data-template');
	this.kv = this.obj.attr('data-kv');
	this.view = this.obj.attr('data-view');
	this.custom = this.obj.attr('data-custom');

	LDAssert.notEmpty(this.template, 'Invalid template');
	LDAssert.notEmpty(this.kv, 'Invalid key value');
	LDAssert.notEmpty(this.view, 'Invalid view');

	this.template = _.template($(this.template).html());
	this.kv = LDAttr.parseKV(this.kv);
	this.view = $(this.view);
	this.result = JQObj;
	if(this.custom) {
		this.custom = eval(this.custom);
	}

	LDAssert.notEmpty(this.kv, 'Invalid KV list, list should be at least one element');

	this.refreshButtons();
};

// -- Create button view
LDCategories.prototype.refreshButtons = function() {
	var me = this;

	var str = '';
	_.each(this.kv, function(d) {
		str = str + me.template(d);
	});

	this.view.empty().append(str);

	// -- original Checkbox type
	this.view.find('.' + this.CLASS_CHECKBOX).off('change').change(function() {
		var self = $(this);
		if(self.is(':checked')) {
			me.addValue(self.val());
		} else {
			me.removeValue(self.val());
		}
	});

	// -- custom type, click event,
	this.view.find('.' + this.CLASS_CUSTOM).click(function() {
		var self = $(this);

		me.custom.setChecked(self, !me.custom.isChecked(self));

		// -- status may not be changed when its clicked
		setTimeout(function() {
			if(me.custom.isChecked(self)) {
				me.addValue(self.attr('data-value'));
			} else {
				me.removeValue(self.attr('data-value'));
			}

			// -- Just give event
			if(me.custom.onChange)
				me.custom.onChange(self);
		}, 10);
	});
};

LDCategories.prototype.addValue = function(val) {
	if(this.mapSelected.hasOwnProperty(val)) {
		return false;
	}

	this.mapSelected[val] = true;

	this.refreshResultValue();
};

LDCategories.prototype.removeValue = function(val) {
	if(!this.mapSelected.hasOwnProperty(val)) {
		return false;
	}

	delete this.mapSelected[val];

	this.refreshResultValue();
};

LDCategories.prototype.refreshResultValue = function() {
	var value = _.keys(this.mapSelected).join(this.DELIMITER);
	this.result.val(value);
};

// -- Select it after init
LDCategories.prototype.setChecked = function(list, checked) {
	var me = this;

	// -- Default true
	if('undefined' == typeof checked) {
		checked = true;
	}

	LDAssert.notEmpty(list, 'LDCategories.select Empty list');

	var mapList = {};
	_.each(list, function(d) {
		mapList[d] = true;
	});

	// -- Checkbox
	if(!this.custom) {
		this.view.find('.' + this.CLASS_CHECKBOX).each(function() {
			var self = $(this);
			var value = self.val();
			if(mapList.hasOwnProperty(value)) {
				self.prop('checked', checked);

				if(checked) {
					me.addValue(value);
				} else {
					me.removeValue(value);
				}
			}
		});
	} else {
		// -- Custom type
		this.view.find('.' + this.CLASS_CUSTOM).each(function() {
			var self = $(this);
			var value = self.attr('data-value');
			if(mapList.hasOwnProperty(value)) {
				me.custom.setChecked(self, checked);

				if(checked) {
					me.addValue(value);
				} else {
					me.removeValue(value);
				}
			}
		});
	}
};

$.fn.LDCategories = function(options) {
	var categories = new LDCategories(options);
	categories.invoke(this);
	return categories;
};

var LDRadio = function(options) {
	this.CLASS_CUSTOM = 'LDRadio';

	this.options = options;
	this.obj = null;

	this.template = null; // -- underscore template
	this.source = null; // -- array []
	this.view = null; // -- JQObj
	this.result = null; // -- JQObj where result input.val will be
	this.custom = null; // -- object name
};

// -- Init
LDRadio.prototype.invoke = function(JQObj) {
	this.obj = JQObj;

	this.template = this.obj.attr('data-template');
	this.kv = this.obj.attr('data-kv');
	this.view = this.obj.attr('data-view');
	this.custom = this.obj.attr('data-custom');

	LDAssert.notEmpty(this.template, 'Invalid template');
	LDAssert.notEmpty(this.kv, 'Invalid KeyValue');
	LDAssert.notEmpty(this.view, 'Invalid view');

	this.template = _.template($(this.template).html());
	this.kv = LDAttr.parseKV(this.kv);
	this.view = $(this.view);
	this.result = JQObj;
	if(this.custom) {
		this.custom = eval(this.custom);
	}

	LDAssert.notEmpty(this.kv, 'Invalid Key Value list, list should be at least one element');

	this.refreshButtons();
};

// -- Create button view
LDRadio.prototype.refreshButtons = function() {
	var me = this;

	var str = '';
	_.each(this.kv, function(d) {
		str = str + me.template(d);
	});

	this.view.empty().append(str);

	// -- custom type, click event,
	this.view.find('.' + this.CLASS_CUSTOM).click(function() {
		var self = $(this);

		var value = self.attr('data-value');

		me.setChecked(value);

		// -- Just give event
		if(me.custom.onChange)
			me.custom.onChange(self);
	});
};

LDRadio.prototype.setValue = function(val) {
	this.result.val(val);
};

// -- Select it after init
LDRadio.prototype.setChecked = function(name) {
	var me = this;

	// -- Custom type
	this.view.find('.' + this.CLASS_CUSTOM).each(function() {
		var self = $(this);
		var value = self.attr('data-value');
		if(name == value) {
			me.custom.setChecked(self, true);
			me.setValue(name);
		} else {
			me.custom.setChecked(self, false);
		}
	});
};

$.fn.LDRadio = function(options) {
	var radio = new LDRadio(options);
	radio.invoke(this);
	return radio;
};
