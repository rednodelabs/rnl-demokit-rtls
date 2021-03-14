function txToDB(tx) {
  var dBMat = [-40, -20, -16, -12, -8, -4, 0, +3, +4]
  return dBMat[tx]
}

var rnb_connected = 1;
var rnb_started = 1;
var rnb_max_nodes = 15;
var socket;

const client_types = {
    WEB: 'web',
    HOST: 'host',
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
	// rnb_connected = 0;
	// rnb_started = 0;
	$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
	$("#btn_start_infra").show().css('color', 'grey').css('pointer-events', 'none');
	$("#btn_stop_tag").hide();
	$("#btn_stop_infra").hide();
}

function connection_recovered() {
	// rnb_connected = 1;   
}

function connection_restarted() {
    // rnb_connected = 1;
	// rnb_started = 1;
}

connect_socket_navbar();

var current_view = "data";

$(document).ready(function() {
	$("#s_ranging").click(function() {
		$("#sec_data").hide();
		$("#sec_map").hide();
		$("#sec_settings").hide();
		$("#sec_ranging").show();
		$('#li_data').removeClass('active')
		$('#li_map').removeClass('active')
		$('#li_ranging').addClass('active');
		$('#li_settings').removeClass('active');
        current_view = "ranging";
	});
});

$(document).ready(function() {
	$("#s_data").click(function() {
		$("#sec_data").show();
		$("#sec_map").hide();
		$("#sec_ranging").hide();
		$("#sec_settings").hide();
		$('#li_data').addClass('active')
		$('#li_map').removeClass('active')
		$('#li_ranging').removeClass('active');
		$('#li_settings').removeClass('active');
        current_view = "data";
	});
});

$(document).ready(function() {
	$("#s_map").click(function() {
		$("#sec_data").hide();
		$("#sec_map").show();
		$("#sec_ranging").hide();
		$("#sec_settings").hide();
		$('#li_data').removeClass('active')
		$('#li_map').addClass('active')
		$('#li_ranging').removeClass('active');
		$('#li_settings').removeClass('active');
        current_view = "map";
	});
});

$(document).ready(function() {
	$("#btn_settings").click(function() {
		$("#sec_data").hide();
		$("#sec_map").hide();
		$("#sec_ranging").hide();
		$("#sec_settings").show();
		$('#li_data').removeClass('active')
		$('#li_map').removeClass('active')
		$('#li_ranging').removeClass('active');
		$('#li_settings').addClass('active');
        current_view = "settings";
	});
});

let enable_tag_mode = 0;
function connect_navbar() {
	  socket.on('net_stats', function(rec_msg) {
				if(rec_msg.type == "stats")
				{
					if(rec_msg.role == 2)
					{
						if(rec_msg.rnr_st)
						{
							if(rec_msg.rnr_infra)
							{
								$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
								$("#btn_start_infra").hide();
								$("#btn_stop_tag").hide();
								$("#btn_stop_infra").show();
								$("#average_minus").show()
								$("#average_plus").show()
							}
							else
							{
								$("#btn_start_tag").hide()
								$("#btn_start_infra").show().css('color', 'grey').css('pointer-events', 'none');
								$("#btn_stop_tag").show();
								$("#btn_stop_infra").hide();
								$("#average_minus").hide()
								$("#average_plus").hide()
							}
						}
						else
						{
							$("#average_minus").show()
							$("#average_plus").show()	
							if(enable_tag_mode)
							{
								$("#btn_start_tag").show().css('color', 'green').css('pointer-events', 'auto');
							}
							else
							{
								$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
							}
							$("#btn_start_infra").show().css('color', 'green').css('pointer-events', 'auto');
							$("#btn_stop_tag").hide();
							$("#btn_stop_infra").hide();
						}
					}
					else if(rec_msg.role == 3)
					{
						$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
						$("#btn_start_infra").show().css('color', 'grey').css('pointer-events', 'none');
						$("#btn_stop_tag").hide();
						$("#btn_stop_infra").hide();
						$("#average_minus").hide()
						$("#average_plus").hide()						
					}
				}
				if(rec_msg.type == "coordinates")
				{
					if(rec_msg.active_node_count)
					{
						enable_tag_mode = 1;
					}
					else
					{
						enable_tag_mode = 0;
					}
				}
	  });
}

const command_types = {
	WHO_AM_I: 'who_am_i',
    START_TAG: 'start_tag',
    START_INFRA: 'start_infra',
	STOP: 'stop',
	TAG_AVG: 'tag_avg'
}

$(document).ready(function() {
	$("#btn_stop_tag").click(function() {
			var msg = {
				type: command_types.STOP
			};
			socket.emit('commands', msg);
			//rnb_started = 0;
			return false;
	});
	
	$("#btn_stop_infra").click(function() {
			var msg = {
				type: command_types.STOP
			};
			socket.emit('commands', msg);
			//rnb_started = 0;
			return false;
	});
	
	$("#btn_start_tag").click(function() {
			var msg = {
				type: command_types.START_TAG
			};
			socket.emit('commands', msg);
			//rnb_started = 0;
			return false;
	});
	
	$("#btn_start_infra").click(function() {
			var msg = {
				type: command_types.START_INFRA
			};
			socket.emit('commands', msg);
			//rnb_started = 0;
			return false;
	});
});

let filter_strength = 32;

$(document).ready(function() {
	$("#average_plus").click(function() {
		if(filter_strength < 64)
		{
			filter_strength = filter_strength + 8;
		}

        $('#average').html( filter_strength  + ' Filter Strength' );
		
		var msg = {
			type: command_types.TAG_AVG,
			avg: filter_strength
		};
		socket.emit('commands', msg);
		
		return false;
    });
});

$(document).ready(function() {
	$("#average_minus").click(function() {
		if(filter_strength > 24)
		{
			filter_strength = filter_strength - 8;
		}
        
		$('#average').html( filter_strength  +' Filter Strength' );
		
		var msg = {
			type: command_types.TAG_AVG,
			avg: filter_strength
		};
		socket.emit('commands', msg);
		
		return false;
	});
});

connect_navbar();