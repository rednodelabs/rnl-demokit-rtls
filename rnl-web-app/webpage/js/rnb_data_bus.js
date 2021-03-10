const REDNODERANGING_ROLE_ANCHOR = 1;
const REDNODERANGING_ROLE_TAG = 2;
const REDNODERANGING_ROLE_LOW_POWER_TAG = 3;

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
	if(tableRef.rows.length > (num_slots + 1))
	{
		for(let i = (num_slots + 1); i< tableRef.rows.length; )
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

var num_slots;
var last_sf_ctr = 0;
var time_last_sf = 0;

function getBusPeriod(msg)
{
	var delta_sf;
	var delta_time;
	var d = new Date();
	delta_sf = msg.sf - last_sf_ctr;
	last_sf_ctr = msg.sf
	delta_time = d.getTime() - time_last_sf;
	time_last_sf = d.getTime();
	
	var bus_period = (delta_time/delta_sf).toFixed(0);
	
	if(bus_period > 100000)
	{
		bus_period = "-";
	}
	
	return bus_period;
}

function rnb_data_update(msg)
{
	num_slots = msg.slots;
	num_rnb_slots = msg.rnm_slots;
	
	var busPeriod = getBusPeriod(msg);
	
	let role="";
	let initial_index;
	if(msg.role == 2)
	{
		role = "Master";
		initial_index = 1;
	}
	else if(msg.role == 3)
	{
		role = "Sniffer";
		initial_index = 0;
	}
	
	for(let i=initial_index; i< (num_slots - num_rnb_slots); i++)
	{   
		let rnr_type;

		if(msg.rnr_role[i] == REDNODERANGING_ROLE_ANCHOR)
		{
			rnr_type = "Anchor";
		}
		else if(msg.rnr_role[i] == REDNODERANGING_ROLE_TAG)
		{
			rnr_type = "Tag"
		}
		else if(msg.rnr_role[i] == REDNODERANGING_ROLE_LOW_POWER_TAG)
		{
			rnr_type = "Tag (LP)"
		}
		else
		{
			rnr_type = "-";
		}
		
		let pkt_attempts;
		let losses;
		
		if(msg.sf_in[i] == -1)		
		{
			pkt_attempts = 0;
			losses = 0;
		}
		else
		{
			pkt_attempts = msg.sf - msg.sf_in[i] + 1;
			losses = msg.pkt_loss[i] - msg.sf_in[i];
		}

		updateTable('sensor-nodes', i+1-initial_index, [i, pkt_attempts-losses+"/"+pkt_attempts, 
		(100*losses/pkt_attempts).toFixed(2), msg.hop[i], msg.rssi[i], (msg.len[i]/busPeriod).toFixed(0), rnr_type]);
		
		if(msg.hop[i] == 255 && msg.sf_in[i] != -1)
		{
			document.getElementById('sensor-nodes').rows[i+1-initial_index].style.backgroundColor = "#FFD1D6";
		}
		else if(msg.sf_in[i] == -1)
		{
			document.getElementById('sensor-nodes').rows[i+1-initial_index].style.backgroundColor = "#D3D3D3";
		}
	}
	
	
	for(let i=(num_slots - num_rnb_slots); i< num_slots; i++)
	{   		
		updateTable('sensor-nodes', i+1-initial_index, [i+" (Commissioning)", (msg.sf-msg.pkt_loss[i]),"-", "-", "-", "-", "-"]);

		document.getElementById('sensor-nodes').rows[i+1-initial_index].style.backgroundColor = "#add8e6";
		
	}
	
	updateTable('sensor-general', 1, [num_slots, num_rnb_slots, msg.ch_msk, msg.ch_num, busPeriod, role])
	
	index[0] = "Slot ID";
	
	for(let i=1;i<(msg.ch_num+1); i++)
	{
		index[i] = "Rep. "+(i-1).toString();
	}
	
	updateTable('packets-channel', 0, index.slice(0,msg.ch_num+1));
	
	for(let i=initial_index; i<num_slots; i++)
	{
		msg.rx[i].unshift(i)
		updateTable('packets-channel', i+1-initial_index, msg.rx[i]);
	}
};


function connect_ws_data_bus() {
	  socket.on('net_stats', function(rec_msg) {
		if(rnb_started)
		{
            if(current_view == "data" && rec_msg.type == "stats")
            {
                resetTable("sensor-nodes");
				resetTable('packets-channel');
                rnb_data_update(rec_msg);
            }
		}
	  });
}

connect_ws_data_bus();
