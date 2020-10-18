function txToDB(tx) {
  var dBMat = [-40, -20, -16, -12, -8, -4, 0, +3, +4]
  return dBMat[tx]
}

var rnb_connected = 0;
var rnb_started = 0;
var socket;

const client_types = {
    WEB: 'web',
    HOST: 'host',
}

const command_types = {
	WHO_AM_I: 'who_am_i',
    START: 'start',
    STOP: 'stop',
}

function connect_socket_navbar() {
	socket = io()

	socket.on('host_connected', function(rec_msg){
		connection_recovered();
	});
    
    socket.on('host_started', function(rec_msg){
		connection_restarted();
	});

	socket.on('host_disconnected', function(rec_msg){
		connection_lost();
	});

	socket.on('connect', function(){
		var msg =
		{
			client_type: client_types.WEB
		};
		socket.emit('client_type',msg);
	});

	socket.on('disconnect', function(){
		connection_lost();
	});
}

function connection_lost() {
	rnb_connected = 0;
	rnb_started = 0;
	$("#btn_start").show().css('color', 'red');
    $("#navbar_options").show();
	$("#btn_stop").hide();
}

function connection_recovered() {
	// var msg = {
		// command_type: command_types.STOP
	// };
	// socket.emit('commands',msg)
	rnb_connected = 1;
	$("#btn_start").show().css('color', 'green');
    $("#navbar_options").show();    
}

function connection_restarted() {
    $("#btn_stop").show();
    $("#navbar_options").hide();
	$("#btn_start").hide().css('color', 'green');
    rnb_connected = 1;
	rnb_started = 1;
}

connect_socket_navbar();

let last_start_time = 0;

$(document).ready(function() {
	$("#btn_start").click(function() {
		var d = new Date();
		var current_start_time = d.getTime();
		if(current_start_time > (last_start_time + 5000))
		{
			if(rnb_connected)
			{
                var rnb_id;
                if(dfu_mode)
                {
                    rnb_id = 0x30;
                    
                }
                else
                {
                    rnb_id = 0x60;
                    
                    if(uwb_mode && ext_mode)
                    {
                        rnb_id = rnb_id + 0x1;
                    }
                    else if(uwb_mode)
                    {
                        rnb_id = rnb_id + 0x2
                    }
                    
                    if(inc_queue_mode)
                    {
                        rnb_id = rnb_id + 0x4
                    }
                    
                    if(acc_mode)
                    {
                        rnb_id = rnb_id + 0x8
                    }

                }
				// tx_output_power, mode, channels_mask, node_count, sleep_superframe_count, rnb_id, wait_for_sync_1st_ch
				var mask_channels = ch0|ch1<<1|ch2<<2|ch3<<3|ch4<<4|ch5<<5|ch6<<6|ch7<<7
				var msg = {
					d3: d3_mode,
					average_tag: average,
					command_type: command_types.START,
					tx_output_power: txToDB(pow),
					mode: snf, // RNL_RNB_MODE_SNIFF_ACTIVE
					channels_mask: mask_channels,
					node_count: num_node,
					sleep_superframe_count: sleep_period_array[sleep_periods],
					rnb_id: rnb_id,
					wait_for_sync_1st_ch: 0,
					channel_repetition_count: repetitions,
                    sync_mode_set: sync_mode
				};
                bus_period_mean = (repetitions*num_channels*num_node*bus_period_ms);
				socket.emit('commands',msg);
				$("#btn_stop").show();
                //$("#navbar_options").hide();
				$("#btn_start").hide();
				
				$('#average_minus').css('pointer-events','none');
				$('#average_plus').css('pointer-events','none');
				$('#3d').css('pointer-events','none');
				
                svg.selectAll("line").remove()
                svg.selectAll("circle").remove()
	            svg.selectAll("#circle_label").remove()
				rnb_started = 1;
                deleteTableContent("map");
                deleteTableContent("height");
			}
			last_start_time = current_start_time;
		}
	});
});

$(document).ready(function() {
	$("#btn_stop").click(function() {
		var d = new Date();
		var current_stop_time = d.getTime();
		if(current_stop_time > (last_start_time + 2000))
		{
			var msg = {
				command_type: command_types.STOP
			};
			socket.emit('commands', msg);
			$("#btn_stop").hide();
            $("#navbar_options").show();
			$("#btn_start").show();
			rnb_started = 0;
			
			$('#average_minus').css('pointer-events','');
			$('#average_plus').css('pointer-events','');
			$('#3d').css('pointer-events','');
		}
	});
});

let average = 16;
let num_node = 9;
let num_channels = 5;
let repetitions = 1;
let pow = 6;
let sleep_periods = 0;
let dfu_mode = 0;
let sleep_period_array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
let bus_period_ms = 1.2;

$(document).ready(function() {
	$("#average_plus").click(function() {
		if(average < 32 && !rnb_started)
		{
			average = average*2
		}
        if(average < 10)
        {
            $('#average').html( '0' + average  +' Average' );
        }
        else
        {
            $('#average').html( average  +' Average' );
        }
    });
});

$(document).ready(function() {
	$("#average_minus").click(function() {
		if(average > 2 && !rnb_started)
		{
			average = average/2;
		}
        if(average < 10)
        {
            $('#average').html( '0' + average  +' Average' );
        }
        else
        {
            $('#average').html( average  +' Average' );
        }
	});
});



$(document).ready(function() {
	$("#node_plus").click(function() {
		if(num_node < 15 && !rnb_started)
		{
			num_node++;
		}
        if(num_node < 10)
        {
            $('#num_nodes').html( '0' + num_node  +' Nodes' );
        }
        else
        {
            $('#num_nodes').html( num_node  +' Nodes' );
        }
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
    });
});

$(document).ready(function() {
	$("#node_minus").click(function() {
		if(num_node > 4 && !rnb_started)
		{
			num_node--;
		}
        if(num_node < 10)
        {
            $('#num_nodes').html( '0' + num_node  +' Nodes' );
        }
        else
        {
            $('#num_nodes').html( num_node  +' Nodes' );
        }
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});

$(document).ready(function() {
	$("#sleeping_plus").click(function() {
		if(sleep_periods < 16 && !rnb_started)
		{
			sleep_periods++;
		}
        if(sleep_period_array[sleep_periods] < 10)
        {
            $('#sleeping_periods').html( '0' + sleep_period_array[sleep_periods]  +' Sleep' );
        }
        else
        {
            $('#sleeping_periods').html( sleep_period_array[sleep_periods]  +' Sleep' );
        }
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});

$(document).ready(function() {
	$("#sleeping_minus").click(function() {
		if(sleep_periods > 0 && !rnb_started)
		{
			sleep_periods--;
		}
        if(sleep_period_array[sleep_periods] < 10)
        {
            $('#sleeping_periods').html( '0' + sleep_period_array[sleep_periods]  +' Sleep' );
        }
        else
        {
            $('#sleeping_periods').html( sleep_period_array[sleep_periods]  +' Sleep' );
        }
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
/*
$(document).ready(function() {
	$("#pow_plus").click(function() {
		if(pow < 8 && !rnb_started)
		{
			pow++;
		}
		$('#pow').html( txToDB(pow)+' dBm' );
	});
});

$(document).ready(function() {
	$("#pow_minus").click(function() {
		if(pow > 0 && !rnb_started)
		{
			pow--;
		}
		$('#pow').html( txToDB(pow)+' dBm' );
	});
});
*/

let sync_mode = 0;
$(document).ready(function() {
	$("#sync_off").click(function() {
        if(rnb_started)
		{
			return;
		}
        sync_mode = 1;
        $("#sync_off").hide();
        $("#sync_cont").show();
        $("#sync_per").hide();
	});
});

$(document).ready(function() {
	$("#sync_cont").click(function() {
        if(rnb_started)
		{
			return;
		}
        sync_mode = 3;
        $("#sync_off").hide();
        $("#sync_cont").hide();
        $("#sync_per").show();
	});
});

$(document).ready(function() {
	$("#sync_per").click(function() {
        if(rnb_started)
		{
			return;
		}
        sync_mode = 0;
        $("#sync_off").show();
        $("#sync_cont").hide();
        $("#sync_per").hide();
	});
});

$(document).ready(function() {
	$("#rep_plus").click(function() {
		if(repetitions < 2 && !rnb_started)
		{
			repetitions++;
		}
		$('#rep').html( repetitions +' Rep.' );
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});

$(document).ready(function() {
	$("#rep_minus").click(function() {
		if(repetitions > 1 && !rnb_started)
		{
			repetitions--;
		}
		$('#rep').html( repetitions +' Rep.' );
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});

var current_view = "data";

$(document).ready(function() {
	$("#s_ranging").click(function() {
		$("#sec_data").hide();
		$("#sec_map").hide();
		$("#sec_ranging").show();
		$('#li_data').removeClass('active')
		$('#li_map').removeClass('active')
		$('#li_ranging').addClass('active');
        current_view = "ranging";
	});
});


$(document).ready(function() {
	$("#s_data").click(function() {
		$("#sec_data").show();
		$("#sec_map").hide();
		$("#sec_ranging").hide();
		$('#li_data').addClass('active')
		$('#li_map').removeClass('active')
		$('#li_ranging').removeClass('active');
        current_view = "data";
	});
});


$(document).ready(function() {
	$("#s_map").click(function() {
		$("#sec_data").hide();
		$("#sec_map").show();
		$("#sec_ranging").hide();
		$('#li_data').removeClass('active')
		$('#li_map').addClass('active')
		$('#li_ranging').removeClass('active');
        current_view = "map";
	});
});


$(document).ready(function() {
	$("#dfu").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(dfu_mode)
		{
			dfu_mode = 0;
			$("#dfu").css('color', 'red');
		}
		else
		{
			dfu_mode = 1;
			$("#dfu").css('color', 'green');
		}
	});
});

var uwb_mode = 1;

$(document).ready(function() {
	$("#uwb").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(uwb_mode)
		{
			uwb_mode = 0;
			$("#uwb").css('color', 'red');
            $("#ext").hide();
            $("#acc").hide();
            $("#inc_queue").hide();
		}
		else
		{
			uwb_mode = 1;
			$("#uwb").css('color', 'green');
            $("#ext").show();
            $("#acc").show();
            $("#inc_queue").show();
		}
	});
});

var inc_queue_mode = 1;

$(document).ready(function() {
	$("#inc_queue").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(inc_queue_mode)
		{
			inc_queue_mode = 0;
			$("#inc_queue").css('color', 'red');
		}
		else
		{
			inc_queue_mode = 1;
			$("#inc_queue").css('color', 'green');
		}
	});
});

var acc_mode = 0;

$(document).ready(function() {
	$("#acc").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(acc_mode)
		{
			acc_mode = 0;
			$("#acc").css('color', 'red');
		}
		else
		{
			acc_mode = 1;
			$("#acc").css('color', 'green');
		}
	});
});

var d3_mode = 0;

$(document).ready(function() {
	$("#3d").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(d3_mode)
		{
			d3_mode = 0;
			$("#3d").css('color', 'red');
		}
		else
		{
			d3_mode = 1;
			$("#3d").css('color', 'green');
		}
	});
});

var ext_mode = 1;

$(document).ready(function() {
	$("#ext").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ext_mode)
		{
			ext_mode = 0;
			$("#ext").css('color', 'red');
		}
		else
		{
			ext_mode = 1;
			$("#ext").css('color', 'green');
		}
	});
});

var snf = 0;

$(document).ready(function() {
	$("#snf").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(snf)
		{
			snf = 0;
			$("#snf").css('color', 'red');
		}
		else
		{
			snf = 1;
			$("#snf").css('color', 'green');
		}
	});
});

var ch0 = 1;
var ch1 = 1;
var ch2 = 1;
var ch3 = 1;
var ch4 = 1;
var ch5 = 0;
var ch6 = 0;
var ch7 = 0;

function update_num_channels()
{
    let mask = ch0|ch1<<1|ch2<<2|ch3<<3|ch4<<4|ch5<<5|ch6<<6|ch7<<7;
    
    num_channels = 0;
    for(let i=0; i<8; i++)
    {
        let mask_shift = 1 << i;
        if((mask & mask_shift) != 0)
        {
            num_channels++;
        }
    }
}

$(document).ready(function() {
	$("#ch0").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch0 && num_channels>5)
		{
			ch0 = 0;
			$("#ch0").css('color', 'red');
		}
		else
		{
			ch0 = 1;
			$("#ch0").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch1").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch1 && num_channels>5)
		{
			ch1 = 0;
			$("#ch1").css('color', 'red');
		}
		else
		{
			ch1 = 1;
			$("#ch1").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch2").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch2 && num_channels>5)
		{
			ch2 = 0;
			$("#ch2").css('color', 'red');
		}
		else
		{
			ch2 = 1;
			$("#ch2").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch3").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch3 && num_channels>5)
		{
			ch3 = 0;
			$("#ch3").css('color', 'red');
		}
		else
		{
			ch3 = 1;
			$("#ch3").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch4").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch4 && num_channels>5)
		{
			ch4 = 0;
			$("#ch4").css('color', 'red');
		}
		else
		{
			ch4 = 1;
			$("#ch4").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch5").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch5 && num_channels>5)
		{
			ch5 = 0;
			$("#ch5").css('color', 'red');
		}
		else
		{
			ch5 = 1;
			$("#ch5").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch6").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch6 && num_channels>5)
		{
			ch6 = 0;
			$("#ch6").css('color', 'red');
		}
		else
		{
			ch6 = 1;
			$("#ch6").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
$(document).ready(function() {
	$("#ch7").click(function() {
		if(rnb_started)
		{
			return;
		}
		if(ch7 && num_channels>5)
		{
			ch7 = 0;
			$("#ch7").css('color', 'red');
		}
		else
		{
			ch7 = 1;
			$("#ch7").css('color', 'green');
		}
        update_num_channels();
        updateTable('sensor-general', 1, [num_node, num_channels, repetitions, (repetitions*num_channels*num_node*bus_period_ms).toFixed(0), (bus_period_ms*repetitions*num_channels*num_node*(sleep_period_array[sleep_periods]+1)).toFixed(0)]);
	});
});
