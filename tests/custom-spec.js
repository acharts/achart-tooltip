var 
    expect = require('expect.js'),
    sinon = require('sinon'),
    $ = require('jquery');

  var Canvas = require('achart-canvas'),
    Util = require('achart-util'),
    PlotRange = require('achart-plot').Range,
    Tooltip = require('../index');

  $('<div id="t3"></div>').prependTo('body');


describe('测试自定义 Tooltip',function(){

  var node = Util.createDom('<div id="t1"></div>');

  document.body.appendChild(node);

var canvas = new Canvas({
  id : 't3',
  width : 300,
  height : 300
});

var tooltip = canvas.addGroup(Tooltip,{
  x : 10,
  y : 10,
  plotRange : new PlotRange({x : 20,y :280},{x : 280,y : 20}),
  title : {
    text : '这是测试title'
  },
  custom : true,
  visible : true,
  crosshairs : true,
  valueSuffix : 'millions',
  items : [
    {color : 'red',name : 'name1',value : '1222333'},
    {color : 'blue',name : 'n2',value : '1233'},
    {color : 'yellow',name : 'name3',value : 'swww - afas'}
  ]
});


  var 
    customDiv = tooltip.get('customDiv')

  describe('自定义tooltip',function(){

    it('tooltip生成',function(){
      expect(customDiv).not.to.be(undefined);
      expect(customDiv.style.visibility).to.be('hidden');
    });

    it('测试cross线生成',function(){
      var line = tooltip.get('crossShape');
      expect(line).not.to.be(undefined);
    });


    it('show',function(){
      tooltip.show();
      expect(customDiv.style.visibility).to.be('visible');
    });

    it('hide',function(){
      tooltip.hide();
      expect(customDiv.style.visibility).to.be('visible');
    });

  });

  function getX(){
    var line = tooltip.get('crossShape'),
      transform = line.attr('transform');
    return transform[0][1];
  }

  describe('移动',function(){

    it('设置items',function(){
      tooltip.setTitle('test');
      tooltip.setItems([{name : 'test',value:122,color : 'red'}]);
      expect($(customDiv).find('.ac-title').text()).to.be('test');
      expect($(customDiv).find('.ac-list').children().length).to.be(1);
    });

    it('移动',function(){
      tooltip.show();
      tooltip.setPosition(100,100);
      expect(customDiv.style.left).to.be('100px');
    });

    it('移除',function(){
      tooltip.remove();
      expect($.contains(document.body,customDiv)).to.be(false);
    });

  });
});