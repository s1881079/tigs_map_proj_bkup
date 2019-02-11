
//var field_data, find_data, crop_data, class_data;
//field_data = [{"owner": "FARMER BROWN", "id": 1, "lowy": 0, "area": 3.56, "hiy": 6, "hix": 6, "lowx": 2, "crop": 4}, {"owner": "FARMER BROWN", "id": 2, "lowy": 6, "area": 2.97, "hiy": 11, "hix": 6, "lowx": 2, "crop": 2}, {"owner": "FARMER GREEN", "id": 3, "lowy": 0, "area": 3.56, "hiy": 6, "hix": 10, "lowx": 6, "crop": 3}, {"owner": "FARMER BLACK", "id": 4, "lowy": 6, "area": 2.97, "hiy": 11, "hix": 10, "lowx": 6, "crop": 2}, {"owner": "FARMER GREEN", "id": 5, "lowy": 0, "area": 3.2600000000000002, "hiy": 11, "hix": 12, "lowx": 10, "crop": 4}, {"owner": "FARMER BLACK", "id": 6, "lowy": 11, "area": 3.56, "hiy": 15, "hix": 12, "lowx": 6, "crop": 1}, {"owner": "FARMER WHITE", "id": 7, "lowy": 12, "area": 0.89, "hiy": 15, "hix": 5, "lowx": 3, "crop": 5}, {"owner": "FARMER WHITE", "id": 8, "lowy": 12, "area": 1.78, "hiy": 16, "hix": 3, "lowx": 0, "crop": 3}];
//find_data = [{"yCoord": 1, "type": 1, "id": 1, "xCoord": 4, "depth": 0.67, "field_notes": "FOUND IN SOME CLAY"}, {"yCoord": 5, "type": 1, "id": 2, "xCoord": 8, "depth": 0.79, "field_notes": "SEVERAL SIMILAR PIECES FOUND TOGETHER"}, {"yCoord": 14, "type": 3, "id": 3, "xCoord": 8, "depth": 1.21, "field_notes": "FOUND EMBEDED IN A BONE"}, {"yCoord": 12, "type": 4, "id": 4, "xCoord": 7, "depth": 1.37, "field_notes": "A SMALL BONE FRAGMENT"}, {"yCoord": 7, "type": 4, "id": 5, "xCoord": 4, "depth": 1.01, "field_notes": "MARKINGS SUGGEST KILLED FOR FOOD"}, {"yCoord": 9, "type": 2, "id": 6, "xCoord": 11, "depth": 0.91, "field_notes": "VERY CORRODED"}, {"yCoord": 2, "type": 1, "id": 7, "xCoord": 12, "depth": 0.54, "field_notes": "PART OF DRINKING VESSEL ?"}, {"yCoord": 14, "type": 2, "id": 8, "xCoord": 3, "depth": 0.62, "field_notes": "REFINED CRAFTWORK, FOUND WITH OTHERS"}];
//crop_data = [{"start_of_season": "01-01-87", "id": 1, "end_of_season": "11-30-87", "name": "TURNIPS"}, {"start_of_season": "04-01-87", "id": 2, "end_of_season": "09-30-87", "name": "OIL SEED RAPE"}, {"start_of_season": "03-01-87", "id": 3, "end_of_season": "08-31-87", "name": "STRAWBERRIES"}, {"start_of_season": "02-01-87", "id": 4, "end_of_season": "10-31-87", "name": "PEAS"}, {"start_of_season": "01-01-87", "id": 5, "end_of_season": "10-31-87", "name": "POTATOES"}];
//class_data = [{"id": 1, "period": "BRONZE", "use": "DOMESTIC", "name": "SHARD"}, {"id": 2, "period": "IRON_AGE", "use": "DECORATIVE", "name": "METAL_WORK"}, {"id": 3, "period": "MESOLITHIC", "use": "HUNTING", "name": "FLINT"}, {"id": 4, "period": "RECENT", "use": "FOOD", "name": "BONE"}];

//iniate display
var normalField = {'opacity' : 1};
var emphaField = {'opacity' : 1,};
var fadeField = {'opacity' : 0.5};

var normalFind = {'opacity' : 1};
var emphaFind = {'opacity' : 1};
var fadeFind = {'opacity' : 0.5};

//initiate list setting for linking dropboxes
var FirSel;

var oriCropList = (function(){
  var CropIdList = [];
  for (crop of crop_data){
    CropIdList.push(crop.id);
  }
  return CropIdList;
})();

var oriOwnerList = owner_data.slice(0);

var oriFieldIDList = (function(){
  var fieldIdList = [];
  for (field of field_data){
    fieldIdList.push(field.id);
  }
  return fieldIdList;
})();

var dymFieldIDList = oriFieldIDList.slice(0);
var preFieldIDList = oriFieldIDList.slice(0);

var dymFieldList = field_data.slice(0);

//map_transform
var mapg_transf = "scale(38,-40) translate(1,-18)";


//============================================================================
//========================================================linked droppdown

function checkClassSelect(){
  var checkClass = $('#class_select option:selected').val();
  console.log('firing checkclass');
  eligFindID = getFindByClass(checkClass);
  updateFindSelect(eligFindID);
  updateShowFind(eligFindID);

}

function getFindByClass(cls_id){
  var rstFindID = [];
  for (find of find_data){
    if (find.type == cls_id){
      rstFindID.push(find.id);
    }
  }
  return rstFindID;
}

function updateShowFind(eligFindID){
  //console.log('firing update show')
  $('.find_loc').each(function(){
    $(this).css(normalFind);
    str_findID = $(this).attr('id');
    num_findID = str_findID - 0;
    if (eligFindID.includes(num_findID)){
      $(this).css(emphaFind);
      console.log('showing fing' + num_findID)
    } else {
      $(this).fadeTo(2,0.5);
    }
  });
}

function updateShowField(eligFieldID){
  console.log('eligFieldID : ');
  console.log(eligFieldID);
  $('.field_rect').each(function(){
    $(this).css(normalField);
    str_fieldID = $(this).attr('id');
    num_fieldID = str_fieldID - 0;
    if (eligFieldID.includes(num_fieldID)){
      $(this).css(emphaField);
      console.log('showing field' + num_fieldID)
    } else {
      $(this).fadeTo(2,0.5);
    }
  });
}

function updateFindSelect(eligFindID){
  isFirElig = true;
  $('#find_select option').each(function(){
    num_findid = $(this).val() - 0;
    $(this).hide();
    if (eligFindID.includes(num_findid)){
      if(isFirElig){
        $('#find_select').val($(this).val());
        isFirElig = false;
      }
      $(this).show();
    }
    })
}

function checkCropSelect(){
  var checkOwner = $('#owner_select option:selected').val();
  if (checkOwner == ''){
    FirSel = 'crop';
  }
  if (FirSel == 'crop'){
    dymFieldIDList = oriFieldIDList.slice(0);
    preFieldIDList = dymFieldIDList.slice(0);
  }else{
    dymFieldIDList = preFieldIDList.slice(0);
  }
  var checkCrop = $('#crop_select option:selected').val();
  var cropIdList = (function(){
    return [checkCrop - 0];
  })();


  var ownerList = (function(){
    //console.log('updating ownerlist');
    let eligOwner = [];
    for (field of field_data){
      if (cropIdList.includes(field.crop)){
        eligOwner.push(field.owner);
      }
    }
    let uniEligOwner = Array.from(new Set(eligOwner));
    return uniEligOwner;
  })();
  console.log(cropIdList);
  console.log(ownerList);

  updateDymFieldIDList(cropIdList,ownerList);
  if (FirSel == 'crop'){
    preFieldIDList = dymFieldIDList.slice(0);
    //console.log('fir = owner,initing dymfield');
  }
  updateFieldSelect(dymFieldIDList);
  updateOwnerSelect(dymFieldIDList);
  updateShowField(dymFieldIDList);
}

function checkOwnerSelect(){
  var checkCrop = $('#crop_select option:selected').val();
  //console.log('chekching crop in ' + checkCrop);
  if (checkCrop == ''){
    FirSel = 'owner';
  }
  if (FirSel == 'owner'){
    dymFieldIDList = oriFieldIDList.slice(0);
    preFieldIDList = dymFieldIDList.slice(0);
    console.log('fir = owner,initing dymfield');
  }else{
    dymFieldIDList = preFieldIDList.slice(0);
  }

  var checkOwner = $('#owner_select option:selected').val();
  var ownerList = [checkOwner];

  var cropIdList = (function(){
    let eligCrop = [];
    for (field of field_data){
      if (ownerList.includes(field.owner)){
        eligCrop.push(field.crop);
      }
    }
    let uniEligCrop = Array.from(new Set(eligCrop));
    return uniEligCrop;
  })();

  updateDymFieldIDList(cropIdList,ownerList);
  if (FirSel == 'owner'){
    preFieldIDList = dymFieldIDList.slice(0);
  }
  updateFieldSelect(dymFieldIDList);
  updateCropSelect(dymFieldIDList);
  updateShowField(dymFieldIDList);
}

function updateDymFieldIDList(cropIDList,ownerList){
  var eligField = (function(){
    let eligF = [];
    for (fieldid of dymFieldIDList){
        eligF.push(getFieldByID(fieldid));
        }
    return eligF;
    })();
  dymFieldIDList = [];
  for (field of eligField){
    if (cropIDList.includes(field.crop) && ownerList.includes(field.owner)){
      dymFieldIDList.push(field.id);
    }
  }
}

function getFieldByID(fieldID){
  for (field of field_data){
    if (field.id == fieldID){
      return field;
    }
  }
}

function getFindByID(findID){
  for (find of find_data){
    if (find.id == findID){
      return find;
    }
  }
}


function updateFieldSelect(validFieldID){
  isFirElig = true;
  $('#field_select option').each(function(){
    num_fieldid = $(this).val() - 0;
    $(this).hide();
    //console.log(num_fieldid);
    if (validFieldID.includes(num_fieldid)){
      if(isFirElig){
        $('#field_select').val($(this).val());
        isFirElig = false;
      }
      $(this).show();
    }
    })
}

function updateOwnerSelect(validFieldID){
  isFirElig = true;
  var eligOwner = (function(){
    let eligO = [];
    for (field_id of validFieldID){
      eligField = getFieldByID(field_id);
      eligO.push(eligField.owner);
    }
    return eligO;
  })();
  //console.log('eligowner ; ' + eligOwner);
  $('#owner_select option').each(function(){
    //num_fieldid = $(this).val() - 0;
    $(this).hide();
    //console.log(num_fieldid);
    if (eligOwner.includes($(this).val())){
      if(isFirElig){
        $('#owner_select').val($(this).val());
        isFirElig = false;
      }
      $(this).show();
    }
    })
}

function updateCropSelect(validFieldID){
  isFirElig = true;
  var eligCrop = (function(){
    let eligC = [];
    for (field_id of validFieldID){
      eligField = getFieldByID(field_id);
      eligC.push(eligField.crop);
    }
    return eligC;
  })();
  //console.log('eligocrop ; ' + eligCrop);
  $('#crop_select option').each(function(){
    num_cropid = $(this).val() - 0;
    $(this).hide();
    //console.log(num_fieldid);
    if (eligCrop.includes(num_cropid)){
      if(isFirElig){
        $('#crop_select').val($(this).val());
        isFirElig = false;
      }
      $(this).show();
    }
    })
}



function checkFindSelect(){
  //console.log('executing check');
  var checkFind = $('#find_select option:selected').val();
  var focus_find = getFindByID(checkFind)
  //console.log(checkFind)
  $('#hloverlay').empty();
  var getFindClassID = function(){
    for (find of find_data){
      if (find.id == checkFind){
        return find.type;
      }
    }
  }
  $('#class_select').val(focus_find.id.toString());
  $('#class_select option').each(function(){
    num_typeid = $(this).val() - 0;
    $(this).hide();
    if (num_typeid == focus_find.type){
      $('#class_select').val($(this).val());
      $(this).show();
    }
  })
  num_findID = checkFind - 0;
  updateShowFind([num_findID]);
  showFindDetail(focus_find);
  var hlov_circ = hlov_g.append('circle').attr("cx",focus_find.xCoord).attr("cy",focus_find.yCoord).attr("r",'0.5').attr("class","hlov_loc").attr('id',focus_find.id);
  //find_info.html('<div><img class = "find_img" src = ' + find_picUrl[focus_find.id] + '></img></div>').style('left',(d3.event.pageX - 50) + 'px').style('top',(d3.event.pageY) + 'px');


}

function checkFieldSelect(){
  //console.log('executing check field select');
  var checkField = $('#field_select option:selected').val();
  var focus_field = getFieldByID(checkField);
  //console.log(checkField)
  $('#hloverlay').empty();

  $('#crop_select').val(focus_field.crop.toString());

  $('#crop_select option').each(function(){
    if ($(this).val() != focus_field.crop){
      $(this).hide();
    }
  })
  $('#owner_select').val(focus_field.owner);
  $('#owner_select option').each(function(){
    //console.log($(this).val());
    //console.log('tofind' + focus_field.owner);
    if ($(this).val() != focus_field.owner){
      $(this).hide();
    }
  })
  //console.log(getFieldCropID());
  num_fieldID = checkField - 0;
  updateShowField([num_fieldID]);
  showFieldDetail(focus_field);
  //onField = getFieldByID($(this).attr('id') - 0)
  var hlov_rect = hlov_g.append('rect').attr('x',focus_field.lowx).attr('y',focus_field.lowy).attr('height',focus_field.height).attr('width',focus_field.width).attr('class','hlov_rect').attr('id',focus_field.id);

}

function clearFieldSelection(){
  //console.log('funing clear')
  $('#crop_select option:hidden').show();
  $('#field_select option:hidden').show();
  $('#owner_select option:hidden').show();
  $('#crop_select').val('');
  $('#field_select').val('');
  $('#owner_select').val('');
  $('.field_rect').css(normalField);

  dymFieldIDList = oriFieldIDList.slice(0);
  preFieldIDList = dymFieldIDList.slice(0);
  FirSel = '';

  //find_detail.transition().duration(200).style('opacity',0);
  field_detail.transition().duration(200).style('opacity',0);
  $('#hloverlay').empty()

}

function clearFindSelection(){
  //console.log('funing clear')
  $('#class_select option:hidden').show();
  $('#find_select option:hidden').show();
  $('#class_select').val('');
  $('#find_select').val('');
  $('.find_loc').css(normalFind);
  find_detail.transition().duration(200).style('opacity',0);
  $('#hloverlay').empty()
}


//===========================================================================
//============================================================draw svg using d3


function addFieldRects(map_svg){
  //console.log('inside addrect');
  //console.log(find_data);
  var map_g = map_svg.append("g").attr("transform",mapg_transf).attr('id','field_g');
  var field_rects = map_g.selectAll('rect').data(field_data).enter().append('rect');
  var rect_attrs = field_rects.attr('x',function(d){return d.lowx;}).attr('y',function(d){return d.lowy;}).attr('height',function(d){return d.height;}).attr('width',function(d){return d.width;}).attr('class','field_rect').attr('id',function(d){return d.id;});
  return field_rects
}

function addFindCircles(map_svg){
  var map_g = map_svg.append("g").attr("transform",mapg_transf).attr('id','find_g');
  var find_circles = map_g.selectAll('circle').data(find_data).enter().append('circle');
  //console.log(find_circles);
  var circle_attrs = find_circles.attr("cx",function(d){return d.xCoord;}).attr("cy",function(d){return d.yCoord;}).attr("r",'0.3').attr("class","find_loc").attr('id',function(d){return d.id;});
  //console.log(find_circles);
}

function addGridLines(map_svg){
  xline_ind = (new Array(14)).fill(undefined).map((_,i) => i);
  yline_ind = (new Array(17)).fill(undefined).map((_,i) => i);
  //console.log(line_ind);
  var map_g = map_svg.append("g").attr("transform",mapg_transf).attr('id','gridline_g');
  for (ind of xline_ind){
    map_g.append('line').attr('x1',ind).attr('x2',ind).attr('y1',0).attr('y2',16).attr('class','xgridline');
  }
  for (ind of yline_ind){
    map_g.append('line').attr('x1',0).attr('x2',13).attr('y1',ind).attr('y2',ind).attr('class','ygridline');
  }
}

function addAxies(map_svg){
  var map_g = map_svg.append("g").attr("transform",mapg_transf).attr('id','axies_g');
  map_g.append('line').attr('x1',0).attr('y1',0).attr('x2',16.5).attr('y2',0).attr('class','axis').attr('id','xaxis');
  map_g.append('line').attr('x1',0).attr('y1',0).attr('x2',0).attr('y2',16.5).attr('class','axis').attr('id','yaxis');

}


function addCoorText(map_svg){
  xtext_ind = (new Array(14)).fill(undefined).map((_,i) => i);
  ytext_ind = (new Array(16)).fill(undefined).map((_,i) => i);

  var map_g = map_svg.append("g").attr("transform",mapg_transf).attr('id','xcoortext_g');

  for (ind of xtext_ind){
    var xc_text = map_g.append('text').attr('x',ind).attr('y',0.7).attr('class','xcoord_text');
    xc_text.html(ind.toString());
  }
  for (ind of ytext_ind){
    var yc_text = map_g.append('text').attr('transform','scale(1,-1) translate(0,-16)').attr('y',ind).attr('x',-0.8).attr('class','ycoord_text');
    yc_text.html((16-ind).toString());
  }

}

//draw svg map

var map_svg= d3.select('#map_div').append("svg").attr('id','map_svg');

addGridLines(map_svg);
field_Rects = addFieldRects(map_svg);
addFindCircles(map_svg);
addAxies(map_svg);
addCoorText(map_svg);

//hover and highlight

var hlov_g = map_svg.append("g").attr('id','hloverlay').attr("transform",mapg_transf);

$('.field_rect').each(function(){
  $(this).mouseover(function(){
    onField = getFieldByID($(this).attr('id') - 0)
    var hlov_rect = hlov_g.append('rect').attr('x',onField.lowx).attr('y',onField.lowy).attr('height',onField.height).attr('width',onField.width).attr('class','hlov_rect').attr('id',onField.id);
  }).mouseout(function(){
    $('#hloverlay').empty()
  })
})

$('.find_loc').each(function(){
  $(this).mouseover(function(){
    focus_find = getFindByID($(this).attr('id') - 0)
    var hlov_circ = hlov_g.append('circle').attr("cx",focus_find.xCoord).attr("cy",focus_find.yCoord).attr("r",'0.5').attr("class","hlov_loc").attr('id',focus_find.id);
  }).mouseout(function(){
    $('#hloverlay').empty()
  })
})



//================================================================================================
//==================================================================================try leaflet
var l_map = L.map('lf_map_div',{
    center: [8,8],
    zoom: 13,
    crs: L.CRS.Simple
});

var l_map_svg= d3.select(l_map.getPanes().overlayPane).append("svg").attr("width", "25cm").attr("height", "25cm");
addFieldRects(l_map_svg);
//field_pane = map.createPane('fieldP')
for (field of field_data){
  var bounds = [[field.lowy, field.lowx], [field.hiy, field.hix]];
  console.log('creating bound' + field.id);
  L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(l_map);
  //l_map.setView(bounds, 11, { animation: true })
}



//================================================================================
//============================================D3 tooltip for field and find

var find_tip = d3.select('body')
  .append('div')
  .attr('class', 'find_tip')
  .style('opacity', 0);

var find_info = d3.select('body')
  .append('div')
  .attr('class', 'find_info')
  .style('opacity', 0);

d3.selectAll('.find_loc').on('mouseover',(d) => {
  find_tip.transition().duration(100).style('opacity',0.9);
  find_tip.html('<div>Find ' + d.id + '</div>').style('left',(d3.event.pageX) + 'px').style('top',(d3.event.pageY - 20) + 'px');
}).on('mousemove',(d)=>{
  find_tip.style('left',(d3.event.pageX) + 'px').style('top',(d3.event.pageY - 20) + 'px');
}).on('mouseout',(d)=>{
  find_tip.transition().duration(100).style('opacity',0);

  console.log('i am here');
}).on('click',(d)=>{
  find_tip.transition().duration(100).style('opacity',0);
  find_info.transition().duration(200).style('opacity',1);
  find_info.html('<div><img class = "find_img" src = ' + find_picUrl[d.id] + '></img></div>').style('left',(d3.event.pageX - 50) + 'px').style('top',(d3.event.pageY) + 'px');
  showFindDetail(d);
});



var field_tip = d3.select('body')
  .append('div')
  .attr('class', 'field_tip')
  .style('opacity', 0);

var field_info = d3.select('body')
  .append('div')
  .attr('class', 'field_info')
  .style('opacity', 0);


d3.selectAll('.field_rect').on('mouseover',(d) => {
  field_tip.transition().duration(100).style('opacity',0.9);
  console.log('hovering');
  console.log(d.id);
  field_tip.html('<div>Field ' + d.id + '</div>').style('left',(d3.event.pageX) + 'px').style('top',(d3.event.pageY - 50) + 'px');
}).on('mousemove',(d)=>{
  field_tip.style('left',(d3.event.pageX) + 'px').style('top',(d3.event.pageY - 20) + 'px');
}).on('mouseout',(d)=>{
  field_tip.transition().duration(200).style('opacity',0);
  console.log('i am here');
}).on('click',(d)=>{
  field_tip.transition().duration(100).style('opacity',0);
  find_info.transition().duration(200).style('opacity',0);
  showFieldDetail(d);
});

//==========================================field detail display
var field_detail = d3.select('body')
  .append('div')
  .attr('class', 'detail_div')
  .attr('id', 'field_detail')
  .style('opacity', 0);

function showFieldDetail(d){
  find_detail.transition().duration(200).style('opacity',0);
  find_info.transition().duration(200).style('opacity',0);
  field_detail.transition().duration(200).style('opacity',0.9);
  var fie_crop = getCropByField(d.id.toString());
  //field_detail.html('<p class = "d_field_name">Field ' + d.id + '</p><hr></hr><form><table><tr><td>Crop:</td><td>' + d.crop + '</td></tr><tr><td>Owner</td><td>' + d.owner + '</td></tr>' + '</table></form>')
  field_detail.html('<p class = "d_field_name">Field ' + d.id + '</p><hr></hr><form><table><tr><td>Crop:</td><td>' + fie_crop.name + '</td></tr><tr><td>Owner</td><td>' + d.owner + '</td></tr><tr><td>Start Season</td><td>' + fie_crop.start_of_season + '</td></tr><tr><td>End Season</td><td>' + fie_crop.end_of_season + '</td></tr>' + '</table></form>')

}


//=================================================find detail display
var find_detail = d3.select('body')
  .append('div')
  .attr('class', 'detail_div')
  .attr('id', 'find_detail')
  .style('opacity', 0);

function showFindDetail(d){
  field_detail.transition().duration(200).style('opacity',0);
  find_detail.transition().duration(200).style('opacity',0.9);
  var fin_type = getClassByFind(d.id.toString())
  //find_detail.html('<p class = "d_find_name">Find ' + d.id + '</p><hr></hr><form><table><tr><td>Type:</td><td>' + d.type + '</td></tr><tr><td>Depth:</td><td>' + (d.depth).toString() + '</td></tr><tr><td>Field Notes:</td><td>' + d.field_notes + '</td></tr>' + '</table></form>')
  find_detail.html('<p class = "d_find_name">Find ' + d.id + '</p><hr></hr><form><table><tr><td>Type:</td><td>' + fin_type.name + '</td></tr><tr><td>Period:</td><td>' + fin_type.period + '</td></tr><tr><td>Depth:</td><td>' + (d.depth).toString() + '</td></tr><tr><td>Field Notes:</td><td>' + d.field_notes + '</td></tr>' + '</table></form>')
  console.log(d.depth,toString());
}



//==================================================================
//=================================================== menu response

$('#main_tab').click(function(){
  find_info.transition().duration(200).style('opacity',0);
  $('.control_container').css('display','none').css('opacity',0);
  //$('#main_control').fadeIn();
  d3.select('#main_control').style('display','block')
  d3.select('#main_control').transition().duration(200).style('opacity',1);
});

$('#field_tab').click(function(){
  find_info.transition().duration(200).style('opacity',0);
  $('.control_container').css('display','none').css('opacity',0);
  d3.select('#field_control').style('display','block')
  d3.select('#field_control').transition().duration(200).style('opacity',1);
});

$('#find_tab').click(function(){
  find_info.transition().duration(200).style('opacity',0);
  $('.control_container').css('display','none').css('opacity',0);
  d3.select('#find_control').style('display','block')
  d3.select('#find_control').transition().duration(200).style('opacity',1);
  //activateFindTipHover();
});

$('#display_tab').click(function(){
  find_info.transition().duration(200).style('opacity',0);
  $('.control_container').css('display','none').css('opacity',0);
  d3.select('#display_control').style('display','block')
  d3.select('#display_control').transition().duration(200).style('opacity',1);
  //activateFindTipHover();
});

var lf_mapdiv= d3.select('#lf_map_div')

$('#leaflet_tab').click(function(){
  console.log('clicking leaflet');
  d3.select('#lf_map_div').style('display','block')
  d3.select('#lf_map_div').transition().duration(200).style('opacity',1);
  //activateFindTipHover();
});


//=========================================================================
//===================================================rendering

function getClassByFind(str_findID){
  num_findID = str_findID - 0;
  var cur_find = getFindByID(num_findID);
  for (type of class_data){
    if (type.id.toString() == cur_find.type){
      return type;
    }
  }
}

function getCropByField(str_fieldID){
  num_fieldID = str_fieldID - 0;
  var cur_field = getFieldByID(num_fieldID);
  for (crop of crop_data){
    if (crop.id.toString() == cur_field.crop){
      return crop;
    }
  }

}

function getOwnerByField(str_fieldID){
  num_fieldID = str_fieldID - 0;
  var cur_field = getFieldByID(num_fieldID);
  return cur_field.owner;

}

$('[name = "field_display"]').click(function(){
  //console.log('checking');
  dis_field_key = $(this).val();
  //console.log(dis_field_key);
  if (dis_field_key ==  'byCrop'){
    renderFieldByCrop();
  }else{
    renderFieldByOwner();
  }
})

$('[name = "find_display"]').click(function(){
  //console.log('checking');
  dis_find_key = $(this).val();
  //console.log(dis_field_key);
  if (dis_find_key ==  'byType'){
    renderFindByType();
  }
})

crop_renderer = {
  '1':'#cc9933',
  '2':'#009993',
  '3':'#FFCC33',
  '4':'#FF9966',
  '5':'#669999'
}

owner_renderer = {
  'FARMER BLACK':'#003300',
  'FARMER BROWN':'#666633',
  'FARMER GREEN':'#669933',
  'FARMER WHITE':'#FFFFCC'
}

type_renderer = {
  '1':'#CC9933',
  '2':'#CCCCFF',
  '3':'#660000',
  '4':'#CCCC99'
}

//legends

function clearFieldLegendDiv(){
  $('#field_legend_table').empty()
}

function clearFindLegendDiv(){
  $('#find_legend_table').empty()
}


function displayCropLegend(){
  clearFieldLegendDiv()
  console.log('displaying cop content')
  var field_lgtb = d3.select('#field_legend_table');
  console.log(field_lgtb)
  for (crop of crop_data){
    console.log(crop)
    tr = field_lgtb.append('tr');
    td1 = tr.append('td');
    console.log(crop_renderer[crop.id.toString()])
    lg_cube = td1.append('div').attr('class','legend_cube').style('background',crop_renderer[crop.id.toString()]);
    td2 = tr.append('td').html(crop.name);
    }
}

function displayTypeLegend(){
  clearFindLegendDiv()
  console.log('displaying ctyp content')
  var find_lgtb = d3.select('#find_legend_table');
  //console.log(field_lgtb)
  for (type of class_data){
    //console.log(crop)
    tr = find_lgtb.append('tr');
    td1 = tr.append('td');
    //console.log(crop_renderer[crop.id.toString()])
    lg_circ = td1.append('div').attr('class','legend_circ').style('background',type_renderer[type.id.toString()]);
    td2 = tr.append('td').html(type.name);
    }
}

function displayOwnerLegend(){
  clearFieldLegendDiv()
  console.log('displaying cowner content')
  var field_lgtb = d3.select('#field_legend_table');
  console.log(field_lgtb)
  for (owner of owner_data){
    //console.log(crop)
    tr = field_lgtb.append('tr');
    td1 = tr.append('td');
    //console.log(crop_renderer[crop.id.toString()])
    lg_cube = td1.append('div').attr('class','legend_cube').style('background',owner_renderer[owner]);
    td2 = tr.append('td').html(owner);
    }
}


function renderFieldByCrop(){
  console.log('runing reder crop');
  $('.field_rect').each(function(){
    //console.log($(this).attr('id'));
    console.log(getCropByField($(this).attr('id')));
    $(this).css('fill',crop_renderer[getCropByField($(this).attr('id')).id.toString()])
  });

  displayCropLegend();
}

function renderFieldByOwner(){
  $('.field_rect').each(function(){
    //console.log($(this).attr('id'));
    console.log(getOwnerByField($(this).attr('id')));
    $(this).css('fill',owner_renderer[getOwnerByField($(this).attr('id'))])
  });
  displayOwnerLegend()
}

function renderFindByType(){
  $('.find_loc').each(function(){
    //console.log($(this).attr('id'));
    //console.log(getOwnerByField($(this).attr('id')));
    console.log(getClassByFind($(this).attr('id')));
    $(this).css('fill',type_renderer[getClassByFind($(this).attr('id')).id.toString()])
  });
  displayTypeLegend()
}




//checkings
/*
$( '.field_rect' ).tooltip({
  position : {
    my: "right",
    of: $('#map_legend')
  }
});

$( '.field_rect' ).click(function(){
  console.log('clicking field ' + $(this).attr('id').slice(-1));
  console.log();
});

$( '.find_loc' ).click(function(){
  console.log('clicking find ' + $(this).attr('id'));
});

*/

$(document).ready(function(){
  renderFindByType();
  renderFieldByCrop();
  $('#class_select').change(checkClassSelect);
  $('#crop_select').change(checkCropSelect);
  $('#owner_select').change(checkOwnerSelect);
  $('#find_select').change(checkFindSelect);
  $('#field_select').change(checkFieldSelect);
  $('#clrSlt_field').click(clearFieldSelection);
  $('#clrSlt_find').click(clearFindSelection);
})
