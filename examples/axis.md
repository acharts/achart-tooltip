# 坐标轴中

----


在坐标轴中显示

----

### 使用plotRange
````html
<p>鼠标滑动显示tooltip</p>

<div id="c1"></div>

````

````javascript
seajs.use(['index','achart-canvas','achart-plot','achart-axis'], function(Tooltip,Canvas,Plot,Axis) {
  var canvas = new Canvas({
    id : 'c1',
    elCls : 'bordered',
    width : 800,
    height : 500
  });
  var plotRange = new Plot.Range({x : 50,y : 450},{x : 750, y : 50}),
    xAxis = canvas.addGroup(Axis.Category,{
      plotRange : plotRange,
      categories : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
      labels : {
        label : {
          y : 12
        }
      }
    });

  var yAxis = canvas.addGroup(Axis.Number,{
      plotRange : plotRange,
      line : null,
      tickLine : null,
      grid : {
        line : {
          stroke : '#c0c0c0'
        }
      },
      title : {
        text : 'xsxxxxx',
        font : '16px bold',
        fill : 'blue',
        rotate : 90,
        x : -30
      },
      min : -5,
      max : 30,
      position:'left',
      tickInterval : 5,
      labels : {
        label : {
          x : -12
        }
      }
    });

  var tooltip = canvas.addGroup(Tooltip,{
    plotRange : plotRange,
    title : {
      text : '这是测试title',
      'font-size' : '10',
        'text-anchor' : 'start',
        x : 8,
        y : 15
    },
    valueSuffix : 'millions',
    visible : true,
    items : [
      {
      color : '#2f7ed8',
      name : 'Asia',
      value : '635'
    },{
      color : '#0d233a',
      name : 'Africa',
      value : '107'
    }]
    
  });
  

  canvas.on('mouseover',function(){
    tooltip.show();
  });
  
  canvas.on('mouseout',function(){
    tooltip.hide();
  });
  
  canvas.on('mousemove',function(ev){

    var point = canvas.getPoint(ev.clientX,ev.clientY);

    tooltip.setTitle('('+ point.x + ',' + point.y+')');
    tooltip.setPosition(point.x,point.y);
  });

});
````