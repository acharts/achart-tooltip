/**
 * @fileOverview 提示信息
 * @ignore
 */


var 
	PlotItem = require('achart-plot').Item,
	Util = require('achart-util'),
	CLS_TITLE = 'ac-title',
	CLS_LIST = 'ac-list';

var max = Math.max;

function getElementsByClassName(dom,cls){
	var els = dom.getElementsByTagName('*');
  var ell = els.length;
  var elements=[];
  for(var n=0;n<ell;n++){
    var oCls=els[n].className||'';
    if(oCls.indexOf(cls)<0)        
    	continue;
    oCls=oCls.split(/\s+/);
    var oCll=oCls.length;
    for(var j=0;j<oCll;j++){
      if(cls==oCls[j]){
        elements.push(els[n]);
        break;
      }
    }
  }
  return elements;
}

function find(dom,cls){
	if(dom.getElementsByClassName){
		return dom.getElementsByClassName(cls)[0];
	}
	return getElementsByClassName(dom,cls)[0];
}


/**
 * @class Chart.Tooltip
 * 提示信息
 * @extends Chart.PlotItem
 */
var Tooltip = function(cfg){
	Tooltip.superclass.constructor.call(this,cfg);
};

Tooltip.ATTRS = {
	zIndex : 10,
	elCls : 'x-chart-tootip',

	itemName : 'tootip',
	/**
	 * 是否贯穿整个坐标轴
	 * @type {Boolean}
	 */
	crosshairs : false,
	/**
	 * 视图范围
	 * @type {Object}
	 */
	plotRange : null,
	/**
	 * 多个数据序列是否共同用一个tooltip
	 * @type {Boolean}
	 */
	shared : false,
	/**
	 * x轴上，移动到位置的偏移量
	 * @type {Number}
	 */
	offset : 0,
	/**
	 * 标题的配置信息
	 * @type {Object}
	 */
	title : {
			'font-size' : '10',
			'text-anchor' : 'start',
			x : 5,
			y : 15
	},
	/**
	 * 数据序列名称的配置信息
	 * @type {Object}
	 */
	name : {
		'font-size' : '12',
		'text-anchor' : 'start'
	},
	/**
	 * 当前值的文本配置信息
	 * @type {String}
	 */
	value : {
			'font-size' : '12',
			'font-weight' :'bold',
			'text-anchor' : 'start'
	},
	/**
	 * 边框的配置项
	 * @type {Object}
	 */
	border : {
			x : 0,
			y : 0,
			r : 3,
			fill : '#fff',
			'fill-opacity' : .85
	},
	animate : true,
	/**
	 * 移动的动画时间
	 * @type {Number}
	 */
	duration : 100,
	/**
	 * 用于格式化数据序列时使用
	 * @deprecated 迁移到series中
	 * @type {Function}
	 */
	pointRenderer : null,
	/**
	 * 跟在value后面的后缀
	 * @type {String}
	 */
	valueSuffix : '',

	/**
	 * 存在多个值时的分隔符
	 * @type {String}
	 */
	valueSplit : ' ',
	
	visible : false,

	/**
	 * 是否自定义tooltip，此时不使用svg,使用一个absolute的div
	 * @type {Boolean}
	 */
	custom : false,

	/**
	 * 自定义的tooltip是否跟随显示隐藏、移动
	 * @type {Boolean}
	 */
	customFollow : true,

	/**
	 * 使用html时的外层模板
	 * @type {String}
	 */
	html : '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><h4 class="' + CLS_TITLE + '"></h4><ul class="' + CLS_LIST + '"></ul></div>',
		
	/**
	 * 使用html时，单个选项的模板
	 * @type {String}
	 */
	itemTpl : '<li><span style="color:{color}">{name}</span> : {value}</li>',
	
	/**
	 * 显示的选项，每个选项分为 name 和 value
	 * @type {Array}
	 */
	items : [

	],
	/**
	 * @crosshairs 线的颜色
	 * @type {Object}
	 */
	crossLine: {
		stroke : "#C0C0C0"
	}
};

Util.extend(Tooltip,PlotItem);


Util.augment(Tooltip,{

	renderUI : function(){
		var _self = this,
			custom = _self.get('custom');

		Tooltip.superclass.renderUI.call(_self);
		if(!custom){
			_self._renderBorer();
			_self._renderText();
			_self._renderItemGroup();
		}else{
			_self._renderCustom();
		}
		_self._renderCrossLine();

	},
	//渲染边框
	_renderBorer : function(){
		var _self = this,
			bbox = _self.getBBox(),
			rect = _self.addShape('rect',_self.get('border'));
		_self.set('borderShape',rect);
	},
	//渲染文本
	_renderText : function(){
		var _self = this,
			title = _self.get('title');

		title && _self.setTitle(title.text);

	},
	_renderCustom : function(){
		var _self = this,
			html = _self.get('html'),
			outterNode = _self.get('canvas').get('node').parentNode,
			customDiv
		if(/^\#/.test(html)){
			var id = html.replace('\#','');
			customDiv = document.getElementById(id);
		}else{
			customDiv = Util.createDom(html);
		}
		if(_self.get('customFollow')){
			outterNode.appendChild(customDiv);
			outterNode.style.position = 'relative';
		}
		_self.set('customDiv',customDiv);

		var items = _self.get('items');
		Util.each(items,function(item,index){
			_self.addCustomItem(item,index);
		});
	},
	//渲染文本集合
	_renderItemGroup : function(){
		var _self = this,
			items = _self.get('items'),
			titleShape = _self.get('titleShape'),
			cfg = {
				x : 8,
				y : 10
			},
			group;

		if(titleShape){
			cfg.y += 20;
		}
		group = _self.addGroup(cfg);
		_self.set('textGroup',group);
		if(items){
			_self.setItems(items);
		}
	},
	//渲染贯穿纵坐标的线
	_renderCrossLine : function(){
		var _self = this,
			crosshairs = _self.get('crosshairs'),
			shape,
			canvas = _self.get('canvas'),
			plotRange = _self.get('plotRange');

		if(crosshairs){
			var y1,
				y2;
			if(plotRange){
				y1 = plotRange.bl.y;
				y2 = plotRange.tl.y;
			}else{
				y1 = canvas.get('height');
				y2 = 0;
			}
			shape = _self.get('parent').addShape({
				type : 'line',
				visible : false,
				zIndex : 3,
				attrs : {
					stroke : _self.get('crossLine').stroke,
					x1 : 0,
					y1 : y1,
					x2 : 0,
					y2 : y2
				}
			});

			_self.set('crossShape',shape);
		}
	},
	/**
	 * 设置title
	 * @param {String} title 标题
	 */
	setTitle : function(text){
		var _self = this,
			titleShape,
			title = _self.get('title'),
			custom = _self.get('custom'),
			cfg;
		if(!title){
			return;
		}
		_self.set('titleText',text);
		if(custom){
			var customDiv = _self.get('customDiv'),
				titleDom = find(customDiv,CLS_TITLE);
			if(titleDom){
				titleDom.innerHTML = text;
			}
			return;
		}

		titleShape = _self.get('titleShape');
		if(!titleShape){
			title.text = text || '';
			title['text-anchor'] = "start";
			titleShape = _self.addShape('text',title);
			_self.set('titleShape',titleShape);
		}
		titleShape.attr('text',text);
	},
	getInnerBox : function(){
		var _self = this,
			rst = {};
		
		var	textGroup = _self.get('textGroup'),
			titleShape = _self.get('titleShape'),
			bbx = textGroup.getBBox(),
			
			width = bbx.width;
		if(titleShape){
			var tbox = titleShape.getBBox();
			width = Math.max(width,tbox.width);
		}
		rst.width = bbx.x + width + 8;
		rst.height = bbx.height + bbx.y + 8;
		/*if(tbox){
			rst.height += tbox.height;
		}*/
		return rst;
	},
	/**
	 * 设置颜色
	 * @param {String} color 颜色
	 */
	setColor : function(color){
		var _self = this,
			borderShape = _self.get('borderShape'),
			customDiv = _self.get('customDiv');
		borderShape && borderShape.attr('stroke',color);
		if(customDiv){
			customDiv.style.borderColor = color;
		} 
	},
	/**
	 * 显示
	 */
	show : function(){
		var _self = this,
			crossShape = _self.get('crossShape'),
			customDiv = _self.get('customDiv'),
			hideHandler = _self.get('hideHandler');
		if(hideHandler){
			clearTimeout(hideHandler);
		}
		
		Tooltip.superclass.show.call(_self);
		if(customDiv && _self.get('customFollow')){
			customDiv.style.visibility = 'visible';
		}
		_self.fireUp('tooltipshow',_self.getEventObj());
		crossShape && crossShape.show();
	},
	/**
	 * 隐藏
	 */
	hide : function(){
		var _self = this,
			customDiv = _self.get('customDiv'),
			crossShape = _self.get('crossShape');

		var hideHandler = setTimeout(function(){
			_self.fireUp('tooltiphide',_self.getEventObj());
			if(customDiv && _self.get('customFollow')){
				customDiv.style.visibility = 'hidden';
			}
			Tooltip.superclass.hide.call(_self);
			_self.set('hideHandler',null);
		},_self.get('duration'));
		_self.set('hideHandler',hideHandler);
		crossShape && crossShape.hide();
	},

	/**
	 * 将tooltip的右下角移动到指定的位置，假设这个点已经在坐标轴内
	 *
	 *  - 默认移动到右下角
	 *  - 如果左边到了坐标轴外，则将tooltip向右移动，按照右下角对齐
	 *  - 如果右边到了坐标轴外，则左移,将右下边放到坐标轴边界上
	 *  - 下面，上面出了坐标轴，做类似处理
	 * @param {Number} x x坐标
	 * @param {Number} y y坐标
	 */
	setPosition : function(x,y){
		var _self = this,
			plotRange = _self.get('plotRange'),
			offset = _self.get('offset'),
			crossShape = _self.get('crossShape'),
			bbox = _self.getBBox(),
			customDiv = _self.get('customDiv'),
			after = true,
			animate = _self.get('animate'); //移动点落到tooltip的后面

		var endx = x,
			endy = y;

		x = x - bbox.width - offset;
		y = y - bbox.height;
		if(customDiv && _self.get('customFollow')){
			var paddingLeft = parseFloat(Util.getStyle(customDiv,'paddingLeft')) || 0;
			x = x - Util.getOuterWidth(customDiv) + paddingLeft;
		}
		if(plotRange){

			if(!plotRange.isInRange(x,y)){
				//如果顶部在外面
				if(!plotRange.isInVertical(y)){
					y = plotRange.tl.y;
				}

				if(!plotRange.isInHorizontal(x)){
					x = max(plotRange.tl.x,endx) + offset;
					after = false;
				}
			}
		}

		if(_self.get('x') != x || _self.get('y') != y){
			if(animate && Util.svg && _self.get('visible')){
				_self.animate({
					x : x,
					y : y
				},_self.get('duration'));
			}

			_self.move(x,y);/**/
			_self.moveCustom(x,y);

			if(crossShape){
				if(after){
					crossShape.attr('transform','t' + endx + ' 0');
				}else{
					crossShape.attr('transform','t' + (x - offset) + ' 0');
				}
			}
		}
	},
	//重置边框大小
	resetBorder : function(){
		var _self = this,
			bbox = _self.getInnerBox(),
			borderShape = _self.get('borderShape');

		borderShape.attr({
			width : bbox.width,
			height : bbox.height
		});
	},
	moveCustom : function(x,y){
		var _self = this,
			customDiv = _self.get('customDiv');
		if(customDiv && _self.get('customFollow')){
			var 
				pTop = parseFloat(Util.getStyle(customDiv,'paddingTop')),
				bTop = parseFloat(Util.getStyle(customDiv,'borderTopWidth')) || 0,
				pLeft = parseFloat(Util.getStyle(customDiv,'paddingLeft')),
				bLeft = parseFloat(Util.getStyle(customDiv,'borderLeftWidth')) || 0;
			customDiv.style.left = (x - bLeft - pLeft ) + 'px';
			customDiv.style.top = (y - bTop - pTop) + 'px';
		}
	},
	//添加自定义项
	addCustomItem : function(item,index){
		item.index = index;
		var _self = this,
			customDiv = _self.get('customDiv'),
			listDom = find(customDiv,CLS_LIST),
			itemTpl = _self.get('itemTpl'),
			str = Util.substitute(itemTpl,item),
			node = Util.createDom(str);
		listDom.appendChild(node);
	},
	/**
	 * @private
	 * 添加一条信息
	 */
	addItem : function(item,index){
		var _self = this,
			textGroup = _self.get('textGroup'),
			group = textGroup.addGroup(),
			name = _self.get('name'),
			value = _self.get('value'),
			y = index * 16,
			cfg,
			nameShape,
			width = 0;
		if(name){
			cfg = Util.mix({},name,{
				x : 0,
				y : y,
				text : item.name + ':',
				'fill' : item.color
			});
			nameShape =	group.addShape('text',cfg);
			width = nameShape.getBBox().width + 10;
		}
		
	  var valueSuffix = item.suffix ||  _self.get('valueSuffix'),
	  	itemValue;
	  if(Util.isArray(item.value)){
	  	Util.each(item.value,function(sub){
	  		var subItem
	  		if(Util.isObject(sub)){
	  			subItem = addValue(sub.text,sub);
	  		}else{
	  			subItem = addValue(sub);
	  		}
	  		width = width + subItem.getBBox().width;
	  	});
	  }else{
	  	itemValue = valueSuffix ? item.value + _self.get('valueSplit') + valueSuffix : item.value;
	  	addValue(itemValue);
	  }

	  function addValue (text,params){
	  	var cfg = Util.mix({},value,{
				x : width,
				y : y,
				text : text
			},params);
		  return group.addShape('text',cfg);
	  }
	},
	/**
	 * 设置显示的信息项
	 *
	 * - name : 序列的标题
	 * - value : 序列的值
	 * - color : 序列的颜色
	 *
	 * @param {Array} items 信息列表
	 */
	setItems : function(items){
		var _self = this,
			custom = _self.get('custom');

			_self.clearItems();
			Util.each(items,function(item,index){
				if(custom){
					_self.addCustomItem(item,index);
				}else{
					_self.addItem(item,index);
				}
			});
			if(items[0]){
				_self.setColor(items[0].color);
			}
			if(!custom){
				_self.resetBorder();
			}
			if(_self.get('items') != items){
				_self.set('items',items);
				_self.onChange();
			}
	},
	onChange : function(){
		this.fireUp('tooltipchange',this.getEventObj());
	},
	getEventObj :function(){
		var _self = this;
		return {
			title : _self.get('titleText'),
			items : _self.get('items'),
			dom : _self.get('customDiv'),
			tooltip : _self
		};
	},
	/**
	 * 清除所有的信息
	 */
	clearItems : function(){
		var _self = this,
			group = _self.get('textGroup'),
			customDiv = _self.get('customDiv');
		group && group.clear();
		if(customDiv){
			var listDom = find(customDiv,CLS_LIST);
			if(listDom){
				listDom.innerHTML = '';
			}
			
		}
	},
	remove : function(){
		var _self = this,
			crossShape = _self.get('crossShape'),
			customDiv = _self.get('customDiv');
		crossShape && crossShape.remove();
		Tooltip.superclass.remove.call(this);
		if(customDiv){
			customDiv.parentNode.removeChild(customDiv);
		}
	}

});

module.exports = Tooltip;
