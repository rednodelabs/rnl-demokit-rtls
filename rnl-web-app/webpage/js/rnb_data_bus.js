function updateTable(tableID, row, cols) {
  // Get a reference to the table
  let tableRef = document.getElementById(tableID);

  if(tableRef.rows.length > row) {
	tableRef.deleteRow(row)
  }

  // Insert a row at the end of the table
  let newRow = tableRef.insertRow(row);

  for (let i=0; i<cols.length; i++) {
	let newCell = newRow.insertCell(i);
	let newText = document.createTextNode(cols[i]);
	newCell.appendChild(newText);
  }
}

function resetTable(tableID)
{
	let tableRef = document.getElementById(tableID);
	if(tableRef.rows.length > (num_node + 1))
	{
		for(let i = (num_node + 1); i< tableRef.rows.length; )
		{
			tableRef.deleteRow(i);
		}
	}
}

function resetTableChannels(tableID)
{
	let tableRef = document.getElementById(tableID);
	if(tableRef.rows.length > (num_channels*num_node + 1))
	{
		for(let i = (num_node + 1); i< tableRef.rows.length; )
		{
			tableRef.deleteRow(i);
		}
	}
}

function deleteTableContent(tableID)
{
	let tableRef = document.getElementById(tableID);
	for(let i = 1; i< tableRef.rows.length; )
    {
        tableRef.deleteRow(i);
    }
}

let old_losses = new Array(15).fill(0);
let old_old_losses = new Array(15).fill(0);
let old_packets_received = new Array(15).fill(0);
let old_packets_expected = new Array(15).fill(0);
let old_packets_error_rate = new Array(15).fill(0);

function rnb_data_update(msg)
{
    let num_channels = 0;
    let channels_array = [];

    for(let i=0; i<8; i++)
    {
        let mask = 1 << i;
        if((msg.channel_mask & mask)!=0)
        {
            num_channels = channels_array.push(i);
        }
    }

	let num_nodes = msg.node_count;
    let rssi_avg;
    let hop_avg;
    let hop_packets;
	for(let i=1; i< num_nodes; i++)
	{
       hop = "-";
       rssi = "-";
	   let rnb_mode = "-";
       
       if(i!=0)
       {
            hop = msg.hop_last[i];
            rssi = msg.rssi_last[i][hop];
			if(msg.rnb_mode[i] == 0)
			{
				rnb_mode = "Anchor";
			}
			else if(msg.rnb_mode[i] == 2)
			{
				rnb_mode = "Tag";
			}
       }
	   else
	   {
		   rnb_mode = "Sniffer"	   
	   }
       
       let packets_received;
       let packet_error_rate;
       let packets_expected;
       
       if(msg.rnb_mode[i]!=2 || msg.sleep_superframe_total == 0)
       {
           packets_received = (msg.superframe_count-msg.packets_total_error[i])+'/'+msg.superframe_count
           packet_error_rate = (100.0*msg.packets_total_error[i]/msg.superframe_count)
           updateTable('sensor-nodes', i, [i, rnb_mode, packets_received, packet_error_rate.toFixed(2),hop, rssi, (((msg.data_size[i]*8.0)/1000)/msg.superframe_duration_s).toFixed(2)])
           if((packet_error_rate >= old_losses[i] || packet_error_rate == 100) && packet_error_rate!=0)
	       {
		       document.getElementById('sensor-nodes').rows[i].style.backgroundColor = "#F9152F";
	       }
	       old_losses[i] = packet_error_rate;
           if(channel_stats)
           {
               for(let k=0; k<num_channels; k++)
               {
                   updateTable('sensor-channel', i*num_channels + k+1, [i, channels_array[k], msg.packets_total_received[i][channels_array[k]]+'/'+msg.num_repetitions*msg.superframe_count, (100.0*(msg.num_repetitions*msg.superframe_count-msg.packets_total_received[i][channels_array[k]])/(msg.num_repetitions*msg.superframe_count)).toFixed(2), (msg.rssi_last[i][channels_array[k]])])
               }
           }       
       }
       else
       {
           if((msg.superframe_count+msg.sleep_superframe_total)%(msg.sleep_superframe_total+1) == 0)
           {
               packets_expected = Math.ceil(msg.superframe_count/(msg.sleep_superframe_total+1));
               packets_received = (msg.packets_total_ok[i])+'/'+packets_expected
               packet_error_rate = (100.0*(packets_expected - msg.packets_total_ok[i])/packets_expected)
               old_packets_received[i] = packets_received;
               old_packets_error_rate[i] = packet_error_rate;
           	   updateTable('sensor-nodes', i, [i, rnb_mode, packets_received, packet_error_rate.toFixed(2), hop, rssi, (((msg.data_size[i]*8.0)/1000)/msg.superframe_duration_s).toFixed(2)])
               if(((packet_error_rate >= old_losses[i] && old_losses[i]>=old_old_losses[i])   || packet_error_rate == 100) && packet_error_rate !=0 )
               {
                   document.getElementById('sensor-nodes').rows[i].style.backgroundColor = "#F9152F";
               }
               old_old_losses[i] = old_losses[i];
               old_losses[i] = packet_error_rate;
               old_packets_expected[i] = packets_expected;
               
               if(channel_stats)
               {
                   for(let k=0; k<num_channels; k++)
                   {
                       updateTable('sensor-channel', i*num_channels + k+1, [i, channels_array[k], msg.packets_total_received[i][channels_array[k]]+'/'+msg.num_repetitions*packets_expected, (100.0*(msg.num_repetitions*packets_expected-msg.packets_total_received[i][channels_array[k]])/(msg.num_repetitions*packets_expected)).toFixed(2), (msg.rssi_last[i][channels_array[k]])])
                   }
               }
               
           }
           else
           {
               packets_received = old_packets_received[i];
               packet_error_rate = old_packets_error_rate[i];
               packets_expected = old_packets_expected[i];
               updateTable('sensor-nodes', i, [i, rnb_mode, packets_received, packet_error_rate.toFixed(2), hop, rssi, (((msg.data_size[i]*8.0)/1000)/msg.superframe_duration_s).toFixed(2)])
               if(((packet_error_rate >= old_losses[i] && old_losses[i]>=old_old_losses[i])   || packet_error_rate == 100) && packet_error_rate != 0)
               {
                   document.getElementById('sensor-nodes').rows[i].style.backgroundColor = "#F9152F";
               }
               
               if(channel_stats)
               {
                   for(let k=0; k<num_channels; k++)
                   {
                       updateTable('sensor-channel', i*num_channels + k+1, [i, channels_array[k], msg.packets_total_received[i][channels_array[k]]+'/'+msg.num_repetitions*packets_expected, (100.0*(msg.num_repetitions*packets_expected-msg.packets_total_received[i][channels_array[k]])/(msg.num_repetitions*packets_expected)).toFixed(2), (msg.rssi_last[i][channels_array[k]])])
                   }
               }
               
           }
       }
	}
    updateMean((msg.superframe_duration_s)*1000.0, 0.05)
	//updateTable('sensor-general', 1, [num_nodes, num_channels, msg.num_repetitions, (bus_period_mean).toFixed(0), ((msg.sleep_superframe_total+1)*bus_period_mean).toFixed(0)])
};


function connect_ws_data_bus() {
	  socket.on('net_stats', function(rec_msg) {
		if(rnb_started)
		{
            if(rec_msg.type == "rnb" && current_view == "data")
            {
                resetTable("sensor-nodes");
                //resetTableChannels("sensor-channel");
                rnb_data_update(rec_msg);
            }
		}
	  });
}

var bus_period_mean = 0;

function updateMean(newValue, alpha) {
	const meanIncrement = alpha * (newValue - bus_period_mean)
    const newMean = bus_period_mean + meanIncrement
	bus_period_mean = newMean
}

var distances_per_second_mean = new Array(15).fill(0);

function updateMeanDistances(newValue, alpha, index) {
	const meanIncrement = alpha * (newValue - distances_per_second_mean[index])
    const newMean = distances_per_second_mean[index] + meanIncrement
	distances_per_second_mean[index] = newMean
}

connect_ws_data_bus();

var channel_stats = 0;

$(document).ready(function() {
	$("#ch_minus").click(function() {
        $("#ch_minus").hide();
        $("#ch_plus").show();
        channel_stats = 0;
        //deleteTableContent("sensor-channel");        
	});
});

$(document).ready(function() {
	$("#ch_plus").click(function() {
        $("#ch_plus").hide();
        $("#ch_minus").show();
        channel_stats = 1;
	});
});
