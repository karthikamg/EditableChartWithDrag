$(document).ready(function(){
    var selectedType = '';
    var driverState = ['ON_DUTY', 'DRIVING', 'OFF_DUTY', 'SLEEPING'];
    var driverStatusPoint = {0: 158, 1: 123, 2: 54, 3: 88 };
    var gameBoard = {
  createBoard: function(dimension, mount) {
    var mount = document.querySelector(mount);
    var initialXVal = 0;
    if (!dimension || isNaN(dimension) || !parseInt(dimension, 10)) {
      return false;
    } else {
      dimension = typeof dimension === 'string' ? parseInt(dimension, 10) : dimension;
      var idenNum = 1;
      $('#editable-chart').append('<div class="table"></div>');
      for(var k = 1; k < 5; k++) {
          $('.table').append('<div class="custom-row"></div>');
          for(i = 1; i <= 24; i++) {
              $('.table .custom-row:last-child').append('<div class="inlineelms inlineelms_'+i+'"></div>');
              for(j = 1; j < 61; j++) {
                    if(idenNum > 1440) idenNum = 1;
                    $('.table .custom-row:last-child .inlineelms_'+i).append('<div class="elm" id="elm_'+j+'" key="'+idenNum+'"></div>');
                    idenNum++;
              }
              // for(j = 1; j < 1441; j++) {
              //       $('.table .custom-row:last-child').append('<div class="elm" id="elm_'+j+'" key="'+j+'"></div>');
              //       idenNum++;
              // }
          };
      }
      output = gameBoard.enumerateBoard($('.table'));
    }

    $.each($('.custom-row'), function(key, element){
        var $elm = $(element);
        for(var i = 1; i <= 24; i++) {
            var $innerElm = $elm.find('.inlineelms_'+i+'');
            for(var j = 1; j <= 60; j++) {
                var el = $innerElm.find("#elm_"+j+"");
                if(j == 0)
                    initialXVal = el.position().left;
                var actualX = el.position().left;
                var x = el.position().left - actualX;
                var y = el.position().top;
                // el.attr({'x': x, 'y': y, 'xToPlot': actualX, 'actualX': (Math.ceil(actualX - initialXVal) - 100)});
                el.attr({'x': x, 'y': y, 'xToPlot': (actualX), 'actualX': Math.ceil(actualX - initialXVal)});
            }
        }
    });

    // $.each($('.custom-row'), function(key, element){
    //     var $elm = $(element);
    //     for(var j = 1; j <= 1440; j++) {
    //         var el = $elm.find("#elm_"+j+"");
    //         if(j == 0)
    //             initialXVal = el.position().left;
    //         var actualX = el.position().left;
    //         var x = el.position().left - actualX;
    //         var y = el.position().top;
    //         el.attr({'x': x, 'y': y, 'xToPlot': actualX, 'actualX': (actualX - 28)});
    //     }
    // });

    for(var i = 30; i < 1440; i = i + 30) {
        if(i % 60 !== 0)
            $('.custom-row [key="'+i+'"]').removeClass('smaller-sub-division').addClass('bigger-sub-division');
    }
    for(var i = 15; i < 1440; i = i + 15) {
        if(i % 60 !== 0 && i % 30 !== 0)
            $('.custom-row [key="'+i+'"]').removeClass('bigger-sub-division').addClass('smaller-sub-division');
    }
    for(var i = 60; i < 1440; i = i + 60) {
        if(i % 60 == 0)
            $('[key="'+i+'"]').addClass('bigger-division');
    }


    //ON = 0
    //D = 1
    //SB = 2
    //OFF = 3

    //0 - 300 - > 3
    //300-765 -> 0
    //765 - 810 -> 3
    //810 - 1020 -> 1
    //1020 - 1140 -> 0
    //1140 - 1440 -> 3

    //generating json file
    var jsonArr = [];
    for(var j = 0; j < 150; j++) {
        var jsonObj = {};
        jsonObj["driverState"] = "OFF_DUTY",
        jsonObj["minutesFrom"] = 0,
        jsonObj["minutesTo"] = j,
        jsonObj["location"] = "",
        jsonObj["note"] = "",
        jsonObj["entryId"] = 0
        jsonArr.push(jsonObj);
    }
    for(var j = 150; j < 960; j++) {
        var jsonObj = {};
        jsonObj["driverState"] = "ON_DUTY",
        jsonObj["minutesFrom"] = 150,
        jsonObj["minutesTo"] = j,
        jsonObj["location"] = "",
        jsonObj["note"] = "",
        jsonObj["entryId"] =  1
        jsonArr.push(jsonObj);
    }
    for(var j = 960; j < 1024; j++) {
        var jsonObj = {};
        jsonObj["driverState"] ="OFF_DUTY",
        jsonObj["minutesFrom"] = 960,
        jsonObj["minutesTo"] = j,
        jsonObj["location"] = "",
        jsonObj["note"] = "",
        jsonObj["entryId"] = 2
        jsonArr.push(jsonObj);
    }
    for(var j = 1024; j < 1200; j++) {
        var jsonObj = {};
        jsonObj["driverState"] ="SLEEPING",
        jsonObj["minutesFrom"] = 1024,
        jsonObj["minutesTo"] = j,
        jsonObj["location"] = "",
        jsonObj["note"] = "",
        jsonObj["entryId"] = 3
        jsonArr.push(jsonObj);
    }
    for(var j = 1200; j < 1300; j++) {
        var jsonObj = {};
        jsonObj["driverState"] ="ON_DUTY",
        jsonObj["minutesFrom"] = 1200,
        jsonObj["minutesTo"] = j,
        jsonObj["location"] = "",
        jsonObj["note"] = "",
        jsonObj["entryId"] = 4
        jsonArr.push(jsonObj);
    }
    for(var j = 1300; j < 1440; j++) {
        var jsonObj = {};
        jsonObj["driverState"] ="OFF_DUTY",
        jsonObj["minutesFrom"] = 1300,
        jsonObj["minutesTo"] = j,
        jsonObj["location"] = "",
        jsonObj["note"] = "",
        jsonObj["entryId"] = 5
        jsonArr.push(jsonObj);
    }

    var previousState = '', previousFrom = '';
    $.each(jsonArr, function(key, value){
        var statusIndex = $.inArray(value.driverState, driverState);
        $('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+(value.minutesTo)+'"]').attr('xToPlot'))+'px;top: '+driverStatusPoint[statusIndex]+'px"></div>');
        if(previousState.length == 0) {
            previousState = value.driverState;
            previousFrom = value.minutesFrom;
        }
        else {
            if(previousState !== value.driverState) {
                $('.table').append('<div class="driverStateSelector">'+previousState+'</div>');
                $('.table .driverStateSelector:last-child').attr({'data-right':($('.elm[key="'+(value.minutesTo)+'"]').attr('xToPlot')),
                'data-left': (previousFrom == 0 ? 24 : ($('.elm[key="'+(previousFrom)+'"]').attr('xToPlot')))});
                var toLimit = driverStatusPoint[$.inArray(previousState, driverState)],
                    fromLimit = driverStatusPoint[statusIndex];
                if(toLimit < fromLimit) {
                    for(var i = fromLimit; i > toLimit; i--) {
                        $('#editable-chart').append('<div class="pointY" style="top:'+(i - 1)+'px;left: '+(parseInt($('[key="'+(value.minutesTo)+'"]').attr('xToPlot')) + 2)+'px"></div>')
                    }
                } else {
                    for(var i = toLimit; i > fromLimit; i--) {
                        $('#editable-chart').append('<div class="pointY" style="top:'+(i - 1)+'px;left: '+(parseInt($('[key="'+(value.minutesTo)+'"]').attr('xToPlot')) + 2)+'px"></div>')
                    }
                }
                previousState = value.driverState;
                previousFrom = value.minutesFrom;
            }
        }
    });
    $('.table').append('<div class="driverStateSelector"><div>'+jsonArr[jsonArr.length-1]['minutesFrom']+' - '+jsonArr[jsonArr.length-1]['minutesTo']+'</div><div>'+jsonArr[jsonArr.length-1]['driverState']+'</div></div>');
    $('.table .driverStateSelector:last-child').attr({'data-right':($('.elm[key="'+(jsonArr[jsonArr.length-1]['minutesTo'])+'"]').attr('xToPlot')),
    'data-left': (previousFrom == 0 ? 24 : ($('.elm[key="'+(previousFrom)+'"]').attr('xToPlot')))});

    //x
    // for(var i = 300; i > 0; i--) {$('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+i+'"]').attr('xToPlot'))+'px;top: 157px"></div>')};
    // for(var i = 765; i > 300; i--) {$('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+i+'"]').attr('xToPlot'))+'px;top: 107px"></div>')};
    // for(var i = 810; i > 765; i--) {$('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+i+'"]').attr('xToPlot'))+'px;top: 157px"></div>')};
    // for(var i = 1020; i > 810; i--) {$('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+i+'"]').attr('xToPlot'))+'px;top: 57px"></div>')};
    // for(var i = 1140; i > 1020; i--) {$('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+i+'"]').attr('xToPlot'))+'px;top: 107px"></div>')};
    // for(var i = 1440; i > 1140; i--) {$('#editable-chart').append('<div class="point" style="left:'+($('.elm[key="'+i+'"]').attr('xToPlot'))+'px;top: 157px"></div>')};

    //y
    // for(var i = 158; i > 54; i--) {$('#editable-chart').append('<div class="pointY" style="top:'+i+'px;left: '+(parseInt($('[key="300"]').attr('xToPlot')) + 2)+'px"></div>')};
    // for(var i = 155; i > 105; i--) {$('#editable-chart').append('<div class="pointY" style="top:'+i+'px;left: '+(parseInt($('[key="765"]').attr('xToPlot')) + 2)+'px"></div>')};
    // for(var i = 155; i > 55; i--) {$('#editable-chart').append('<div class="pointY" style="top:'+i+'px;left: '+(parseInt($('[key="810"]').attr('xToPlot')) + 2)+'px"></div>')};
    // for(var i = 105; i > 55; i--) {$('#editable-chart').append('<div class="pointY" style="top:'+i+'px;left: '+(parseInt($('[key="1020"]').attr('xToPlot')) + 2)+'px"></div>')};
    // for(var i = 155; i > 105; i--) {$('#editable-chart').append('<div class="pointY" style="top:'+i+'px;left: '+(parseInt($('[key="1140"]').attr('xToPlot')) + 2)+'px"></div>')};
    return output;
  },
  enumerateBoard: function(board) {
    return gameBoard;
  }
};
gameBoard.createBoard(10, "#editable-chart");
       var coordinates = {},
            j = 1,
            template = '';
        function dragFunc(elements) {
          $('.drag-elem').draggable({
              axis: "x",
              delay: 0,
              containment: "#editable-chart",
              create: function(event, ui){},
              drag: function(event, ui){
                  timeCalc();
                  var distanceBetDrag = $('#right-drag').position().left - $('#left-drag').position().left;
                  if($(ui)[0].helper.attr('id') == 'right-drag') {
                    $('#draggable-area').css({'width': distanceBetDrag});
                    $('.right-bubble').css('left', (parseInt($('#right-drag').position().left) - 30));
                    // $('#editable-chart').append('<div class="point" style="left:'+(parseInt($('#right-drag').position().left))+'px;top: 54px"></div>');
                  }
                  else {
                      $('#draggable-area').css({'left': ($('#left-drag').position().left), 'width': distanceBetDrag});
                      $('.left-bubble').css('left', (parseInt($('#left-drag').position().left) - 30));
                      // $('#editable-chart').append('<div class="point" style="left:'+(parseInt($('#left-drag').position().left))+'px;top: 54px"></div>');
                  }
              },
              stop: function() {
                  $('.newChartDraw').hide();
                  var statusIndex = $.inArray(selectedType, driverState);
                  var toDragPos = $('#right-drag').position().left;
                  var fromDragPos = $('#left-drag').position().left;
                  for(var i = fromDragPos; i < toDragPos; i++) {
                      $('#editable-chart').append('<div class="point newChartDraw" style="left:'+i+'px;top: '+driverStatusPoint[statusIndex]+'px"></div>');
                  }
                  $(window).trigger('resize');
              }
          });
      }
      dragFunc(['#editable-chart']);
      $(window).on('resize', function(){
          var toDragPos = $('#right-drag').position().left;
          var fromDragPos = $('#left-drag').position().left;
          var distanceBetDrag = toDragPos - fromDragPos;
          $('#draggable-area').css({'left': ($('#left-drag').position().left), 'width': distanceBetDrag});
          $('.right-bubble').css('left', (parseInt(toDragPos) - 30));
          $('.left-bubble').css('left', (parseInt(fromDragPos) - 30));
      });
      $('#left-drag, #right-drag').height($('#editable-chart').height());

      $(document).on('click', '.driverStateSelector', function(){
          $('.driverStateSelector').addClass('disabled-edit');
          selectedType = $(this).text();
          $('#left-drag, .left-bubble').css('left', $(this).attr('data-left')+'px').show();
          $('#right-drag, .right-bubble').css('left', $(this).attr('data-right')+'px').show();
          var distanceBetDrag = $('#right-drag').position().left - $('#left-drag').position().left;
          $('#draggable-area').css({'left': ($('#left-drag').position().left), 'width': distanceBetDrag});
          timeCalc();
          $(window).trigger('resize');
      });

      // This timeout, started on mousedown, triggers the beginning of a hold
      var holdStarter = null;

      // This is how many milliseconds to wait before recognizing a hold
      var holdDelay = 500;

      // This flag indicates the user is currently holding the mouse down
      var holdActive = false;

      // MouseDown
      $('#left-drag, #right-drag').mousedown(onMouseDown);
      function timeCalc() {
          var toDragPos = $('#right-drag').position().left;
          var fromDragPos = $('#left-drag').position().left;
          var distanceBetDrag = toDragPos - fromDragPos;
          var selectedToTime = $('[actualx="'+Math.ceil(toDragPos)+'"]').attr('key');
          var selectedFromTime = $('[actualx="'+Math.ceil(fromDragPos == 24 ? 27 : fromDragPos)+'"]').attr('key');
          if(selectedToTime && selectedFromTime) {
              var Tohours = Math.floor( selectedToTime / 60);
              var TohoursToDisplay = Tohours % 12;
              TohoursToDisplay = TohoursToDisplay ? TohoursToDisplay : 12; // the hour '0' should be '12'
              var Fromhours = Math.floor( selectedFromTime / 60);
              var FromhoursToDisplay = Fromhours % 12;
              FromhoursToDisplay = FromhoursToDisplay ? FromhoursToDisplay : 12; // the hour '0' should be '12'
              var Tominutes = selectedToTime % 60;
              Tominutes = Tominutes < 10 ? '0'+Tominutes : Tominutes;
              var Fromminutes = selectedFromTime % 60;
              Fromminutes = Fromminutes < 10 ? '0'+Fromminutes : Fromminutes;
              var Toampm = Tohours >= 12 ? 'pm' : 'am';
              var Fromampm = Fromhours >= 12 ? 'pm' : 'am';

              $('#selected-from-time').val(TohoursToDisplay + ':' + Tominutes + ' ' + Toampm);
              $('#selected-to-time').val(FromhoursToDisplay + ':' + Fromminutes + ' ' + Fromampm);

              $('.left-bubble').text(FromhoursToDisplay + ':' + Fromminutes + ' ' + Fromampm);
              $('.right-bubble').text(TohoursToDisplay + ':' + Tominutes + ' ' + Toampm);
          }
      }
      function onMouseDown(){
        holdStarter = setTimeout(function() {
            // If the mouse is released immediately (i.e., a click), before the
            //  holdStarter runs, then cancel the holdStarter and do the click
    		holdStarter = null;
    		holdActive = true;
    	}, holdDelay);
        }

        // MouseUp
        $('#left-drag, #right-drag').mouseup(onMouseUp);
        function onMouseUp(){
            // If the mouse is released immediately (i.e., a click), before the
            //  holdStarter runs, then cancel the holdStarter and do the click
        	if (holdStarter) {
        		clearTimeout(holdStarter);
        		// run click-only operation here
                console.log('Clicked!');
        	}
            // Otherwise, if the mouse was being held, end the hold
        	else if (holdActive) {
        		holdActive = false;
        		// end hold-only operation here, if desired
        	}
        }
});
