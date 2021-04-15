const max_nodes = 32;
const average_length = 16;
const REDNODERANGING_DISTANCE_ERROR = -32768;

let last_total_distances_received_array = new Array(max_nodes).fill(0);
let total_distances_received_array = new Array(max_nodes).fill(0);
let total_distances_lost_array = new Array(max_nodes).fill(0);
let index = new Array(max_nodes)
let distances_rec = new Array(max_nodes);

let distances_rec_last_avg = createArray(max_nodes, max_nodes + 1);
let hop_rssi = createArray(max_nodes, max_nodes + 1);

for(let i=0;i<max_nodes; i++)
{		
	distances_rec_last_avg[i][0] = +i.toString();
	hop_rssi[i][0] = +i.toString();
	
	for(let j=1;j<max_nodes+1;j++)
	{
		hop_rssi[i][j] = "-/-";
		distances_rec_last_avg[i][j] = "-/-/-";
	}
}

let last_sf = 0;
let num_nodes = 0;
let last_n_distances = createArray(max_nodes, max_nodes, average_length);
let avg_index =  createArray(max_nodes, max_nodes);			
let completed_average =  createArray(max_nodes, max_nodes);	

function uwb_data_update(msg)
{	
	let num_slots = msg.slots;
	let num_rnb_slots = msg.rnm_slots;
	num_nodes = num_slots - num_rnb_slots;
	
	let num_anchors = 0;
	let num_tags = 0;
	let total_distances_received = 0;
	
	let total_distances_lost = 0;
	
	
	let rnr_type;
	
	let busPeriod = getBusPeriod(msg);
	
	total_distances_received_array.fill(0);
	total_distances_lost_array.fill(0);
	
	for(let i=0; i< (num_nodes); i++)
	{		
		let ranging_capable = 0;
		
		if(msg.rnr_role[i] == REDNODERANGING_ROLE_TAG)
		{
			num_tags++;
			rnr_type = "Tag";
			ranging_capable = 1;
		}
		else if(msg.rnr_role[i] == REDNODERANGING_ROLE_LOW_POWER_TAG)
		{
			num_tags++;
			rnr_type = "Tag (LP)";
			ranging_capable = 1;
		}
		else if(msg.rnr_role[i] == REDNODERANGING_ROLE_ANCHOR)
		{
			num_anchors++;
			rnr_type = "Anchor";
			ranging_capable = 1;
		}
		
		if(ranging_capable)
		{
			for(let j=0; j< (num_nodes); j++)
			{
				total_distances_received += msg.dist_rx[i][j];
				total_distances_received_array[i] += msg.dist_rx[i][j];
				total_distances_lost += msg.dist_error[i][j];
				total_distances_lost_array[i] += msg.dist_error[i][j];
			}
	
			let distances_per_cycle = (total_distances_received_array[i] - last_total_distances_received_array[i])/(msg.sf - last_sf);
			
			updateTable('dis_rate', num_tags+num_anchors, [i, rnr_type, distances_per_cycle.toFixed(1), busPeriod, (1000.0*(distances_per_cycle/busPeriod)).toFixed(1), (100.0*(1-(total_distances_received_array[i]/(total_distances_received_array[i]+total_distances_lost_array[i])))).toFixed(2)]);
			
			if(distances_per_cycle == 0)
			{
				document.getElementById('dis_rate').rows[num_tags+num_anchors].style.backgroundColor = "#D3D3D3";
			}
			
			last_total_distances_received_array[i] = total_distances_received_array[i];
		}
	}
	
	last_sf = msg.sf;

	updateTable('positioning-general', 1, [num_anchors, num_tags, total_distances_received+"/"+(total_distances_received+total_distances_lost), (100.0*(1-(total_distances_received/(total_distances_received+total_distances_lost)))).toFixed(2)] )
	
	index[0] = "Slot ID"
	for(let i=1;i<(num_nodes+1); i++)
	{
		index[i] = +(i).toString();
	}
	updateTable('distance-received', 0, index.slice(0,num_nodes));


	for(let i=1;i<num_nodes; i++)
	{
        distances_rec[0] = +i.toString();
		
		for(let j=2;j<num_nodes+1;j++)
		{
			if(msg.dist_rx[i][j-1] == 0 && msg.dist_error[i][j-1] == 0)
			{
				distances_rec[j-1] = "-/-";
			}
			else
			{
				distances_rec[j-1] = msg.dist_rx[i][j-1]+"/"+(msg.dist_rx[i][j-1]+msg.dist_error[i][j-1]);
			}
		}
		updateTable('distance-received', i, distances_rec.slice(0,num_nodes));
	}
};

function uwb_data_update_ranging(msg)
{			
	index[0] = "Slot ID"
	for(let i=1;i<(num_nodes+1); i++)
	{
		index[i] = +(i).toString();
	}

    updateTable('hop-rssi', 0, index.slice(0,num_nodes));
	updateTable('last-distance-received', 0, index.slice(0,num_nodes));

	for(let i=1;i<num_nodes; i++)
	{		
		for(let j=2;j<num_nodes+1;j++)
		{
			for(let k=0; k< msg.dist; k++)
			{
				if(msg.rnr[k][0] == i && msg.rnr[k][1] == (j-1))
				{
					if(msg.rnr[k][4] != 255)
					{
						hop_rssi[i][j-1] = msg.rnr[k][4]+'/'+ msg.rnr[k][3];
					}
					
					let current_distance ="-";
					
					if(msg.rnr[k][2] != REDNODERANGING_DISTANCE_ERROR)
					{
						last_n_distances[i][j-1][avg_index[i][j-1]] = msg.rnr[k][2];
						avg_index[i][j-1] = (avg_index[i][j-1]+1)%average_length;
						current_distance = msg.rnr[k][2];
					}
				
					
					if(completed_average[i][j-1])
					{
						distances_rec_last_avg[i][j-1] = current_distance +'/'+average(last_n_distances[i][j-1]).toFixed(0)+'/'+standardDeviation(last_n_distances[i][j-1]).toFixed(0);
					}
					else
					{
						distances_rec_last_avg[i][j-1] = current_distance +'/-/-';
					}

					if(avg_index[i][j-1] == (average_length-1))
					{
						completed_average[i][j-1] = 1;
					}
				}
			}
		}
        updateTable('hop-rssi', i, hop_rssi[i].slice(0,num_nodes));
		updateTable('last-distance-received', i, distances_rec_last_avg[i].slice(0,num_nodes));
	}
};

function connect_ws_uwb_bus() {
	  socket.on('net_stats', function(rec_msg) {
		if(rnb_started)
		{
			if(current_view == "ranging")
			{
				if(rec_msg.type == "stats")
				{
					resetTable('distance-received');
					deleteTableContent("dis_rate");
					uwb_data_update(rec_msg);
				}
				else if(rec_msg.type == "dist" && num_nodes > 0)
				{
					resetTable('hop-rssi');
					resetTable('last-distance-received');
					uwb_data_update_ranging(rec_msg);
				}
			}
		}
	  });
}

connect_ws_uwb_bus();

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum /data.length;
  return avg;
}

function createArray(length) {
    var arr = new Array(length || 0).fill(0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
	
    return arr;
}