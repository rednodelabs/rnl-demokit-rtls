function uwb_data_update(msg)
{
	//A dibujar!
	let num_nodes = msg.node_count;

	var index = new Array(num_nodes)
	index[0] = "Node ID"
	for(let i=1;i<(num_nodes); i++)
	{
		index[i] = +(i).toString();
	}
	updateTable('last-distance-received', 0, index);
	updateTable('distance-average', 0, index )
	updateTable('distance-received', 0, index )
	updateTable('distance-min', 0, index )
    updateTable('hop-rssi', 0, index )

	let total_distances_received = 0;
	let total_distances_lost = 0;
	for(let i=0;i<num_nodes; i++)
	{
		let last_distance = new Array(num_nodes)
		let distances = new Array(num_nodes)
		let distances_rec = new Array(num_nodes)
		let distances_min = new Array(num_nodes)
        let hop_rssi = new Array(num_nodes)
		last_distance[0] = +i.toString();
		distances[0] = +i.toString();
		distances_min[0] = +i.toString();
		distances_rec[0] = +i.toString();
        hop_rssi[0] = +i.toString();
		for(let j=2;j<num_nodes+1;j++)
		{
		total_distances_received += msg.distance_count[i][j-1];
		total_distances_lost += msg.distance_error_count[i][j-1];
			if(i == (j-1) || i == 0 || (msg.distance_count[i][j-1]+msg.distance_error_count[i][j-1]) == 0)
			{
				last_distance[j-1] = "-";
				distances[j-1] = "-";
				distances_min[j-1] = "-";
				distances_rec[j-1] = "-";
                hop_rssi[j-1] = "-";
			}
			else
			{
				if(msg.distances[i][j-1] < 0)
				{
					msg.distances[i][j-1] = 0
				}
				
				if(msg.distance_avg[i][j-1] < 0)
				{
					msg.distance_avg[i][j-1] = 0;
				}
				
				if(msg.distance_min[i][j-1] < 0)
				{
					msg.distance_min[i][j-1] = 0;
				}
				
				if(msg.distance_max[i][j-1] < 0)
				{
					msg.distance_max[i][j-1] = 0;
				}
				
				last_distance[j-1] = msg.distances[i][j-1];
				distances[j-1] = msg.distance_avg[i][j-1].toFixed(2)+', '+msg.distance_std[i][j-1].toFixed(2);
				distances_rec[j-1] = msg.distance_count[i][j-1]+'/'+(msg.distance_count[i][j-1]+msg.distance_error_count[i][j-1]);
				distances_min[j-1] = msg.distance_min[i][j-1]+', '+msg.distance_max[i][j-1];
				if(msg.rssi[i][j-1]!=0)
				{
					hop_rssi[j-1] = msg.hop[i][j-1]+', '+ msg.rssi[i][j-1];
				}
				else
				{
					hop_rssi[j-1] = "-";
				}
			}
		}
		
		updateTable('last-distance-received', i+1, last_distance);
		updateTable('distance-average', i+1, distances);
		updateTable('distance-received', i+1, distances_rec);
		updateTable('distance-min', i+1, distances_min);
        updateTable('hop-rssi', i+1, hop_rssi);
	}
	document.getElementById('last-distance-received').deleteRow(1);
	document.getElementById('distance-average').deleteRow(1);
	document.getElementById('distance-received').deleteRow(1);
	document.getElementById('distance-min').deleteRow(1);
	document.getElementById('hop-rssi').deleteRow(1);
	updateTable('positioning-general', 1, [num_nodes - 1, total_distances_received+"/"+(total_distances_received+total_distances_lost), (100.0*(1-(total_distances_received/(total_distances_received+total_distances_lost)))).toFixed(2)] )
    
    let j=0;
    for(let i=0; i<num_nodes; i++)
    {
        updateMeanDistances(msg.distances_superframe[i], 0.2, i)
        if(distances_per_second_mean[i]>0.000000000000001)
        {
            updateTable('dis_rate', j+1, [i, rnb_node_type[i],distances_per_second_mean[i].toFixed(2), bus_period_mean.toFixed(0), (1000.0*(distances_per_second_mean[i]/bus_period_mean)).toFixed(1)]);
            j++;
        }
    }
};

nodes_acc_received = new Array(15).fill(0);
let rnb_node_type = new Array(15).fill(0);

function update_rnb_types(msg)
{
	let num_nodes = msg.node_count;
	for(let i=0; i< num_nodes; i++)
	{       
       if(i!=0)
       {
			if(msg.rnb_mode[i] == 0)
			{
				rnb_node_type[i] = "Anchor";
			}
			else if(msg.rnb_mode[i] == 2)
			{
				rnb_node_type[i] = "Tag";
			}
       }
	   else
	   {
		   rnb_node_type[i] = "Sniffer"	   
	   }
	}
}

function connect_ws_uwb_bus() {
	  socket.on('net_stats', function(rec_msg) {
		if(rnb_started)
		{
			if(rec_msg.type == "rnb" && current_view == "ranging")
            {
				update_rnb_types(rec_msg);
            }
            if(rec_msg.type == "ranging" && current_view == "ranging")
            {
				resetTable('last-distance-received');
                resetTable('distance-average');
                resetTable('distance-received');
                resetTable('distance-min');
                resetTable('hop-rssi');
                deleteTableContent("dis_rate");
                uwb_data_update(rec_msg);
            }
            else if(rec_msg.type == "accelerometer_app" && current_view == "ranging")
            {
                update_acceleration(rec_msg);
                nodes_acc_received[rec_msg.node_id] = 1;
            }
            else if(rec_msg.type== "rnb_superframe_end")
            {
                for(let i=0; i<15; i++)
                {
                    if(!nodes_acc_received[i])
                    {
                        acceleration_values_x[i] = 0;
                        acceleration_values_y[i] = 0;
                        acceleration_values_z[i] = 0;
                    }
                }
                //deleteTableContent("acc_table");
                paint_acceleration();
                nodes_acc_received.fill(0);
            }
		}
	  });
}

connect_ws_uwb_bus();
