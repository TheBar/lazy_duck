/**
 * Created by Administrator on 2016-12-12.
 */

/**
 * Lazyduck ui에 필요한 Radio 구성 파일, 프로젝트별로 구성해야한다.
 * Template 주의!
 */

var _projectRadio = {
	init: function(opts, parent) {
		if(opts.hasOwnProperty('template')) {
			opts.template = _.template(opts.template);
		} else {
			// -- Project default
			opts.template = _.template($('#templateGender2').html());
		}
	},

	setSelected: function(item, selected) {
		if(selected)
			item.addClass('box-selected');
		else
			item.removeClass('box-selected');
	},
	isSelected: function(item) {
		return item.hasClass('box-selected');
	}
};

// -- Override
var LDUIRadio = function(customOptions) {
	this.general = new LDUIGeneral();

	var options = _.extend(customOptions, _projectRadio, _thsBaseRadioOptions);
	this.radioOptions = options;
	this.general.invoke(this.radioOptions);
};

$.fn.LDUIRadio = function(options) {
	options.view = this;

	var radio = new LDUIRadio(options);
	return radio;
};
