
var svg;
var x;
var y;

function init_map()
{

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
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
	.domain([-24000/zoom_level_array[zoom_level], 24000/zoom_level_array[zoom_level]])
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
      .text("X Distance (cm)");


  // Add Y axis
  y = d3.scaleLinear()
	.domain([-12000/zoom_level_array[zoom_level], 12000/zoom_level_array[zoom_level]])
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
      .text("Y Distance (cm)");
}

function update_map(msg)
{
	//Transform position to csv
	let csv_positions = "x,y,id";
    let csv_positions_tag = "x,y,id";
    
    for(let i=0; i<msg.active_node_count_tag; i++)
	{
		csv_positions_tag = csv_positions_tag + "\n" + (ref_x*msg.tag_position[msg.active_node_index_tag[i]][0]).toString() + "," + (ref_y*msg.tag_position[msg.active_node_index_tag[i]][1]).toString()
		 + "," + msg.active_node_index_tag[i].toString();
		
		if(msg.dimensions == 2)
		{
			updateTable('height', i+1, [msg.active_node_index_tag[i], "Tag", ref_x*msg.tag_position[msg.active_node_index_tag[i]][0].toFixed(0), ref_y*msg.tag_position[msg.active_node_index_tag[i]][1].toFixed(0), "-", msg.anchors_in_tag_range[i], (msg.pps_tag).toFixed(0), msg.average_tag]);
		}
		if(msg.dimensions == 3)
		{
			updateTable('height', i+1, [msg.active_node_index_tag[i], "Tag", ref_x*msg.tag_position[msg.active_node_index_tag[i]][0].toFixed(0), ref_y*msg.tag_position[msg.active_node_index_tag[i]][1].toFixed(0), msg.tag_position[msg.active_node_index_tag[i]][2].toFixed(0), msg.anchors_in_tag_range[i], (msg.pps_tag).toFixed(0), msg.average_tag]);
		}
	}
    
	for(let i=0; i<msg.active_node_count; i++)
	{
		csv_positions = csv_positions + "\n" + (ref_x*msg.positions[i][0]).toString() + "," + (ref_y*msg.positions[i][1]).toString()
		 + "," + msg.active_node_index[i].toString();
		if(msg.dimensions == 2)
		{
			updateTable('height', i+1+msg.active_node_count_tag, [msg.active_node_index[i], "Anchor", ref_x*msg.positions[i][0].toFixed(0), ref_y*msg.positions[i][1].toFixed(0),"-", msg.anchors_in_range[msg.active_node_index[i]], (msg.pps).toFixed(0), msg.average]);
		}
		if(msg.dimensions == 3)
		{
			updateTable('height', i+1+msg.active_node_count_tag, [msg.active_node_index[i], "Anchor", ref_x*msg.positions[i][0].toFixed(0), ref_y*msg.positions[i][1].toFixed(0), msg.positions[i][2].toFixed(0), msg.anchors_in_range[msg.active_node_index[i]], (msg.pps).toFixed(0), msg.average]);
		}
	}
	updateTable('map', 1, [msg.active_node_count, msg.active_node_count_tag, msg.dimensions, msg.direct_distances+"/"+msg.indirect_distances+"/"+msg.missing_distances]);
	
    svg.selectAll("line").remove()
    
    if(view_lines)
    {
        for(let i=0; i<msg.direct_distances; i++)
        {
			svg.append("line")
			  .attr("x1", function (d) {return x(ref_x*msg.positions[msg.direct_distances_list[i][0]][0]); })
			  .attr("y1", function (d) {return y(ref_y*msg.positions[msg.direct_distances_list[i][0]][1]); })
			  .attr("x2", function (d) {return x(ref_x*msg.positions[msg.direct_distances_list[i][1]][0]); })
			  .attr("y2", function (d) {return y(ref_y*msg.positions[msg.direct_distances_list[i][1]][1]); })
			  .attr("stroke-width", 2)
			  .attr("stroke", "black");
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
        
	  svg.selectAll("circle").remove()
	  svg.selectAll("#circle_label").remove()

	  svg.append('g')
		.selectAll("dot")
		.data(d3_positions)
		.enter()
		.append("circle")
		  .attr("cx", function (d) { return x(d.x); } )
		  .attr("cy", function (d) { return y(d.y); } )
		  .attr("r", 15)
		  .style("fill", "#F9152F")
          
      svg.append('g')
		.selectAll("dot")
		.data(d3_positions_tag)
		.enter()
		.append("circle")
		  .attr("cx", function (d) { return x(d.x); } )
		  .attr("cy", function (d) { return y(d.y); } )
		  .attr("r", 15)
		  .style("fill", "#10AA00")

	  svg.append('g')
	   .selectAll("text")
	   .data(d3_positions)
	   .enter()
	   .append("text")
	   // Add your code below this line
		 .attr("x", function (d) { return x(d.x)-5; } )
		 .attr("y", function (d) { return y(d.y)+5; } )
	   .attr('id','circle_label')
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
	   .text(function (d) { return d.id; })

};

let acceleration_values_x = new Array(15).fill(0);
let acceleration_values_y = new Array(15).fill(0);
let acceleration_values_z = new Array(15).fill(0);
let acceleration_counter = new Array(15).fill(0);

function update_acceleration(msg)
{
    acceleration_counter[msg.node_id] = msg.accelerometer_data_counter;
    let acceleration_x = 0;
    let acceleration_y = 0;
    let acceleration_z = 0;

    for(let i=0; i<msg.accelerometer_data_counter; i++)
    {
        acceleration_x += msg.acceleration[i][0]
        acceleration_y += msg.acceleration[i][1]
        acceleration_z += msg.acceleration[i][2]
    }
    acceleration_values_x[msg.node_id] = acceleration_x/msg.accelerometer_data_counter;
    acceleration_values_y[msg.node_id] = acceleration_y/msg.accelerometer_data_counter;
    acceleration_values_z[msg.node_id] = acceleration_z/msg.accelerometer_data_counter;    
}

function paint_acceleration()
{
    let i = 0;
    for(let j=0; j<15; j++)
    {
        if(acceleration_values_x[j]||acceleration_values_y[j]||acceleration_values_z[j])
        {
            let node_id = j;
            updateTable('acc_table', i+1, [node_id, acceleration_values_x[node_id].toFixed(0), acceleration_values_y[node_id].toFixed(0), acceleration_values_z[node_id].toFixed(0), 3*acceleration_counter[node_id], bus_period_mean.toFixed(0), (1000.0*(3.0*acceleration_counter[node_id]/bus_period_mean)).toFixed(0)]);        
            i++;
        }
    }  
}

function connect_ws_map() {
	  socket.on('net_stats', function(rec_msg) {
		if(rnb_started)
		{
            if(rec_msg.type == "coordinates" && current_view == "map")
            {
                deleteTableContent("height");
                update_map(rec_msg);
            }
            else if(rec_msg.type == "rnb" && current_view == "map")
            {
                updateMean((rec_msg.superframe_duration_s)*1000.0, 0.05)
            }
		}
	  });
}

connect_ws_map();

let zoom_level = 8;
let zoom_level_array = [1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];

$(document).ready(function() {
	$("#zoom_plus").click(function() {
		if(zoom_level < 16)
		{
			zoom_level++;
		}
        $("#my_dataviz").empty();
        svg.selectAll("*").remove();
        init_map();
	});
});

$(document).ready(function() {
	$("#zoom_minus").click(function() {
		if(zoom_level > 0)
		{
			zoom_level--;
		}
        $("#my_dataviz").empty();
        svg.selectAll("*").remove();
        init_map();
	});
});

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


let rotation_angle;

$(document).ready(function() {
	$("#rotate_counterclockwise").click(function() {
		rotation_angle = rotation_angle + Math.Pi / 6;
	});
});

$(document).ready(function() {
	$("#rotate_clockwise").click(function() {
		rotation_angle = rotation_angle - Math.Pi / 6;
	});
});

