# Demo

---

## Normal usage
<style>
  .bordered{
    border : 1px solid #ddd;
  }


</style>

````html
<p>鼠标滑动显示tooltip</p>

<div id="c1"></div>

````

````javascript
seajs.use(['index','achart-canvas'], function(Tooltip,Canvas) {
  var canvas = new Canvas({
    id : 'c1',
    elCls : 'bordered',
    width : 500,
    height : 500
  });

  var tooltip = canvas.addGroup(Tooltip,{
    title : {
      text : 'init title',
      x : 5,
      y : 15
    },
    crosshairs : true,
    offset : 10,
    items : [
      {color : 'red',name : 'name1',value : '1222333'},
      {color : 'blue',name : 'n2',value : '1233'},
      {color : 'yellow',name : 'name3',value : 'swww - afas'}
    ],
    visible : false
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

### 使用plotRange
````html
<p>鼠标滑动显示tooltip</p>

<div id="c2"></div>

````

````javascript
seajs.use(['index','achart-canvas','achart-plot'], function(Tooltip,Canvas,Plot) {
  var canvas = new Canvas({
    id : 'c2',
    elCls : 'bordered',
    width : 500,
    height : 500
  });
  var plotRange = new Plot.Range({x : 20,y : 480},{x : 480,y : 20});
  var tooltip = canvas.addGroup(Tooltip,{
    title : {
      text : 'init title'
    },
    plotRange : plotRange,
    crosshairs : true,
    offset : 10,
    items : [
      {color : 'red',name : 'name1',value : '1222333'},
      {color : 'blue',name : 'n2',value : '1233'},
      {color : 'yellow',name : 'name3',value : 'swww - afas'}
    ],
    visible : false
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

## 使用自定义 html

````html
<p>鼠标滑动显示tooltip</p>
<style>
  .ac-tooltip{
    border: 1px solid #efefef;
    padding: 10px;
  }
  .ac-title{
    margin: 0;
  }

  .ac-list{
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
<div id="c3"></div>

````

````javascript
seajs.use(['index','achart-canvas'], function(Tooltip,Canvas) {
  var canvas = new Canvas({
    id : 'c3',
    elCls : 'bordered',
    width : 500,
    height : 500
  });

  var tooltip = canvas.addGroup(Tooltip,{
    title : {
      text : 'init title'
    },
    crosshairs : true,
    custom : true,
    offset : 10,
    items : [
      {color : 'red',name : 'name1',value : '1222333'},
      {color : 'blue',name : 'n2',value : '1233'},
      {color : 'yellow',name : 'name3',value : 'swww - afas'}
    ],
    visible : false
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

## 更改模板

````html
<div id="c4"></div>

````

````javascript
seajs.use(['index','achart-canvas'], function(Tooltip,Canvas) {
  var canvas = new Canvas({
    id : 'c4',
    elCls : 'bordered',
    width : 500,
    height : 500
  });

  var tooltip = canvas.addGroup(Tooltip,{
    title : {
      text : 'init title'
    },
    crosshairs : true,
    custom : true,
    offset : 10,
    itemTpl : '<li>{index} - <strong style="color:{color}">name</strong>:<span>{value}</span></li>',
    items : [
      {color : 'red',name : 'name1',value : '1222333'},
      {color : 'blue',name : 'n2',value : '1233'},
      {color : 'yellow',name : 'name3',value : 'swww - afas'}
    ],
    visible : false
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


