var svg;
var x;
var y;

let plot_min_x = -20;
let plot_max_x = 20;
let plot_min_y = -20;
let plot_max_y = 20;

let map_zoom_offset = 0;
let map_scale_factor = 100;

let rotation_idx = 0
let rotation_xx = [1, 0, -1, 0]
let rotation_xy = [0, -1, 0, 1]
let rotation_yx = [0, 1, 0, -1]
let rotation_yy = [1, 0, -1, 0]

function init_map()
{

// set the dimensions and margins of the graph
var margin = {top: 20, right: 110, bottom: 60, left: 50},
	width = 1200 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
svg = d3.select("#my_dataviz")
  .append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform",
		  "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  x = d3.scaleLinear()
	.domain([plot_min_x, plot_max_x])
	.range([ 0, width ]);
  svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

  // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("X (m)");


  // Add Y axis
  y = d3.scaleLinear()
	.domain([plot_min_y, plot_max_y])
	.range([ height, 0]);
  svg.append("g")
	.call(d3.axisLeft(y));

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Y (m)");
}

function update_map(msg)
{
	//Transform position to csv
	let csv_positions = "x,y,id";
    let csv_positions_tag = "x,y,id";
	let csv_path_tag  = "x,y"
	
	let min_x = 999999;
	let max_x = -999999;
	let min_y = 999999;
	let max_y = -999999;
    
    for(let i=0; i<msg.active_node_count_tag; i++)
	{
		let aux_x = msg.tag_position[msg.active_node_index_tag[i]][0];
		msg.tag_position[msg.active_node_index_tag[i]][0] = rotation_xx[rotation_idx]*msg.tag_position[msg.active_node_index_tag[i]][0] + rotation_xy[rotation_idx]*msg.tag_position[msg.active_node_index_tag[i]][1]
		msg.tag_position[msg.active_node_index_tag[i]][1] = rotation_yx[rotation_idx]*aux_x + rotation_yy[rotation_idx]*msg.tag_position[msg.active_node_index_tag[i]][1]
		
		msg.tag_position[msg.active_node_index_tag[i]][0] = ref_x*msg.tag_position[msg.active_node_index_tag[i]][0]/map_scale_factor
		msg.tag_position[msg.active_node_index_tag[i]][1] = ref_y*msg.tag_position[msg.active_node_index_tag[i]][1]/map_scale_factor
		
		if(msg.tag_position[msg.active_node_index_tag[i]][0] > max_x)
		{
			max_x = msg.tag_position[msg.active_node_index_tag[i]][0]
		}
		if(msg.tag_position[msg.active_node_index_tag[i]][0] < min_x)
		{
			min_x = msg.tag_position[msg.active_node_index_tag[i]][0];
		}
		
		if(msg.tag_position[msg.active_node_index_tag[i]][1] > max_y)
		{
			max_y = msg.tag_position[msg.active_node_index_tag[i]][1]
		}
		if(msg.tag_position[msg.active_node_index_tag[i]][1] < min_y)
		{
			min_y = msg.tag_position[msg.active_node_index_tag[i]][1];
		}
		
		csv_positions_tag = csv_positions_tag + "\n" + (msg.tag_position[msg.active_node_index_tag[i]][0]).toString() + "," + (msg.tag_position[msg.active_node_index_tag[i]][1]).toString()
		 + "," + msg.active_node_index_tag[i].toString();
		 
		for(let j=0; j<msg.last_positions_tag.length; j++)
		{
			let aux_x = msg.last_positions_tag[j][0];
			msg.last_positions_tag[j][0] = rotation_xx[rotation_idx]*msg.last_positions_tag[j][0] + rotation_xy[rotation_idx]*msg.last_positions_tag[j][1]
			msg.last_positions_tag[j][1] = rotation_yx[rotation_idx]*aux_x + rotation_yy[rotation_idx]*msg.last_positions_tag[j][1]
			csv_path_tag = csv_path_tag + "\n" + (ref_x*msg.last_positions_tag[j][0]/map_scale_factor).toString() + "," + (ref_y*msg.last_positions_tag[j][1]/map_scale_factor).toString();
		}
		
		if(msg.dimensions == 2)
		{
			updateTable('height', i+1, [msg.active_node_index_tag[i], "Tag", msg.tag_position[msg.active_node_index_tag[i]][0].toFixed(2), (msg.tag_position[msg.active_node_index_tag[i]][1]).toFixed(2), "-", msg.anchors_in_tag_range[i], (msg.pps_tag).toFixed(0), (10*msg.tag_velocity/busPeriod).toFixed(1), msg.tag_filter_order]);
		}
		if(msg.dimensions == 3)
		{
			updateTable('height', i+1, [msg.active_node_index_tag[i], "Tag", msg.tag_position[msg.active_node_index_tag[i]][0].toFixed(2), (msg.tag_position[msg.active_node_index_tag[i]][1]).toFixed(2), (msg.tag_position[msg.active_node_index_tag[i]][2]/map_scale_factor).toFixed(2), msg.anchors_in_tag_range[i], (msg.pps_tag).toFixed(0), (10*msg.tag_velocity/busPeriod).toFixed(1), msg.tag_filter_order]);
		}
		
		if(msg.tag_started == 0)
		{
			document.getElementById('height').rows[i+1].style.backgroundColor = "#D3D3D3";
		}
	}
    
	for(let i=0; i<msg.active_node_count; i++)
	{
		let aux_x = msg.positions[i][0];
		msg.positions[i][0] = rotation_xx[rotation_idx]*msg.positions[i][0] + rotation_xy[rotation_idx]*msg.positions[i][1]
		msg.positions[i][1] = rotation_yx[rotation_idx]*aux_x + rotation_yy[rotation_idx]*msg.positions[i][1]
	
		msg.positions[i][0] = ref_x*msg.positions[i][0]/map_scale_factor
		msg.positions[i][1] = ref_y*msg.positions[i][1]/map_scale_factor
		
		if(msg.positions[i][0] > max_x)
		{
			max_x = msg.positions[i][0]
		}
		if(msg.positions[i][0] < min_x)
		{
			min_x = msg.positions[i][0];
		}
		
		if(msg.positions[i][1] > max_y)
		{
			max_y = msg.positions[i][1]
		}
		if(msg.positions[i][1] < min_y)
		{
			min_y = msg.positions[i][1];
		}
		
		csv_positions = csv_positions + "\n" + (msg.positions[i][0]).toString() + "," + (msg.positions[i][1]).toString()
		 + "," + msg.active_node_index[i].toString();
		if(msg.dimensions == 2)
		{
			updateTable('height', i+1+msg.active_node_count_tag, [msg.active_node_index[i], "Anchor", msg.positions[i][0].toFixed(2), msg.positions[i][1].toFixed(2),"-", msg.anchors_in_range[msg.active_node_index[i]], (msg.pps).toFixed(0),"-","-"]);
		}
		if(msg.dimensions == 3)
		{
			updateTable('height', i+1+msg.active_node_count_tag, [msg.active_node_index[i], "Anchor", msg.positions[i][0].toFixed(2), msg.positions[i][1].toFixed(2), (msg.positions[i][2]/map_scale_factor).toFixed(2), msg.anchors_in_range[msg.active_node_index[i]], (msg.pps).toFixed(0),"-","-"]);
		}
		
		if(msg.infra_started == 0)
		{
			document.getElementById('height').rows[i+1+msg.active_node_count_tag].style.backgroundColor = "#D3D3D3";
		}
		
	}
	
	if((max_x-min_x)> 2*(max_y-min_y))
	{
		new_plot_min_x = (min_x - map_zoom_offset);
		new_plot_max_x = (max_x + map_zoom_offset);
		new_plot_min_y = (min_y + (max_y - min_y)/ 2) - (new_plot_max_x - new_plot_min_x)/4
		new_plot_max_y = (min_y + (max_y - min_y)/ 2) + (new_plot_max_x - new_plot_min_x)/4
	}
	else
	{
		new_plot_min_y = (min_y - map_zoom_offset)
		new_plot_max_y = (max_y + map_zoom_offset)
		new_plot_min_x = (min_x + (max_x - min_x)/ 2) - (new_plot_max_y - new_plot_min_y)
		new_plot_max_x = (min_x + (max_x - min_x)/ 2) + (new_plot_max_y - new_plot_min_y)
	}
	
	if( Math.abs(new_plot_min_x - plot_min_x) > 0.1 ||	
	Math.abs(new_plot_max_x - plot_max_x) > 0.1 ||	
	Math.abs(new_plot_min_y - plot_min_y) > 0.1 || 
	Math.abs(new_plot_max_y - plot_max_y) > 0.1)
	{
		plot_min_x = new_plot_min_x;
		plot_max_x = new_plot_max_x;
		plot_min_y = new_plot_min_y;
		plot_max_y = new_plot_max_y;
		
		$("#my_dataviz").empty();
        svg.selectAll("*").remove();
        init_map();
	}
		
	updateTable('map', 1, [msg.active_node_count, msg.active_node_count_tag, msg.dimensions, msg.direct_distances+"/"+msg.indirect_distances+"/"+msg.missing_distances]);
	
    svg.selectAll("line").remove()
    
    if(view_lines)
    {
        for(let i=0; i<msg.direct_distances; i++)
        {
			svg.append("line")
			  .attr("x1", function (d) {return x(msg.positions[msg.direct_distances_list[i][0]][0]); })
			  .attr("y1", function (d) {return y(msg.positions[msg.direct_distances_list[i][0]][1]); })
			  .attr("x2", function (d) {return x(msg.positions[msg.direct_distances_list[i][1]][0]); })
			  .attr("y2", function (d) {return y(msg.positions[msg.direct_distances_list[i][1]][1]); })
			  .attr("stroke-width", 1)
			  .style("stroke-dasharray", ("3, 3")) 
			  .attr("stroke", "black");
        }
		
		for(let i=0; i<msg.indirect_distances; i++)
        {
			svg.append("line")
			  .attr("x1", function (d) {return x(msg.positions[msg.indirect_distances_list[i][0]][0]); })
			  .attr("y1", function (d) {return y(msg.positions[msg.indirect_distances_list[i][0]][1]); })
			  .attr("x2", function (d) {return x(msg.positions[msg.indirect_distances_list[i][1]][0]); })
			  .attr("y2", function (d) {return y(msg.positions[msg.indirect_distances_list[i][1]][1]); })
			  .attr("stroke-width", 1)
			  .style("stroke-dasharray", ("3, 3")) 
			  .attr("stroke", "red");
        }
    }
        
    var d3_positions = d3.csvParse(csv_positions, d=>
		{d.x=+d.x;
		d.y=+d.y;
		d.id=d.id;
		return d;});
    
    var d3_positions_tag = d3.csvParse(csv_positions_tag, d=>
		{d.x=+d.x;
		d.y=+d.y;
		d.id=d.id;
		return d;});
	
    var d3_positions_tag_path = d3.csvParse(csv_path_tag, d=>
		{d.x=+d.x;
		d.y=+d.y;
		return d;});
		
		svg.selectAll("path.tag").remove()
		
		svg.append("path")
			   .datum(d3_positions_tag_path)
			   .attr("fill", "none")
			   .attr("stroke", "#F9152F")
			   .attr("stroke-width", 1)
	
			   .attr("class","tag")
		       .attr("d", d3.line()
					.x(function(d) { return x(d.x) })
					.y(function(d) { return y(d.y) })
					.curve(d3.curveBasis)
				)
				 
				
	  svg.selectAll("circle").remove()
	  svg.selectAll("#circle_label").remove()

	  svg.append('g')
		.selectAll("dot")
		.data(d3_positions)
		.enter()
		.append("circle")
		  .attr("cx", function (d) { return x(d.x); } )
		  .attr("cy", function (d) { return y(d.y); } )
		  .attr("r", 12)
		  .style("fill", "#000000")
          
      svg.append('g')
		.selectAll("dot")
		.data(d3_positions_tag)
		.enter()
		.append("circle")
		  .attr("cx", function (d) { return x(d.x); } )
		  .attr("cy", function (d) { return y(d.y); } )
		  .attr("r", 12)
		  .style("fill", "#F9152F")

	  svg.append('g')
	   .selectAll("text")
	   .data(d3_positions)
	   .enter()
	   .append("text")
	   // Add your code below this line
		 .attr("x", function (d) { return x(d.x)-5; } )
		 .attr("y", function (d) { return y(d.y)+5; } )
	   .attr('id','circle_label')
	   .style("fill", "#FFFFFFFF")
	   .text(function (d) { return d.id; })
      
	  
      svg.append('g')
	   .selectAll("text")
	   .data(d3_positions_tag)
	   .enter()
	   .append("text")
	   // Add your code below this line
		 .attr("x", function (d) { return x(d.x)-5; } )
		 .attr("y", function (d) { return y(d.y)+5; } )
	   .attr('id','circle_label')
	   .style("fill", "#FFFFFFFF")
	   .text(function (d) { return d.id; })
	   
	   let rows = 1;
	   for(let i=0; i<(msg.active_node_count - 1); i++)
	   {
		   for(let j=i+1; j<msg.active_node_count; j++)
		   {
				updateTable('paths', rows, [msg.active_node_index[i],msg.active_node_index[j], 
				((Math.sqrt(Math.pow(msg.positions[i][0]-msg.positions[j][0],2)+Math.pow(msg.positions[i][1]-msg.positions[j][1],2)))).toFixed(2)]);
				rows++;
		   }
	   }

};

let busPeriod;

function connect_ws_map() {
	  socket.on('net_stats', function(rec_msg) {
		if(rnb_started)
		{
            if(rec_msg.type == "coordinates" && current_view == "map")
            {
                deleteTableContent("height");
				deleteTableContent("paths");
                update_map(rec_msg);
            }
            if(current_view == "map" && rec_msg.type == "stats")
            {
				busPeriod = getBusPeriod(rec_msg);
            }
		}
	  });
}

connect_ws_map();

let ref_x = 1;
$(document).ready(function() {
	$("#ref_x").click(function() {
        if(ref_x == 1)
        {
            ref_x = -1;
        }
        else
        {
            ref_x = 1;
        }
	});
});

let ref_y = 1;
$(document).ready(function() {
	$("#ref_y").click(function() {
        if(ref_y == 1)
        {
            ref_y = -1;
        }
        else
        {
            ref_y = 1;
        }
	});
});

$(document).ready(function() {
	$("#rot_cw").click(function() {
        if(rotation_idx < 3)
        {
            rotation_idx += 1;
        }
        else
        {
            rotation_idx = 0;
        }
	});	
});

$(document).ready(function() {
	$("#rot_ccw").click(function() {
        if(rotation_idx > 0)
        {
            rotation_idx -= 1;
        }
        else
        {
            rotation_idx = 3;
        }
	});	
});

init_map();

let view_lines = 1;

$(document).ready(function() {
	$("#lines").click(function() {
		if(view_lines)
		{
			view_lines = 0;
		}
		else
		{
			view_lines = 1;
		}
	});
});
