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
		$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
		$("#btn_start_tag2w").show().css('color', 'grey').css('pointer-events', 'none');
		$("#btn_start_infra").show().css('color', 'grey').css('pointer-events', 'none');
		$("#btn_stop_tag").hide();
		$("#btn_stop_tag2w").hide();
		$("#btn_stop_infra").hide();
		$("#dimensions").css('pointer-events', 'auto');
		$("#dimensions").css("color", "green"); 
		connection_lost = 1;
		enable_tag_mode = 0
	});

	socket.on('connect', function(){
		var msg =
		{
			client_type: client_types.WEB
		};
		socket.emit('client_type',msg);
	});
}

function connection_recovered() {
	// rnb_connected = 1;
	connection_lost = 0;
	$("#average_minus").show()
	$("#average_plus").show()
	$("#average_d_minus").show()
	$("#average_d_plus").show()	
	if(enable_tag_mode && dimensions_updated == 0)
	{
		$("#btn_start_tag").show().css('color', 'green').css('pointer-events', 'auto');
		$("#btn_start_tag2w").show().css('color', 'green').css('pointer-events', 'auto');
		
	}
	else
	{
		$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
		$("#btn_start_tag2w").show().css('color', 'grey').css('pointer-events', 'auto');
	}
	$("#btn_start_infra").show().css('color', 'green').css('pointer-events', 'auto');
	$("#btn_stop_tag").hide();
	$("#btn_stop_tag2w").hide();
	$("#btn_stop_infra").hide();
	
	$("#dimensions").css('pointer-events', 'auto');
	$("#dimensions").css("color", "green"); 
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

let stats_received;
let connection_lost = 1;

var intervalId = setInterval(function() {
	if(!connection_lost)
	{
		if(!stats_received)
		{
			connection_recovered();
		}
		else
		{
			stats_received = 0;
		}
	}
}, 2000);

let enable_tag_mode = 0;
function connect_navbar() {
	  socket.on('net_stats', function(rec_msg) {
				if(rec_msg.type == "stats")
				{
					stats_received = 1;
					connection_lost = 0;
					if(rec_msg.role == REDNODEBUS_ROLE_MASTER)
					{
						if(rec_msg.rnr_st)
						{
							if(rec_msg.rnr_infra)
							{
								$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
								$("#btn_start_tag2w").show().css('color', 'grey').css('pointer-events', 'none');
								$("#btn_start_infra").hide();
								$("#btn_stop_tag").hide();
								$("#btn_stop_tag2w").hide();
								$("#btn_stop_infra").show();
								$("#average_minus").show()
								$("#average_plus").show()
								$("#average_d_minus").show()
								$("#average_d_plus").show()
							}
							else
							{
								$("#btn_start_infra").show().css('color', 'grey').css('pointer-events', 'none');
								$("#btn_stop_infra").hide();
								$("#average_minus").hide()
								$("#average_plus").hide()
								$("#average_d_minus").hide()
								$("#average_d_plus").hide()
								
								if(rec_msg.rnr_mode == 1)
								{
									$("#btn_start_tag").hide()
									$("#btn_stop_tag").show();
									
									$("#btn_start_tag2w").show().css('color', 'grey').css('pointer-events', 'none');
									$("#btn_stop_tag2w").hide();
									
								}
								if(rec_msg.rnr_mode == 2)
								{
									$("#btn_start_tag2w").hide()
									$("#btn_stop_tag2w").show();
									
									$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
									$("#btn_stop_tag").hide();
								}
							}
							
							$("#dimensions").css("pointer-events", "none");
							$("#dimensions").css("color", "red");
						}
						else
						{
							$("#average_minus").show()
							$("#average_plus").show()
							$("#average_d_minus").show()
							$("#average_d_plus").show()								
							if(enable_tag_mode && dimensions_updated == 0)
							{
								$("#btn_start_tag").show().css('color', 'green').css('pointer-events', 'auto');
								$("#btn_start_tag2w").show().css('color', 'green').css('pointer-events', 'auto');
							}
							else
							{
								$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
								$("#btn_start_tag2w").show().css('color', 'grey').css('pointer-events', 'none');
							}
							$("#btn_start_infra").show().css('color', 'green').css('pointer-events', 'auto');
							$("#btn_stop_tag").hide();
							$("#btn_stop_tag2w").hide();
							$("#btn_stop_infra").hide();
							
							$("#dimensions").css("color", "green");
							$("#dimensions").css('pointer-events', 'auto');
						}
					}
					else if(rec_msg.role == REDNODEBUS_ROLE_SNIFFER)
					{
						$("#btn_start_tag").show().css('color', 'grey').css('pointer-events', 'none');
						$("#btn_start_tag2w").show().css('color', 'grey').css('pointer-events', 'none');
						$("#btn_start_infra").show().css('color', 'grey').css('pointer-events', 'none');
						$("#btn_stop_tag").hide();
						$("#btn_stop_tag_2w").hide();
						$("#btn_stop_infra").hide();
						$("#average_minus").hide()
						$("#average_plus").hide()
						$("#average_d_minus").hide()
						$("#average_d_plus").hide()							

						$("#dimensions").css("pointer-events", "none");
				        $("#dimensions").css("color", "red");
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
	START_TAG_2W: 'start_tag2w',
    START_INFRA: 'start_infra',
	STOP: 'stop',
	TAG_AVG: 'tag_avg',
	TAG_AVG_D: 'tag_avg_d',
	NUM_DIM: 'num_dim'
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
	
	$("#btn_stop_tag2w").click(function() {
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
				type: command_types.TAG_AVG,
				avg: filter_strength
			};
			
			socket.emit('commands', msg);
			
			var msg = {
				type: command_types.TAG_AVG_D,
				avg: filter_strength_d
			};
			
			
			socket.emit('commands', msg);

			var msg = {
				type: command_types.START_TAG
			};

			socket.emit('commands', msg);
			
			//rnb_started = 0;
			return false;
	});
	
		$("#btn_start_tag2w").click(function() {
			
			var msg = {
				type: command_types.TAG_AVG,
				avg: filter_strength
			};
			
			socket.emit('commands', msg);
			
			var msg = {
				type: command_types.TAG_AVG_D,
				avg: filter_strength_d
			};
			
			
			socket.emit('commands', msg);

			var msg = {
				type: command_types.START_TAG_2W
			};

			socket.emit('commands', msg);
			
			//rnb_started = 0;
			return false;
	});
	
	$("#btn_start_infra").click(function() {
		
			var msg = {
				type: command_types.NUM_DIM,
				dim: dimensions_mode
			};
			
			socket.emit('commands', msg);
			
			dimensions_updated = 0;
		
			var msg = {
				type: command_types.START_INFRA
			};
			socket.emit('commands', msg);
			//rnb_started = 0;
			return false;
	});
});

let filter_strength = 32;

let filter_strength_d = 4;

$(document).ready(function() {
	$("#average_d_minus").click(function() {
		if(filter_strength_d > 2)
		{
			filter_strength_d = filter_strength_d - 2;
		}
        
		$('#average_d').html( filter_strength_d  +' Distance Filter Order' );

		return false;
	});
});

$(document).ready(function() {
	$("#average_d_plus").click(function() {
		if(filter_strength_d < 8)
		{
			filter_strength_d = filter_strength_d + 2;
		}

        $('#average_d').html( filter_strength_d  + ' Distance Filter Order' );
		
		return false;
    });
});

$(document).ready(function() {
	$("#average_plus").click(function() {
		if(filter_strength < 96)
		{
			filter_strength = filter_strength + 8;
		}

        $('#average').html( filter_strength  + ' Position Filter Order' );
		
		return false;
    });
});

let dimensions_mode = 2
let dimensions_updated = 1
$(document).ready(function() {
	$("#dimensions").click(function() {
		$("#btn_start_tag").css('color', 'grey').css('pointer-events', 'one');
		$("#btn_start_tag2w").css('color', 'grey').css('pointer-events', 'none');
		dimensions_updated = 1
		if(dimensions_mode == 2)
		{
			dimensions_mode = 3;
			$("#dimensions").html("<b>3D</b>");
		}
		else
		{
			dimensions_mode = 2;
			$("#dimensions").html("<b>2D</b>");
		}
    });
});

$(document).ready(function() {
	$("#average_minus").click(function() {
		if(filter_strength > 24)
		{
			filter_strength = filter_strength - 8;
		}
        
		$('#average').html( filter_strength  +' Position Filter Order' );

		return false;
	});
});

connect_navbar();